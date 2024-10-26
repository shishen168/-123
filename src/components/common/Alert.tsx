import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = ''
}) => {
  const types = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      iconColor: 'text-green-400'
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      iconColor: 'text-blue-400'
    }
  };

  const { icon: Icon, bg, text, border, iconColor } = types[type];

  return (
    <div className={`rounded-md border p-4 ${bg} ${border} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${text}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${text} ${title ? 'mt-2' : ''}`}>
            {message}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md ${bg} p-1.5 ${text} hover:${bg} focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              <span className="sr-only">关闭</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;