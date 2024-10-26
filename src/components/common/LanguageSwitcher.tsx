import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' }
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
        <Globe className="w-5 h-5" />
        <span>{languages.find(lang => lang.code === i18n.language)?.name}</span>
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`
              block w-full text-left px-4 py-2 text-sm
              ${i18n.language === lang.code ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}
            `}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;