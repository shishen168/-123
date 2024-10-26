import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatThread } from './types';
import MessageItem from './MessageItem';
import { smsAPI } from '../../services/api';

interface ChatViewProps {
  thread: ChatThread;
  onClose: () => void;
  onDeleteMessage: (id: string) => void;
  onThreadUpdate?: () => void;
}

function ChatView({ thread, onClose, onDeleteMessage, onThreadUpdate }: ChatViewProps) {
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [thread.messages]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior,
      block: 'end'
    });
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await smsAPI.sendSMS({
        recipients: [thread.recipient],
        message: replyMessage.trim()
      });

      if (response.success) {
        setReplyMessage('');
        // 立即触发历史记录更新
        if (onThreadUpdate) {
          onThreadUpdate();
        }
        scrollToBottom();
      } else {
        alert(response.message || '发送失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('发送失败，请重试');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-4">
        {thread.messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onDelete={() => onDeleteMessage(message.id)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
            placeholder="输入回复内容..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendReply}
            disabled={!replyMessage.trim() || sending}
            className={`p-2 rounded-full ${
              !replyMessage.trim() || sending
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatView;