'use client';

import React from 'react';

interface DumbbellLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function DumbbellLoader({ 
  size = 'md', 
  message = 'Loading...', 
  className = '' 
}: DumbbellLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Dumbbell Animation */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Left weight */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-4 bg-purple-600 rounded-full animate-pulse"></div>
        
        {/* Bar */}
        <div className="absolute left-2 right-2 top-1/2 transform -translate-y-1/2 h-1 bg-purple-600 rounded-full animate-bounce"></div>
        
        {/* Right weight */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-4 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Lifting motion overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-6 bg-purple-400 rounded-full animate-ping opacity-30"></div>
        </div>
      </div>
      
      {/* Loading text */}
      {message && (
        <p className={`text-purple-600 font-medium ${textSizeClasses[size]} animate-pulse`}>
          {message}
        </p>
      )}
    </div>
  );
}

// Alternative dumbbell design with more detailed animation
export function DumbbellLoaderDetailed({ 
  size = 'md', 
  message = 'Loading...', 
  className = '' 
}: DumbbellLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-12 h-6', 
    lg: 'w-16 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Detailed Dumbbell Animation */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Left weight */}
        <div className="absolute left-0 w-3 h-6 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full shadow-lg animate-bounce" style={{ animationDuration: '1s' }}></div>
        
        {/* Bar */}
        <div className="w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-md animate-pulse"></div>
        
        {/* Right weight */}
        <div className="absolute right-0 w-3 h-6 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full shadow-lg animate-bounce" style={{ animationDuration: '1s', animationDelay: '0.5s' }}></div>
        
        {/* Weight plates effect */}
        <div className="absolute left-0 w-3 h-6 border-2 border-purple-300 rounded-full animate-ping opacity-20"></div>
        <div className="absolute right-0 w-3 h-6 border-2 border-purple-300 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Loading text */}
      {message && (
        <p className={`text-purple-600 font-medium ${textSizeClasses[size]} animate-pulse`}>
          {message}
        </p>
      )}
    </div>
  );
}
