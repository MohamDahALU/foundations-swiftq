import { Link } from 'react-router-dom';
import logoFull from "../assets/logoFull.png";
import { useState } from 'react';
import JoinPopup from './_components/JoinPopup';

export default function Home() {

  const [showJoin, setShowJoin] = useState(false);

  return (
    <>
      {showJoin && <JoinPopup onClose={() => setShowJoin(false)} />}

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto text-center py-16 px-4">
          <div className="flex justify-center items-center mb-4">
            <img src={logoFull} className='max-h-24' />
          </div>
          <h3 className="text-xl font-bold mb-2">No More Waiting in Line</h3>
          <p className="text-gray-500 font-bold max-w-2xl mx-auto mb-10">
            SwiftQ lets you join or manage queues digitally, and wait nearby, not in a crowd.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowJoin(true)}
              className="bg-primary text-sm font-bold px-3 py-1 rounded-full shadow-lg shadow-black/25"
            >
              Join a Queue
            </button>
            <Link to="/create">
              <button className="bg-primary text-sm font-bold px-3 py-1 rounded-full shadow-lg shadow-black/25">Create a Queue</button>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-12">How It Works</h3>

            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-y-8 gap-x-12">
              {/* Step 1 */}
              <div className="bg-white rounded-[29px] p-6 flex items-center">
                <div className="bg-gray-200 rounded-full min-w-14 aspect-square flex items-center justify-center mr-6">
                  <span className="text-4xl font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-base font-bold">Create or Join</h4>
                  <p className="text-gray-700 text-sm">Businesses create queues. Customers join with a QR code or ID.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-[29px] p-6 flex items-center">
                <div className="bg-gray-200 rounded-full min-w-14 aspect-square flex items-center justify-center mr-6">
                  <span className="text-4xl font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-base font-bold">Wait Virtually</h4>
                  <p className="text-gray-700 text-sm">No need to physically wait in line. Do other things while you wait.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-[29px] p-6 flex items-center">
                <div className="bg-gray-200 rounded-full min-w-14 aspect-square flex items-center justify-center mr-6">
                  <span className="text-4xl font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-base font-bold">Get Notified</h4>
                  <p className="text-gray-700 text-sm">Receive a notification when it's your turn to be served.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary pt-8 pb-4">
        {/* <div className="container mx-auto flex justify-center gap-8">
          <Link to="/about">
            <button className="bg-white px-6 py-2 rounded-full">About Us</button>
          </Link>
          <Link to="/contact">
            <button className="bg-white px-6 py-2 rounded-full">Contact Us</button>
          </Link>
          <Link to="/privacy">
            <button className="bg-white px-6 py-2 rounded-full">Privacy Policy</button>
          </Link>
        </div> */}
        <div className="text-center mt-6 text-xs">
          <p>© 2025 SwiftQ. All rights reserved.</p>
        </div>
      </footer>
    </>

  );
}