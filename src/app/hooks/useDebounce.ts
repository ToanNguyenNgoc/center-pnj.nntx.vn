import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 800) {
  const [debouncedValue, setDebouncedValue] = useState(JSON.stringify(value));

  useEffect(() => {
    let timer: any
    timer = setTimeout(() => {
      setDebouncedValue(JSON.stringify(value));
    }, delay);
    return () => clearTimeout(timer)
  });

  return JSON.parse(debouncedValue);
};
