import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Dialog from '../common/Dialog';
import DatePicker from 'react-datepicker';
import { Contact } from '../../types';

interface FollowUpFormData {
  contact: string;
  content: string;
  dueDate: Date;
  status: 'pending' | 'completed';
}

interface FollowUpFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FollowUpFormData) => void;
  initialData?: FollowUpFormData;
  contacts: Contact[];
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  contacts
}) => {
  const [formData, setFormData] = useState<FollowUpFormData>({
    contact: '',
    content: '',
    dueDate: new Date(),
    status: 'pending'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        contact: '',
        content: '',
        dueDate: new Date(),
        status: 'pending'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (formData.contact && formData.content && formData.dueDate) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? '编辑跟进任务' : '新建跟进任务'}
      onConfirm={handleSubmit}
      confirmText={initialData ? '保存' : '创建'}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            联系人
          </label>
          <select
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">选择联系人</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name} ({contact.phone})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            跟进内容
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="输入跟进内容..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            截止日期
          </label>
          <DatePicker
            selected={formData.dueDate}
            onChange={(date) => date && setFormData({ ...formData, dueDate: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            minDate={new Date()}
          />
        </div>

        {initialData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'completed' })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">待处理</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default FollowUpForm;