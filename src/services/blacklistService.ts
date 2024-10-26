import { cache } from '../utils/cache';

export interface BlacklistEntry {
  id: string;
  phone: string;
  reason?: string;
  createdAt: string;
}

class BlacklistService {
  private readonly STORAGE_KEY = 'blacklist';
  private blacklist: BlacklistEntry[] = [];

  constructor() {
    this.loadBlacklist();
  }

  private loadBlacklist() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.blacklist = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading blacklist:', error);
      this.blacklist = [];
    }
  }

  private saveBlacklist() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.blacklist));
      // 清除缓存
      cache.delete('blacklist');
      // 触发更新事件
      window.dispatchEvent(new Event('blacklistUpdate'));
    } catch (error) {
      console.error('Error saving blacklist:', error);
    }
  }

  getBlacklist(): BlacklistEntry[] {
    return [...this.blacklist];
  }

  isBlacklisted(phone: string): boolean {
    return this.blacklist.some(entry => entry.phone === phone);
  }

  addToBlacklist(phone: string, reason?: string): BlacklistEntry {
    if (this.isBlacklisted(phone)) {
      throw new Error('该号码已在黑名单中');
    }

    const entry: BlacklistEntry = {
      id: Date.now().toString(),
      phone,
      reason,
      createdAt: new Date().toISOString()
    };

    this.blacklist.push(entry);
    this.saveBlacklist();
    return entry;
  }

  removeFromBlacklist(phone: string): boolean {
    const initialLength = this.blacklist.length;
    this.blacklist = this.blacklist.filter(entry => entry.phone !== phone);
    
    if (this.blacklist.length !== initialLength) {
      this.saveBlacklist();
      return true;
    }
    return false;
  }

  updateBlacklistEntry(id: string, updates: Partial<BlacklistEntry>): boolean {
    const entry = this.blacklist.find(e => e.id === id);
    if (!entry) return false;

    Object.assign(entry, updates);
    this.saveBlacklist();
    return true;
  }
}

export const blacklistService = new BlacklistService();