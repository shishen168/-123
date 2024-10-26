import React, { useState } from 'react';
import { Users, Settings, CreditCard, LogOut, UserCog, Bell, BarChart, DollarSign, MessageSquare } from 'lucide-react';
import PaymentSettings from './PaymentSettings';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import UserSettings from './UserSettings';
import NotificationSettings from './NotificationSettings';
import RevenueStatistics from './RevenueStatistics';
import PriceSettings from './PriceSettings';
import AdvertisementSettings from './AdvertisementSettings';
import { adminService } from '../../services/adminService';

interface AdminPanelProps {
  onLogout: () => void;
}

type TabType = 'payment' | 'users' | 'orders' | 'userSettings' | 'notification' | 'revenue' | 'prices' | 'advertisement';

function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('users');

  const handleLogout = () => {
    adminService.logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">管理后台</h1>
        </div>
        
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'users'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            用户管理
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'prices'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="w-5 h-5 mr-3" />
            价格设置
          </button>

          <button
            onClick={() => setActiveTab('userSettings')}
            className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'userSettings'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UserCog className="w-5 h-5 mr-3" />
            用户设置
          </button>

          <button
            onClick={() => setActiveTab('notification')}
            className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'notification'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell className="w-5 h-5 mr-3" />
            通知设置
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'payment'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            支付设置
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'orders'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            订单管理
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'revenue'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart className="w-5 h-5 mr-3" />
            营收统计
          </button>

          <button
            onClick={() => setActiveTab('advertisement')}
            className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'advertisement'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            广告管理
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            退出登录
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8">
        {activeTab === 'payment' && <PaymentSettings />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'userSettings' && <UserSettings />}
        {activeTab === 'notification' && <NotificationSettings />}
        {activeTab === 'revenue' && <RevenueStatistics />}
        {activeTab === 'prices' && <PriceSettings />}
        {activeTab === 'advertisement' && <AdvertisementSettings />}
      </div>
    </div>
  );
}

export default AdminPanel;