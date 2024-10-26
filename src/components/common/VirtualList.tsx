import React, { useEffect, useRef, useState } from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  onEndReached,
  endReachedThreshold = 0.8
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(height / itemHeight);
  const bufferCount = Math.ceil(visibleCount / 2);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const newScrollTop = containerRef.current.scrollTop;
      setScrollTop(newScrollTop);

      // 检查是否到达底部
      if (onEndReached) {
        const scrollHeight = containerRef.current.scrollHeight;
        const clientHeight = containerRef.current.clientHeight;
        const scrollPosition = newScrollTop + clientHeight;
        const threshold = scrollHeight * endReachedThreshold;

        if (scrollPosition >= threshold) {
          onEndReached();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onEndReached, endReachedThreshold]);

  useEffect(() => {
    const newStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferCount);
    const endIndex = Math.min(items.length, newStartIndex + visibleCount + 2 * bufferCount);
    
    setStartIndex(newStartIndex);
    setVisibleItems(items.slice(newStartIndex, endIndex));
  }, [scrollTop, items, itemHeight, visibleCount, bufferCount]);

  return (
    <div
      ref={containerRef}
      style={{ height, overflow: 'auto' }}
      className="relative"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${startIndex * itemHeight}px)`
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;