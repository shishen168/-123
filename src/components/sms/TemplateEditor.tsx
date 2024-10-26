import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Dialog from '../common/Dialog';

interface TemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: { name: string; content: string }) => void;
  initialData?: { name: string; content: string };
  title?: string;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = '编辑模板'
}) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setContent(initialData.content);
    } else {
      setName('');
      setContent('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (name.trim() && content.trim()) {
      onSave({ name: name.trim(), content: content.trim() });
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onConfirm={handleSubmit}
      confirmText="保存模板"
      confirmIcon={<Save className="w-4 h-4 mr-2" />}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            模板名称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="输入模板名称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            模板内容
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="输入模板内容"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default TemplateEditor;