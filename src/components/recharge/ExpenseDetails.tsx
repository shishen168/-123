import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Download, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { exportToCSV } from '../../utils/exportUtils';

interface ExpenseDetailsProps {
  onBack: () => void;
}

// 模拟消费记录数据
const mockExpenses = [
  {
    id: '1',
    type: 'sms',
    amount: 0.1,
    recipient: '+1234567890',
    content: '您的验证码是: 123456',
    time: '2024-03-15 12:34:56',
    status: 'success'
  },
  {
    id: '2',
    type: 'sms',
    amount: 0.1,
    recipient: '+1987654321',
    content: '您的订单已发货',
    time: '2024-03-15 13:00:00',
    status: 'failed'
  },
  {
    id: '3',
    type: 'sms',
    amount: 0.1,
    recipient: '+1122334455',
    content: '祝您生日快乐！',
    time: '2024-03-15 14:00:00',
    status: 'success'
  }
];

const exportColumns = [
  { key: 'time', title: '时间' },
  { key: 'type', title: '类型', formatter: () => '短信' },
  { key: 'recipient', title: '接收人' },
  { key: 'content', title: '内容' },
  { key: 'amount', title: '消费金额(USDT)' },
  { 
    key: 'status', 
    title: '状态',
    formatter: (status: string) => {
      switch (status) {
        case 'success': return '发送成功';
        case 'failed': return '发送失败';
        default: return '未知状态';
      }
    }
  }
];

function ExpenseDetails({ onBack }: ExpenseDetailsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [expenses] = useState(mockExpenses);
  const [showPreview, setShowPreview] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '发送成功';
      case 'failed':
        return '发送失败';
      default:
        return '未知状态';
    }
  };

  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      const matchesSearch = expense.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.content.toLowerCase().includes(searchTerm.toLowerCase());
      const expenseDate = new Date(expense.time);
      const matchesDateRange = (!startDate || expenseDate >= startDate) && 
                             (!endDate || expenseDate <= endDate);
      return matchesSearch && matchesDateRange;
    });
  };

  const handleExport = () => {
    const success = exportToCSV(getFilteredExpenses(), exportColumns, '消费明细');
    if (success) {
      setShowPreview(false);
      alert('导出成功！');
    } else {
      alert('导出失败，请重试！');
    }
  };

  const PreviewModal = () => {
    if (!showPreview) return null;

    const filteredExpenses = getFilteredExpenses();
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[90%] max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-lg font-semibold">导出预览</h3>
            <button 
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                共 {filteredExpenses.length} 条记录将被导出
              </p>
              <p className="text-gray-600">
                总消费: {totalAmount.toFixed(2)} USDT
              </p>
            </div>
            
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {exportColumns.map(col => (
                    <th key={col.key} className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredExpenses.map((expense, index) => (
                  <tr key={expense.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {exportColumns.map(col => (
                      <td key={col.key} className="px-4 py-2 text-sm">
                        {col.formatter ? col.formatter(expense[col.key]) : expense[col.key] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              确认导出
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">消费明细</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索接收人或内容..."
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

        <button 
          onClick={() => setShowPreview(true)}
          className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
        >
          <Download className="w-4 h-4 mr-2" />
          导出记录
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">接收人</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">内容</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">消费金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {getFilteredExpenses().map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{expense.time}</td>
                <td className="px-4 py-3 text-sm">短信</td>
                <td className="px-4 py-3 text-sm">{expense.recipient}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="max-w-xs truncate">{expense.content}</div>
                </td>
                <td className="px-4 py-3 text-sm">{expense.amount} USDT</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                    {getStatusText(expense.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm text-gray-600">
          <span>本页消费总计：{getFilteredExpenses().reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)} USDT</span>
          <span>总记录数：{getFilteredExpenses().length}条</span>
        </div>
      </div>

      <PreviewModal />
    </div>
  );
}

export default ExpenseDetails;