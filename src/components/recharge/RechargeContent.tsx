import React, { useState } from 'react';
import { CreditCard, Wallet, History, ArrowRight } from 'lucide-react';
import RechargeHistory from './RechargeHistory';
import ExpenseDetails from './ExpenseDetails';
import useMediaQuery from '../../hooks/useMediaQuery';

interface RechargeContentProps {
  onShowRecharge: () => void;
}

function RechargeContent({ onShowRecharge }: RechargeContentProps) {
  const [activeView, setActiveView] = useState<'main' | 'history' | 'expenses'>('main');
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (activeView === 'history') {
    return <RechargeHistory onBack={() => setActiveView('main')} />;
  }

  if (activeView === 'expenses') {
    return <ExpenseDetails onBack={() => setActiveView('main')} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-6">充值中心</h2>
        
        <div className={`
          grid gap-4
          ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}
        `}>
          {/* USDT充值卡片 */}
          <div 
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition duration-200"
            onClick={onShowRecharge}
          >
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8" />
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">USDT充值</h3>
            <p className="text-blue-100 text-sm">支持TRC20网络，快速到账</p>
          </div>

          {/* 充值记录卡片 */}
          <div 
            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition duration-200"
            onClick={() => setActiveView('history')}
          >
            <div className="flex items-center justify-between mb-4">
              <History className="w-8 h-8" />
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">充值记录</h3>
            <p className="text-purple-100 text-sm">查看历史充值订单</p>
          </div>

          {/* 消费明细卡片 */}
          <div 
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition duration-200"
            onClick={() => setActiveView('expenses')}
          >
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8" />
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">消费明细</h3>
            <p className="text-green-100 text-sm">查看短信消费记录</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">充值说明</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• 支持USDT-TRC20网络充值，最低充值金额10 USDT</li>
            <li>• 充值完成后，系统将自动为您添加相应的短信条数</li>
            <li>• 如遇充值问题，请联系在线客服处理</li>
            <li>• 充值金额与短信条数对照表请查看价格详情</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RechargeContent;