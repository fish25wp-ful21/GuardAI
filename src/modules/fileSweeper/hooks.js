import { useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../../utils/constants';

export function useFileSweeper() {
  const [results, setResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const scan = useCallback(() => {
    setIsScanning(true);
    setTimeout(() => {
      const allKeys = Object.keys(localStorage);
      const knownKeys = Object.values(STORAGE_KEYS);
      const junk = [];

      allKeys.forEach((key) => {
        if (!knownKeys.includes(key) && !key.startsWith('aegis_')) {
          junk.push({ key, size: localStorage.getItem(key).length });
        }
      });

      setResults({ junk, duplicates: [], corrupted: [], expired: [] });
      setIsScanning(false);
    }, 1000);
  }, []);

  const deleteItem = useCallback((key) => {
    localStorage.removeItem(key);
    scan();
  }, [scan]);

  const deleteAll = useCallback(() => {
    if (results?.junk) {
      results.junk.forEach(item => localStorage.removeItem(item.key));
    }
    setResults(null);
  }, [results]);

  return { scan, results, isScanning, deleteItem, deleteAll };
}

