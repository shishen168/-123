import { ExportColumn } from '../utils/exportUtils';

export interface ExportConfig {
  id: string;
  name: string;
  format: 'csv' | 'xlsx' | 'json';
  columns: string[];
  batchSize: number;
  createdAt: string;
  updatedAt: string;
}

class ExportConfigService {
  private readonly STORAGE_KEY = 'export_configs';
  private configs: ExportConfig[] = [];

  constructor() {
    this.loadConfigs();
  }

  private loadConfigs() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.configs = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading export configs:', error);
      this.configs = [];
    }
  }

  private saveConfigs() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.configs));
      window.dispatchEvent(new Event('exportConfigUpdate'));
    } catch (error) {
      console.error('Error saving export configs:', error);
    }
  }

  getConfigs(): ExportConfig[] {
    return [...this.configs];
  }

  getConfigById(id: string): ExportConfig | undefined {
    return this.configs.find(config => config.id === id);
  }

  createConfig(data: Omit<ExportConfig, 'id' | 'createdAt' | 'updatedAt'>): ExportConfig {
    const newConfig: ExportConfig = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.configs.push(newConfig);
    this.saveConfigs();
    return newConfig;
  }

  updateConfig(id: string, data: Partial<Omit<ExportConfig, 'id' | 'createdAt'>>): boolean {
    const index = this.configs.findIndex(config => config.id === id);
    if (index === -1) return false;

    this.configs[index] = {
      ...this.configs[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.saveConfigs();
    return true;
  }

  deleteConfig(id: string): boolean {
    const initialLength = this.configs.length;
    this.configs = this.configs.filter(config => config.id !== id);
    
    if (this.configs.length !== initialLength) {
      this.saveConfigs();
      return true;
    }
    return false;
  }
}

export const exportConfigService = new ExportConfigService();