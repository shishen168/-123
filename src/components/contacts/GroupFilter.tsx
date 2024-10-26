import React from 'react';
import { Tag } from 'lucide-react';

interface GroupFilterProps {
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  groups: { id: string; name: string; count: number }[];
}

function GroupFilter({ selectedGroup, onGroupChange, groups }: GroupFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onGroupChange('')}
        className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
          selectedGroup === ''
            ? 'bg-purple-100 text-purple-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Tag className="w-4 h-4 mr-1" />
        全部
        <span className="ml-1 text-xs">({groups.reduce((acc, g) => acc + g.count, 0)})</span>
      </button>
      
      {groups.map((group) => (
        <button
          key={group.id}
          onClick={() => onGroupChange(group.id)}
          className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
            selectedGroup === group.id
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {group.name}
          <span className="ml-1 text-xs">({group.count})</span>
        </button>
      ))}
    </div>
  );
}

export default GroupFilter;