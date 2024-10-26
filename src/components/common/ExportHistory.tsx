import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Trash2, Eye } from 'lucide-react';
import Dialog from './Dialog';
import { exportHistoryService } from '../../services/exportHistoryService';
import { exportQueueService } from '../../services/exportQueueService';
import { SizeEstimator } from '../../utils/sizeEstimator';
import ExportTaskDetails from './ExportTaskDetails';
import DataTable from './DataTable';

interface ExportHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

function ExportHistory({ isOpen, onClose }: ExportHistoryProps) {
  const [history, setHistory] = useState(exportHistoryService.getHistory());
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setHistory(exportHistoryService.getHistory());
    };

    window.addEventListener('exportHistoryUpdate', handleUpdate);
    return () => {
      window.removeEventListener('exportHistoryUpdate', handleUpdate);
    };
  }, []);

  const handleRetry = async (id: string) => {
    const success = await exportQueueService.retryTask(id);
    if (success) {
      setSelectedTask(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      exportHistoryService.deleteRecord(id);
      setHistory(exportHistoryService.getHistory());
    }
  };

  const columns = [
    {
      key: 'filename',
      title: '文件名',
      sortable: true
    },
    {
      key: 'format',
      title: '格式',
      render: (value: string) => value.toUpperCase()
    },
    {
      key: 'size',
      title: '大小',
      render: (value: number) => SizeEstimator.formatSize(value)
    },
    {
      key: 'rowCount',
      title: '数据行数',
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'status',
      title: '状态',
      render: (value: string) => (
        <span className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${value === 'success' ? 'bg-green-100 text-green-800' :
            value === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'}
        `}>
          {value === 'success' ? '成功' :
           value === 'failed' ? '失败' : '处理中'}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: '创建时间',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString()
    },
    {
      key: 'id',
      title: '操作',
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTask(record)}
            className="text-gray-400 hover:text-blue-600"
            title="查看详情"
          >
            <Eye className="w-4 h-4" />
          </button>
          {record.status === 'failed' && (
            <button
              onClick={() => handleRetry(record.id)}
              className="text-gray-400 hover:text-green-600"
              title="重试"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(record.id)}
            className="text-gray-400 hover:text-red-600"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title="导出历史记录"
        size="xl"
      >
        <div className="space-y-4">
          <DataTable
            data={history}
            columns={columns}
            rowKey="id"
            searchable
            searchFields={['filename']}
            emptyText="暂无导出记录"
          />
        </div>
      </Dialog>

      {selectedTask && (
        <ExportTaskDetails
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onRetry={selectedTask.status === 'failed' ? () => handleRetry(selectedTask.id) : undefined}
        />
      )}
    </>
  );
}

export default ExportHistory;