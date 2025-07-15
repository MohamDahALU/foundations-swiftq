import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoFull from "../assets/logoFull.png";
import rays from "../assets/rays.png";

export default function CreateQueue() {
  const [queueName, setQueueName] = useState("");
  const [requireCustomerNames, setRequireCustomerNames] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queueName.trim()) {
      alert("Queue name is required");
      return;
    }
    
    // TODO: Implement queue creation logic
    console.log("Creating queue:", {
      name: queueName,
      requireCustomerNames
    });
    
    // Navigate to queue management or success page
    navigate("/my-queues");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center py-0 px-4 relative">
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center p-4">
        <Link to="/">
          <img src={logoFull} alt="SwiftQ" className="max-h-8" />
        </Link>
        <button 
          onClick={() => setShowMenu(true)}
          className="bg-white bg-opacity-20 rounded-full p-2 w-10 h-10 flex items-center justify-center"
        >
          <div className="space-y-1">
            <div className="w-5 h-0.5 bg-black"></div>
            <div className="w-5 h-0.5 bg-black"></div>
            <div className="w-5 h-0.5 bg-black"></div>
          </div>
        </button>
      </header>

      {/* Top rays */}
      <div className="flex justify-center w-52 -mt-5">
        <img src={rays} alt="Rays" />
      </div>

      {/* Logo */}
      <div className="bg-white rounded-full w-full max-w-md pb-6 mb-4 flex justify-center">
        <img src={logoFull} alt="SwiftQ Logo" className="max-h-20" />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl w-full max-w-md p-6 mb-4">
        <h2 className="text-2xl font-bold text-center mb-2">Create a New Queue</h2>
        <p className="text-center text-gray-600 mb-6">Set up a new queue for your customers to join</p>

        <form onSubmit={handleSubmit}>
          {/* Queue Name */}
          <div className="mb-6">
            <label htmlFor="queueName" className="block text-lg font-bold mb-2">
              Queue Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="queueName"
              value={queueName}
              onChange={(e) => setQueueName(e.target.value)}
              placeholder="e.g. Gorilla Glue Queue"
              className="w-full border border-lime-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-lime-400"
              required
            />
          </div>

          {/* Require Customer Names Checkbox */}
          <div className="mb-8">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requireCustomerNames}
                onChange={(e) => setRequireCustomerNames(e.target.checked)}
                className="mt-1 h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
              />
              <div>
                <span className="text-lg font-bold">Require customer names</span>
                <p className="text-sm text-gray-600 mt-1">
                  When enabled, customers would need to provide their name to join the queue.
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 border border-gray-300 rounded-full py-3 px-6 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary rounded-full py-3 px-6 font-medium text-black hover:bg-lime-300 transition-colors"
            >
              Create Queue
            </button>
          </div>
        </form>
      </div>

      {/* Bottom rays */}
      <div className="flex justify-center w-52">
        <img src={rays} alt="Rays" className="rotate-180" />
      </div>

      {/* Footer */}
      <footer className="text-xs text-center mt-4">
        © 2025 SwiftQ. All rights reserved.
      </footer>

      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary rounded-3xl w-full max-w-sm mx-4 p-6 relative">
            {/* Close Button */}
            <button 
              onClick={() => setShowMenu(false)}
              className="absolute top-4 right-4 bg-primary rounded-full p-2 w-8 h-8 flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Menu Items */}
            <div className="space-y-4 mt-8">
              <button 
                onClick={() => { setShowMenu(false); navigate("/my-queues"); }}
                className="w-full bg-white rounded-full py-4 px-6 font-medium text-center block"
              >
                My Queues
              </button>
              
              <button 
                onClick={() => { setShowMenu(false); navigate("/create"); }}
                className="w-full bg-white rounded-full py-4 px-6 font-medium text-center block"
              >
                Create New Queue
              </button>
              
              <button 
                onClick={() => { setShowMenu(false); navigate("/analytics"); }}
                className="w-full bg-white rounded-full py-4 px-6 font-medium text-center block"
              >
                Analytics
              </button>
            </div>

            {/* Join a Queue Button */}
            <div className="mt-8 mb-4">
              <button 
                onClick={() => { setShowMenu(false); navigate("/join/1234"); }}
                className="w-full bg-primary border-2 border-black rounded-full py-3 px-6 font-medium text-center"
              >
                Join a Queue
              </button>
            </div>

            {/* Logout Button */}
            <div className="mt-4">
              <button 
                onClick={() => { setShowMenu(false); navigate("/login"); }}
                className="w-full bg-white rounded-full py-3 px-6 font-medium text-center"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}