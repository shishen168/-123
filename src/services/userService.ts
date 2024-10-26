import { BALANCE_UPDATE_EVENT } from '../components/MainApp';

export interface User {
  id: string;
  email: string;
  status: 'active' | 'banned';
  balance: number;
  lastLogin: string;
  registerDate: string;
  totalOrders: number;
  totalRecharge: number;
  totalSpent: number;
  lastModified: string;
}

export interface UserCredentials {
  id: string;
  email: string;
  username: string;
  password: string;
  lastPasswordChange: string;
}

interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

class UserService {
  private users: User[] = [];
  private credentials: UserCredentials[] = [];
  private readonly USERS_KEY = 'users';
  private readonly CREDENTIALS_KEY = 'userCredentials';

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const savedUsers = localStorage.getItem(this.USERS_KEY);
      const savedCredentials = localStorage.getItem(this.CREDENTIALS_KEY);

      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      } else {
        this.initializeUsers();
      }

      if (savedCredentials) {
        this.credentials = JSON.parse(savedCredentials);
      } else {
        this.initializeCredentials();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.initializeUsers();
      this.initializeCredentials();
    }
  }

  private saveData() {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
      localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(this.credentials));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  private initializeUsers() {
    this.users = [
      {
        id: '1',
        email: 'user1@example.com',
        status: 'active',
        balance: 20.00,
        lastLogin: '2024/10/24 13:54:05',
        registerDate: '2024-01-01',
        totalOrders: 25,
        totalRecharge: 500.00,
        totalSpent: 399.50,
        lastModified: new Date().toISOString()
      }
    ];
    this.saveData();
  }

  private initializeCredentials() {
    this.credentials = [
      {
        id: '1',
        email: 'user1@example.com',
        username: 'user1',
        password: 'password123',
        lastPasswordChange: '2024-03-15 14:30:00'
      }
    ];
    this.saveData();
  }

  getUsers(): User[] {
    return [...this.users];
  }

  getCredentials(): UserCredentials[] {
    return [...this.credentials];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  updateUserBalance(userId: string, newBalance: number): boolean {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) return false;

      const user = this.users[userIndex];
      const oldBalance = user.balance;
      const rechargeAmount = newBalance - oldBalance;

      // 更新用户数据
      this.users[userIndex] = {
        ...user,
        balance: newBalance,
        lastModified: new Date().toISOString(),
        totalRecharge: rechargeAmount > 0 ? user.totalRecharge + rechargeAmount : user.totalRecharge,
        totalSpent: rechargeAmount < 0 ? user.totalSpent + Math.abs(rechargeAmount) : user.totalSpent
      };

      // 保存到本地存储
      this.saveData();

      // 触发余额更新事件
      const event = new CustomEvent(BALANCE_UPDATE_EVENT, {
        detail: {
          userId,
          balance: newBalance,
          oldBalance,
          change: rechargeAmount
        }
      });
      window.dispatchEvent(event);

      return true;
    } catch (error) {
      console.error('Error updating user balance:', error);
      return false;
    }
  }

  registerUser(data: RegisterUserData): boolean {
    try {
      const existingUser = this.credentials.find(
        u => u.username.toLowerCase() === data.username.toLowerCase() || 
            u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (existingUser) {
        console.log('User already exists');
        return false;
      }

      const now = new Date();
      const userId = (Math.max(...this.users.map(u => parseInt(u.id)), 0) + 1).toString();

      const newCredentials: UserCredentials = {
        id: userId,
        email: data.email,
        username: data.username,
        password: data.password,
        lastPasswordChange: now.toLocaleString()
      };

      const newUser: User = {
        id: userId,
        email: data.email,
        status: 'active',
        balance: 0,
        lastLogin: now.toLocaleString(),
        registerDate: now.toLocaleString(),
        totalOrders: 0,
        totalRecharge: 0,
        totalSpent: 0,
        lastModified: now.toISOString()
      };

      this.credentials.push(newCredentials);
      this.users.push(newUser);
      this.saveData();

      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  }

  validateCredentials(usernameOrEmail: string, password: string): UserCredentials | null {
    const user = this.credentials.find(
      u => (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
            u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && 
           u.password === password
    );
    
    if (user) {
      const userRecord = this.users.find(u => u.id === user.id);
      if (userRecord) {
        userRecord.lastLogin = new Date().toLocaleString();
        this.saveData();
      }
    }
    
    return user;
  }

  validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
      return { valid: false, message: '密码长度至少为6位' };
    }
    return { valid: true };
  }
}

export const userService = new UserService();