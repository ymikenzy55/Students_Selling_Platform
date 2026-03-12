'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already seen the preloader in this session
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    
    if (hasSeenPreloader) {
      setIsLoading(false);
      return;
    }

    // Show preloader for 3 seconds (adjust based on your video length)
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasSeenPreloader', 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <video
        src="/logo.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onEnded={() => {
          setIsLoading(false);
          sessionStorage.setItem('hasSeenPreloader', 'true');
        }}
      />
    </div>
  );
}
