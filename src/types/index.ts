export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontSize: number;
}

export interface ShortcutAction {
  id: string;
  label: string;
  defaultShortcut: string;
  description?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  group?: string;
  notes?: string;
}

export interface FollowUp {
  id: string;
  contact: string;
  content: string;
  dueDate: Date;
  status: 'pending' | 'completed';
  createdAt: Date;
}

export interface SMSRecord {
  id: string;
  recipient: string;
  message: string;
  status: 'sent' | 'failed' | 'scheduled';
  sendTime: string;
  isIncoming?: boolean;
}

export interface ChatThread {
  recipient: string;
  messages: SMSRecord[];
}