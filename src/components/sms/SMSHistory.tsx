import React, { useState, useEffect } from 'react';
import { smsAPI } from '../../services/api';
import { SMSRecord, ChatThread } from './types';
import ThreadList from './ThreadList';
import ChatView from './ChatView';
import EmptyState from './EmptyState';

function SMSHistory() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
    
    const handleHistoryUpdate = () => {
      console.log('History update event received');
      loadHistory();
    };
    
    window.addEventListener('smsHistoryUpdate', handleHistoryUpdate);
    return () => {
      window.removeEventListener('smsHistoryUpdate', handleHistoryUpdate);
    };
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await smsAPI.getSMSHistory();
      
      if (response.success && response.data) {
        const messages = response.data as SMSRecord[];
        const threadMap = new Map<string, ChatThread>();

        // 按收件人分组消息
        messages.forEach(message => {
          const thread = threadMap.get(message.recipient) || {
            recipient: message.recipient,
            messages: []
          };
          thread.messages.push(message);
          threadMap.set(message.recipient, thread);
        });

        // 按最后消息时间排序
        const sortedThreads = Array.from(threadMap.values())
          .map(thread => ({
            ...thread,
            messages: thread.messages.sort((a, b) => 
              new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime()
            )
          }))
          .sort((a, b) => {
            const aTime = new Date(a.messages[0].sendTime).getTime();
            const bTime = new Date(b.messages[0].sendTime).getTime();
            return bTime - aTime;
          });

        setThreads(sortedThreads);
        
        // 如果当前选中的对话存在，更新它
        if (selectedThread) {
          const updatedThread = sortedThreads.find(t => t.recipient === selectedThread.recipient);
          if (updatedThread) {
            setSelectedThread(updatedThread);
          }
        }
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const response = await smsAPI.deleteMessage(messageId);
    if (response.success) {
      await loadHistory();
    }
  };

  const handleDeleteThread = async (recipient: string) => {
    if (window.confirm('确定要删除此对话吗？')) {
      const response = await smsAPI.deleteThread(recipient);
      if (response.success) {
        if (selectedThread?.recipient === recipient) {
          setSelectedThread(null);
        }
        await loadHistory();
      }
    }
  };

  const handleThreadUpdate = () => {
    loadHistory();
  };

  const filteredThreads = threads.filter(thread =>
    thread.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.messages.some(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-[600px] md:h-[calc(100vh-12rem)] bg-white rounded-lg shadow-lg flex">
      <div className={`${selectedThread ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r flex-col`}>
        {threads.length === 0 ? (
          <EmptyState
            title="暂无短信记录"
            description="发送新短信后将在这里显示"
          />
        ) : (
          <ThreadList
            threads={filteredThreads}
            selectedThreadId={selectedThread?.recipient || null}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onThreadSelect={setSelectedThread}
            onDeleteThread={handleDeleteThread}
          />
        )}
      </div>

      <div className={`${selectedThread ? 'flex' : 'hidden md:flex'} flex-col w-full md:w-2/3`}>
        {selectedThread ? (
          <ChatView
            key={selectedThread.recipient}
            thread={selectedThread}
            onClose={() => setSelectedThread(null)}
            onDeleteMessage={handleDeleteMessage}
            onThreadUpdate={handleThreadUpdate}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            选择一个对话开始聊天
          </div>
        )}
      </div>
    </div>
  );
}

export default SMSHistory;