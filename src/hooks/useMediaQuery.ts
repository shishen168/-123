import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 添加监听器
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
    } else {
      mediaQuery.addEventListener('change', handler);
    }

    // 清理监听器
    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handler);
      } else {
        mediaQuery.removeEventListener('change', handler);
      }
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;