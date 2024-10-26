import React, { useState, useEffect } from 'react';
import { Save, DollarSign, ChevronUp, ChevronDown } from 'lucide-react';
import { priceService } from '../../services/priceService';

function PriceSettings() {
  const [prices, setPrices] = useState({
    sendPrice: 0.1,
    receivePrice: 0.05
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [lastModified, setLastModified] = useState('');
  const [modifiedBy, setModifiedBy] = useState('');

  useEffect(() => {
    const settings = priceService.getSettings();
    setPrices({
      sendPrice: settings.sendPrice,
      receivePrice: settings.receivePrice
    });
    setLastModified(new Date(settings.lastModified).toLocaleString());
    setModifiedBy(settings.modifiedBy);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (prices.sendPrice <= 0 || prices.receivePrice <= 0) {
      setError('价格必须大于0');
      return;
    }

    const success = priceService.updatePrices(prices.sendPrice, prices.receivePrice);
    
    if (success) {
      const settings = priceService.getSettings();
      setLastModified(new Date(settings.lastModified).toLocaleString());
      setModifiedBy(settings.modifiedBy);
      setSuccess('价格设置已更新');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('更新价格失败');
    }
  };

  const adjustPrice = (type: 'send' | 'receive', amount: number) => {
    setPrices(prev => ({
      ...prev,
      [type === 'send' ? 'sendPrice' : 'receivePrice']: Math.max(0, Number((prev[type === 'send' ? 'sendPrice' : 'receivePrice'] + amount).toFixed(3)))
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">短信价格设置</h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 发送短信价格 */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">发送短信价格</h3>
            </div>
            <div className="relative flex items-center">
              <input
                type="number"
                value={prices.sendPrice}
                onChange={(e) => setPrices(prev => ({
                  ...prev,
                  sendPrice: parseFloat(e.target.value)
                }))}
                step="0.01"
                min="0"
                className="w-full p-3 pr-24 border rounded-lg"
              />
              <div className="absolute right-3 flex items-center">
                <span className="text-gray-500 mr-2">USDT/条</span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => adjustPrice('send', 0.001)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustPrice('send', -0.001)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 接收短信价格 */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">接收短信价格</h3>
            </div>
            <div className="relative flex items-center">
              <input
                type="number"
                value={prices.receivePrice}
                onChange={(e) => setPrices(prev => ({
                  ...prev,
                  receivePrice: parseFloat(e.target.value)
                }))}
                step="0.01"
                min="0"
                className="w-full p-3 pr-24 border rounded-lg"
              />
              <div className="absolute right-3 flex items-center">
                <span className="text-gray-500 mr-2">USDT/条</span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => adjustPrice('receive', 0.001)}
                    className="text-gray-500 hover:text-green-600"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustPrice('receive', -0.001)}
                    className="text-gray-500 hover:text-green-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <p>上次修改时间: {lastModified}</p>
            <p>修改人: {modifiedBy}</p>
          </div>
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            保存设置
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">价格说明</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 价格修改后立即生效</li>
          <li>• 价格必须大于0</li>
          <li>• 建议发送价格略高于接收价格</li>
          <li>• 价格调整会影响所有用户</li>
        </ul>
      </div>
    </div>
  );
}

export default PriceSettings;