import React, { useState } from 'react';
import { Download, Settings, X } from 'lucide-react';
import Dialog from './Dialog';
import { exportQueueService } from '../../services/exportQueueService';
import { SizeEstimator } from '../../utils/sizeEstimator';
import Progress from './Progress';
import ExportConfigManager from './ExportConfigManager';
import { ExportConfig } from '../../services/exportConfigService';

interface BatchExportProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  columns: { key: keyof T; title: string }[];
  filename?: string;
}

function BatchExport<T>({
  isOpen,
  onClose,
  data,
  columns,
  filename = 'export'
}: BatchExportProps<T>) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xlsx' | 'json'>('csv');
  const [batchSize, setBatchSize] = useState(1000);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfigManager, setShowConfigManager] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);

    try {
      await exportQueueService.addToQueue({
        data,
        columns,
        filename,
        format: selectedFormat,
        onProgress: setProgress
      });

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleApplyConfig = (config: ExportConfig) => {
    setSelectedFormat(config.format);
    setBatchSize(config.batchSize);
    setShowConfigManager(false);
  };

  const estimatedSize = SizeEstimator.estimateExportSize(data, columns, selectedFormat);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="批量导出"
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              导出格式
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-md"
              disabled={exporting}
            >
              <option value="csv">CSV</option>
              <option value="xlsx">Excel</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              每批数据量
            </label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(Math.max(100, parseInt(e.target.value) || 1000))}
              min="100"
              className="w-full px-3 py-2 border rounded-md"
              disabled={exporting}
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">导出信息</span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>总记录数:</span>
              <span>{data.length.toLocaleString()} 条</span>
            </div>
            <div className="flex justify-between">
              <span>预计文件大小:</span>
              <span>{SizeEstimator.formatSize(estimatedSize)}</span>
            </div>
            <div className="flex justify-between">
              <span>导出字段数:</span>
              <span>{columns.length} 个</span>
            </div>
          </div>
        </div>

        {exporting && (
          <div className="space-y-2">
            <Progress percent={progress} />
            <p className="text-sm text-gray-500 text-center">
              正在导出 {progress}%
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setShowConfigManager(true)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <Settings className="w-4 h-4 mr-2" />
            配置管理
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              开始导出
            </button>
          </div>
        </div>
      </div>

      {showConfigManager && (
        <ExportConfigManager
          isOpen={showConfigManager}
          onClose={() => setShowConfigManager(false)}
          columns={columns}
          onApplyConfig={handleApplyConfig}
        />
      )}
    </Dialog>
  );
}

export default BatchExport;