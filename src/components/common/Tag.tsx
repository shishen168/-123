import React from 'react';
import { X } from 'lucide-react';

interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  onRemove,
  color = 'default',
  className = ''
}) => {
  const colors = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
      ${colors[color]}
      ${className}
    `}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={`
            -mr-1 ml-1.5 inline-flex items-center justify-center
            hover:bg-gray-200 hover:bg-opacity-20 rounded-full p-0.5
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default Tag;