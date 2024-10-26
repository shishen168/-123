import { useState, useEffect, useRef } from 'react';

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now();
      if (now >= lastExecuted.current + interval) {
        setThrottledValue(value);
        lastExecuted.current = now;
      }
    }, interval);

    return () => {
      clearTimeout(handler);
    };
  }, [value, interval]);

  return throttledValue;
}