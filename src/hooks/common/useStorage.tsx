import { useState, useEffect } from 'react';

type StorageType = 'session' | 'local';

interface UseStorageProps<T> {
  key: string;
  initialValue: T;
  type?: StorageType;
}

export const useStorage = <T,>({
  key,
  initialValue,
  type,
}: UseStorageProps<T>): { value: T; setValue: (value: T) => void; resetValue: () => void } => {
  const storage = type === 'session' ? sessionStorage : localStorage;
  const [value, setValue] = useState<T>(() => {
    try {
      const storedData = storage.getItem(key);
      return storedData ? JSON.parse(storedData) : initialValue;
    } catch (error) {
      console.error(`${key} storage set error: ${error}`);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`${key} storage set error: ${error}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  const resetValue = () => {
    storage.removeItem(key);
    setValue(initialValue);
  };
  return { value, setValue, resetValue };
};
