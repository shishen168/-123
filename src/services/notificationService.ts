export interface Notification {
  id: string;
  content: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

class NotificationService {
  private notification: Notification | null = null;

  constructor() {
    this.loadNotification();
    if (!this.notification) {
      this.updateNotification('目前程序正在开发完善中，更多功能敬请期待！');
    }
  }

  private loadNotification() {
    const saved = localStorage.getItem('notification');
    if (saved) {
      this.notification = JSON.parse(saved);
    }
  }

  private saveNotification() {
    if (this.notification) {
      localStorage.setItem('notification', JSON.stringify(this.notification));
      window.dispatchEvent(new CustomEvent('notificationUpdate'));
    } else {
      localStorage.removeItem('notification');
    }
  }

  getCurrentNotification(): string {
    return this.notification?.content || '';
  }

  updateNotification(content: string): boolean {
    try {
      this.notification = {
        id: Date.now().toString(),
        content,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.saveNotification();
      return true;
    } catch (error) {
      console.error('Error updating notification:', error);
      return false;
    }
  }

  clearNotification(): boolean {
    try {
      this.notification = null;
      this.saveNotification();
      return true;
    } catch (error) {
      console.error('Error clearing notification:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();