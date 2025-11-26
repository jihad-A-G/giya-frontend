"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for critical resources to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Also check if document is ready
    if (document.readyState === 'complete') {
      setIsLoading(false);
      clearTimeout(timer);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => setIsLoading(false), 500);
      });
    }

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500"
      style={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? 'auto' : 'none' }}
    >
      <div className="text-center">
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="Giya Enjoy Living"
            width={120}
            height={120}
            className="mx-auto animate-pulse"
            priority
          />
        </div>
        <div className="flex space-x-2 justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
