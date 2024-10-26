import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface User {
  id: string;
  email: string;
}

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

// 模拟历史记录数据
const mockHistory = [
  {
    id: '1',
    type: 'login',
    ip: '192.168.1.1',
    location: '中国，北京',
    time: '2024-03-15 14:30:00',
    details: '登录成功'
  },
  {
    id: '2',
    type: 'recharge',
    amount: 100,
    time: '2024-03-15 13:00:00',
    details: '充值 100 USDT'
  },
  {
    id: '3',
    type: 'sms',
    amount: 0.1,
    time: '2024-03-15 12:30:00',
    details: '发送短信到 +1234567890'
  }
];

function UserHistoryModal({ isOpen, onClose, user }: UserHistoryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">用户历史记录 - {user.email}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索历史记录..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                placeholderText="开始日期"
                className="w-32 px-3 py-2 border rounded-md"
              />
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                placeholderText="结束日期"
                className="w-32 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">详情</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">IP地址</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">位置</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{record.time}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.type === 'login' ? 'bg-blue-100 text-blue-800' :
                        record.type === 'recharge' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {record.type === 'login' ? '登录' :
                         record.type === 'recharge' ? '充值' : '短信'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{record.details}</td>
                    <td className="px-4 py-3 text-sm">{record.ip || '-'}</td>
                    <td className="px-4 py-3 text-sm">{record.location || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHistoryModal;