import React from 'react';
import { FileText, Calendar, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Dialog from './Dialog';
import { SizeEstimator } from '../../utils/sizeEstimator';

interface ExportTaskDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    filename: string;
    format: string;
    size: number;
    rowCount: number;
    status: 'success' | 'failed' | 'pending';
    createdAt: string;
    completedAt?: string;
    error?: string;
    columns: { title: string }[];
  };
  onRetry?: () => void;
}

function ExportTaskDetails({ isOpen, onClose, task, onRetry }: ExportTaskDetailsProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'success':
        return '导出成功';
      case 'failed':
        return '导出失败';
      default:
        return '处理中';
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="导出任务详情"
      size="lg"
    >
      <div className="space-y-6">
        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-500">
              <FileText className="w-4 h-4 mr-2" />
              <span className="text-sm">文件名</span>
            </div>
            <p className="font-medium">{task.filename}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">创建时间</span>
            </div>
            <p className="font-medium">{new Date(task.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* 状态信息 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            {getStatusIcon()}
            <span className="ml-2 font-medium">{getStatusText()}</span>
          </div>
          <div className="text-sm text-gray-500">
            {task.completedAt && `完成时间: ${new Date(task.completedAt).toLocaleString()}`}
          </div>
        </div>

        {/* 导出详情 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">文件格式</div>
            <div className="font-medium uppercase">{task.format}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 mb-1">数据行数</div>
            <div className="font-medium">{task.rowCount.toLocaleString()} 行</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 mb-1">文件大小</div>
            <div className="font-medium">{SizeEstimator.formatSize(task.size)}</div>
          </div>
        </div>

        {/* 导出字段 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">导出字段</h4>
          <div className="grid grid-cols-3 gap-2">
            {task.columns.map((col, index) => (
              <div
                key={index}
                className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-600"
              >
                {col.title}
              </div>
            ))}
          </div>
        </div>

        {/* 错误信息 */}
        {task.status === 'failed' && task.error && (
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center text-red-600 mb-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">错误信息</span>
            </div>
            <p className="text-sm text-red-600">{task.error}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3">
          {task.status === 'failed' && onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              重试导出
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
          >
            关闭
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ExportTaskDetails;