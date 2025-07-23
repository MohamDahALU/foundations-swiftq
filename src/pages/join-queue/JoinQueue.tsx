/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { joinQueue } from "../../firebase/services/queues";
import { type CustomerItem, type Queue } from "../../firebase/schema";

type LoaderData = {
  queue: { id: string, data: Queue; };
  prevPositions: CustomerItem[];
};

export default function JoinQueue() {
  const { queueId } = useParams<{ queueId: string; }>();
  const navigate = useNavigate();
  const { queue, prevPositions } = useLoaderData() as LoaderData;
  const queueData = queue.data;

  const [customerName, setCustomerName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!queueId) return;

    // If queue requires name but none provided
    if (queueData?.requireCustomerName && !customerName.trim()) {
      setError("Please enter your name to join this queue");
      return;
    }

    setJoining(true);
    setError(null);

    try {
      const customerId = await joinQueue(queue.id, customerName.trim() || undefined);

      // Navigate to customer view
      navigate(`/queue/${queueId}/customer/${customerId}`);
    } catch (err: any) {
      console.error("Error joining queue:", err);
      setError(err.message || "Failed to join the queue");
    } finally {
      setJoining(false);
    }
  };

  const goToPreviousPosition = (customerId: string) => {
    navigate(`/queue/${queueId}/customer/${customerId}`);
  };


  if (error || !queueData) {
    return (
      <div className="bg-primary max-w-md mx-auto mt-10 p-6  rounded-lg shadow">
        <div className="text-red-500 text-center">{error}</div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (

    <div className="max-w-md mx-auto p-6 bg-white rounded-[40px] shadow-lg shadow-black/25">
      <h1 className="text-xl text-center font-bold mb-4">{queueData.queueName}</h1>

      {prevPositions.length > 0 && (
        <div className="mb-6 bg-primary/60 p-4 pt-8 rounded-2xl">
          <h2 className="font-semibold text-lg mb-2">Your Previous Positions</h2>
          <p className="text-2xs text-gray-900 mb-3">
            You already have active positions in this queue. You can return to one of them:
          </p>
          <div className="space-y-2">
            {prevPositions.slice(0, 2).map((position) => (
              <div key={position.id} className="flex justify-between items-center pb-2">
                <div>
                  <p className="font-medium">{position.data.name || 'Anonymous'}</p>
                  <p className="text-2xs">
                    Joined: {position.data.joinedAt.toDate().toLocaleString()}
                  </p>
                  <p className="text-2xs">
                    Status: <span className="text-red-600">
                      {position.data.status === 'notified' ? 'Ready to be served' : 'Waiting'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => goToPreviousPosition(position.id)}
                  className="bg-primary-sat px-3 py-1 rounded-full hover:bg-primary text-xs font-semibold shadow-lg shadow-black/25"
                >
                  Return
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2">
            <p className="text-2xs text-center">Or join as a new customer below.</p>
          </div>
        </div>
      )}

      {!queueData.isActive ? (
        <div className="bg-yellow-100 p-4 rounded-md text-yellow-800 mb-4">
          This queue is currently closed and not accepting new customers.
        </div>
      ) : (
        <form onSubmit={handleJoinQueue}>
          {queueData.requireCustomerName && (
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="name">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-sm border-2 border-primary rounded-md focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          {!queueData.requireCustomerName && (
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="name">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-sm border-2 border-primary rounded-md focus:outline-none"
                placeholder="Enter your name (optional)"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={joining || (queueData.requireCustomerName && !customerName.trim())}
            className={`w-full bg-primary-sat font-semibold shadow-lg shadow-black/25 py-2 px-4 mt-4 rounded-xl hover:bg-primary ${joining || (queueData.requireCustomerName && !customerName.trim())
              ? "opacity-50 cursor-not-allowed"
              : ""
              }`}
          >
            {joining ? "Joining..." : "Join Queue"}
          </button>
        </form>
      )}

      {/* <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Host:</span>
          <span>{queueData.hostName}</span>
        </div>
        {queueData.estimatedWaitPerPerson && (
          <div className="flex justify-between items-center">
            <span className="font-semibold">Est. wait per person:</span>
            <span>{queueData.estimatedWaitPerPerson}</span>
          </div>
        )}
      </div> */}
    </div>
  );
}