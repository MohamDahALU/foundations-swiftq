import { useEffect, useState } from 'react';

export default function SuspLoader() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Start with a quick initial progress
    setProgress(30);
    
    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(50), 300);
    const timer2 = setTimeout(() => setProgress(70), 600);
    const timer3 = setTimeout(() => setProgress(90), 900);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div 
        className="h-1 bg-blue-600 transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.7)'
        }}
      >
        {/* Animated loading effect at the end of the bar */}
        <div className="absolute right-0 h-full w-5 bg-gradient-to-r from-blue-600 to-blue-400 animate-pulse"></div>
      </div>
    </div>
  );
}
