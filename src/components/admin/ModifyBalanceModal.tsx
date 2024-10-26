import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

interface User {
  id: string;
  email: string;
  balance: number;
}

interface ModifyBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  user: User;
}

function ModifyBalanceModal({ isOpen, onClose, onConfirm, user }: ModifyBalanceModalProps) {
  const [amount, setAmount] = useState(user.balance.toString());
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAmount = parseFloat(amount);
    
    if (isNaN(newAmount)) {
      setError('请输入有效的金额');
      return;
    }

    onConfirm(newAmount);
    setAmount('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">修改余额 - {user.email}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              当前余额: {user.balance} USDT
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md pl-10"
                placeholder="输入新的余额"
                step="0.01"
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              确认修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifyBalanceModal;