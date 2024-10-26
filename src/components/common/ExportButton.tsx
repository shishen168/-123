import React, { useState } from 'react';
import { Download, FileText, Table } from 'lucide-react';
import BatchExport from './BatchExport';
import ExportHistory from './ExportHistory';

interface ExportButtonProps<T> {
  data: T[];
  columns: { key: keyof T; title: string }[];
  filename?: string;
  className?: string;
}

function ExportButton<T extends Record<string, any>>({
  data,
  columns,
  filename,
  className = ''
}: ExportButtonProps<T>) {
  const [showMenu, setShowMenu] = useState(false);
  const [showBatchExport, setShowBatchExport] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`
          flex items-center px-4 py-2 text-sm font-medium text-gray-700
          bg-white border border-gray-300 rounded-md hover:bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${className}
        `}
      >
        <Download className="w-4 h-4 mr-2" />
        导出
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                setShowMenu(false);
                setShowBatchExport(true);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Table className="w-4 h-4 mr-2" />
              批量导出
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                setShowHistory(true);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileText className="w-4 h-4 mr-2" />
              导出历史
            </button>
          </div>
        </div>
      )}

      {showBatchExport && (
        <BatchExport
          isOpen={showBatchExport}
          onClose={() => setShowBatchExport(false)}
          data={data}
          columns={columns}
          filename={filename}
        />
      )}

      {showHistory && (
        <ExportHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default ExportButton;