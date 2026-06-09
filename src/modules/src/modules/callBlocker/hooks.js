import { useState, useCallback, useEffect } from 'react';

const CryptoJS = require('crypto-js');
const BLOCKER_KEY = 'aegis-blocker-key-v1';

export function useCallBlocker() {
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [blockLog, setBlockLog] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    try {
      const encrypted = localStorage.getItem('aegis_blocked_numbers');
      if (encrypted) {
        const decrypted = CryptoJS.AES.decrypt(encrypted, BLOCKER_KEY).toString(CryptoJS.enc.Utf8);
        if (decrypted) {
          const data = JSON.parse(decrypted);
          setBlockedNumbers(data.numbers || []);
          setBlockLog(data.log || []);
          setIsMonitoring(data.isMonitoring !== false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const save = useCallback((num, log, mon) => {
    try {
      const cryptoStr = CryptoJS.AES.encrypt(JSON.stringify({ numbers: num, log, isMonitoring: mon }), BLOCKER_KEY).toString();
      localStorage.setItem('aegis_blocked_numbers', cryptoStr);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const logBlockedEvent = useCallback((number, type, name) => {
    const newLog = { id: Date.now(), number, name, type, timestamp: new Date().toISOString() };
    const updatedLog = [newLog, ...blockLog].slice(0, 50);
    setBlockLog(updatedLog);
    save(blockedNumbers, updatedLog, isMonitoring);
  }, [blockLog, blockedNumbers, isMonitoring, save]);

  return {
    blockedNumbers,
    blockLog,
    isMonitoring,
    setBlockedNumbers: (val) => { setBlockedNumbers(val); save(val, blockLog, isMonitoring); },
    setBlockLog: (val) => { setBlockLog(val); save(blockedNumbers, val, isMonitoring); },
    logBlockedEvent,
    toggleMonitoring: () => { const m = !isMonitoring; setIsMonitoring(m); save(blockedNumbers, blockLog, m); }
  };
}
