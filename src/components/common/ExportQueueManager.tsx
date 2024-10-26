import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Download, AlertCircle } from 'lucide-react';
import { exportQueueService } from '../../services/exportQueueService';
import Progress from './Progress';

interface QueueStatus {
  queueLength: number;
  processing: boolean;
  currentTask: {
    id: string;
    filename: string;
    format: string;
    retryCount: number;
    maxRetries: number;
  } | null;
}

function ExportQueueManager() {
  const [queueStatus, setQueueStatus] = useState<QueueStatus>(
    exportQueueService.getQueueStatus()
  );
  const [progress, setProgress] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const status = exportQueueService.getQueueStatus();
      setQueueStatus(status);
      
      if (status.processing) {
        setProgress(prev => (prev + 1) % 100);
      } else {
        setProgress(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!queueStatus.processing && queueStatus.queueLength === 0) {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        <Download className="w-5 h-5" />
        {queueStatus.queueLength > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {queueStatus.queueLength}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Download className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium">导出任务队列</h3>
            <span className="ml-2 text-sm text-gray-500">
              ({queueStatus.queueLength} 个任务)
            </span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {queueStatus.processing && queueStatus.currentTask && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                正在导出: {queueStatus.currentTask.filename}
              </span>
              {queueStatus.currentTask.retryCount > 0 && (
                <span className="flex items-center text-yellow-600">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  重试 {queueStatus.currentTask.retryCount}/{queueStatus.currentTask.maxRetries}
                </span>
              )}
            </div>
            <Progress percent={progress} />
          </div>
        )}

        {queueStatus.queueLength > 1 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              还有 {queueStatus.queueLength - 1} 个任务等待处理
            </div>
          </div>
        )}
      </div>

      {queueStatus.queueLength > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t rounded-b-lg">
          <button
            onClick={() => exportQueueService.clearQueue()}
            className="text-sm text-red-600 hover:text-red-700"
          >
            清空队列
          </button>
        </div>
      )}
    </div>
  );
}

export default ExportQueueManager;