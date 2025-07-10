import logoFull from "../assets/logoFull.png";
import rays from "../assets/rays.png";

import { useState } from "react";

export default function JoinQueue() {
  const [name, setName] = useState("");

  return (
    <>
      <div className="min-h-screen bg-primary flex flex-col items-center py-0 px-4 relative">
        {/* Top rays */}
        <div className="flex justify-center w-52 -mt-5">
          <img src={rays} />
        </div>

        {/* Logo */}
        <div className="bg-white rounded-full w-full max-w-md pb-6 mb-4 flex justify-center">
          <img src={logoFull} alt="Logo" className="max-h-20" />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl w-full max-w-md p-6 mb-4">
          <h2 className="text-2xl font-bold text-center mb-4">My Queue</h2>

          {/* Previous positions section */}
          <div className="bg-lime-100 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-2">Your Previous Positions</h3>
            <p className="text-base mb-1">You already have active positions in this queue.</p>
            <p className="text-base mb-6">You can return to one of them:</p>

            <div className="mb-4">
              <h4 className="text-xl font-bold">Customer 2</h4>
              <p className="text-sm">Joined: 7/1/2025, 10:54:44 AM</p>
              <p className="text-sm">Status: <span className="text-red-500">Waiting</span></p>
            </div>

            <button className="bg-primary rounded-full py-2 px-12 w-full max-w-xs mx-auto block mb-4">
              Return
            </button>

            <p className="text-center">Or join as a new customer below.</p>
          </div>

          {/* Join form */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-xl font-bold mb-2">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name (Optional)"
              className="w-full border border-lime-300 rounded-full py-3 px-4"
            />
          </div>

          <button className="bg-primary rounded-full py-4 px-6 w-full font-bold text-lg">
            Join Queue
          </button>
        </div>

        {/* Bottom rays */}
        <div className="flex justify-center w-52">
          <img src={rays} className="rotate-180" />
        </div>

        {/* Footer */}
        <footer className="text-xs text-center">
          © 2025 SwiftQ. All rights reserved.
        </footer>
      </div>
    </>
  );
}
