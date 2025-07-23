import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, collection, query, where, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Queue, Customer } from '../firebase/schema';
import { formatDistance } from 'date-fns';

type QueueCustomer = {
  id: string;
  data: Customer;
};

export default function HostQueueDetails() {
  const { queueId } = useParams<{ queueId: string; }>();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<{ id: string, data: Queue; } | null>(null);
  const [customers, setCustomers] = useState<QueueCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQueueActive, setIsQueueActive] = useState(false);

  // Calculate average time
  const avgWaitTime = useMemo(() => queue?.data.waitTimes ? queue?.data.waitTimes.reduce((a, i) => a + i, 0) / queue?.data.waitTimes.length : null, [queue?.data.waitTimes]);

  // Set up real-time listeners for queue and customers
  useEffect(() => {
    if (!queueId) return;

    setIsLoading(true);

    // Set up listener for queue document
    const queueRef = doc(db, "queues", queueId);
    const unsubscribeQueue = onSnapshot(queueRef,
      (doc) => {
        console.log("ran");
        if (doc.exists()) {
          const queueData = {
            id: doc.id,
            data: doc.data() as Queue
          };
          setQueue(queueData);
          setIsQueueActive(queueData.data.isActive);
          setIsLoading(false);
        } else {
          setError("Queue not found.");
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Error listening to queue:", err);
        setError("Failed to load queue data.");
        setIsLoading(false);
      }
    );

    // Set up listener for customers collection
    const customersRef = collection(db, "queues", queueId, "customers");
    const customersQuery = query(
      customersRef,
      where("status", "in", ["waiting", "notified"]),
    );


    const unsubscribeCustomers = onSnapshot(customersQuery,
      (snapshot) => {
        const customersList = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data() as Customer
        }))
          .sort((a, b) => a.data.position - b.data.position);
        setCustomers(customersList);
      },
      (err) => {
        console.error("Error listening to customers:", err);
        setError("Failed to load customers data.");
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      unsubscribeQueue();
      unsubscribeCustomers();
    };
  }, [queueId]);

  // Toggle queue active state
  const toggleQueueStatus = async () => {
    if (!queueId || !queue) return;

    try {
      await updateDoc(doc(db, "queues", queueId), {
        isActive: !isQueueActive
      });
      // No need to manually update state or refetch data
      // The onSnapshot listener will automatically update the UI
    } catch (err) {
      console.error("Error updating queue status:", err);
      setError("Failed to update queue status.");
    }
  };

  // Mark customer as served and remove from queue
  const serveCustomer = async (customer: QueueCustomer) => {
    if (!queueId || !queue) return;

    try {
      const customerRef = doc(db, "queues", queueId, "customers", customer.id);
      await updateDoc(customerRef, {
        status: "served",
        servedAt: serverTimestamp()
      });

      const queueRef = doc(db, "queues", queueId);
      const newWaitTimes = [...(queue.data.waitTimes || []), (new Date()).getTime() - customer.data.joinedAt.toDate().getTime()];
      await updateDoc(queueRef, {
        waitTimes: newWaitTimes,
        estimatedWaitPerPerson: newWaitTimes.reduce((a, i) => a + i, 0) / newWaitTimes.length
      });

    } catch (err) {
      console.error("Error serving customer:", err);
      setError("Failed to update customer status.");
    }
  };

  // Mark customer as notified
  const notifyCustomer = async (customerId: string) => {
    if (!queueId) return;

    try {
      const customerRef = doc(db, "queues", queueId, "customers", customerId);
      await updateDoc(customerRef, {
        notified: true,
        status: "notified",
        notifiedAt: serverTimestamp()
      });
      // No need to manually refresh - listeners will handle it
    } catch (err) {
      console.error("Error notifying customer:", err);
      setError("Failed to notify customer.");
    }
  };

  // Generate shareable join link
  const getJoinLink = () => {
    return `${window.location.origin}/join/${queue?.data.id}`;
  };

  // Copy join link to clipboard
  const copyJoinLink = () => {
    navigator.clipboard.writeText(getJoinLink());
  };

  // Get wait time in minutes
  const getWaitTimeDisplay = (customer: QueueCustomer) => {
    if (!customer) return "Unknown";
    console.log(customer);
    const joinTime = customer.data.joinedAt.toDate();
    const now = new Date();

    const duration = formatDistance(now, joinTime);
    return duration;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !queue) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="mt-2">{error || "Queue not found"}</p>
          <button
            onClick={() => navigate('/my-queues')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Back to My Queues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <h1 className="text-2xl text-center font-bold flex-1 bg-white py-5 mt-6">{queue.data.queueName}</h1>
      <div className="container px-4 mx-auto my-10 lg:grid grid-cols-2 grid-rows-2 grid-flow-col lg:items-start lg:gap-x-10">
        {/* Queue status and actions */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6 shadow-md shadow-black/25">
          <div className="m-4 p-4 bg-primary/60 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border-2 ${isQueueActive ? 'bg-green-200 text-green-800 border-green-500' : 'bg-red-200 text-red-800 border-red-500'
                    }`}>
                    {isQueueActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="ml-2 font-medium">{customers.length} in queue</span>
                </div>
                <p className="mt-2 text-sm">
                  Created: {queue.data.createdAt?.toDate().toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Names required: {queue.data.requireCustomerName ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex gap-4 flex-wrap justify-center text-xs *:shadow-lg *:shadow-black/25">
                <button
                  onClick={toggleQueueStatus}
                  className={`px-3 py-2 text-white rounded-md ${isQueueActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {isQueueActive ? 'Deactivate Queue' : 'Activate Queue'}
                </button>
                <button
                  onClick={copyJoinLink}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Copy Join Link
                </button>
                <Link
                  to={`/qr/${queue.data.id}`}
                  className="px-3 py-2 bg-primary-sat rounded-md hover:bg-primary"
                >
                  View QR Code
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Queue stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-2xl shadow-md shadow-black/25">
          <div className="bg-primary/60 rounded-lg shadow-md p-4">
            <h3 className=" font-semibold text-gray-900">Current Queue Size</h3>
            <p className="text-2xl font-bold text-green-700 mt-2">{customers.length}</p>
          </div>
          <div className="bg-primary/60 rounded-lg shadow-md p-4">
            <h3 className=" font-semibold text-gray-900">Average Wait Time</h3>
            <p className="text-2xl font-bold text-green-700 mt-2">
              {avgWaitTime
                ? `${formatDistance(new Date(Date.now() - avgWaitTime), new Date())}`
                : 'N/A'}
            </p>
          </div>
          <div className="bg-primary/60 rounded-lg shadow-md p-4">
            <h3 className=" font-semibold text-gray-900">Est. Total Time</h3>
            <p className="text-2xl font-bold text-green-700 mt-2">
              {avgWaitTime && customers.length
                ? `${formatDistance(new Date(Date.now() - (avgWaitTime * customers.length)), new Date())}`
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Customers list */}
        <div className="lg:row-span-2 bg-white rounded-xl overflow-hidden shadow-md shadow-black/25">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Customers in Queue</h2>
            <p className="mt-1 text-xs text-gray-500">
              Manage customers and their status in the queue.
            </p>
          </div>

          {customers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No customers in the queue.</p>
            </div>
          ) : (
            <div className="space-y-4 my-3">
              {customers.map((customer, index) => (
                <div
                  key={customer.id}
                  className={`mx-2 p-2 rounded-md bg-primary/40`}
                >
                  <div className="flex sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="font-medium text-green-800">#{customer.data.position.toString().padStart(3, "0")}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {customer.data.name} {" "}
                          <span className='text-xs'>#{customer.data.position.toString().padStart(3, "0")}</span>
                        </h3>
                        <div className="flex flex-col items-start mt-1">
                          <span className="text-sm text-gray-600">Wait: {getWaitTimeDisplay(customer)}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium shadow-md shadow-black/25 ${
                            customer.data.status === 'notified'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {customer.data.status === 'notified' ? 'Notified' : 'Waiting'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 self-center">
                      {customer.data.status === 'waiting' && index === 0 && (
                        <button
                          onClick={() => notifyCustomer(customer.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-md shadow-black/25 text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                        >
                          Notify
                        </button>
                      )}
                      <button
                        onClick={() => serveCustomer(customer)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-md shadow-black/25 text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        Serve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
