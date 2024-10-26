import React, { useState, useEffect } from 'react';
import { X, Copy, QrCode, Check } from 'lucide-react';
import QRCode from 'qrcode.react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

interface PaymentSettings {
  usdtAddress: string;
  qrCodeUrl: string;
}

function RechargeModal({ isOpen, onClose, onSuccess }: RechargeModalProps) {
  const [step, setStep] = useState<'amount' | 'payment'>('amount');
  const [amount, setAmount] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15分钟 = 900秒
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    usdtAddress: 'TFKSSswm9dyoV6jP1RneJvmzW1B8Xoew26',
    qrCodeUrl: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: '',
    network: 'TRON',
    currency: 'USDT-TRC20'
  });
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  // 加载支付设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('paymentSettings');
    if (savedSettings) {
      setPaymentSettings(JSON.parse(savedSettings));
    }
  }, [isOpen]);

  // 重置状态
  useEffect(() => {
    if (!isOpen) {
      setStep('amount');
      setAmount('');
      setCopySuccess(false);
      setTimeLeft(900);
      setPaymentStatus('pending');
      setCheckingPayment(false);
    }
  }, [isOpen]);

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (step === 'payment' && timeLeft > 0 && paymentStatus === 'pending') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [step, timeLeft, paymentStatus]);

  // 模拟支付状态检查
  useEffect(() => {
    let checkTimer: NodeJS.Timeout;
    
    if (step === 'payment' && paymentStatus === 'pending') {
      checkTimer = setInterval(() => {
        // 模拟随机支付成功
        if (Math.random() < 0.1) { // 10%概率支付成功
          setPaymentStatus('success');
          setCheckingPayment(false);
          // 显示成功消息并延迟关闭
          setTimeout(() => {
            onSuccess(Number(amount));
          }, 2000);
        }
      }, 5000); // 每5秒检查一次
    }

    return () => {
      if (checkTimer) {
        clearInterval(checkTimer);
      }
    };
  }, [step, paymentStatus, amount, onSuccess]);

  const handleAmountSubmit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return;
    }

    // 生成订单号
    const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setPaymentInfo(prev => ({
      ...prev,
      orderId
    }));
    setTimeLeft(900); // 重置倒计时
    setStep('payment');
    setCheckingPayment(true);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      
      // 3秒后重置复制状态
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}秒`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0D1117] text-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {step === 'amount' ? 'USDT充值' : '支付详情'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'amount' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                请输入充值金额 (USDT)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="最小充值金额 10 USDT"
                min="10"
                step="1"
              />
            </div>
            <button
              onClick={handleAmountSubmit}
              disabled={!amount || Number(amount) < 10}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认充值
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {paymentStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">充值成功！</h4>
                <p className="text-gray-400">
                  已成功充值 {amount} USDT
                </p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <h4 className="text-lg mb-2">
                    您正在支付 波场(TRON) 的 {amount} USDT-TRC20
                  </h4>
                  <div className={`text-sm ${timeLeft > 300 ? 'text-yellow-400' : 'text-red-400'}`}>
                    剩余时间: {formatTime(timeLeft)}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg relative">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={paymentSettings.usdtAddress}
                      readOnly
                      className="bg-transparent text-sm flex-1 mr-2 outline-none"
                    />
                    <button
                      onClick={() => handleCopy(paymentSettings.usdtAddress)}
                      className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                        copySuccess 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {copySuccess ? (
                        <span className="flex items-center">
                          <Check className="w-4 h-4 mr-1" />
                          已复制
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Copy className="w-4 h-4 mr-1" />
                          复制
                        </span>
                      )}
                    </button>
                  </div>
                  {copySuccess && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded text-sm">
                      复制成功
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    {paymentSettings.qrCodeUrl ? (
                      <img
                        src={paymentSettings.qrCodeUrl}
                        alt="Payment QR Code"
                        className="w-48 h-48 object-contain"
                      />
                    ) : (
                      <QRCode value={paymentSettings.usdtAddress} size={200} />
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>区块链:</span>
                    <span>{paymentInfo.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>币种:</span>
                    <span>{paymentInfo.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>支付金额:</span>
                    <span>{amount} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>订单编号:</span>
                    <span>{paymentInfo.orderId}</span>
                  </div>
                </div>

                {checkingPayment && (
                  <div className="text-center text-sm text-blue-400">
                    正在检查支付状态...
                  </div>
                )}

                <div className="text-center text-red-500 text-sm">
                  请仔细核对区块链和币种，避免丢失资产或支付失败！！！
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RechargeModal;