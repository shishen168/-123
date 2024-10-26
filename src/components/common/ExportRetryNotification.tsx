import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { exportQueueService } from '../../services/exportQueueService';

function ExportRetryNotification() {
  const [queueStatus, setQueueStatus] = useState(exportQueueService.getQueueStatus());
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkQueue = setInterval(() => {
      const status = exportQueueService.getQueueStatus();
      setQueueStatus(status);
      setShow(status.processing && status.currentTask?.retryCount > 0);
    }, 1000);

    return () => clearInterval(checkQueue);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-yellow-50 p-4 rounded-lg shadow-lg border border-yellow-200">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-yellow-800">
            正在重试导出任务
          </p>
          <p className="mt-1 text-sm text-yellow-700">
            {`重试次数: ${queueStatus.currentTask?.retryCount}/${queueStatus.currentTask?.maxRetries}`}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-yellow-50 rounded-md inline-flex text-yellow-400 hover:text-yellow-500 focus:outline-none"
            onClick={() => setShow(false)}
          >
            <span className="sr-only">关闭</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportRetryNotification;