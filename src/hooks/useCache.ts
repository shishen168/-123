import { useState, useEffect } from 'react';
import { cache } from '../utils/cache';

export function useCache<T>(key: string, fetcher: () => Promise<T>, ttl?: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get from cache first
        const cachedData = cache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          return;
        }

        // If not in cache, fetch new data
        const newData = await fetcher();
        cache.set(key, newData, ttl);
        setData(newData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, ttl]);

  return { data, loading, error };
}