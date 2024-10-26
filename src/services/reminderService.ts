import { FollowUp } from '../types';
import { followUpService } from './followUpService';

interface ReminderSettings {
  enabled: boolean;
  reminderTime: number; // 提前提醒分钟数
  sound: boolean;
  desktop: boolean;
}

class ReminderService {
  private readonly SETTINGS_KEY = 'reminder_settings';
  private checkInterval: NodeJS.Timeout | null = null;
  private notifiedTasks: Set<string> = new Set();

  private settings: ReminderSettings = {
    enabled: true,
    reminderTime: 30, // 默认提前30分钟提醒
    sound: true,
    desktop: true
  };

  constructor() {
    this.loadSettings();
    if (this.settings.enabled) {
      this.startChecking();
    }
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(this.SETTINGS_KEY);
      if (saved) {
        this.settings = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading reminder settings:', error);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
      // 触发设置更新事件
      window.dispatchEvent(new CustomEvent('reminderSettingsUpdate', {
        detail: this.settings
      }));
    } catch (error) {
      console.error('Error saving reminder settings:', error);
    }
  }

  getSettings(): ReminderSettings {
    return { ...this.settings };
  }

  updateSettings(settings: Partial<ReminderSettings>) {
    this.settings = {
      ...this.settings,
      ...settings
    };
    this.saveSettings();

    // 根据启用状态开始或停止检查
    if (this.settings.enabled) {
      this.startChecking();
    } else {
      this.stopChecking();
    }
  }

  private async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  private async showNotification(task: FollowUp) {
    if (!this.settings.desktop) return;

    const hasPermission = await this.requestNotificationPermission();
    if (!hasPermission) return;

    const notification = new Notification('任务提醒', {
      body: `任务"${task.content}"即将到期`,
      icon: '/favicon.ico',
      tag: task.id
    });

    if (this.settings.sound) {
      this.playSound();
    }

    notification.onclick = () => {
      window.focus();
      // 触发任务详情事件
      window.dispatchEvent(new CustomEvent('showTaskDetail', {
        detail: { taskId: task.id }
      }));
    };
  }

  private playSound() {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  }

  private checkTasks() {
    const now = new Date();
    const reminderThreshold = new Date(now.getTime() + this.settings.reminderTime * 60000);

    // 获取所有待处理的任务
    const tasks = followUpService.getPending();

    tasks.forEach(task => {
      // 检查是否需要提醒
      if (task.dueDate <= reminderThreshold && 
          task.dueDate > now && 
          !this.notifiedTasks.has(task.id)) {
        this.showNotification(task);
        this.notifiedTasks.add(task.id);

        // 触发提醒事件
        window.dispatchEvent(new CustomEvent('taskReminder', {
          detail: { task }
        }));
      }
    });

    // 清理已过期的通知记录
    this.notifiedTasks.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.dueDate <= now) {
        this.notifiedTasks.delete(taskId);
      }
    });
  }

  private startChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // 每分钟检查一次
    this.checkInterval = setInterval(() => {
      this.checkTasks();
    }, 60000);

    // 立即执行一次检查
    this.checkTasks();
  }

  private stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // 清理资源
  destroy() {
    this.stopChecking();
  }
}

export const reminderService = new ReminderService();