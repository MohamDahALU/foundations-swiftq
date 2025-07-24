import { useState, useEffect } from 'react';
import { getAllCustomersForHost } from '../firebase/services/queues';
import { Timestamp } from 'firebase/firestore';
import { BarChart, BarChart2, PieChart } from 'lucide-react';

interface Analytics {
  peakHour: {
    hour: number;
    count: number;
  };
  averageWaitTime: number;
  averageCustomers: number;
  totalCustomers: number;
  totalQueues: number;
}

type TimeFilter = 'today' | 'yesterday' | 'week' | 'month' | 'all';

// /analytics
export default function Analytics() {
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<Analytics>({
    peakHour: { hour: 0, count: 0 },
    averageWaitTime: 0,
    averageCustomers: 0,
    totalCustomers: 0,
    totalQueues: 0
  });
  const [, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  useEffect(() => {
    fetchAnalytics(timeFilter);
  }, [timeFilter]);

  async function fetchAnalytics(filter: TimeFilter) {
    try {
      setLoading(true);

      // Fetch all customer data for all queues
      const allCustomerData = await getAllCustomersForHost();
      // const queues = await getHostQueues();

      // Get start and end dates based on filter
      const { startDate, endDate } = getDateRange(filter);

      // Calculate analytics
      const hourCounts: Record<number, number> = {};
      let totalWaitTimeMinutes = 0;
      let waitTimeCustomers = 0;
      let totalCustomers = 0;
      let filteredQueues = 0;

      // Keep track of unique queues that have customers in the time range
      const activeQueueIds = new Set<string>();

      // Process each queue's customers
      allCustomerData.forEach(queueData => {
        let hasCustomersInRange = false;

        queueData.customers.forEach(customer => {
          if (!customer.data.joinedAt) return;

          const joinDate = (customer.data.joinedAt as Timestamp).toDate();

          // Skip if customer joined outside the selected date range
          if ((startDate && joinDate < startDate) || (endDate && joinDate > endDate)) {
            return;
          }

          hasCustomersInRange = true;
          totalCustomers++;

          // Count joinedAt hour for peak hour analysis
          const hour = joinDate.getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;

          // Calculate wait time if applicable
          if (customer.data.servedAt) {
            const joinTime = joinDate.getTime();
            const serveTime = (customer.data.servedAt as Timestamp).toDate().getTime();
            const waitTimeMs = serveTime - joinTime;
            const waitTimeMinutes = waitTimeMs / (1000 * 60);
            totalWaitTimeMinutes += waitTimeMinutes;
            waitTimeCustomers++;
          }
        });

        // If this queue had customers in the selected time range, count it
        if (hasCustomersInRange) {
          activeQueueIds.add(queueData.queueId);
        }
      });

      filteredQueues = activeQueueIds.size;

      // Find peak hour
      let peakHour = 0;
      let peakCount = 0;
      Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > peakCount) {
          peakHour = parseInt(hour);
          peakCount = count;
        }
      });

      // Calculate averages
      const averageWaitTime = waitTimeCustomers > 0 ? totalWaitTimeMinutes / waitTimeCustomers : 0;
      const averageCustomers = filteredQueues > 0 ? totalCustomers / filteredQueues : 0;

      setAnalytics({
        peakHour: {
          hour: peakHour,
          count: peakCount
        },
        averageWaitTime,
        averageCustomers,
        totalCustomers,
        totalQueues: filteredQueues
      });

    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const getDateRange = (filter: TimeFilter): { startDate: Date | null; endDate: Date | null; } => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (filter) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'yesterday':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;

      case 'month':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;

      case 'all':
      default:
        startDate = null;
        endDate = null;
        break;
    }

    return { startDate, endDate };
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${period}`;
  };

  const getFilterDisplayName = (filter: TimeFilter): string => {
    switch (filter) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'all': return 'All Time';
      default: return 'All Time';
    }
  };

  return (
    <div className="py-12 bg-primary">
      <h1 className="text-2xl font-semibold mb-6 text-center bg-white py-5">Analytics</h1>

      <div className="px-6 mb-6 container mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap justify-center gap-2">
          {(['today', 'yesterday', 'week', 'month', 'all'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-md transition-colors ${timeFilter === filter
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              {getFilterDisplayName(filter)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 container mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <div className='absolute top-4 right-4'>
                <BarChart className='size-10' />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Peak Hour</h2>
              <p className="text-3xl font-bold text-green-700">{
                analytics.peakHour.count > 0
                  ? formatHour(analytics.peakHour.hour)
                  : "N/A"
              }</p>
              <p className="text-sm text-gray-500 mt-1">
                {analytics.peakHour.count > 0
                  ? `${analytics.peakHour.count} customers joined during this hour`
                  : "Not enough data to determine peak hour"}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <div className='absolute top-4 right-4'>
                <PieChart className='size-10' />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Avg. Wait Time</h2>
              <p className="text-3xl font-bold text-green-700">
                {analytics.averageWaitTime > 0
                  ? `${analytics.averageWaitTime.toFixed(1)} min`
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {analytics.averageWaitTime > 0
                  ? "Average time customers waited to be served"
                  : "No wait time data available yet"}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <div className='absolute top-4 right-4'>
                <BarChart2 className='size-10' />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Avg. No. Customers</h2>
              <p className="text-3xl font-bold text-green-700">
                {analytics.averageCustomers > 0
                  ? analytics.averageCustomers.toFixed(1)
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Average number of customers per queue
              </p>
            </div>
          </div>

          <div className="mt-8 px-6 container mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3">Summary for {getFilterDisplayName(timeFilter)}</h2>
              <p className="text-gray-700">
                {analytics.totalCustomers > 0 ? (
                  <>
                    You have {timeFilter === 'all' ? 'served' : 'served during this period'} a total of {analytics.totalCustomers} customers
                    {analytics.totalQueues > 0 ? ` across ${analytics.totalQueues} queues` : ''}.
                    {analytics.peakHour.count > 0 ? ` The busiest time is at ${formatHour(analytics.peakHour.hour)}, when most customers join your queues.` : ''}
                  </>
                ) : (
                  `No customer data available for ${getFilterDisplayName(timeFilter).toLowerCase()}.`
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
