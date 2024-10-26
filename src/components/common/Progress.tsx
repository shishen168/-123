import React from 'react';

interface ProgressProps {
  percent: number;
  status?: 'normal' | 'success' | 'error';
  showInfo?: boolean;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  percent,
  status = 'normal',
  showInfo = true,
  className = ''
}) => {
  const colors = {
    normal: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ${colors[status]}`}
          style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
        />
      </div>
      {showInfo && (
        <div className="mt-1 text-right text-sm text-gray-500">
          {Math.round(percent)}%
        </div>
      )}
    </div>
  );
};

export default Progress;