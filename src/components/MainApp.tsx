import React, { useState, useEffect } from 'react';
import { LogOut, User, Menu, X } from 'lucide-react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { notificationService } from '../services/notificationService';
import Navbar from './Navbar';
import MainContent from './MainContent';
import RechargeModal from './recharge/RechargeModal';
import NotificationBanner from './NotificationBanner';
import Advertisement from './advertisement/Advertisement';
import useMediaQuery from '../hooks/useMediaQuery';

export const BALANCE_UPDATE_EVENT = 'balanceUpdate';

function MainApp() {
  const [activeTab, setActiveTab] = useState('sms');
  const [balance, setBalance] = useState(0);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const currentUser = authService.getCurrentUser();
  const [notification, setNotification] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    loadUserBalance();

    const handleBalanceUpdate = (event: CustomEvent) => {
      console.log('Balance update event received:', event.detail);
      setBalance(event.detail.balance);
    };

    window.addEventListener(BALANCE_UPDATE_EVENT, handleBalanceUpdate as EventListener);
    
    return () => {
      window.removeEventListener(BALANCE_UPDATE_EVENT, handleBalanceUpdate as EventListener);
    };
  }, []);

  const loadUserBalance = () => {
    const user = authService.getCurrentUser();
    if (user) {
      const userData = userService.getUsers().find(u => u.id === user.id);
      if (userData) {
        setBalance(userData.balance);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleRechargeSuccess = (amount: number) => {
    loadUserBalance(); // 充值成功后重新加载余额
    setShowRecharge(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col">
      {notification && <NotificationBanner />}

      <div className="flex flex-1">
        {isMobile && (
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="fixed top-4 left-4 z-50 p-2 bg-blue-700 rounded-md text-white"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        )}

        <div className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out' : 'w-48'}
          ${isMobile && !showMobileMenu ? '-translate-x-full' : 'translate-x-0'}
          bg-blue-700 text-white flex flex-col
        `}>
          <div className="p-4">
            <h1 className="text-xl font-bold">神域短信</h1>
          </div>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="flex-1 flex flex-col">
          <header className="bg-blue-700 text-white p-4">
            <div className="flex justify-end items-center space-x-4">
              <div className="text-white">
                <span className="text-blue-100">余额：</span>
                <span className="font-semibold">{balance.toFixed(2)} USDT</span>
              </div>
              <button
                onClick={() => setShowRecharge(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50"
              >
                充值
              </button>
              <div className="flex items-center space-x-2 border-l border-blue-400 pl-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span className="hidden md:inline">{currentUser?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1 hover:bg-blue-600 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4 md:mr-1" />
                  <span className="hidden md:inline">退出</span>
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-6 flex-1">
            <MainContent 
              activeTab={activeTab}
              onShowRecharge={() => setShowRecharge(true)}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Advertisement position="bottom" />
      </div>

      {showRecharge && (
        <RechargeModal
          isOpen={showRecharge}
          onClose={() => setShowRecharge(false)}
          onSuccess={handleRechargeSuccess}
        />
      )}
    </div>
  );
}

export default MainApp;