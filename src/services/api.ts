import { authService } from './authService';

const SMS_HISTORY_KEY = 'sms_history';
const CONTACTS_KEY = 'contacts';

export interface SMSResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  group?: string;
  notes?: string;
}

export const smsAPI = {
  async sendSMS({ recipients, message, scheduleTime }: {
    recipients: string[];
    message: string;
    scheduleTime?: string;
  }): Promise<SMSResponse> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: '请先登录' };
      }

      // 模拟发送延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newMessage = {
        id: Date.now().toString(),
        userId: currentUser.id,
        recipient: recipients[0],
        message,
        status: 'sent',
        sendTime: new Date().toISOString()
      };

      // 保存到本地存储
      const history = this.getLocalHistory();
      history.push(newMessage);
      localStorage.setItem(SMS_HISTORY_KEY, JSON.stringify(history));

      // 触发历史记录更新事件
      window.dispatchEvent(new Event('smsHistoryUpdate'));

      return {
        success: true,
        message: '发送成功',
        data: newMessage
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '发送失败'
      };
    }
  },

  async getSMSHistory(): Promise<SMSResponse> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: '请先登录' };
      }

      const history = this.getLocalHistory();
      const userHistory = history
        .filter(msg => msg.userId === currentUser.id)
        .sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime());

      return {
        success: true,
        data: userHistory
      };
    } catch (error) {
      console.error('Error getting SMS history:', error);
      return {
        success: false,
        message: '获取历史记录失败'
      };
    }
  },

  getLocalHistory() {
    try {
      const saved = localStorage.getItem(SMS_HISTORY_KEY);
      if (!saved) return [];
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error loading SMS history:', error);
      return [];
    }
  },

  async deleteMessage(messageId: string): Promise<SMSResponse> {
    try {
      const history = this.getLocalHistory();
      const updatedHistory = history.filter(msg => msg.id !== messageId);
      localStorage.setItem(SMS_HISTORY_KEY, JSON.stringify(updatedHistory));
      return {
        success: true,
        message: '删除成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '删除失败'
      };
    }
  },

  async deleteThread(recipient: string): Promise<SMSResponse> {
    try {
      const history = this.getLocalHistory();
      const updatedHistory = history.filter(msg => msg.recipient !== recipient);
      localStorage.setItem(SMS_HISTORY_KEY, JSON.stringify(updatedHistory));
      return {
        success: true,
        message: '删除成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '删除失败'
      };
    }
  }
};

export const contactsAPI = {
  async getContacts(): Promise<SMSResponse> {
    try {
      const contacts = localStorage.getItem(CONTACTS_KEY);
      return {
        success: true,
        data: contacts ? JSON.parse(contacts) : []
      };
    } catch (error) {
      return {
        success: false,
        message: '获取联系人失败'
      };
    }
  },

  async addContact(contact: Omit<Contact, 'id'>): Promise<SMSResponse> {
    try {
      const contacts = await this.getContacts();
      const newContact = {
        ...contact,
        id: Date.now().toString()
      };

      const updatedContacts = [...(contacts.data || []), newContact];
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(updatedContacts));

      return {
        success: true,
        message: '添加联系人成功',
        data: newContact
      };
    } catch (error) {
      return {
        success: false,
        message: '添加联系人失败'
      };
    }
  },

  async updateContact(id: string, updates: Partial<Contact>): Promise<SMSResponse> {
    try {
      const contacts = await this.getContacts();
      const updatedContacts = (contacts.data || []).map(contact =>
        contact.id === id ? { ...contact, ...updates } : contact
      );

      localStorage.setItem(CONTACTS_KEY, JSON.stringify(updatedContacts));
      return {
        success: true,
        message: '更新联系人成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '更新联系人失败'
      };
    }
  },

  async deleteContact(id: string): Promise<SMSResponse> {
    try {
      const contacts = await this.getContacts();
      const updatedContacts = (contacts.data || []).filter(contact => contact.id !== id);
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(updatedContacts));

      return {
        success: true,
        message: '删除联系人成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '删除联系人失败'
      };
    }
  }
};