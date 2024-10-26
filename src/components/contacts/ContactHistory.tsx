import React from 'react';
import { Clock, MessageSquare, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface HistoryItem {
  id: string;
  type: 'message' | 'call';
  content: string;
  timestamp: string;
}

interface ContactHistoryProps {
  history: HistoryItem[];
}

function ContactHistory({ history }: ContactHistoryProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'call':
        return <Phone className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">联系记录</h3>
      
      <div className="space-y-4">
        {history.map(item => (
          <div
            key={item.id}
            className="flex items-start p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className={`
              p-2 rounded-full mr-4
              ${item.type === 'message' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}
            `}>
              {getIcon(item.type)}
            </div>
            
            <div className="flex-1">
              <p className="text-gray-900">{item.content}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {formatDistanceToNow(new Date(item.timestamp), {
                  addSuffix: true,
                  locale: zhCN
                })}
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无联系记录
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactHistory;