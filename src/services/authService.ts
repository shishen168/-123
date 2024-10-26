import { userService } from './userService';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  token: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly IS_LOGGED_IN = 'isLoggedIn';

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userStr = localStorage.getItem(this.USER_KEY);
      
      if (token && userStr) {
        this.currentUser = JSON.parse(userStr);
        localStorage.setItem(this.IS_LOGGED_IN, 'true');
      }
    } catch (e) {
      console.error('Error loading user from storage:', e);
      this.clearStorage();
    }
  }

  private clearStorage() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.IS_LOGGED_IN);
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.IS_LOGGED_IN) === 'true';
  }

  getCurrentUser(): AuthUser | null {
    if (!this.currentUser) {
      this.loadUserFromStorage();
    }
    return this.currentUser;
  }

  async login(usernameOrEmail: string, password: string, rememberMe: boolean = false): Promise<{success: boolean; message?: string}> {
    try {
      const user = userService.validateCredentials(usernameOrEmail, password);
      
      if (!user) {
        console.log('Login failed: Invalid credentials');
        return { success: false, message: '用户名或密码错误' };
      }

      const token = Math.random().toString(36).substring(2);
      
      this.currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        token
      };

      if (rememberMe) {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.currentUser));
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(this.currentUser));
      }
      
      localStorage.setItem(this.IS_LOGGED_IN, 'true');

      console.log('Login successful');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: '登录失败，请重试' };
    }
  }

  logout() {
    console.log('Logging out...');
    this.clearStorage();
    sessionStorage.clear();
    window.location.href = '/login';
  }
}

export const authService = new AuthService();