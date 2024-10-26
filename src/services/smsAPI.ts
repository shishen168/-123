// 在发送短信前添加黑名单检查
import { blacklistService } from './blacklistService';

export const smsAPI = {
  async sendSMS({ recipients, message, scheduleTime }: {
    recipients: string[];
    message: string;
    scheduleTime?: string;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // 检查黑名单
      const blacklistedNumbers = recipients.filter(phone => 
        blacklistService.isBlacklisted(phone)
      );

      if (blacklistedNumbers.length > 0) {
        return {
          success: false,
          message: `以下号码在黑名单中: ${blacklistedNumbers.join(', ')}`
        };
      }

      // ... 原有的发送逻辑 ...

    } catch (error: any) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '发送失败'
      };
    }
  }
};