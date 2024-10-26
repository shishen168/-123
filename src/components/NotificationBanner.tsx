import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { notificationService } from '../services/notificationService';

function NotificationBanner() {
  const [notification, setNotification] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const loadNotification = () => {
      const currentNotification = notificationService.getCurrentNotification();
      if (currentNotification !== notification) {
        setIsAnimating(true);
        setTimeout(() => {
          setNotification(currentNotification);
          setIsVisible(!!currentNotification);
          setIsAnimating(false);
        }, 300);
      } else {
        setNotification(currentNotification);
        setIsVisible(!!currentNotification);
      }
    };

    loadNotification();
    const handleUpdate = () => loadNotification();
    window.addEventListener('notificationUpdate', handleUpdate);
    
    return () => {
      window.removeEventListener('notificationUpdate', handleUpdate);
    };
  }, [notification]);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-600 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-code-flow"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className={`flex items-center justify-center py-2 transition-all duration-300 ${
          isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
        }`}>
          <div className="flex items-center max-w-4xl mx-auto">
            <Bell className="w-4 h-4 mr-2 flex-shrink-0 text-white animate-bounce" />
            <p className="text-sm text-center flex-1 text-white font-medium">{notification}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationBanner;