import React, { useState, useEffect } from 'react';
import { Bell, Save, X } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

function NotificationSettings() {
  const [notification, setNotification] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const currentNotification = notificationService.getCurrentNotification();
    setNotification(currentNotification);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notification.trim()) {
      setError('通知内容不能为空');
      return;
    }

    const success = notificationService.updateNotification(notification.trim());
    
    if (success) {
      setSuccess('通知已更新');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('更新通知失败');
    }
  };

  const handleClear = () => {
    const success = notificationService.clearNotification();
    if (success) {
      setNotification('');
      setSuccess('通知已清除');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('清除通知失败');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">通知设置</h2>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            通知内容
          </label>
          <textarea
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="输入要显示的通知内容..."
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            清除通知
          </button>

          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            保存通知
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">预览效果</h3>
        {notification ? (
          <div className="flex items-center p-3 bg-blue-600 text-white rounded-md">
            <Bell className="w-5 h-5 mr-2" />
            <p className="text-sm">{notification}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">暂无通知内容</p>
        )}
      </div>
    </div>
  );
}

export default NotificationSettings;