import React, { useState, useEffect } from 'react';
import { Settings, Save, Trash2, Edit2 } from 'lucide-react';
import Dialog from './Dialog';
import { exportConfigService, ExportConfig } from '../../services/exportConfigService';

interface ExportConfigManagerProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: { key: keyof T; title: string }[];
  onApplyConfig: (config: ExportConfig) => void;
}

function ExportConfigManager<T>({
  isOpen,
  onClose,
  columns,
  onApplyConfig
}: ExportConfigManagerProps<T>) {
  const [configs, setConfigs] = useState<ExportConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<ExportConfig | null>(null);
  const [newConfig, setNewConfig] = useState({
    name: '',
    format: 'csv' as const,
    columns: columns.map(col => String(col.key)),
    batchSize: 1000
  });

  useEffect(() => {
    loadConfigs();

    const handleUpdate = () => {
      loadConfigs();
    };

    window.addEventListener('exportConfigUpdate', handleUpdate);
    return () => {
      window.removeEventListener('exportConfigUpdate', handleUpdate);
    };
  }, []);

  const loadConfigs = () => {
    setConfigs(exportConfigService.getConfigs());
  };

  const handleSaveConfig = () => {
    if (editingConfig) {
      exportConfigService.updateConfig(editingConfig.id, {
        name: editingConfig.name,
        format: editingConfig.format,
        columns: editingConfig.columns,
        batchSize: editingConfig.batchSize
      });
      setEditingConfig(null);
    } else if (newConfig.name) {
      exportConfigService.createConfig(newConfig);
      setNewConfig({
        name: '',
        format: 'csv',
        columns: columns.map(col => String(col.key)),
        batchSize: 1000
      });
    }
  };

  const handleDeleteConfig = (id: string) => {
    if (window.confirm('确定要删除这个配置吗？')) {
      exportConfigService.deleteConfig(id);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="导出配置管理"
      size="lg"
    >
      <div className="space-y-6">
        {/* 新建配置表单 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            {editingConfig ? '编辑配置' : '新建配置'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                配置名称
              </label>
              <input
                type="text"
                value={editingConfig?.name ?? newConfig.name}
                onChange={(e) => editingConfig
                  ? setEditingConfig({ ...editingConfig, name: e.target.value })
                  : setNewConfig({ ...newConfig, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="输入配置名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                导出格式
              </label>
              <select
                value={editingConfig?.format ?? newConfig.format}
                onChange={(e) => editingConfig
                  ? setEditingConfig({ ...editingConfig, format: e.target.value as any })
                  : setNewConfig({ ...newConfig, format: e.target.value as any })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
                <option value="json">JSON</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                每批数据量
              </label>
              <input
                type="number"
                value={editingConfig?.batchSize ?? newConfig.batchSize}
                onChange={(e) => {
                  const value = Math.max(100, parseInt(e.target.value) || 1000);
                  editingConfig
                    ? setEditingConfig({ ...editingConfig, batchSize: value })
                    : setNewConfig({ ...newConfig, batchSize: value });
                }}
                min="100"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                导出字段
              </label>
              <div className="max-h-40 overflow-y-auto p-2 border rounded-md bg-white">
                {columns.map(col => (
                  <label key={String(col.key)} className="flex items-center p-1">
                    <input
                      type="checkbox"
                      checked={(editingConfig?.columns ?? newConfig.columns).includes(String(col.key))}
                      onChange={(e) => {
                        const value = String(col.key);
                        const update = (current: string[]) =>
                          e.target.checked
                            ? [...current, value]
                            : current.filter(k => k !== value);
                            
                        editingConfig
                          ? setEditingConfig({ ...editingConfig, columns: update(editingConfig.columns) })
                          : setNewConfig({ ...newConfig, columns: update(newConfig.columns) });
                      }}
                      className="mr-2"
                    />
                    {col.title}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {editingConfig && (
                <button
                  onClick={() => setEditingConfig(null)}
                  className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
              )}
              <button
                onClick={handleSaveConfig}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                保存配置
              </button>
            </div>
          </div>
        </div>

        {/* 配置列表 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">已保存的配置</h3>
          <div className="space-y-3">
            {configs.map(config => (
              <div
                key={config.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-medium">{config.name}</h4>
                  <p className="text-sm text-gray-500">
                    格式: {config.format.toUpperCase()} | 
                    批量: {config.batchSize} | 
                    字段: {config.columns.length}个
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onApplyConfig(config)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="应用配置"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingConfig(config)}
                    className="p-2 text-gray-400 hover:text-green-600"
                    title="编辑配置"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteConfig(config.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="删除配置"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {configs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                暂无保存的配置
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ExportConfigManager;