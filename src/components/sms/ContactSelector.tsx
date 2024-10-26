import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { Contact } from '../../types';

interface ContactSelectorProps {
  contacts: Contact[];
  selectedContacts: Contact[];
  onSelect: (contacts: Contact[]) => void;
  onClose: () => void;
}

function ContactSelector({ contacts, selectedContacts, onSelect, onClose }: ContactSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedContacts.map(c => c.id))
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleToggleContact = (contact: Contact) => {
    const newSelected = new Set(selected);
    if (newSelected.has(contact.id)) {
      newSelected.delete(contact.id);
    } else {
      newSelected.add(contact.id);
    }
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    const selectedContactsList = contacts.filter(c => selected.has(c.id));
    onSelect(selectedContactsList);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">选择联系人</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索联系人..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>

        <div className="max-h-96 overflow-y-auto mb-4">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              未找到匹配的联系人
            </div>
          ) : (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => handleToggleContact(contact)}
                className={`flex items-center justify-between p-3 cursor-pointer rounded-lg ${
                  selected.has(contact.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <h4 className="font-medium">{contact.name}</h4>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                  {contact.group && (
                    <span className="text-xs text-gray-400">
                      分组: {contact.group}
                    </span>
                  )}
                </div>
                {selected.has(contact.id) && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            确认 ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactSelector;