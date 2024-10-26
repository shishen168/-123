import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { FollowUp } from '../../types';
import { contactsAPI } from '../../services/api';

interface TaskReminderProps {
  onClose: () => void;
}

function TaskReminder({ onClose }: TaskReminderProps) {
  const [task, setTask] = useState<FollowUp | null>(null);
  const [contactName, setContactName] = useState('');

  useEffect(() => {
    const handleReminder = async (event: CustomEvent) => {
      setTask(event.detail.task);
      
      try {
        const response = await contactsAPI.getContacts();
        if (response.success) {
          const contact = response.data.find(c => c.id === event.detail.task.contact);
          if (contact) {
            setContactName(contact.name);
          }
        }
      } catch (error) {
        console.error('Error loading contact:', error);
      }
    };

    window.addEventListener('taskReminder', handleReminder as EventListener);
    return () => {
      window.removeEventListener('taskReminder', handleReminder as EventListener);
    };
  }, []);

  if (!task) return null;

  const timeUntilDue = Math.round((task.dueDate.getTime() - Date.now()) / 60000);

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <Bell className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="font-medium">任务提醒</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mt-3">
        <p className="text-sm text-gray-600 mb-2">
          {contactName && `联系人: ${contactName}`}
        </p>
        <p className="text-sm mb-2">{task.content}</p>
        <p className="text-xs text-yellow-600">
          将在 {timeUntilDue} 分钟后到期
        </p>
      </div>
    </div>
  );
}

export default TaskReminder;