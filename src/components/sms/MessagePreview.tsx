import React from 'react';
import { Phone, Clock } from 'lucide-react';

interface MessagePreviewProps {
  recipient: string;
  message: string;
  scheduleTime?: Date | null;
}

function MessagePreview({ recipient, message, scheduleTime }: MessagePreviewProps) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-medium text-gray-700 mb-4">消息预览</h3>
      
      <div className="bg-white rounded-lg shadow-sm p-4 max-w-sm mx-auto">
        <div className="flex items-center mb-3">
          <Phone className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{recipient || '收件人'}</span>
        </div>
        
        <div className="bg-blue-500 text-white rounded-lg p-3 mb-2">
          <p className="text-sm">{message || '消息内容'}</p>
        </div>
        
        {scheduleTime && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>预计发送时间: {scheduleTime.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagePreview;