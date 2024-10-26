import React, { memo } from 'react';
import { MessageSquare } from 'lucide-react';

interface MessageInputProps {
  message: string;
  onChange: (value: string) => void;
  remainingChars: number;
  maxLength?: number;
  placeholder?: string;
}

const MessageInput = memo(({
  message,
  onChange,
  remainingChars,
  maxLength = 500,
  placeholder = "输入短信内容..."
}: MessageInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        <MessageSquare className="w-4 h-4 mr-2" />
        短信内容
      </label>
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          maxLength={maxLength}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
        <div className="absolute bottom-2 right-2">
          <span className={`text-sm ${
            remainingChars < 50 ? 'text-orange-500' : 'text-gray-500'
          }`}>
            还可输入 {remainingChars} 字符
          </span>
        </div>
      </div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;