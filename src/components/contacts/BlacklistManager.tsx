import React, { useState, useEffect } from 'react';
import { Ban, Search, Plus, Trash2, AlertCircle } from 'lucide-react';
import { blacklistService, BlacklistEntry } from '../../services/blacklistService';
import Dialog from '../common/Dialog';

interface BlacklistManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

function BlacklistManager({ isOpen, onClose }: BlacklistManagerProps) {
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({ phone: '', reason: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadBlacklist();

    const handleUpdate = () => {
      loadBlacklist();
    };

    window.addEventListener('blacklistUpdate', handleUpdate);
    return () => {
      window.removeEventListener('blacklistUpdate', handleUpdate);
    };
  }, []);

  const loadBlacklist = () => {
    setBlacklist(blacklistService.getBlacklist());
  };

  const handleAddToBlacklist = () => {
    try {
      if (!newEntry.phone) {
        setError('请输入电话号码');
        return;
      }

      blacklistService.addToBlacklist(newEntry.phone, newEntry.reason);
      setShowAddDialog(false);
      setNewEntry({ phone: '', reason: '' });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加失败');
    }
  };

  const handleRemoveFromBlacklist = (phone: string) => {
    if (window.confirm('确定要将此号码从黑名单中移除吗？')) {
      blacklistService.removeFromBlacklist(phone);
    }
  };

  const filteredBlacklist = blacklist.filter(entry =>
    entry.phone.includes(searchTerm) ||
    entry.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="黑名单管理"
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索黑名单..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加黑名单
          </button>
        </div>

        <div className="border rounded-lg divide-y">
          {filteredBlacklist.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              暂无黑名单记录
            </div>
          ) : (
            filteredBlacklist.map(entry => (
              <div
                key={entry.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <div className="flex items-center">
                    <Ban className="w-4 h-4 text-red-500 mr-2" />
                    <span className="font-medium">{entry.phone}</span>
                  </div>
                  {entry.reason && (
                    <p className="mt-1 text-sm text-gray-500">{entry.reason}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    添加时间: {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFromBlacklist(entry.phone)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="移出黑名单"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setNewEntry({ phone: '', reason: '' });
          setError('');
        }}
        title="添加黑名单"
        onConfirm={handleAddToBlacklist}
      >
        <div className="space-y-4">
          {error && (
            <div className="flex items-center p-4 bg-red-50 rounded-lg text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              电话号码
            </label>
            <input
              type="text"
              value={newEntry.phone}
              onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="输入要拉黑的电话号码"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              拉黑原因（可选）
            </label>
            <textarea
              value={newEntry.reason}
              onChange={(e) => setNewEntry({ ...newEntry, reason: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="输入拉黑原因..."
            />
          </div>
        </div>
      </Dialog>
    </Dialog>
  );
}

export default BlacklistManager;