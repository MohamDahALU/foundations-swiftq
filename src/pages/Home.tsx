import { Link } from 'react-router-dom';
import logoFull from "../assets/logoFull.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logoFull} className='max-h-16' />
        </div>
        <Link to="/login">
          <button className="bg-primary px-6 py-2 rounded-full font-medium">Login</button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto text-center py-16 px-4">
          <div className="flex justify-center items-center mb-4">
            <img src={logoFull} />
          </div>
          <h3 className="text-3xl font-bold mb-2">No More Waiting in Line</h3>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-10">
            SwiftQ lets you join or manage queues digitally, and wait nearby, not in a crowd.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/join/1234">
              <button className="bg-primary px-8 py-3 rounded-full font-medium">Join a Queue</button>
            </Link>
            <Link to="/create">
              <button className="bg-primary px-8 py-3 rounded-full font-medium">Create a Queue</button>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>

            <div className="max-w-3xl mx-auto space-y-8">
              {/* Step 1 */}
              <div className="bg-white rounded-full p-6 flex items-center">
                <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mr-6">
                  <span className="text-4xl font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold">Create or Join</h4>
                  <p className="text-gray-700">Businesses create queues. Customers join with a QR code or ID.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-full p-6 flex items-center">
                <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mr-6">
                  <span className="text-4xl font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold">Wait Virtually</h4>
                  <p className="text-gray-700">No need to physically wait in line. Do other things while you wait.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-full p-6 flex items-center">
                <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mr-6">
                  <span className="text-4xl font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold">Get Notified</h4>
                  <p className="text-gray-700">Receive a notification when it's your turn to be served.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary py-8">
        <div className="container mx-auto flex justify-center gap-8">
          <Link to="/about">
            <button className="bg-white px-6 py-2 rounded-full">About Us</button>
          </Link>
          <Link to="/contact">
            <button className="bg-white px-6 py-2 rounded-full">Contact Us</button>
          </Link>
          <Link to="/privacy">
            <button className="bg-white px-6 py-2 rounded-full">Privacy Policy</button>
          </Link>
        </div>
        <div className="text-center mt-6">
          <p>© 2025 SwiftQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
