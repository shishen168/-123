import React, { useState, useEffect } from 'react';
import { Bell, Volume2, Monitor } from 'lucide-react';
import { reminderService } from '../../services/reminderService';
import Switch from '../common/Switch';
import Select from '../common/Select';

interface ReminderSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const reminderTimeOptions = [
  { value: '5', label: '5分钟' },
  { value: '15', label: '15分钟' },
  { value: '30', label: '30分钟' },
  { value: '60', label: '1小时' },
  { value: '120', label: '2小时' },
  { value: '1440', label: '1天' }
];

function ReminderSettings({ isOpen, onClose }: ReminderSettingsProps) {
  const [settings, setSettings] = useState(reminderService.getSettings());

  useEffect(() => {
    const handleSettingsUpdate = (event: CustomEvent) => {
      setSettings(event.detail);
    };

    window.addEventListener('reminderSettingsUpdate', handleSettingsUpdate as EventListener);
    return () => {
      window.removeEventListener('reminderSettingsUpdate', handleSettingsUpdate as EventListener);
    };
  }, []);

  const handleChange = (key: string, value: boolean | number) => {
    reminderService.updateSettings({ [key]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">提醒设置</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            关闭
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-gray-500 mr-2" />
              <span className="font-medium">任务提醒</span>
            </div>
            <Switch
              checked={settings.enabled}
              onChange={(checked) => handleChange('enabled', checked)}
            />
          </div>

          {settings.enabled && (
            <>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">提前提醒时间</label>
                <Select
                  value={settings.reminderTime.toString()}
                  onChange={(e) => handleChange('reminderTime', parseInt(e.target.value))}
                  options={reminderTimeOptions}
                  className="w-32"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Volume2 className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">提醒声音</span>
                </div>
                <Switch
                  checked={settings.sound}
                  onChange={(checked) => handleChange('sound', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Monitor className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">桌面通知</span>
                </div>
                <Switch
                  checked={settings.desktop}
                  onChange={(checked) => handleChange('desktop', checked)}
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReminderSettings;