import React, { memo } from 'react';
import { Copy, Edit2, Trash2 } from 'lucide-react';

interface TemplateItemProps {
  id: string;
  name: string;
  content: string;
  onUse: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TemplateItem = memo(({
  name,
  content,
  onUse,
  onEdit,
  onDelete
}: TemplateItemProps) => {
  return (
    <div className="p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{name}</h4>
        <div className="flex space-x-2">
          <button
            onClick={onUse}
            className="p-1 text-gray-400 hover:text-purple-600"
            title="使用此模板"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  );
});

TemplateItem.displayName = 'TemplateItem';

export default TemplateItem;