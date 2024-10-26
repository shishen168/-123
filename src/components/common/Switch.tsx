import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  label
}) => {
  const sizes = {
    sm: {
      switch: 'w-8 h-4',
      dot: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'w-11 h-6',
      dot: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-7',
      dot: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  return (
    <label className={`inline-flex items-center ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex flex-shrink-0 ${sizes[size].switch}
          border-2 border-transparent rounded-full cursor-pointer
          transition-colors ease-in-out duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            ${sizes[size].dot}
            pointer-events-none inline-block rounded-full bg-white shadow
            transform ring-0 transition ease-in-out duration-200
            ${checked ? sizes[size].translate : 'translate-x-0'}
          `}
        />
      </button>
      {label && (
        <span className="ml-3 text-sm text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;