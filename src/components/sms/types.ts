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

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  group?: string;
  notes?: string;
}