import React from 'react';
import { X } from 'lucide-react';

interface User {
  id: string;
  email: string;
  status: 'active' | 'banned';
  balance: number;
  lastLogin: string;
  createdAt: string;
  totalOrders: number;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">用户详情</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">用户ID</label>
            <p className="mt-1">{user.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">邮箱</label>
            <p className="mt-1">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">账户状态</label>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.status === 'active' ? '正常' : '已封禁'}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">账户余额</label>
            <p className="mt-1">{user.balance.toFixed(2)} USDT</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">最后登录时间</label>
            <p className="mt-1">{user.lastLogin}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">注册时间</label>
            <p className="mt-1">{user.createdAt}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">总订单数</label>
            <p className="mt-1">{user.totalOrders}</p>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;