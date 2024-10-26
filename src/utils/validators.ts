import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { phoneRules } from './phoneRules';

export const validatePhone = (phone: string): boolean => {
  try {
    // 从完整号码中提取国家代码
    const match = phone.match(/^\+(\d+)/);
    if (!match) return false;

    const countryCode = `+${match[1]}`;
    const numberWithoutCountry = phone.substring(countryCode.length);

    // 获取该国家的号码规则
    const rules = phoneRules[countryCode];
    if (!rules) {
      // 如果没有特定规则，使用 libphonenumber-js 进行基本验证
      return isValidPhoneNumber(phone);
    }

    // 检查号码是否符合该国家的格式规则
    if (!rules.format.test(phone)) {
      return false;
    }

    // 移除所有非数字字符
    const cleanNumber = numberWithoutCountry.replace(/\D/g, '');

    // 检查号码长度
    if (!rules.lengths.includes(cleanNumber.length)) {
      return false;
    }

    // 检查开头数字
    if (!rules.startsWith.includes(cleanNumber[0])) {
      return false;
    }

    // 如果是美国号码，检查区号
    if (countryCode === '+1') {
      const areaCode = cleanNumber.substring(0, 3);
      const isValidAreaCode = Object.values(rules.areaCodeRules).some(
        codes => codes.includes(areaCode)
      );
      if (!isValidAreaCode) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Phone validation error:', error);
    return false;
  }
};

export const formatPhone = (phone: string): string => {
  try {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber.formatInternational();
  } catch (error) {
    console.error('Phone formatting error:', error);
    return phone;
  }
};

export const validatePhoneList = (phones: string[]): string[] => {
  return phones.filter(phone => validatePhone(phone));
};