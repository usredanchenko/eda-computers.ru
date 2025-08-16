'use client';

import React, { memo, useMemo, useCallback, ReactNode } from 'react';

// Интерфейс для пропсов мемоизированного компонента
interface MemoizedComponentProps {
  children: ReactNode;
  dependencies?: any[];
  shouldUpdate?: (prevProps: any, nextProps: any) => boolean;
}

// Мемоизированный компонент с кастомной логикой обновления
export const MemoizedComponent = memo<MemoizedComponentProps>(
  ({ children }) => children,
  (prevProps, nextProps) => {
    // Если предоставлена кастомная функция сравнения, используем её
    if (nextProps.shouldUpdate) {
      return nextProps.shouldUpdate(prevProps, nextProps);
    }
    
    // По умолчанию сравниваем зависимости
    if (nextProps.dependencies) {
      return nextProps.dependencies.every((dep, index) => 
        prevProps.dependencies?.[index] === dep
      );
    }
    
    // Если нет зависимостей, компонент не обновляется
    return true;
  }
);

MemoizedComponent.displayName = 'MemoizedComponent';

// Хук для создания мемоизированного значения с зависимостями
export function useMemoizedValue<T>(
  factory: () => T,
  dependencies: any[]
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, dependencies);
}

// Хук для создания мемоизированной функции
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, dependencies);
}

// Компонент для условного рендеринга с мемоизацией
interface ConditionalRenderProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export const ConditionalRender = memo<ConditionalRenderProps>(
  ({ condition, children, fallback = null }) => {
    return condition ? <>{children}</> : <>{fallback}</>;
  }
);

ConditionalRender.displayName = 'ConditionalRender';

// Компонент для ленивой загрузки
interface LazyLoadProps {
  children: ReactNode;
  threshold?: number;
  placeholder?: ReactNode;
}

export const LazyLoad = memo<LazyLoadProps>(
  ({ children, threshold = 0.1, placeholder = null }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, [threshold]);

    React.useEffect(() => {
      if (isVisible) {
        // Имитация загрузки
        const timer = setTimeout(() => {
          setHasLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
      }
    }, [isVisible]);

    return (
      <div ref={ref}>
        {hasLoaded ? children : placeholder}
      </div>
    );
  }
);

LazyLoad.displayName = 'LazyLoad';

// Компонент для виртуализации списков
interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor(scrollTop / itemHeight) + visibleCount + overscan
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
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

// Компонент для дебаунсинга
interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export const DebouncedInput = memo<DebouncedInputProps>(
  ({ value, onChange, placeholder, delay = 300, className }) => {
    const [inputValue, setInputValue] = React.useState(value);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, delay);
    }, [onChange, delay]);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
      />
    );
  }
);

DebouncedInput.displayName = 'DebouncedInput';

// Компонент для троттлинга
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = React.useRef(0);
  const lastCallTimer = React.useRef<NodeJS.Timeout>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();

      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      } else {
        if (lastCallTimer.current) {
          clearTimeout(lastCallTimer.current);
        }

        lastCallTimer.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
        }, delay - (now - lastCall.current));
      }
    }) as T,
    [callback, delay]
  );
}
