interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

class CountryCodeService {
  private readonly DEFAULT_CODE_KEY = 'default_country_code';
  private readonly DEFAULT_COUNTRY_NAME_KEY = 'default_country_name';
  private readonly countryCodes: CountryCode[] = [
    { code: '+1', name: '美国', flag: '🇺🇸' },
    { code: '+1', name: '加拿大', flag: '🇨🇦' },
    { code: '+852', name: '中国香港', flag: '🇭🇰' },
    { code: '+81', name: '日本', flag: '🇯🇵' },
    { code: '+82', name: '韩国', flag: '🇰🇷' },
    { code: '+44', name: '英国', flag: '🇬🇧' },
    { code: '+33', name: '法国', flag: '🇫🇷' },
    { code: '+49', name: '德国', flag: '🇩🇪' },
    { code: '+61', name: '澳大利亚', flag: '🇦🇺' },
    { code: '+64', name: '新西兰', flag: '🇳🇿' },
    { code: '+65', name: '新加坡', flag: '🇸🇬' },
    { code: '+66', name: '泰国', flag: '🇹🇭' },
    { code: '+84', name: '越南', flag: '🇻🇳' },
    { code: '+91', name: '印度', flag: '🇮🇳' },
    { code: '+62', name: '印度尼西亚', flag: '🇮🇩' },
    { code: '+60', name: '马来西亚', flag: '🇲🇾' },
    { code: '+63', name: '菲律宾', flag: '🇵🇭' },
    { code: '+7', name: '俄罗斯', flag: '🇷🇺' },
    { code: '+39', name: '意大利', flag: '🇮🇹' },
    { code: '+34', name: '西班牙', flag: '🇪🇸' }
  ];

  constructor() {
    // 如果没有默认区号,设置为美国
    if (!this.getDefaultCode()) {
      this.setDefaultCode('+1', '美国');
    }
  }

  getAllCodes(): CountryCode[] {
    return this.countryCodes;
  }

  getDefaultCode(): string {
    return localStorage.getItem(this.DEFAULT_CODE_KEY) || '+1';
  }

  getDefaultCountryName(): string {
    return localStorage.getItem(this.DEFAULT_COUNTRY_NAME_KEY) || '美国';
  }

  setDefaultCode(code: string, countryName: string): boolean {
    try {
      const country = this.countryCodes.find(c => c.code === code && c.name === countryName);
      if (!country) {
        throw new Error('无效的国家区号');
      }
      localStorage.setItem(this.DEFAULT_CODE_KEY, code);
      localStorage.setItem(this.DEFAULT_COUNTRY_NAME_KEY, countryName);
      
      // 触发区号更新事件
      window.dispatchEvent(new CustomEvent('countryCodeUpdate', {
        detail: { code, countryName }
      }));
      return true;
    } catch (error) {
      console.error('Error setting default country code:', error);
      return false;
    }
  }

  getCountryByCode(code: string): CountryCode | undefined {
    const countryName = this.getDefaultCountryName();
    return this.countryCodes.find(c => c.code === code && c.name === countryName);
  }

  getCountryInfo(code: string): { name: string; flag: string } | null {
    const country = this.countryCodes.find(c => c.code === code);
    return country ? { name: country.name, flag: country.flag } : null;
  }
}

export const countryCodeService = new CountryCodeService();