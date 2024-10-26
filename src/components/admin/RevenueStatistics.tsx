import React, { useState, useEffect } from 'react';
import { BarChart, DollarSign, Download, Calendar } from 'lucide-react';
import { revenueService, MonthlyRevenue } from '../../services/revenueService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function RevenueStatistics() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadRevenue();
  }, [startDate, endDate]);

  const loadRevenue = () => {
    const revenue = revenueService.getMonthlyRevenue(startDate, endDate);
    setMonthlyRevenue(revenue);
    setTotalRevenue(revenue.reduce((sum, item) => sum + item.amount, 0));
  };

  const handleExport = () => {
    const csvContent = [
      ['月份', '充值金额(USDT)', '充值人数', '人均充值'],
      ...monthlyRevenue.map(item => [
        item.month,
        item.amount.toFixed(2),
        item.userCount,
        (item.amount / item.userCount).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `revenue_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BarChart className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">营收统计</h2>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
        >
          <Download className="w-4 h-4 mr-2" />
          导出报表
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            dateFormat="yyyy/MM"
            showMonthYearPicker
            placeholderText="开始月份"
            className="px-3 py-2 border rounded-md"
          />
          <span className="text-gray-500">至</span>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            dateFormat="yyyy/MM"
            showMonthYearPicker
            placeholderText="结束月份"
            className="px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-blue-600">总充值金额</h3>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {totalRevenue.toFixed(2)} USDT
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-green-600">月均充值</h3>
            <BarChart className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {monthlyRevenue.length ? (totalRevenue / monthlyRevenue.length).toFixed(2) : '0.00'} USDT
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-purple-600">总充值人次</h3>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {monthlyRevenue.reduce((sum, item) => sum + item.userCount, 0)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月份</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充值金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充值人数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">人均充值</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">环比增长</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyRevenue.map((item, index) => {
              const prevAmount = index > 0 ? monthlyRevenue[index - 1].amount : item.amount;
              const growth = ((item.amount - prevAmount) / prevAmount) * 100;
              
              return (
                <tr key={item.month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount.toFixed(2)} USDT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.userCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(item.amount / item.userCount).toFixed(2)} USDT
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${
                      growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {index === 0 ? '-' : `${growth > 0 ? '+' : ''}${growth.toFixed(2)}%`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RevenueStatistics;