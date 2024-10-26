import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { contactsAPI } from '../../services/api';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Tag {
  id: string;
  name: string;
  count: number;
}

function TagManager({ isOpen, onClose }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await contactsAPI.getTags();
      if (response.success) {
        setTags(response.data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      setError('标签名称不能为空');
      return;
    }

    try {
      const response = await contactsAPI.createTag(newTagName.trim());
      if (response.success) {
        setNewTagName('');
        loadTags();
        setSuccess('标签创建成功');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('创建标签失败');
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!window.confirm('确定要删除这个标签吗？')) return;

    try {
      const response = await contactsAPI.deleteTag(tagId);
      if (response.success) {
        loadTags();
        setSuccess('标签删除成功');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('删除标签失败');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">标签管理</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-500 rounded-md text-sm">
            {success}
          </div>
        )}

        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="输入标签名称"
            className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleAddTag}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tags.map(tag => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
            >
              <div>
                <span className="font-medium">{tag.name}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({tag.count} 个联系人)
                </span>
              </div>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="删除标签"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TagManager;