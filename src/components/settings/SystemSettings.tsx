import React, { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Download, Upload, Bell, Keyboard } from 'lucide-react';
import { settingsService, SystemSettings } from '../../services/settingsService';
import ThemeSettings from './ThemeSettings';
import ShortcutSettings from './ShortcutSettings';
import NotificationSettings from './NotificationSettings';
import BackupSettings from './BackupSettings';

function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(settingsService.getSettings());
  const [activeTab, setActiveTab] = useState<'theme' | 'shortcuts' | 'notifications' | 'backup'>('theme');

  useEffect(() => {
    const handleSettingsUpdate = (event: CustomEvent<SystemSettings>) => {
      setSettings(event.detail);
    };

    window.addEventListener('settingsUpdate', handleSettingsUpdate as EventListener);
    return () => {
      window.removeEventListener('settingsUpdate', handleSettingsUpdate as EventListener);
    };
  }, []);

  const tabs = [
    { id: 'theme', label: '主题设置', icon: settings.theme.mode === 'dark' ? Moon : Sun },
    { id: 'shortcuts', label: '快捷键', icon: Keyboard },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'backup', label: '备份还原', icon: Download }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 text-gray-500 mr-2" />
        <h2 className="text-xl font-semibold">系统设置</h2>
      </div>

      <div className="flex space-x-6">
        {/* 左侧标签页 */}
        <div className="w-48 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                w-full flex items-center px-4 py-2 rounded-lg text-sm
                ${activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 border-l pl-6">
          {activeTab === 'theme' && (
            <ThemeSettings
              theme={settings.theme}
              onUpdate={(theme) => settingsService.setTheme(theme)}
            />
          )}
          
          {activeTab === 'shortcuts' && (
            <ShortcutSettings
              shortcuts={settings.shortcuts}
              onUpdate={(action, shortcut) => settingsService.updateShortcut(action, shortcut)}
            />
          )}
          
          {activeTab === 'notifications' && (
            <NotificationSettings
              settings={settings.notifications}
              onUpdate={(updates) => settingsService.updateSettings({ notifications: updates })}
            />
          )}
          
          {activeTab === 'backup' && (
            <BackupSettings
              settings={settings.backup}
              onUpdate={(updates) => settingsService.updateSettings({ backup: updates })}
              onCreateBackup={() => settingsService.createBackup()}
              onRestoreBackup={(file) => settingsService.restoreBackup(file)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;