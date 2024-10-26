import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { SizeEstimator } from './sizeEstimator';

export interface ExportColumn<T> {
  key: keyof T;
  title: string;
  formatter?: (value: any, record: T) => string;
}

interface ExportOptions {
  filename: string;
  format: 'csv' | 'xlsx' | 'json';
  batchSize?: number;
  onProgress?: (progress: number) => void;
}

const defaultOptions: ExportOptions = {
  filename: 'export',
  format: 'csv',
  batchSize: 1000
};

export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string = 'export'
): boolean {
  try {
    // 准备CSV数据
    const headers = columns.map(col => col.title);
    const rows = [headers];

    // 转换数据行
    data.forEach(record => {
      const row = columns.map(col => {
        const value = record[col.key];
        return col.formatter ? col.formatter(value, record) : value;
      });
      rows.push(row);
    });

    // 使用 Papa Parse 生成 CSV
    const csv = Papa.unparse(rows);
    
    // 添加 BOM 以支持中文
    const blob = new Blob(['\ufeff' + csv], { 
      type: 'text/csv;charset=utf-8;' 
    });

    // 下载文件
    saveAs(blob, `${filename}.csv`);
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

export async function exportData<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
  options: Partial<ExportOptions> = {}
): Promise<boolean> {
  try {
    const mergedOptions = { ...defaultOptions, ...options };
    const { filename, format, batchSize = 1000, onProgress } = mergedOptions;

    // 估算文件大小
    const estimatedSize = SizeEstimator.estimateExportSize(data, columns, format);

    // 分批处理数据
    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    // 根据格式导出
    switch (format) {
      case 'csv':
        return exportToCSV(data, columns, filename);
      case 'xlsx':
        // TODO: 实现 Excel 导出
        throw new Error('Excel export not implemented yet');
      case 'json':
        const jsonContent = JSON.stringify(data.map(record => {
          const result: Record<string, any> = {};
          columns.forEach(col => {
            const value = record[col.key];
            result[col.title] = col.formatter ? col.formatter(value, record) : value;
          });
          return result;
        }), null, 2);

        const jsonBlob = new Blob([jsonContent], { 
          type: 'application/json;charset=utf-8;' 
        });
        saveAs(jsonBlob, `${filename}.json`);
        return true;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

export function getContentType(format: string): string {
  switch (format) {
    case 'csv':
      return 'text/csv;charset=utf-8';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'json':
      return 'application/json';
    default:
      return 'text/plain';
  }
}

export function validateExportConfig(
  columns: ExportColumn<any>[],
  format: string,
  batchSize: number
): { valid: boolean; error?: string } {
  if (!columns || columns.length === 0) {
    return { valid: false, error: '导出列不能为空' };
  }

  if (!['csv', 'xlsx', 'json'].includes(format)) {
    return { valid: false, error: '不支持的导出格式' };
  }

  if (batchSize < 100) {
    return { valid: false, error: '批量大小不能小于100' };
  }

  return { valid: true };
}