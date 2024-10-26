import React from 'react';
import { Check, Clock, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'sent' | 'failed' | 'scheduled';
  className?: string;
}

function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'sent':
        return {
          icon: Check,
          text: '已发送',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'failed':
        return {
          icon: AlertTriangle,
          text: '发送失败',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      case 'scheduled':
        return {
          icon: Clock,
          text: '待发送',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${config.bgColor} ${config.textColor} ${className}
    `}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  );
}

export default StatusBadge;