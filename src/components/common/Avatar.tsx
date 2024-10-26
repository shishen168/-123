import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  text,
  className = ''
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`
          rounded-full object-cover
          ${sizes[size]}
          ${className}
        `}
      />
    );
  }

  return (
    <div className={`
      flex items-center justify-center rounded-full
      bg-gray-200 text-gray-600 font-medium
      ${sizes[size]}
      ${className}
    `}>
      {text ? getInitials(text) : alt ? getInitials(alt) : '?'}
    </div>
  );
};

export default Avatar;