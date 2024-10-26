import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onConfirm?: () => void;
  confirmText?: string;
  confirmIcon?: React.ReactNode;
  confirmLoading?: boolean;
  type?: 'info' | 'warning' | 'danger';
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  onConfirm,
  confirmText = '确认',
  confirmIcon,
  confirmLoading = false,
  type = 'info'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const types = {
    info: {
      buttonColor: 'primary',
      titleColor: 'text-gray-900'
    },
    warning: {
      buttonColor: 'warning',
      titleColor: 'text-yellow-700'
    },
    danger: {
      buttonColor: 'danger',
      titleColor: 'text-red-700'
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        <div className={`relative bg-white rounded-lg w-full ${sizes[size]} transform transition-all`}>
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className={`text-lg font-semibold ${types[type].titleColor}`}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {children}
          </div>

          {(footer || onConfirm) && (
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              {footer || (
                <>
                  <Button
                    variant="secondary"
                    onClick={onClose}
                  >
                    取消
                  </Button>
                  <Button
                    variant={types[type].buttonColor as any}
                    onClick={onConfirm}
                    loading={confirmLoading}
                    icon={confirmIcon}
                  >
                    {confirmText}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;