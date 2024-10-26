import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Order {
  id: string;
  userId: string;
  email: string;
  type: 'recharge' | 'sms';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  createTime: string;
  details: string;
}

function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [orders] = useState<Order[]>([
    {
      id: '1',
      userId: 'user1',
      email: 'user1@example.com',
      type: 'recharge',
      amount: 100,
      status: 'success',
      createTime: '2024-03-15 14:30:00',
      details: '充值 100 USDT'
    },
    {
      id: '2',
      userId: 'user2',
      email: 'user2@example.com',
      type: 'sms',
      amount: 0.1,
      status: 'success',
      createTime: '2024-03-15 13:00:00',
      details: '发送短信到 +15513598715'
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.details.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (startDate && endDate) {
      const orderDate = new Date(order.createTime);
      return orderDate >= startDate && orderDate <= endDate;
    }

    return true;
  });

  const downloadReport = () => {
    const csvContent = [
      ['订单ID', '用户ID', '邮箱', '类型', '金额', '状态', '创建时间', '详情'],
      ...filteredOrders.map(order => [
        order.id,
        order.userId,
        order.email,
        order.type,
        order.amount.toString(),
        order.status,
        order.createTime,
        order.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">订单管理</h2>
        <button
          onClick={downloadReport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          导出报表
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索订单..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            placeholderText="开始日期"
            className="px-4 py-2 border rounded-md"
          />
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            placeholderText="结束日期"
            className="px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">订单ID</th>
              <th className="px-4 py-2 text-left">用户ID</th>
              <th className="px-4 py-2 text-left">邮箱</th>
              <th className="px-4 py-2 text-left">类型</th>
              <th className="px-4 py-2 text-left">金额</th>
              <th className="px-4 py-2 text-left">状态</th>
              <th className="px-4 py-2 text-left">创建时间</th>
              <th className="px-4 py-2 text-left">详情</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.userId}</td>
                <td className="px-4 py-2">{order.email}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.type === 'recharge' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.type === 'recharge' ? '充值' : '短信'}
                  </span>
                </td>
                <td className="px-4 py-2">{order.amount} USDT</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'success' ? '成功' : 
                     order.status === 'pending' ? '处理中' : '失败'}
                  </span>
                </td>
                <td className="px-4 py-2">{order.createTime}</td>
                <td className="px-4 py-2">{order.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagement;