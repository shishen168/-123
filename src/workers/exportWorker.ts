// Web Worker for handling export operations
import { ExportColumn } from '../utils/exportUtils';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ExportMessage<T> {
  type: 'export';
  data: T[];
  columns: ExportColumn<T>[];
  format: 'csv' | 'xlsx' | 'json';
  batchIndex: number;
  totalBatches: number;
  batchSize: number;
}

self.onmessage = async <T>(event: MessageEvent<ExportMessage<T>>) => {
  const { data, columns, format, batchIndex, totalBatches, batchSize } = event.data;
  
  try {
    let result: string | Blob;
    
    // 使用 Generator 分批处理数据
    const processDataInBatches = async function* (items: T[]) {
      for (let i = 0; i < items.length; i += batchSize) {
        yield items.slice(i, i + batchSize);
        
        // 报告进度
        const progress = (i / items.length) * 100;
        self.postMessage({ 
          type: 'progress', 
          progress: Math.round(progress),
          batchIndex
        });

        // 让出主线程
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    };

    switch (format) {
      case 'csv':
        result = await exportToCSV(data, columns, processDataInBatches);
        break;
      case 'xlsx':
        result = await exportToExcel(data, columns, processDataInBatches);
        break;
      case 'json':
        result = await exportToJSON(data, columns, processDataInBatches);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    self.postMessage({ 
      type: 'complete',
      result,
      batchIndex
    });
  } catch (error) {
    self.postMessage({ 
      type: 'error',
      error: error instanceof Error ? error.message : 'Export failed',
      batchIndex
    });
  }
};

async function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  batchProcessor: (items: T[]) => AsyncGenerator<T[]>
): Promise<string> {
  const rows = [];
  const headers = columns.map(col => col.title);
  rows.push(headers);

  for await (const batch of batchProcessor(data)) {
    for (const item of batch) {
      const row = columns.map(col => {
        const value = item[col.key];
        return col.formatter ? col.formatter(value, item) : value;
      });
      rows.push(row);
    }
  }

  return Papa.unparse(rows, {
    delimiter: ',',
    header: false
  });
}

async function exportToExcel<T>(
  data: T[],
  columns: ExportColumn<T>[],
  batchProcessor: (items: T[]) => AsyncGenerator<T[]>
): Promise<Blob> {
  const rows = [];
  const headers = columns.map(col => col.title);
  rows.push(headers);

  for await (const batch of batchProcessor(data)) {
    for (const item of batch) {
      const row = columns.map(col => {
        const value = item[col.key];
        return col.formatter ? col.formatter(value, item) : value;
      });
      rows.push(row);
    }
  }

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

async function exportToJSON<T>(
  data: T[],
  columns: ExportColumn<T>[],
  batchProcessor: (items: T[]) => AsyncGenerator<T[]>
): Promise<string> {
  const result = [];

  for await (const batch of batchProcessor(data)) {
    for (const item of batch) {
      const processedItem: Record<string, any> = {};
      columns.forEach(col => {
        const value = item[col.key];
        processedItem[col.title] = col.formatter ? col.formatter(value, item) : value;
      });
      result.push(processedItem);
    }
  }

  return JSON.stringify(result, null, 2);
}

export {};