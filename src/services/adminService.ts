interface AdminUser {
  username: string;
  lastLogin: string;
}

class AdminService {
  private readonly ADMIN_KEY = 'admin_token';
  private readonly ADMIN_USER_KEY = 'admin_user';
  private readonly adminCredentials = {
    username: 'admin',
    password: 'admin123'
  };
  private currentAdmin: AdminUser | null = null;

  constructor() {
    this.loadAdminUser();
  }

  private loadAdminUser() {
    const savedUser = localStorage.getItem(this.ADMIN_USER_KEY);
    if (savedUser) {
      try {
        this.currentAdmin = JSON.parse(savedUser);
      } catch (e) {
        this.clearStorage();
      }
    }
  }

  private clearStorage() {
    localStorage.removeItem(this.ADMIN_KEY);
    localStorage.removeItem(this.ADMIN_USER_KEY);
    this.currentAdmin = null;
  }

  isAdminLoggedIn(): boolean {
    return localStorage.getItem(this.ADMIN_KEY) === 'true';
  }

  getCurrentAdmin(): AdminUser | null {
    return this.currentAdmin;
  }

  login(username: string, password: string): boolean {
    if (username === this.adminCredentials.username && 
        password === this.adminCredentials.password) {
      localStorage.setItem(this.ADMIN_KEY, 'true');
      
      const adminUser: AdminUser = {
        username: username,
        lastLogin: new Date().toISOString()
      };
      
      this.currentAdmin = adminUser;
      localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(adminUser));
      return true;
    }
    return false;
  }

  logout() {
    this.clearStorage();
    window.location.href = '/admin/login';
  }
}

export const adminService = new AdminService();