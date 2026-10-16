import { useState } from 'react';

export function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback));

  const updateValue = (nextValue: T) => {
    setValue(nextValue);
    localStorage.setItem(key, JSON.stringify(nextValue));
  };

  return [value, updateValue] as const;
}