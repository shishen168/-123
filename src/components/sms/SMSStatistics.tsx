import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MessageSquare, TrendingUp, Clock } from 'lucide-react';

interface SMSRecord {
  id: string;
  recipient: string;
  message: string;
  status: 'sent' | 'failed' | 'scheduled';
  sendTime: string;
  isIncoming?: boolean;
}

interface SMSStatisticsProps {
  records: SMSRecord[];
}

function SMSStatistics({ records }: SMSStatisticsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyStats = last7Days.map(date => {
      const dayRecords = records.filter(r => 
        r.sendTime.startsWith(date)
      );

      return {
        date,
        sent: dayRecords.filter(r => !r.isIncoming).length,
        received: dayRecords.filter(r => r.isIncoming).length,
        failed: dayRecords.filter(r => r.status === 'failed').length
      };
    });

    const totalSent = records.filter(r => !r.isIncoming).length;
    const totalReceived = records.filter(r => r.isIncoming).length;
    const totalFailed = records.filter(r => r.status === 'failed').length;

    return {
      dailyStats,
      totalSent,
      totalReceived,
      totalFailed
    };
  }, [records]);

  return (
    <div className="space-y-6">
      {/* 总览卡片 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-blue-600">发送总量</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalSent}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="text-sm text-green-600">接收总量</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {stats.totalReceived}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-red-600" />
            <span className="text-sm text-red-600">失败总量</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {stats.totalFailed}
          </div>
        </div>
      </div>

      {/* 趋势图表 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">最近7天趋势</h3>
        <div className="h-64">
          <BarChart
            width={800}
            height={250}
            data={stats.dailyStats}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sent" name="发送" fill="#3B82F6" />
            <Bar dataKey="received" name="接收" fill="#10B981" />
            <Bar dataKey="failed" name="失败" fill="#EF4444" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default SMSStatistics;