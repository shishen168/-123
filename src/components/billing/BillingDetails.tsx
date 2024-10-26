import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { priceService } from '../../services/priceService';
import useMediaQuery from '../../hooks/useMediaQuery';

function BillingDetails() {
  const [prices, setPrices] = useState({
    sendPrice: 0.1,
    receivePrice: 0.05
  });
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // ... 保持现有的价格加载逻辑 ...
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-6">计费详情</h2>

        <div className={`
          grid gap-6 mb-8
          ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}
        `}>
          {/* 发送消息统计 */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <ArrowUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">发送消息</h3>
              </div>
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              {/* ... 保持现有的统计内容 ... */}
            </div>
          </div>

          {/* 接收消息统计 */}
          <div className="bg-green-50 rounded-lg p-6">
            {/* ... 保持现有的统计内容 ... */}
          </div>
        </div>

        {/* 总计费用 */}
        <div className="bg-purple-50 rounded-lg p-6">
          {/* ... 保持现有的总计内容 ... */}
        </div>

        {/* 计费说明 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">计费说明</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 发送短信：{prices.sendPrice} USDT/条</li>
            <li>• 接收短信：{prices.receivePrice} USDT/条</li>
            <li>• 计费周期：实时计费，余额实时扣除</li>
            <li>• 余额不足时将无法发送新消息</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BillingDetails;