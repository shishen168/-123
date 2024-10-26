import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { Theme } from '../../types';
import Switch from '../common/Switch';

interface ThemeSettingsProps {
  theme: Theme;
  onUpdate: (theme: Theme) => void;
}

function ThemeSettings({ theme, onUpdate }: ThemeSettingsProps) {
  const colors = [
    { name: '蓝色', value: '#2563eb' },
    { name: '紫色', value: '#7c3aed' },
    { name: '绿色', value: '#059669' },
    { name: '红色', value: '#dc2626' },
    { name: '橙色', value: '#ea580c' },
    { name: '粉色', value: '#db2777' }
  ];

  const fontSizes = [
    { label: '小', value: 12 },
    { label: '默认', value: 14 },
    { label: '中', value: 16 },
    { label: '大', value: 18 }
  ];

  return (
    <div className="space-y-6">
      {/* 深色模式切换 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {theme.mode === 'dark' ? (
            <Moon className="w-5 h-5 text-gray-500 mr-2" />
          ) : (
            <Sun className="w-5 h-5 text-gray-500 mr-2" />
          )}
          <span className="font-medium">深色模式</span>
        </div>
        <Switch
          checked={theme.mode === 'dark'}
          onChange={(checked) => onUpdate({
            ...theme,
            mode: checked ? 'dark' : 'light'
          })}
        />
      </div>

      {/* 主题色选择 */}
      <div>
        <div className="flex items-center mb-4">
          <Palette className="w-5 h-5 text-gray-500 mr-2" />
          <span className="font-medium">主题色</span>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {colors.map(color => (
            <button
              key={color.value}
              onClick={() => onUpdate({
                ...theme,
                primaryColor: color.value
              })}
              className={`
                w-full aspect-square rounded-lg border-2 transition-all
                ${theme.primaryColor === color.value
                  ? 'border-blue-600 scale-110 shadow-lg'
                  : 'border-transparent hover:scale-105'
                }
              `}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* 字体大小设置 */}
      <div>
        <div className="flex items-center mb-4">
          <span className="font-medium">字体大小</span>
        </div>
        <div className="flex space-x-3">
          {fontSizes.map(size => (
            <button
              key={size.value}
              onClick={() => onUpdate({
                ...theme,
                fontSize: size.value
              })}
              className={`
                px-4 py-2 rounded-md transition-colors
                ${theme.fontSize === size.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* 预览区域 */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">预览效果</h3>
        <div 
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: theme.mode === 'dark' ? '#1f2937' : 'white',
            color: theme.mode === 'dark' ? 'white' : 'black'
          }}
        >
          <h4 className="text-lg font-medium mb-2">示例标题</h4>
          <p className="text-sm" style={{ fontSize: `${theme.fontSize}px` }}>
            这是一段示例文本，用于预览主题效果。
          </p>
          <button
            className="mt-4 px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: theme.primaryColor }}
          >
            示例按钮
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeSettings;