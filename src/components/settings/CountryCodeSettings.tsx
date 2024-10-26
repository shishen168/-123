import React, { useState, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import { countryCodeService } from '../../services/countryCodeService';

function CountryCodeSettings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [defaultCode, setDefaultCode] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDefaultCode(countryCodeService.getDefaultCode());
  }, []);

  const handleCodeSelect = (code: string, countryName: string) => {
    const success = countryCodeService.setDefaultCode(code, countryName);
    if (success) {
      setDefaultCode(code);
      setSuccess('默认区号已更新');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('更新默认区号失败');
    }
  };

  const countryCodes = countryCodeService.getAllCodes().filter(
    country => country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               country.code.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">默认区号设置</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索国家或区号..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countryCodes.map((country) => (
          <button
            key={`${country.code}-${country.name}`}
            onClick={() => handleCodeSelect(country.code, country.name)}
            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
              country.code === defaultCode && country.name === countryCodeService.getDefaultCountryName()
                ? 'bg-blue-50 border-blue-200'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{country.flag}</span>
              <div className="text-left">
                <div className="font-medium">{country.name}</div>
                <div className="text-sm text-gray-500">{country.code}</div>
              </div>
            </div>
            {country.code === defaultCode && country.name === countryCodeService.getDefaultCountryName() && (
              <Check className="w-5 h-5 text-blue-600" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">说明</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 设置默认区号后,发送短信时将自动选择该区号</li>
          <li>• 您仍可以在发送短信时临时更改区号</li>
          <li>• 区号设置立即生效</li>
        </ul>
      </div>
    </div>
  );
}

export default CountryCodeSettings;