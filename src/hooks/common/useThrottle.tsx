import { useEffect, useRef, useState } from 'react';

export const useThrottle = <T,>(value: T, delay: number = 1000): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  const lastExecuted = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    if (lastExecuted.current === null || now >= lastExecuted.current + delay) {
      lastExecuted.current = now;
      const timerId = setTimeout(() => {
        setThrottledValue(value);
      }, 0);
      return () => clearTimeout(timerId);
    } else {
      const remainingTime = delay - (now - lastExecuted.current);
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, remainingTime);
      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  return throttledValue;
};
