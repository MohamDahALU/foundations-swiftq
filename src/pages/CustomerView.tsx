/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getQueue,
  getCustomerStatus,
  getCustomerPosition
} from '../firebase/services/queues';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Customer, Queue, QueueItem } from '../firebase/schema';

export default function CustomerView() {
  const { queueId, customerId } = useParams<{ queueId: string; customerId: string; }>();
  const navigate = useNavigate();

  const [queue, setQueue] = useState<QueueItem | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [position, setPosition] = useState<{ position: number; totalAhead: number; estimatedWaitTime: number | null; }>({
    position: 0,
    totalAhead: 0,
    estimatedWaitTime: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add ref for previous customer status
  const prevCustomerStatusRef = useRef<string | null>(null);
  // Add ref for notification sound
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  // Initialize notification sound
  useEffect(() => {
    notificationSoundRef.current = new Audio('/notification-sound.mp3');
    return () => {
      // Cleanup if needed
      if (notificationSoundRef.current) {
        notificationSoundRef.current.pause();
        notificationSoundRef.current = null;
      }
    };
  }, []);

  // Function to play notification sound
  const playNotificationSound = () => {
    if (notificationSoundRef.current) {
      // Reset the audio to the beginning if it's already playing
      notificationSoundRef.current.currentTime = 0;
      // Play the sound
      notificationSoundRef.current.play().catch(err => {
        console.error("Error playing notification sound:", err);
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (!queueId || !customerId) {
      setError('Invalid queue or customer ID');
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        // Get queue data
        const queueData = await getQueue(queueId);
        if (!queueData) {
          setError('Queue not found');
          setLoading(false);
          return;
        }
        setQueue(queueData);

        // Get customer data
        const customerData = await getCustomerStatus(queueData.id, customerId);
        if (!customerData) {
          setError('Customer position not found');
          setLoading(false);
          return;
        }
        setCustomer(customerData);

        // Get position data
        const positionData = await getCustomerPosition(queueData.id, customerId);
        setPosition(positionData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load queue information');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [queueId, customerId]);

  // Set up real-time listeners
  useEffect(() => {
    if (!queue?.id || !customerId || loading) return;

    // Listen for changes to the customer document
    const customerUnsubscribe = onSnapshot(
      doc(db, 'queues', queue.id, 'customers', customerId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Customer;
          
          // Check if status changed to 'notified'
          if (prevCustomerStatusRef.current !== 'notified' && data.status === 'notified') {
            playNotificationSound();
          }
          
          // Update previous status ref
          prevCustomerStatusRef.current = data.status;
          setCustomer(data);
        } else {
          setError('Customer position no longer exists');
        }
      },
      (err) => {
        console.error('Error in customer listener:', err);
        setError('Failed to get real-time updates');
      }
    );

    // Listen for changes to customers ahead in the queue to update position
    const customersAheadUnsubscribe = onSnapshot(
      query(
        collection(db, 'queues', queue.id, 'customers'),
        where('status', 'in', ['waiting', 'notified']),
      ),
      async (snapshot) => {
        console.log("ran", snapshot);

        try {
          // Recalculate total customers ahead
          if (customer) {
            const ahead = snapshot.docs.filter(
              doc => (doc.data() as Customer).position < customer.position
            ).length;

            setPosition(prev => ({
              ...prev,
              totalAhead: ahead,
              estimatedWaitTime: queue?.data.estimatedWaitPerPerson ? ahead * queue.data.estimatedWaitPerPerson : null
            }));
          }
        } catch (err) {
          console.error('Error calculating position:', err);
        }
      },
      (err) => {
        console.error('Error in queue listener:', err);
      }
    );

    // Listen for changes to the queue document
    const queueUnsubscribe = onSnapshot(
      doc(db, 'queues', queue.id),
      (snapshot) => {
        if (snapshot.exists()) {
          const queueData = snapshot.data() as Queue;
          setQueue({id: queue.id, data: queueData});

          // Update estimated wait time if applicable
          if (queueData.estimatedWaitPerPerson) {
            setPosition(prev => ({
              ...prev,
              estimatedWaitTime: prev.totalAhead * queueData.estimatedWaitPerPerson!
            }));
          }
        } else {
          setError('Queue no longer exists');
        }
      },
      (err) => {
        console.error('Error in queue listener:', err);
      }
    );

    // Clean up listeners
    return () => {
      customerUnsubscribe();
      customersAheadUnsubscribe();
      queueUnsubscribe();
    };
  }, [queue?.id, customerId, loading]);

  // Helper function to format status for display
  const getStatusDisplay = () => {
    if (!customer) return '';

    switch (customer.status) {
      case 'notified':
        return 'It\'s your turn! Please proceed to the service point.';
      case 'waiting':
        return 'Waiting in queue';
      case 'served':
        return 'You have been served';
      case 'skipped':
        return 'You were skipped';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    if (!customer) return 'bg-gray-100';

    switch (customer.status) {
      case 'notified':
        return 'bg-green-100 border-green-500';
      case 'waiting':
        return 'bg-primary/60 border-primary-sat';
      case 'served':
        return 'bg-gray-100 border-gray-300';
      case 'skipped':
        return 'bg-yellow-100 border-yellow-400';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center">
        <p className="text-gray-600">Loading your position...</p>
      </div>
    );
  }

  if (error || !queue || !customer) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <div className="text-red-500 text-center mb-4">{error || "Could not find your position in queue"}</div>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const etaWaitTime = Math.floor(((queue.data.estimatedWaitPerPerson || 0) * (position.totalAhead + 1)) / 1000 / 60);

  // TODO: Then make the analytics page
  return (
    <div className="max-w-md mx-auto mt-10 p-6 pb-9 bg-white rounded-[40px] shadow-lg shadow-black/25">
      <h1 className="text-xl font-bold mb-2 text-center">{queue.data.queueName}</h1>
      <p className="mb-6 text-center font-medium">
        Host: {queue.data.hostName}
      </p>

      <div className={`p-4 border rounded-3xl mb-6 ${getStatusColor()}`}>
        <div className={`flex justify-around flex-wrap`}>
          <h2 className="font-bold text-lg mb-2">
            {customer.name}
          </h2>
          <div className="font-bold mb-2">
            {getStatusDisplay()}
          </div>
        </div>

        <div className="mt-5 flex justify-between items-center mb-2">
          <span className='text-sm'>Your number:</span>
          <span className="font-bold">#{position.position.toString().padStart(3, "0")}</span>
        </div>
        {customer.status === 'waiting' && (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className='text-sm'>People ahead of you:</span>
              <span className="font-bold">{position.totalAhead}</span>
            </div>
            {queue.data.estimatedWaitPerPerson && (
              <div className="flex justify-between items-center">
                <span className='text-sm'>Estimated wait time:</span>
                <span className="font-bold text-end">{etaWaitTime} minutes</span>
              </div>
            )}
          </>
        )}

        {customer.status === 'notified' && (
          <>
            <div className="text-green-700 font-medium mt-2">
              You were called at {customer.notifiedAt?.toDate().toLocaleTimeString()}
            </div>
          </>
        )}
      </div>

      <div className="mb-4 text-xs text-center text-gray-900">
        <p>You joined this queue on {customer.joinedAt.toDate().toLocaleString()}</p>
      </div>

      {!queue.data.isActive && (
        <div className="bg-yellow-100 p-3 rounded-md mb-4 text-yellow-800 text-xs">
          Note: This queue is currently not accepting new customers.
        </div>
      )}

      <div className="mt-8 border-t pt-4">
        <p className="text-xs text-gray-900 mb-3">
          Keep this page open to maintain your position and receive notifications when it's your turn.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full font-semibold bg-primary-sat py-2 px-4 rounded-xl hover:bg-primary shadow-lg shadow-black/25"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
