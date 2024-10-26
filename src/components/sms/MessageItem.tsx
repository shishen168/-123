import React from 'react';
import { Trash2 } from 'lucide-react';

interface MessageItemProps {
  message: {
    id: string;
    message: string;
    sendTime: string;
    isIncoming?: boolean;
  };
  onDelete: () => void;
}

function MessageItem({ message, onDelete }: MessageItemProps) {
  return (
    <div className={`flex ${message.isIncoming ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[70%] rounded-lg px-4 py-2 relative group ${
        message.isIncoming ? 'bg-white' : 'bg-blue-500 text-white'
      }`}>
        <p className="break-words">{message.message}</p>
        <div className={`text-xs mt-1 ${
          message.isIncoming ? 'text-gray-500' : 'text-blue-100'
        }`}>
          {new Date(message.sendTime).toLocaleString()}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -right-8 top-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default MessageItem;