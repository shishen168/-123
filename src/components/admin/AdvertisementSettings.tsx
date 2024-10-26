import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { advertisementService } from '../../services/advertisementService';

interface Advertisement {
  id: string;
  content: string;
  position: 'top' | 'bottom';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

function AdvertisementSettings() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [newAdContent, setNewAdContent] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = () => {
    const allAds = advertisementService.getAllAds();
    setAds(allAds);
  };

  const handleCreateAd = () => {
    if (!newAdContent.trim()) {
      setError('广告内容不能为空');
      return;
    }

    const newAd = advertisementService.createAd({
      content: newAdContent,
      position: 'bottom',
      active: true
    });

    setAds([...ads, newAd]);
    setNewAdContent('');
    setSuccess('广告创建成功');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateAd = (id: string, updates: Partial<Advertisement>) => {
    const success = advertisementService.updateAd(id, updates);
    if (success) {
      loadAds();
      setSuccess('广告更新成功');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('更新广告失败');
    }
  };

  const handleDeleteAd = (id: string) => {
    if (window.confirm('确定要删除这条广告吗？')) {
      const success = advertisementService.deleteAd(id);
      if (success) {
        loadAds();
        setSuccess('广告删除成功');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('删除广告失败');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">广告设置</h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newAdContent}
            onChange={(e) => setNewAdContent(e.target.value)}
            placeholder="输入新广告内容..."
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleCreateAd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加广告
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {ads.map((ad) => (
          <div key={ad.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <textarea
                  value={ad.content}
                  onChange={(e) => handleUpdateAd(ad.id, { content: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  rows={2}
                />
              </div>
              <div className="flex items-center ml-4">
                <button
                  onClick={() => handleUpdateAd(ad.id, { active: !ad.active })}
                  className={`px-3 py-1 rounded-md mr-2 ${
                    ad.active
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {ad.active ? '已启用' : '已禁用'}
                </button>
                <button
                  onClick={() => handleDeleteAd(ad.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              最后更新: {new Date(ad.updatedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdvertisementSettings;