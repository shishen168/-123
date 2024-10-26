import React, { useState, useEffect } from 'react';
import { Upload, Save } from 'lucide-react';

interface PaymentSettings {
  usdtAddress: string;
  qrCodeUrl: string;
}

function PaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>({
    usdtAddress: 'TFKSSswm9dyoV6jP1RneJvmzW1B8Xoew26',
    qrCodeUrl: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('paymentSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleQRCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError('图片大小不能超过1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings(prev => ({
          ...prev,
          qrCodeUrl: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('paymentSettings', JSON.stringify(settings));
      setSuccess('设置已保存');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('保存设置失败');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 space-y-6">
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-md">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            USDT-TRC20 收款地址
          </label>
          <input
            type="text"
            value={settings.usdtAddress}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              usdtAddress: e.target.value
            }))}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入USDT-TRC20收款地址"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            收款二维码
          </label>
          <div className="space-y-4">
            {settings.qrCodeUrl && (
              <div className="w-48 h-48 border rounded-lg overflow-hidden">
                <img
                  src={settings.qrCodeUrl}
                  alt="Payment QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <div>
              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer w-fit">
                <Upload className="w-4 h-4 mr-2" />
                上传新二维码
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQRCodeUpload}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">
                支持 JPG、PNG 格式，大小不超过1MB
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSettings;