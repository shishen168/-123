import React from 'react';

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
}

interface MenuProps {
  items: MenuItem[];
  selectedKey?: string;
  onSelect: (key: string) => void;
  mode?: 'vertical' | 'horizontal';
  className?: string;
}

const Menu: React.FC<MenuProps> = ({
  items,
  selectedKey,
  onSelect,
  mode = 'vertical',
  className = ''
}) => {
  const renderMenuItem = (item: MenuItem) => {
    const isSelected = item.key === selectedKey;

    return (
      <li key={item.key}>
        <button
          onClick={() => !item.disabled && onSelect(item.key)}
          className={`
            w-full text-left px-4 py-2 text-sm
            ${item.disabled
              ? 'text-gray-400 cursor-not-allowed'
              : isSelected
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }
            flex items-center
          `}
          disabled={item.disabled}
        >
          {item.icon && (
            <span className="mr-2">{item.icon}</span>
          )}
          {item.label}
        </button>
        {item.children && (
          <ul className="ml-4 border-l border-gray-200">
            {item.children.map(renderMenuItem)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ul className={`
      ${mode === 'horizontal' ? 'flex space-x-2' : 'space-y-1'}
      ${className}
    `}>
      {items.map(renderMenuItem)}
    </ul>
  );
};

export default Menu;