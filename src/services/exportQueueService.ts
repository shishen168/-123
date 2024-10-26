import { ExportColumn } from '../utils/exportUtils';
import { exportHistoryService } from './exportHistoryService';
import { SizeEstimator } from '../utils/sizeEstimator';

interface ExportTask<T> {
  id: string;
  data: T[];
  columns: ExportColumn<T>[];
  filename: string;
  format: 'csv' | 'xlsx' | 'json';
  retryCount: number;
  maxRetries: number;
  onProgress?: (progress: number) => void;
}

class ExportQueueService {
  private queue: ExportTask<any>[] = [];
  private processing = false;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 3000; // 3秒后重试

  async addToQueue<T>(task: Omit<ExportTask<T>, 'id' | 'retryCount' | 'maxRetries'>) {
    const newTask: ExportTask<T> = {
      ...task,
      id: Date.now().toString(),
      retryCount: 0,
      maxRetries: this.MAX_RETRIES
    };

    this.queue.push(newTask);
    
    if (!this.processing) {
      this.processQueue();
    }

    return newTask.id;
  }

  async retryTask(taskId: string) {
    const record = exportHistoryService.getRecordById(taskId);
    if (!record || record.status === 'success') return false;

    // 重置重试次数
    const task = this.queue.find(t => t.id === taskId);
    if (task) {
      task.retryCount = 0;
      if (!this.processing) {
        this.processQueue();
      }
      return true;
    }

    return false;
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const task = this.queue[0];

    try {
      const size = SizeEstimator.estimateExportSize(task.data, task.columns, task.format);
      
      // 执行导出
      const success = await this.executeExport(task);

      if (success) {
        // 记录成功
        exportHistoryService.addRecord({
          filename: task.filename,
          format: task.format,
          size,
          columns: task.columns,
          rowCount: task.data.length,
          status: 'success'
        });

        // 从队列中移除
        this.queue.shift();
      } else {
        // 处理重试逻辑
        if (task.retryCount < task.maxRetries) {
          task.retryCount++;
          // 将任务移到队列末尾
          this.queue.push(this.queue.shift()!);
          // 延迟后继续处理队列
          setTimeout(() => this.processQueue(), this.RETRY_DELAY);
          return;
        } else {
          // 超过最大重试次数，记录失败
          exportHistoryService.addRecord({
            filename: task.filename,
            format: task.format,
            size,
            columns: task.columns,
            rowCount: task.data.length,
            status: 'failed',
            error: '导出失败，已达到最大重试次数'
          });
          this.queue.shift();
        }
      }
    } catch (error) {
      // 记录错误
      exportHistoryService.addRecord({
        filename: task.filename,
        format: task.format,
        size: 0,
        columns: task.columns,
        rowCount: task.data.length,
        status: 'failed',
        error: error instanceof Error ? error.message : '导出失败'
      });
      this.queue.shift();
    }

    // 继续处理队列中的下一个任务
    this.processQueue();
  }

  private async executeExport<T>(task: ExportTask<T>): Promise<boolean> {
    // 这里实现具体的导出逻辑
    // 返回 true 表示成功，false 表示失败
    return true;
  }

  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      currentTask: this.queue[0]
    };
  }

  clearQueue() {
    this.queue = [];
    this.processing = false;
  }
}

export const exportQueueService = new ExportQueueService();