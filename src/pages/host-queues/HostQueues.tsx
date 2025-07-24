import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import type { QueueItem } from '../../firebase/schema';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

type LoaderData = {
  queues: (QueueItem & { count: number; })[];
};

export default function HostQueues() {
  const loaderData = useLoaderData() as LoaderData;
  const [queues, setQueues] = useState(loaderData.queues);
  // Add state for delete confirmation
  const [activeInProgress, setActiveInProgress] = useState<string | null>(null);


  // Toggle queue active state
  const toggleQueueStatus = async (queue: QueueItem & {
    count: number;
  }) => {
    if (!queue.id || !queue) return;
    setActiveInProgress(queue.id);
    try {
      await updateDoc(doc(db, "queues", queue.id), {
        isActive: !queue.data.isActive
      });
      setQueues(prev => prev.map(q => {
        const newQ = { ...q };
        if (q.id === queue.id) {
          console.log("fsadf");
          newQ.data = { ...newQ.data, isActive: !newQ.data.isActive };
        }
        return newQ;
      }));
    } catch (err) {
      console.error("Error updating queue status:", err);
      alert("Failed to update queue status.");
    }

    setActiveInProgress(null);
  };
  return (
    <div className="py-8">
      <div className="flex flex-col justify-between items-center mb-6">
        <h1 className="text-2xl font-bold py-5 bg-primary w-full text-center">My Queues</h1>
      </div>
      <div className="mx-auto mt-11 py-12 px-5 bg-primary">
        {queues.length === 0 ? (
          <div className="containe max-w-5xl mx-auto text-center py-10 bg-white rounded-lg shadow-lg shadow-black/25 border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No queues yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first queue.</p>
            <div className="mt-6">
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg shadow-black/25 bg-primary hover:bg-primary-sat focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Queue
              </Link>
            </div>
          </div>
        ) : (
          <div className="container max-w-5xl mx-auto py-8 bg-white shadow-lg shadow-black/25 overflow-hidden rounded-[40px]">
            <ul className="space-y-6 px-4">
              {queues.map((queue) => (
                <li key={queue.id}>
                  <div className="px-4 py-4 sm:px-6 bg-primary/50 rounded-3xl shadow-md shadow-black/25">
                    <div className="flex items-center justify-between flex-wrap gap-y-2">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-white rounded-full flex items-center justify-center">
                          <span className="font-semibold">{queue.count}</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900 break-words">{queue.data.queueName}</h3>
                          <p className="text-sm text-gray-500">
                            Created {queue.data.createdAt.toDate().toLocaleDateString()} •
                            {queue.data.requireCustomerName ? " Names required" : " Names not required"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-x-2 gap-y-2 justify-end flex-wrap">
                        <Link
                          to={`/my-queues/${queue.id}`}
                          className="inline-flex items-center px-3 py-1 border-2 text-xs font-medium rounded-lg border-blue-500 bg-blue-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Manage
                        </Link>
                        <Link
                          to={`/join/${queue.data.id}`}
                          className="inline-flex items-center px-3 py-1 border-2 text-xs font-medium rounded-lg border-green-500 bg-green-300 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Join Link
                        </Link>
                        <button
                          disabled={activeInProgress === queue.id}
                          onClick={() => toggleQueueStatus(queue)}
                          className="inline-flex items-center px-3 py-1 border-2 text-xs font-medium rounded-lg border-red-500 bg-red-300 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-200 disabled:border-transparent"
                        >
                          {activeInProgress === queue.id ? "Toggling" : queue.data.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link
          to="/create"
          className="block w-10/12 max-w-3xl mx-auto text-center mt-11 py-2 text-lg font-semibold rounded-xl shadow-lg shadow-black/25 bg-white"
        >
          Create New Queue
        </Link>
      </div>

    </div>
  );
}
