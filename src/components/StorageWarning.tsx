'use client';

import { useState, useEffect } from 'react';
import { MdWarning, MdClose } from 'react-icons/md';

export function StorageWarning() {
  const [isVisible, setIsVisible] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // Check if we're in production
    const isProd = process.env.NODE_ENV === 'production';
    setIsProduction(isProd);
    
    // Show warning in production
    if (isProd) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible || !isProduction) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <MdWarning className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <strong>Demo Mode:</strong> This is a demonstration version. 
            Data will reset when the server restarts. For persistent storage, 
            this app would need to be connected to a database like Vercel KV.
          </p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setIsVisible(false)}
            className="inline-flex text-yellow-400 hover:text-yellow-600"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
