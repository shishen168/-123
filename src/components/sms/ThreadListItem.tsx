import React, { memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Trash2, UserPlus } from 'lucide-react';
import { ChatThread } from './types';
import StatusBadge from './StatusBadge';
import { contactsService } from '../../services/contactsService';

interface ThreadListItemProps {
  thread: ChatThread;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onAddContact?: () => void;
}

const ThreadListItem = memo(({
  thread,
  isSelected,
  onSelect,
  onDelete,
  onAddContact
}: ThreadListItemProps) => {
  const contact = contactsService.findContactByPhone(thread.recipient);
  const lastMessage = thread.messages[thread.messages.length - 1];

  return (
    <div
      className={`
        p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors
        ${isSelected ? 'bg-blue-50' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1" onClick={onSelect}>
          <div className="flex items-center justify-between">
            <div className="font-medium">
              {contact ? contact.name : thread.recipient}
            </div>
            <StatusBadge status={lastMessage.status} />
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-600 truncate flex-1 mr-2">
              {lastMessage.message}
            </p>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatDistanceToNow(new Date(lastMessage.sendTime), {
                addSuffix: true,
                locale: zhCN
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center ml-2">
          {!contact && onAddContact && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddContact();
              }}
              className="p-1 text-gray-400 hover:text-blue-600"
              title="添加到联系人"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 hover:text-red-600 ml-1"
            title="删除对话"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

ThreadListItem.displayName = 'ThreadListItem';

export default ThreadListItem;