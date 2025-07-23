import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQueue } from '../firebase/services/queues';

export default function CreateQueue() {
  const [queueName, setQueueName] = useState('');
  const [requireNames, setRequireNames] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!queueName.trim()) {
      setError('Queue name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create the queue in Firestore, passing the requireNames parameter
      const queueId = await createQueue(queueName, requireNames);

      // Redirect to the queue details page
      navigate(`/my-queues/${queueId}`);
    } catch (err) {
      console.error('Error creating queue:', err);
      setError('Failed to create queue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="max-w-md mx-auto bg-white rounded-[40px] shadow-lg shadow-black/25 overflow-hidden">
      <div className="md:flex">
        <div className="p-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-lg font-bold text-gray-900">Create a New Queue</h1>
            <p className="mt-1 text-xs text-gray-600">
              Set up a new queue for your customers to join
            </p>
          </div>

          {error && (
            <div className="mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="queueName" className="block text-sm font-semibold">
                Queue Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="queueName"
                  name="queueName"
                  type="text"
                  required
                  value={queueName}
                  onChange={(e) => setQueueName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-2 border-primary rounded-md shadow-sm placeholder-gray-500 focus:outline-none text-sm"
                  placeholder="e.g., Coffee Shop Queue"
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="requireNames"
                  name="requireNames"
                  type="checkbox"
                  checked={requireNames}
                  onChange={(e) => setRequireNames(e.target.checked)}
                  className="h-4 w-4"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="requireNames" className="font-semibold">
                  Require customer names
                </label>
                <p className="text-gray-500 text-xs">When enabled, customers will need to provide their name to join the queue</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="py-1 px-4 border border-red-500 rounded-xl text-sm font-semibold bg-white shadow-lg shadow-black/25"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-1 px-4 border border-transparent rounded-xl shadow-lg shadow-black/25 text-sm font-semibold bg-primary hover:bg-primary-sat  ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? 'Creating...' : 'Create Queue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}