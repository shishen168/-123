import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="relative">
        <div className={`${sizes[size]} border-4 border-blue-200 rounded-full`}></div>
        <div 
          className={`
            ${sizes[size]} border-4 border-blue-600 rounded-full 
            animate-spin absolute top-0 left-0 
            border-t-transparent
          `}
        ></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;