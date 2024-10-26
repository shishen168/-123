interface Advertisement {
  id: string;
  content: string;
  position: 'top' | 'bottom';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

class AdvertisementService {
  private readonly STORAGE_KEY = 'advertisements';
  private advertisements: Advertisement[] = [];

  constructor() {
    this.loadFromStorage();
    if (this.advertisements.length === 0) {
      this.initializeDefaultAds();
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.advertisements = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading advertisements:', error);
      this.advertisements = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.advertisements));
      window.dispatchEvent(new Event('advertisementUpdate'));
    } catch (error) {
      console.error('Error saving advertisements:', error);
    }
  }

  private initializeDefaultAds() {
    const defaultAd: Advertisement = {
      id: '1',
      content: '欢迎来到神域工作室，本工作室主营：社交账户售卖、软件开发、渗透、P图、三方人设、AI换脸、声音克隆、直播引流等，详情请联系客服！',
      position: 'bottom',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.advertisements = [defaultAd];
    this.saveToStorage();
  }

  getAllAds(): Advertisement[] {
    return this.advertisements;
  }

  getActiveAd(position: 'top' | 'bottom'): Advertisement | null {
    return this.advertisements.find(ad => ad.active && ad.position === position) || null;
  }

  createAd(ad: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'>): Advertisement {
    const newAd: Advertisement = {
      ...ad,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.advertisements.push(newAd);
    this.saveToStorage();
    return newAd;
  }

  updateAd(id: string, updates: Partial<Omit<Advertisement, 'id' | 'createdAt'>>): boolean {
    const index = this.advertisements.findIndex(ad => ad.id === id);
    if (index === -1) return false;

    this.advertisements[index] = {
      ...this.advertisements[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();
    return true;
  }

  deleteAd(id: string): boolean {
    const initialLength = this.advertisements.length;
    this.advertisements = this.advertisements.filter(ad => ad.id !== id);
    
    if (this.advertisements.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

export const advertisementService = new AdvertisementService();