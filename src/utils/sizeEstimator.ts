import { ExportColumn } from './exportUtils';

export class SizeEstimator {
  // 每个字符的平均字节大小（UTF-8编码）
  private static readonly CHAR_SIZE = 3;
  // CSV/Excel 文件头部的固定开销
  private static readonly CSV_OVERHEAD = 100; // BOM + 格式开销
  private static readonly XLSX_OVERHEAD = 2048; // Excel文件格式开销
  private static readonly JSON_OVERHEAD = 50; // 格式化和括号开销

  /**
   * 估算单个字段的大小
   */
  private static estimateFieldSize(value: any): number {
    if (value == null) return 4; // "null"
    if (typeof value === 'boolean') return 5; // "true"/"false"
    if (typeof value === 'number') return String(value).length;
    if (typeof value === 'string') return value.length * this.CHAR_SIZE;
    if (Array.isArray(value)) {
      return value.reduce((size, item) => size + this.estimateFieldSize(item), 2); // []
    }
    if (typeof value === 'object') {
      return Object.values(value).reduce(
        (size, val) => size + this.estimateFieldSize(val),
        2 // {}
      );
    }
    return String(value).length * this.CHAR_SIZE;
  }

  /**
   * 估算单行数据的大小
   */
  private static estimateRowSize<T>(
    row: T,
    columns: ExportColumn<T>[]
  ): number {
    return columns.reduce((size, column) => {
      const value = row[column.key];
      const formattedValue = column.formatter ? column.formatter(value, row) : value;
      return size + this.estimateFieldSize(formattedValue) + 1; // +1 for delimiter
    }, 0);
  }

  /**
   * 估算表头大小
   */
  private static estimateHeaderSize<T>(columns: ExportColumn<T>[]): number {
    return columns.reduce(
      (size, column) => size + column.title.length * this.CHAR_SIZE + 1,
      0
    );
  }

  /**
   * 估算导出文件大小
   */
  static estimateExportSize<T>(
    data: T[],
    columns: ExportColumn<T>[],
    format: 'csv' | 'xlsx' | 'json' = 'csv'
  ): number {
    // 计算表头大小
    const headerSize = this.estimateHeaderSize(columns);

    // 采样计算数据大小
    const sampleSize = Math.min(100, data.length);
    const sample = data.slice(0, sampleSize);
    const averageRowSize = sample.reduce(
      (sum, row) => sum + this.estimateRowSize(row, columns),
      0
    ) / sampleSize;

    // 估算总数据大小
    const totalDataSize = averageRowSize * data.length;

    // 根据不同格式添加开销
    const overhead = format === 'csv' 
      ? this.CSV_OVERHEAD 
      : format === 'xlsx'
        ? this.XLSX_OVERHEAD
        : this.JSON_OVERHEAD;

    return Math.ceil(headerSize + totalDataSize + overhead);
  }

  /**
   * 格式化文件大小显示
   */
  static formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}