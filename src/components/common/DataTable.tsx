import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, X } from 'lucide-react';
import { useFilterSort } from '../../hooks/useFilterSort';

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string | number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchFields?: (keyof T)[];
  rowKey: keyof T;
  emptyText?: string;
  className?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchFields,
  rowKey,
  emptyText = '暂无数据',
  className = ''
}: DataTableProps<T>) {
  const {
    filteredData,
    sortConfig,
    searchTerm,
    handleSort,
    setSearch
  } = useFilterSort<T>(
    data,
    undefined,
    undefined
  );

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    return (
      <span className="ml-2 inline-flex flex-col">
        <ChevronUp 
          className={`w-3 h-3 ${
            sortConfig?.key === column.key && sortConfig.direction === 'asc'
              ? 'text-blue-600'
              : 'text-gray-400'
          }`}
        />
        <ChevronDown 
          className={`w-3 h-3 -mt-1 ${
            sortConfig?.key === column.key && sortConfig.direction === 'desc'
              ? 'text-blue-600'
              : 'text-gray-400'
          }`}
        />
      </span>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {searchable && (
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索..."
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value, searchFields || [])}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearch('', [])}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer select-none' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
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
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              filteredData.map((record) => (
                <tr key={String(record[rowKey])} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap">
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
    </div>
  );
}

export default DataTable;