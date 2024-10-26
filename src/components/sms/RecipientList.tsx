import React, { memo } from 'react';
import { Phone, X } from 'lucide-react';
import { phoneRules } from '../../utils/phoneRules';

interface RecipientListProps {
  recipients: string[];
  onRemove: (recipient: string) => void;
  getCarrierInfo: (number: string) => { carrier: string } | null;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  onAddRecipient: () => void;
}

const RecipientList = memo(({
  recipients,
  onRemove,
  getCarrierInfo,
  countryCode,
  onCountryCodeChange,
  phoneNumber,
  onPhoneNumberChange,
  onAddRecipient
}: RecipientListProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50 min-h-[100px]">
      {recipients.map(recipient => {
        const carrierInfo = getCarrierInfo(recipient);
        return (
          <div 
            key={recipient}
            className="flex items-center bg-white px-3 py-1 rounded-full border shadow-sm hover:shadow-md transition-shadow"
          >
            <Phone className="w-4 h-4 text-gray-500 mr-2" />
            <span>{recipient}</span>
            {carrierInfo && (
              <span className="ml-2 text-xs text-gray-500">
                ({carrierInfo.carrier})
              </span>
            )}
            <button
              type="button"
              onClick={() => onRemove(recipient)}
              className="ml-2 text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
      <div className="flex">
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          className="w-24 p-2 border-r bg-transparent outline-none"
        >
          {Object.entries(phoneRules).map(([code, rules]) => (
            <option key={code} value={code}>
              {code} {rules.countryName}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddRecipient())}
          placeholder="输入手机号码"
          className="flex-1 min-w-[200px] p-2 outline-none bg-transparent"
        />
      </div>
    </div>
  );
});

RecipientList.displayName = 'RecipientList';

export default RecipientList;