import React from 'react';
import { MessageSquare, Users, Bell, Wallet, FileText, Phone } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const navItems = [
    { id: 'sms', icon: MessageSquare, label: '短信' },
    { id: 'contacts', icon: Users, label: '联系人' },
    { id: 'followup', icon: Bell, label: '跟进' },
    { id: 'recharge', icon: Wallet, label: '充值' },
    { id: 'billing', icon: FileText, label: '计费详情' },
    { id: 'countryCode', icon: Phone, label: '默认区号' }
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center space-x-2 py-3 px-4 w-full transition-all duration-200 ${
            activeTab === item.id 
              ? 'bg-blue-800 text-white shadow-lg' 
              : 'text-blue-100 hover:bg-blue-600 hover:text-white'
          }`}
        >
          <item.icon className={`w-5 h-5 transition-transform duration-200 ${
            activeTab === item.id ? 'scale-110' : ''
          }`} />
          <span className={`transition-all duration-200 ${
            activeTab === item.id ? 'font-medium' : ''
          }`}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navbar;