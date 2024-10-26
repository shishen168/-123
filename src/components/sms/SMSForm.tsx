import React, { useState, useEffect } from 'react';
import { Send, X, Users } from 'lucide-react';
import { smsAPI } from '../../services/api';
import { countryCodeService } from '../../services/countryCodeService';
import Alert from '../common/Alert';
import { validatePhone } from '../../utils/validators';

interface SMSFormProps {
  initialRecipient?: string;
  initialRecipientName?: string;
}

function SMSForm({ initialRecipient, initialRecipientName }: SMSFormProps) {
  const [recipients, setRecipients] = useState<string[]>(initialRecipient ? [initialRecipient] : []);
  const [message, setMessage] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodeService.getDefaultCode());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const handleCountryCodeUpdate = (event: CustomEvent) => {
      setCountryCode(event.detail.code);
    };

    window.addEventListener('countryCodeUpdate', handleCountryCodeUpdate as EventListener);
    return () => {
      window.removeEventListener('countryCodeUpdate', handleCountryCodeUpdate as EventListener);
    };
  }, []);

  const handleAddRecipient = () => {
    if (!phoneNumber) {
      setError('请输入手机号码');
      return;
    }

    const fullNumber = `${countryCode}${phoneNumber}`;
    
    if (!validatePhone(fullNumber)) {
      setError('请输入有效的手机号码格式');
      return;
    }

    if (recipients.includes(fullNumber)) {
      setError('该号码已添加');
      return;
    }

    setRecipients(prev => [...prev, fullNumber]);
    setPhoneNumber('');
    setError('');
  };

  const handleRemoveRecipient = (recipient: string) => {
    setRecipients(prev => prev.filter(r => r !== recipient));
  };

  const handleSend = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (recipients.length === 0) {
      setError('请添加至少一个收件人');
      return;
    }

    if (!message.trim()) {
      setError('请输入短信内容');
      return;
    }

    try {
      setSending(true);
      setError('');
      setSuccess('');

      const response = await smsAPI.sendSMS({
        recipients,
        message: message.trim()
      });

      if (response.success) {
        setSuccess('短信发送成功');
        setMessage('');
        setRecipients([]);
        
        // 3秒后清除成功提示
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(response.message || '发送失败');
      }
    } catch (err) {
      console.error('发送短信失败:', err);
      setError('发送失败，请重试');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">收件人</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-32 border rounded-md"
              >
                {countryCodeService.getAllCodes().map(country => (
                  <option key={`${country.code}-${country.name}`} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                className="flex-1 px-3 py-2 border rounded-md"
                placeholder="输入手机号码"
              />
              <button
                type="button"
                onClick={handleAddRecipient}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                添加
              </button>
            </div>

            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
                {recipients.map(recipient => (
                  <div
                    key={recipient}
                    className="flex items-center bg-white px-3 py-1 rounded-full border shadow-sm"
                  >
                    <span>{recipient}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(recipient)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">短信内容</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="输入短信内容..."
          />
        </div>

        <button
          onClick={handleSend}
          disabled={sending || recipients.length === 0 || !message.trim()}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white ${
            sending || recipients.length === 0 || !message.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {sending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              发送中...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              发送短信
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default SMSForm;