import React, { useState } from 'react';
import { Tag as TagIcon, Plus, X } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface ContactTagsProps {
  tags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onAddTag: (tag: Omit<Tag, 'id'>) => void;
}

function ContactTags({
  tags,
  selectedTags,
  onTagsChange,
  onAddTag
}: ContactTagsProps) {
  const [showInput, setShowInput] = useState(false);
  const [newTag, setNewTag] = useState({
    name: '',
    color: '#2563eb'
  });

  const handleAddTag = () => {
    if (newTag.name.trim()) {
      onAddTag(newTag);
      setNewTag({ name: '', color: '#2563eb' });
      setShowInput(false);
    }
  };

  const toggleTag = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newSelectedTags);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">标签</h3>
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          添加标签
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`
              flex items-center px-3 py-1 rounded-full text-sm
              transition-colors duration-200
              ${selectedTags.includes(tag.id)
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <TagIcon className="w-4 h-4 mr-1" />
            {tag.name}
          </button>
        ))}

        {showInput && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              className="px-3 py-1 border rounded-full text-sm"
              placeholder="输入标签名称"
              autoFocus
            />
            <input
              type="color"
              value={newTag.color}
              onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
              className="w-6 h-6 p-0 border-0"
            />
            <button
              onClick={handleAddTag}
              className="text-blue-600 hover:text-blue-700"
            >
              确定
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setNewTag({ name: '', color: '#2563eb' });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactTags;