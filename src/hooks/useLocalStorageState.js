import { useCallback, useEffect, useState } from 'react';

function readStoredState(key, initialValue) {
  const fallback = typeof initialValue === 'function' ? initialValue() : initialValue;
  if (typeof window === 'undefined') return { value: fallback, error: '' };

  try {
    const storedValue = window.localStorage.getItem(key);
    return {
      value: storedValue === null ? fallback : JSON.parse(storedValue),
      error: '',
    };
  } catch (error) {
    return {
      value: fallback,
      error: `Couldn't read saved ${key}: ${error.message}`,
    };
  }
}

export default function useLocalStorageState(key, initialValue) {
  const [storedState, setStoredState] = useState(() => readStoredState(key, initialValue));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedState.value));
      if (storedState.error) {
        setStoredState((current) => ({ ...current, error: '' }));
      }
    } catch (error) {
      const message = `Couldn't save ${key}: ${error.message}`;
      setStoredState((current) => (
        current.error === message ? current : { ...current, error: message }
      ));
    }
  }, [key, storedState.value, storedState.error]);

  const setValue = useCallback((nextValue) => {
    setStoredState((current) => ({
      value: typeof nextValue === 'function' ? nextValue(current.value) : nextValue,
      error: '',
    }));
  }, []);

  return [storedState.value, setValue, storedState.error];
}
