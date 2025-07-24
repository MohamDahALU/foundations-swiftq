import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { getQueue } from '../firebase/services/queues';
import type { Queue } from '../firebase/schema';
import { CheckCircle2, Copy } from 'lucide-react';

// QR page for displaying queue info, QR code, and join link
export default function QR() {
  // Get queueId from URL params
  const { queueId } = useParams<{ queueId: string; }>();
  const navigate = useNavigate();

  // State for queue data, loading, error, join link, and copy feedback
  const [queue, setQueue] = useState<{ id: string, data: Queue; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinLink, setJoinLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Fetch queue data when queueId changes
  useEffect(() => {
    const fetchQueue = async () => {
      if (!queueId) {
        setError('Queue ID not found');
        setLoading(false);
        return;
      }

      try {
        const queueData = await getQueue(queueId);
        if (!queueData) {
          setError('Queue not found');
          setLoading(false);
          return;
        }

        setQueue(queueData);
        // Create the join link for sharing
        const baseUrl = window.location.origin;
        setJoinLink(`${baseUrl}/join/${queueId}`);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching queue data:', err);
        setError('Failed to load queue information');
        setLoading(false);
      }
    };

    fetchQueue();
  }, [queueId]);

  // Copy join link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // Copy queue code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(queueId || "");
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading QR code...</p>
        </div>
      </div>
    );
  }

  // Show error message if queue not found or fetch fails
  if (error || !queue) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <div className="text-red-500 mb-4">{error || "Queue not found"}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main QR code and queue info UI
  return (
    <div className="min-h-screen bg-primary py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header with title and close button */}
        <div className="bg-white px-5 py-4 border-b border-gray-200 shadow-lg shadow-black/25 flex justify-between items-center rounded-full">
          <div>
            <h1 className="text-xl font-semibold">Queue QR Code</h1>
            <p className="text-sm text-gray-500">Scan to join the queue</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary p-2 rounded-full shadow-lg shadow-black/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-white mt-3.5 p-2.5 rounded-[30px] shadow-lg shadow-black/25 overflow-hidden">

          {/* Queue Info with Code and copy button */}
          <div className="p-5 bg-primary/50 border-b rounded-[30px]">
            <div className="flex flex-col justify-between items-start">
              <div className='flex items-center justify-between w-full flex-wrap'>
                <div>
                  <h2 className="text-lg font-semibold">{queue.data.queueName}</h2>
                  <p className="text-sm">Host: {queue.data.hostName}</p>
                </div>
                <div className={`mt-2 text-sm inline-block px-4 py-1 rounded-lg border ${queue.data.isActive ? "bg-green-200 border-green-800" : "bg-red-200 border-red-800" }`}>
                  {queue.data.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="text-center self-center mt-4 flex gap-3">
                <div>
                  <div className="text-xs mb-1">Queue Code</div>
                  <div className="text-xl font-bold bg-white px-3 py-2 rounded-lg shadow-sm border-2 border-primary">
                    {queueId}
                  </div>
                </div>
                {/* Copy queue code button */}
                <button onClick={copyCode} className="self-end mb-1.5 text-lg font-bold bg-white px-3 py-2 rounded-lg shadow-sm border-2 border-primary">
                  {!codeCopied ?
                    <Copy size={18} strokeWidth={2.5} />
                    : <CheckCircle2 className='text-white' fill='green' />
                  }
                </button>
              </div>
            </div>
            {/* Feedback for code copy */}
            {codeCopied && (
              <p className="mt-1 text-sm text-green-600 text-center">
                Code copied to clipboard!
              </p>
            )}
          </div>

          {/* QR Code section */}
          <div className="py-8 px-2 flex flex-col items-center">
            <div className="bg-white p-3 rounded-lg shadow-sm border-4 border-primary">
              <QRCodeSVG
                value={joinLink}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
              />
            </div>

            {/* Join Link with copy button */}
            <div className="mt-8 w-full">
              <label className="block font-semibold mb-1">
                Join Link:
              </label>
              <div className="flex rounded-md shadow-sm gap-2.5">
                <input
                  type="text"
                  readOnly
                  value={joinLink}
                  className="flex-1 block w-full text-xs font-medium rounded-md sm:text-sm border-2 border-primary px-2 focus:outline-none"
                />
                {/* Copy join link button */}
                <button
                  onClick={copyToClipboard}
                  className={`inline-flex items-center px-3 py-2 border-2  border-primary rounded-md ${copied ? 'text-green-700' : 'text-gray-700'} hover:bg-gray-100`}
                >
                  {copied ? (
                    <CheckCircle2 className='text-white' fill='green' />
                  ) : (
                    <Copy size={18} strokeWidth={2.5} className='text-black' />
                  )}
                </button>
              </div>
              {/* Feedback for link copy */}
              {copied && (
                <p className="mt-1 text-sm text-green-600">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          </div>

          {/* Instructions for using QR code */}
          <div className="py-5 px-3 bg-primary/50 rounded-[20px]">
            <h3 className="text-xs font-medium text-gray-900">Instructions:</h3>
            <ul className="mt-2 text-xs font-medium text-gray-500 list-disc list-inside space-y-1">
              <li>Display this QR code for customers to scan</li>
              <li>When scanned, customers will be directed to the join page</li>
              <li>Customers can enter their information and join the queue</li>
            </ul>
          </div>
          {/* Button to manage the queue */}
          <button
            onClick={() => navigate(`/my-queues/${queue.id}`)}
            className="font-semibold px-10 py-2 bg-primary rounded-xl hover:bg-primary-sat block mx-auto mt-5 mb-7 shadow-lg shadow-black/25"
          >
            Manage Queue
          </button>
        </div>
      </div>
    </div>
  );
}
