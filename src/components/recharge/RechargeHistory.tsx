import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Download, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { exportToCSV } from '../../utils/exportUtils';

interface RechargeHistoryProps {
  onBack: () => void;
}

// 模拟充值记录数据
const mockHistory = [
  {
    id: '1',
    amount: 100,
    status: 'success',
    orderNo: '202403151234567890',
    createTime: '2024-03-15 12:34:56',
    completeTime: '2024-03-15 12:35:30',
    txHash: '0x1234...5678'
  },
  {
    id: '2',
    amount: 50,
    status: 'pending',
    orderNo: '202403151234567891',
    createTime: '2024-03-15 13:00:00',
    completeTime: null,
    txHash: null
  },
  {
    id: '3',
    amount: 200,
    status: 'failed',
    orderNo: '202403151234567892',
    createTime: '2024-03-15 14:00:00',
    completeTime: '2024-03-15 14:01:00',
    txHash: null
  }
];

const exportColumns = [
  { key: 'orderNo', title: '订单号' },
  { key: 'amount', title: '充值金额(USDT)' },
  { 
    key: 'status', 
    title: '状态',
    formatter: (status: string) => {
      switch (status) {
        case 'success': return '充值成功';
        case 'pending': return '处理中';
        case 'failed': return '充值失败';
        default: return '未知状态';
      }
    }
  },
  { key: 'createTime', title: '创建时间' },
  { key: 'completeTime', title: '完成时间' },
  { key: 'txHash', title: '交易哈希' }
];

function RechargeHistory({ onBack }: RechargeHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [records] = useState(mockHistory);
  const [showPreview, setShowPreview] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '充值成功';
      case 'pending':
        return '处理中';
      case 'failed':
        return '充值失败';
      default:
        return '未知状态';
    }
  };

  const getFilteredRecords = () => {
    return records.filter(record => {
      const matchesSearch = record.orderNo.toLowerCase().includes(searchTerm.toLowerCase());
      const recordDate = new Date(record.createTime);
      const matchesDateRange = (!startDate || recordDate >= startDate) && 
                             (!endDate || recordDate <= endDate);
      return matchesSearch && matchesDateRange;
    });
  };

  const handleExport = () => {
    const success = exportToCSV(getFilteredRecords(), exportColumns, '充值记录');
    if (success) {
      setShowPreview(false);
      alert('导出成功！');
    } else {
      alert('导出失败，请重试！');
    }
  };

  const PreviewModal = () => {
    if (!showPreview) return null;

    const filteredRecords = getFilteredRecords();
    
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
            <div className="mb-4">
              <p className="text-gray-600">
                共 {filteredRecords.length} 条记录将被导出
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
                {filteredRecords.map((record, index) => (
                  <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {exportColumns.map(col => (
                      <td key={col.key} className="px-4 py-2 text-sm">
                        {col.formatter ? col.formatter(record[col.key]) : record[col.key] || '-'}
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
        <h2 className="text-xl font-semibold">充值记录</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索订单号..."
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">订单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">充值金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">创建时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">完成时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">交易哈希</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{record.orderNo}</td>
                <td className="px-4 py-3 text-sm">{record.amount} USDT</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {getStatusText(record.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{record.createTime}</td>
                <td className="px-4 py-3 text-sm">{record.completeTime || '-'}</td>
                <td className="px-4 py-3 text-sm">
                  {record.txHash ? (
                    <a href={`https://tronscan.org/#/transaction/${record.txHash}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-800">
                      {record.txHash.slice(0, 6)}...{record.txHash.slice(-4)}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PreviewModal />
    </div>
  );
}

export default RechargeHistory;