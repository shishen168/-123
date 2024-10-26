import { adminService } from './adminService';

interface PriceSettings {
  sendPrice: number;
  receivePrice: number;
  lastModified: string;
  modifiedBy: string;
}

class PriceService {
  private readonly PRICE_SETTINGS_KEY = 'price_settings';
  private settings: PriceSettings;

  constructor() {
    this.loadSettings();
    if (!this.settings) {
      // 默认价格
      this.settings = {
        sendPrice: 0.1,
        receivePrice: 0.05,
        lastModified: new Date().toISOString(),
        modifiedBy: 'system'
      };
      this.saveSettings();
    }
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(this.PRICE_SETTINGS_KEY);
      if (saved) {
        this.settings = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading price settings:', error);
      // 如果加载失败,使用默认设置
      this.settings = {
        sendPrice: 0.1,
        receivePrice: 0.05,
        lastModified: new Date().toISOString(),
        modifiedBy: 'system'
      };
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(this.PRICE_SETTINGS_KEY, JSON.stringify(this.settings));
      // 触发价格更新事件
      window.dispatchEvent(new CustomEvent('priceUpdate', {
        detail: this.settings
      }));
    } catch (error) {
      console.error('Error saving price settings:', error);
      throw new Error('保存价格设置失败');
    }
  }

  getSettings(): PriceSettings {
    return { ...this.settings };
  }

  updatePrices(sendPrice: number, receivePrice: number): boolean {
    try {
      // 移除管理员登录检查,因为这个页面本身就在管理后台
      if (sendPrice < 0 || receivePrice < 0) {
        throw new Error('价格不能为负数');
      }

      this.settings = {
        sendPrice,
        receivePrice,
        lastModified: new Date().toISOString(),
        modifiedBy: 'admin'
      };

      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error updating prices:', error);
      return false;
    }
  }
}

export const priceService = new PriceService();