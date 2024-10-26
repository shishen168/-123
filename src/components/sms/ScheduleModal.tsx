import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  currentTime: Date | null;
}

function ScheduleModal({ isOpen, onClose, onConfirm, currentTime }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(currentTime || new Date());

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">安排发送时间</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>选择日期和时间</span>
          </div>

          <DatePicker
            selected={selectedDate}
            onChange={(date: Date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            minDate={new Date()}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleModal;