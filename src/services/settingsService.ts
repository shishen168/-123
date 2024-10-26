import { Theme } from '../types';

export interface SystemSettings {
  theme: Theme;
  shortcuts: Record<string, string>;
  notifications: {
    sound: boolean;
    desktop: boolean;
    email: boolean;
  };
  display: {
    density: 'compact' | 'comfortable' | 'spacious';
    fontSize: number;
    language: string;
  };
  backup: {
    autoBackup: boolean;
    backupInterval: number; // 天数
    lastBackup?: string;
  };
}

const defaultSettings: SystemSettings = {
  theme: {
    mode: 'light',
    primaryColor: '#2563eb',
    fontSize: 14
  },
  shortcuts: {
    'new-message': 'Ctrl+N',
    'send-message': 'Ctrl+Enter',
    'search': 'Ctrl+F',
    'help': 'F1'
  },
  notifications: {
    sound: true,
    desktop: true,
    email: false
  },
  display: {
    density: 'comfortable',
    fontSize: 14,
    language: 'zh-CN'
  },
  backup: {
    autoBackup: true,
    backupInterval: 7
  }
};

class SettingsService {
  private readonly STORAGE_KEY = 'system_settings';
  private settings: SystemSettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): SystemSettings {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return { ...defaultSettings };
  }

  private saveSettings() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
      window.dispatchEvent(new CustomEvent('settingsUpdate', {
        detail: this.settings
      }));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  getSettings(): SystemSettings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<SystemSettings>) {
    this.settings = {
      ...this.settings,
      ...updates
    };
    this.saveSettings();
  }

  // 主题相关
  setTheme(theme: Theme) {
    this.settings.theme = theme;
    this.saveSettings();
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--font-size', `${theme.fontSize}px`);
    document.body.classList.toggle('dark', theme.mode === 'dark');
  }

  // 快捷键相关
  updateShortcut(action: string, shortcut: string) {
    this.settings.shortcuts[action] = shortcut;
    this.saveSettings();
  }

  // 备份相关
  async createBackup(): Promise<string> {
    const data = {
      settings: this.settings,
      contacts: localStorage.getItem('contacts'),
      messages: localStorage.getItem('messages'),
      templates: localStorage.getItem('templates')
    };

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    this.settings.backup.lastBackup = new Date().toISOString();
    this.saveSettings();

    return url;
  }

  async restoreBackup(file: File): Promise<boolean> {
    try {
      const content = await file.text();
      const data = JSON.parse(content);

      // 恢复设置
      this.settings = data.settings;
      this.saveSettings();

      // 恢复其他数据
      if (data.contacts) localStorage.setItem('contacts', data.contacts);
      if (data.messages) localStorage.setItem('messages', data.messages);
      if (data.templates) localStorage.setItem('templates', data.templates);

      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }

  // 自动备份检查
  checkAutoBackup() {
    if (!this.settings.backup.autoBackup) return;

    const lastBackup = this.settings.backup.lastBackup;
    if (!lastBackup) {
      this.createBackup();
      return;
    }

    const daysSinceLastBackup = Math.floor(
      (Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastBackup >= this.settings.backup.backupInterval) {
      this.createBackup();
    }
  }
}

export const settingsService = new SettingsService();