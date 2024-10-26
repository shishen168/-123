import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Check, AlertTriangle } from 'lucide-react';
import { followUpService } from '../../services/followUpService';
import { contactsService } from '../../services/contactsService';
import ReminderSettings from './ReminderSettings';
import TaskReminder from './TaskReminder';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface FollowUp {
  id: string;
  contact: string;
  content: string;
  dueDate: Date;
  status: 'pending' | 'completed';
  createdAt: Date;
}

function FollowUpList() {
  const [tasks, setTasks] = useState<FollowUp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReminder, setShowReminder] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadTasks();

    const handleTaskReminder = () => {
      setShowReminder(true);
    };

    window.addEventListener('taskReminder', handleTaskReminder);
    return () => {
      window.removeEventListener('taskReminder', handleTaskReminder);
    };
  }, []);

  const loadTasks = () => {
    setTasks(followUpService.getAll());
  };

  const handleStatusChange = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      followUpService.update(taskId, {
        status: task.status === 'pending' ? 'completed' : 'pending'
      });
      loadTasks();
    }
  };

  const getContactName = (contactId: string) => {
    const contact = contactsService.findContactByPhone(contactId);
    return contact ? contact.name : contactId;
  };

  const filteredTasks = tasks.filter(task =>
    getContactName(task.contact).toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string, dueDate: Date) => {
    if (status === 'completed') return 'text-green-600';
    if (dueDate < new Date()) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">跟进任务</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            提醒设置
          </button>
          <button
            onClick={() => {/* TODO: Add new task */}}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            新建任务
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`p-4 border rounded-lg ${
              task.status === 'completed' ? 'bg-gray-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => handleStatusChange(task.id)}
                  className={`p-2 rounded-full mr-3 ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400 hover:text-green-600'
                  }`}
                >
                  <Check className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="font-medium">{getContactName(task.contact)}</h3>
                  <p className="text-gray-600 mt-1">{task.content}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center ${getStatusColor(task.status, task.dueDate)}`}>
                  {task.status === 'completed' ? (
                    <Check className="w-4 h-4 mr-1" />
                  ) : task.dueDate < new Date() ? (
                    <AlertTriangle className="w-4 h-4 mr-1" />
                  ) : (
                    <Calendar className="w-4 h-4 mr-1" />
                  )}
                  <span>
                    {formatDistanceToNow(task.dueDate, { addSuffix: true, locale: zhCN })}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  创建于 {task.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无跟进任务
          </div>
        )}
      </div>

      {showSettings && (
        <ReminderSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showReminder && (
        <TaskReminder onClose={() => setShowReminder(false)} />
      )}
    </div>
  );
}

export default FollowUpList;