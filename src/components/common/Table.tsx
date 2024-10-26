import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  emptyText?: string;
  className?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  rowKey,
  sortColumn,
  sortDirection,
  onSort,
  emptyText = '暂无数据',
  className = ''
}: TableProps<T>) {
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    return (
      <span className="ml-2 inline-flex flex-col">
        <ChevronUp 
          className={`w-3 h-3 ${
            sortColumn === column.key && sortDirection === 'asc'
              ? 'text-blue-600'
              : 'text-gray-400'
          }`}
        />
        <ChevronDown 
          className={`w-3 h-3 -mt-1 ${
            sortColumn === column.key && sortDirection === 'desc'
              ? 'text-blue-600'
              : 'text-gray-400'
          }`}
        />
      </span>
    );
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4" />
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-100 rounded mb-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer select-none' : ''}
                `}
                style={{ width: column.width }}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center">
                  {column.title}
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record) => (
              <tr key={record[rowKey]} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render
                      ? column.render(record[column.key], record)
                      : record[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;