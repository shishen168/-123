import { Contact } from '../components/sms/types';

class ContactsService {
  private readonly STORAGE_KEY = 'contacts';

  getContacts(): Contact[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return [];
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error loading contacts:', error);
      return [];
    }
  }

  addContact(contact: Omit<Contact, 'id'>): Contact {
    const contacts = this.getContacts();
    const newContact = {
      ...contact,
      id: Date.now().toString()
    };
    
    contacts.push(newContact);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contacts));
    
    // 触发更新事件
    window.dispatchEvent(new Event('contactsUpdate'));
    
    return newContact;
  }

  updateContact(id: string, updates: Partial<Contact>): boolean {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return false;

    contacts[index] = { ...contacts[index], ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contacts));
    
    window.dispatchEvent(new Event('contactsUpdate'));
    return true;
  }

  deleteContact(id: string): boolean {
    const contacts = this.getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    if (filtered.length === contacts.length) return false;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('contactsUpdate'));
    return true;
  }

  findContactByPhone(phone: string): Contact | null {
    const contacts = this.getContacts();
    return contacts.find(c => c.phone === phone) || null;
  }
}

export const contactsService = new ContactsService();