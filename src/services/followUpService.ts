import { FollowUp } from '../types';

class FollowUpService {
  private readonly STORAGE_KEY = 'followups';
  private followUps: FollowUp[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        // 将日期字符串转换回 Date 对象
        this.followUps = JSON.parse(saved, (key, value) => {
          if (key === 'dueDate' || key === 'createdAt') {
            return new Date(value);
          }
          return value;
        });
      }
    } catch (error) {
      console.error('Error loading follow-ups:', error);
      this.followUps = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.followUps));
      // 触发更新事件
      window.dispatchEvent(new Event('followupUpdate'));
    } catch (error) {
      console.error('Error saving follow-ups:', error);
    }
  }

  getAll(): FollowUp[] {
    return [...this.followUps];
  }

  getById(id: string): FollowUp | undefined {
    return this.followUps.find(item => item.id === id);
  }

  getByContact(contactId: string): FollowUp[] {
    return this.followUps.filter(item => item.contact === contactId);
  }

  getPending(): FollowUp[] {
    return this.followUps.filter(item => item.status === 'pending');
  }

  create(data: Omit<FollowUp, 'id' | 'createdAt'>): FollowUp {
    const newFollowUp: FollowUp = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    this.followUps.push(newFollowUp);
    this.saveToStorage();
    return newFollowUp;
  }

  update(id: string, data: Partial<Omit<FollowUp, 'id' | 'createdAt'>>): boolean {
    const index = this.followUps.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.followUps[index] = {
      ...this.followUps[index],
      ...data
    };

    this.saveToStorage();
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this.followUps.length;
    this.followUps = this.followUps.filter(item => item.id !== id);
    
    if (this.followUps.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteByContact(contactId: string): boolean {
    const initialLength = this.followUps.length;
    this.followUps = this.followUps.filter(item => item.contact !== contactId);
    
    if (this.followUps.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // 获取即将到期的任务
  getUpcoming(days: number = 7): FollowUp[] {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    return this.followUps.filter(item => 
      item.status === 'pending' &&
      item.dueDate >= now &&
      item.dueDate <= future
    );
  }

  // 获取已过期的任务
  getOverdue(): FollowUp[] {
    const now = new Date();
    return this.followUps.filter(item =>
      item.status === 'pending' &&
      item.dueDate < now
    );
  }

  // 批量更新状态
  updateStatus(ids: string[], status: 'pending' | 'completed'): boolean {
    let updated = false;
    ids.forEach(id => {
      const index = this.followUps.findIndex(item => item.id === id);
      if (index !== -1) {
        this.followUps[index].status = status;
        updated = true;
      }
    });

    if (updated) {
      this.saveToStorage();
    }
    return updated;
  }
}

export const followUpService = new FollowUpService();