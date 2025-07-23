/* eslint-disable @typescript-eslint/no-explicit-any */
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import '../styles/qr-scanner.css';

const qrcodeRegionId = "html5qr-code-full-region";

const Html5QrcodePlugin = (props: any) => {
    // Use refs to keep track of scanner instance and scanning state
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const isScanning = useRef<boolean>(false);
    const [cameras, setCameras] = useState<Array<{id: string, label: string}>>([]);
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

    // Function to start scanning with a specific camera
    const startScanning = async (cameraId: string) => {
        if (!html5QrCodeRef.current) return;
        
        try {
            if (isScanning.current) {
                await html5QrCodeRef.current.stop();
                isScanning.current = false;
            }
            
            await html5QrCodeRef.current.start(
                cameraId,
                {
                    fps: props.fps || 10,
                    qrbox: props.qrbox || 250,
                    aspectRatio: props.aspectRatio || 1,
                    disableFlip: props.disableFlip || false,
                },
                (decodedText) => {
                    props.qrCodeSuccessCallback(decodedText);
                },
                undefined
            );
            isScanning.current = true;
            setSelectedCamera(cameraId);
        } catch (error) {
            console.error("Error starting camera:", error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'scanner-error';
            errorDiv.textContent = 'Failed to start selected camera';
            document.getElementById(qrcodeRegionId)?.appendChild(errorDiv);
        }
    };

    useEffect(() => {
        // Success callback is required
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }

        // Initialize scanner with proper cleanup
        const initializeScanner = async () => {
            try {
                // Clean up any existing instance first
                if (html5QrCodeRef.current) {
                    if (isScanning.current) {
                        await html5QrCodeRef.current.stop();
                        isScanning.current = false;
                    }
                    html5QrCodeRef.current = null;
                }

                // Make sure the element is empty
                const element = document.getElementById(qrcodeRegionId);
                if (element) {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                }

                // Create new instance
                html5QrCodeRef.current = new Html5Qrcode(qrcodeRegionId);

                // Get cameras
                const devices = await Html5Qrcode.getCameras();
                if (devices && devices.length) {
                    setCameras(devices);
                    
                    // Try to find back camera
                    const backCamera = devices.find(
                        device => device.label.toLowerCase().includes('back')
                    );
                    const defaultCamera = backCamera ? backCamera.id : devices[0].id;
                    
                    // Add camera selector UI
                    const selectorContainer = document.createElement('div');
                    selectorContainer.className = 'camera-selector';
                    document.getElementById(qrcodeRegionId)?.appendChild(selectorContainer);
                    
                    // Start with default camera
                    await startScanning(defaultCamera);
                } else {
                    console.error("No cameras found");
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'scanner-error';
                    errorDiv.textContent = 'No cameras found on this device';
                    document.getElementById(qrcodeRegionId)?.appendChild(errorDiv);
                }
            } catch (error) {
                console.error("Error starting camera:", error);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'scanner-error';
                errorDiv.textContent = 'Failed to access camera. Please check permissions.';
                document.getElementById(qrcodeRegionId)?.appendChild(errorDiv);
            }
        };

        // Initialize after a short delay to ensure DOM is ready
        const timer = setTimeout(() => {
            initializeScanner();
        }, 100);

        // Cleanup function
        return () => {
            clearTimeout(timer);
            const stopScanner = async () => {
                if (html5QrCodeRef.current && isScanning.current) {
                    try {
                        await html5QrCodeRef.current.stop();
                        console.log("Scanner stopped successfully");
                    } catch (error) {
                        console.error("Failed to stop scanner:", error);
                    } finally {
                        isScanning.current = false;
                        html5QrCodeRef.current = null;
                    }
                }
            };
            
            stopScanner();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to run only once

    const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cameraId = e.target.value;
        startScanning(cameraId);
    };

    return (
        <div className="qr-scanner-isolation">
            <div id={qrcodeRegionId} className="qr-scanner-only" />
            {cameras.length > 1 && (
                <div className="camera-selector-wrapper">
                    <select 
                        value={selectedCamera || ''} 
                        onChange={handleCameraChange}
                        className="camera-select"
                    >
                        {cameras.map((camera) => (
                            <option key={camera.id} value={camera.id}>
                                {camera.label || `Camera ${camera.id.slice(0, 4)}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default Html5QrcodePlugin;