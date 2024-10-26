import React, { useState, useRef, useEffect } from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const placements = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div className={`
          absolute z-50 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5
          ${placements[placement]}
        `}>
          <div className="p-4">
            {content}
          </div>
          <div
            className={`
              absolute w-2 h-2 bg-white transform rotate-45
              ${placement === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                placement === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                placement === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                'left-[-4px] top-1/2 -translate-y-1/2'
              }
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Popover;