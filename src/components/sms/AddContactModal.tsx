import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { contactsService } from '../../services/contactsService';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
}

function AddContactModal({ isOpen, onClose, phone }: AddContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    group: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('请输入联系人姓名');
      return;
    }

    try {
      contactsService.addContact({
        ...formData,
        phone
      });
      
      setSuccess('联系人添加成功');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('添加联系人失败');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">添加到联系人</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              手机号码
            </label>
            <input
              type="text"
              value={phone}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="请输入联系人姓名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="请输入邮箱地址"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分组
            </label>
            <select
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">选择分组</option>
              <option value="family">家人</option>
              <option value="friend">朋友</option>
              <option value="work">工作</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="添加备注信息..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              添加联系人
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddContactModal;