interface ExportRecord {
  id: string;
  filename: string;
  format: 'csv' | 'xlsx' | 'json';
  size: number;
  columns: { key: string; title: string }[];
  rowCount: number;
  status: 'success' | 'failed' | 'pending';
  createdAt: string;
  completedAt?: string;
  error?: string;
}

class ExportHistoryService {
  private readonly STORAGE_KEY = 'export_history';
  private history: ExportRecord[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.history = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading export history:', error);
      this.history = [];
    }
  }

  private saveHistory() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
      window.dispatchEvent(new Event('exportHistoryUpdate'));
    } catch (error) {
      console.error('Error saving export history:', error);
    }
  }

  getHistory(): ExportRecord[] {
    return [...this.history];
  }

  getRecordById(id: string): ExportRecord | undefined {
    return this.history.find(record => record.id === id);
  }

  addRecord(record: Omit<ExportRecord, 'id' | 'createdAt'>): ExportRecord {
    const newRecord: ExportRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    this.history.unshift(newRecord);
    this.saveHistory();
    return newRecord;
  }

  updateRecordStatus(id: string, status: 'success' | 'failed', error?: string) {
    const record = this.history.find(record => record.id === id);
    if (record) {
      record.status = status;
      if (error) {
        record.error = error;
      }
      if (status === 'success' || status === 'failed') {
        record.completedAt = new Date().toISOString();
      }
      this.saveHistory();
    }
  }

  deleteRecord(id: string): boolean {
    const initialLength = this.history.length;
    this.history = this.history.filter(record => record.id !== id);
    
    if (this.history.length !== initialLength) {
      this.saveHistory();
      return true;
    }
    return false;
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
  }
}

export const exportHistoryService = new ExportHistoryService();