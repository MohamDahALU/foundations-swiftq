import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Html5QrcodePlugin from './Html5QrcodePlugin';

type QRScannerProps = {
  setShowScanner: (value: React.SetStateAction<boolean>) => void;
};

export default function QRScanner({ setShowScanner }: QRScannerProps) {
  console.log("fsdafsd")
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scanning = useRef(false);
  const navigate = useNavigate();

  // Request camera permission explicitly
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // If we get here, permission was granted
        setHasPermission(true);
        // Clean up the stream since QrReader will create its own
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasPermission(false);
        setError('Could not access camera. Please check permissions.');
      }
    };

    requestCameraPermission();
  }, []);

  const handleScan = (decodedText: string) => {
    if (decodedText && scanning.current === false) {
      scanning.current = true;
      // Assuming the QR code contains a queue ID
      const queueId = decodedText;
      if (queueId) {
        navigate((new URL(decodedText)).pathname);
      }
    }
  };


  return (
    <div className="mb-6">
      {hasPermission === false ? (
        <div className="bg-red-100 p-4 text-red-700 rounded-lg">
          <p>Camera access denied or not available.</p>
          <p className="text-sm mt-2">Please grant camera permissions in your browser settings.</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 text-red-700 rounded-lg">
          <p>{error}</p>
          <p className="text-sm mt-2">Please make sure camera permissions are granted to this site.</p>
        </div>
      ) : (
        <div className="qr-scanner-container origin-bottom" style={{overflow: 'hidden'}}>
          <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={handleScan}
          />
        </div>
      )}
      <p className="text-center text-gray-500 mb-4">
        {hasPermission === null ? "Requesting camera access..." : "Position the QR code within the frame to scan"}
      </p>
      <button
        onClick={() => setShowScanner(false)}
        className="w-full bg-primary text-black py-3 rounded-full font-medium"
      >
        Enter Queue ID Instead
      </button>
    </div>
  );
}
