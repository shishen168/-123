import { useState, useMemo } from 'react';

interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

interface FilterConfig<T> {
  key: keyof T;
  value: string | number | boolean;
  type?: 'exact' | 'contains' | 'startsWith' | 'endsWith';
}

export function useFilterSort<T extends Record<string, any>>(
  data: T[],
  initialSort?: SortConfig<T>,
  initialFilters?: FilterConfig<T>[]
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | undefined>(initialSort);
  const [filters, setFilters] = useState<FilterConfig<T>[]>(initialFilters || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFields, setSearchFields] = useState<(keyof T)[]>([]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // 应用过滤器
    if (filters.length > 0) {
      result = result.filter(item => 
        filters.every(filter => {
          const value = item[filter.key];
          const filterValue = filter.value;

          if (filter.type === 'contains') {
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          } else if (filter.type === 'startsWith') {
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          } else if (filter.type === 'endsWith') {
            return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
          }
          return value === filterValue;
        })
      );
    }

    // 应用搜索
    if (searchTerm && searchFields.length > 0) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => 
          String(item[field]).toLowerCase().includes(term)
        )
      );
    }

    // 应用排序
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, filters, sortConfig, searchTerm, searchFields]);

  const handleSort = (key: keyof T) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return undefined;
    });
  };

  const addFilter = (filter: FilterConfig<T>) => {
    setFilters(current => [...current, filter]);
  };

  const removeFilter = (key: keyof T) => {
    setFilters(current => current.filter(f => f.key !== key));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const setSearch = (term: string, fields: (keyof T)[]) => {
    setSearchTerm(term);
    setSearchFields(fields);
  };

  return {
    filteredData,
    sortConfig,
    filters,
    searchTerm,
    handleSort,
    addFilter,
    removeFilter,
    clearFilters,
    setSearch
  };
}