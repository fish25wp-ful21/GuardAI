import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { STORAGE_KEYS, SENSITIVITY_THRESHOLDS } from '../../utils/constants';

const CryptoJS = require('crypto-js');
const PIN_KEY = 'aegis-pin-key-v1';

export default function TheftModule() {
  const { state, setLocked, setTheftSensitivity } = useAppContext();
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastMovement, setLastMovement] = useState(0);

  const sensitivity = state.theftSensitivity;
  const threshold = SENSITIVITY_THRESHOLDS[sensitivity] || 18;

  useEffect(() => {
    if (!state.isLocked && isMonitoring) {
      const handleMotion = (event) => {
        const { x, y, z } = event.accelerationIncludingGravity || {};
        if (x && y && z) {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          const change = Math.abs(magnitude - lastMovement);
          setLastMovement(magnitude);

          if (change > threshold) {
            setLocked(true);
            setIsMonitoring(false);
          }
        }
      };
      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [isMonitoring, state.isLocked, threshold, lastMovement, setLocked]);

  const startMonitoring = useCallback(() => { setIsMonitoring(true); }, []);
  const stopMonitoring = useCallback(() => { setIsMonitoring(false); }, []);

  const handleUnlock = useCallback(() => {
    setPinError('');
    try {
      const encryptedPIN = localStorage.getItem(STORAGE_KEYS.USER_PIN);
      if (encryptedPIN) {
        const decrypted = CryptoJS.AES.decrypt(encryptedPIN, PIN_KEY).toString(CryptoJS.enc.Utf8);
        if (pinInput === decrypted) {
          setLocked(false);
          setPinInput('');
          setTimeout(() => setIsMonitoring(true), 500);
        } else {
          setPinError('Incorrect PIN');
          setPinInput('');
        }
      }
    } catch (e) { setPinError('Error PIN'); }
  }, [pinInput, setLocked]);

  if (state.isLocked) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', zIndex: 1000 }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#ff3355', fontSize: '18px', marginBottom: '8px' }}>Theft Shield Engaged</h2>
        {pinError && <p style={{ color: '#ff3355', fontSize: '12px' }}>{pinError}</p>}
        <input
          type="password" inputMode="numeric" maxLength={6} value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
          placeholder="PIN" style={{ background: '#12121a', border: '1px solid #ff3355', borderRadius: '8px', padding: '12px', color: '#ff3355', fontSize: '20px', textAlign: 'center', width: '180px', outline: 'none', marginBottom: '16px' }}
        />
        <button onClick={handleUnlock} className="btn-danger">Unlock</button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ color: '#ffaa00', fontSize: '18px' }}>🔒 Theft Lock</h2>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{isMonitoring ? '🛡️' : '🔓'}</div>
        <button onClick={isMonitoring ? stopMonitoring : startMonitoring} className={isMonitoring ? 'btn-danger' : 'btn-primary'} style={{ width: '100%' }}>
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>
    </div>
  );
}

