import React, { useState, useEffect } from 'react';
import { advertisementService } from '../../services/advertisementService';

interface AdvertisementProps {
  position: 'bottom' | 'top';
  className?: string;
}

function Advertisement({ position, className = '' }: AdvertisementProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadAd = () => {
      const ad = advertisementService.getActiveAd(position);
      setContent(ad?.content || '');
    };

    loadAd();
    window.addEventListener('advertisementUpdate', loadAd);

    return () => {
      window.removeEventListener('advertisementUpdate', loadAd);
    };
  }, [position]);

  if (!content) return null;

  return (
    <div className="w-full flex justify-center bg-blue-600">
      <div className={`max-w-4xl w-full text-center text-white px-4 py-3 ${className}`}>
        {content}
      </div>
    </div>
  );
}

export default Advertisement;