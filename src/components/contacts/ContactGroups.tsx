import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import Dialog from '../common/Dialog';

interface Group {
  id: string;
  name: string;
  color: string;
}

interface ContactGroupsProps {
  groups: Group[];
  onAddGroup: (group: Omit<Group, 'id'>) => void;
  onEditGroup: (id: string, group: Partial<Group>) => void;
  onDeleteGroup: (id: string) => void;
}

function ContactGroups({
  groups,
  onAddGroup,
  onEditGroup,
  onDeleteGroup
}: ContactGroupsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#2563eb'
  });

  const handleSubmit = () => {
    if (editingGroup) {
      onEditGroup(editingGroup.id, formData);
    } else {
      onAddGroup(formData);
    }
    handleClose();
  };

  const handleClose = () => {
    setShowDialog(false);
    setEditingGroup(null);
    setFormData({ name: '', color: '#2563eb' });
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      color: group.color
    });
    setShowDialog(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">联系人分组</h3>
          <button
            onClick={() => setShowDialog(true)}
            className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            添加分组
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => (
            <div
              key={group.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: group.color }}
                />
                <span>{group.name}</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(group)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteGroup(group.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        isOpen={showDialog}
        onClose={handleClose}
        title={editingGroup ? '编辑分组' : '添加分组'}
        onConfirm={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分组名称
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="输入分组名称"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分组颜色
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 p-1 border rounded-md"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default ContactGroups;