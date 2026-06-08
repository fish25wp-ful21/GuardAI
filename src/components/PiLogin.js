import React, { useCallback, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { STORAGE_KEYS, APP_NAME } from '../utils/constants';

export default function PiLogin() {
  const { setAuth, setPIN, state } = useAppContext();
  const [isPiLoading, setIsPiLoading] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [error, setError] = useState('');

  const handlePiLogin = useCallback(async () => {
    setIsPiLoading(true);
    setError('');

    try {
      if (window.Pi) {
        const scopes = ['username', 'payments'];
        const authResult = await window.Pi.authenticate(scopes, (payment) => {
          console.log('Payment callback:', payment);
        });

        if (authResult) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(authResult));
          setAuth(true);
        }
      } else {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify({ demo: true, username: 'guardian_user' }));
        setAuth(true);
      }
    } catch (err) {
      setError('Pi authentication failed. Please try again.');
      console.error('Pi auth error:', err);
    } finally {
      setIsPiLoading(false);
    }
  }, [setAuth]);

  const handlePinSetup = useCallback(() => {
    if (pinValue.length < 4 || pinValue.length > 6) {
      setError('PIN must be 4-6 digits');
      return;
    }
    if (!/^\d+$/.test(pinValue)) {
      setError('PIN must contain only numbers');
      return;
    }

    const CryptoJS = require('crypto-js');
    const encryptedPIN = CryptoJS.AES.encrypt(pinValue, 'aegis-pin-key-' + APP_NAME).toString();
    localStorage.setItem(STORAGE_KEYS.USER_PIN, encryptedPIN);
    setPIN(true);
    setShowPinSetup(false);
    setError('');
  }, [pinValue, setPIN]);

  if (!showPinSetup) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '32px',
        background: '#0a0a0f',
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '3px solid #00ff88',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '56px',
          marginBottom: '24px',
          boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)',
        }}>
          🛡️
        </div>
        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: '#00ff88',
          fontSize: '22px',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          AEGIS GUARDIAN AI
        </h1>
        <p style={{ color: '#8888aa', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
          On-device security. Total privacy.
        </p>

        {error && (
          <p style={{ color: '#ff3355', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
        )}

        <button
          onClick={handlePiLogin}
          disabled={isPiLoading}
          style={{
            background: isPiLoading ? '#666' : '#00ff88',
            color: '#0a0a0f',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 32px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            cursor: isPiLoading ? 'not-allowed' : 'pointer',
            width: '220px',
            transition: 'background 0.2s',
          }}
        >
          {isPiLoading ? 'Connecting...' : 'Connect with Pi'}
        </button>

        <button
          onClick={() => setShowPinSetup(true)}
          style={{
            background: 'transparent',
            color: '#8888aa',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px 24px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '13px',
            cursor: 'pointer',
            marginTop: '12px',
            width: '220px',
          }}
        >
          Set Up PIN (Offline Mode)
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '32px',
      background: '#0a0a0f',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
      <h2 style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: '#00ff88',
        fontSize: '18px',
        marginBottom: '8px',
      }}>
        Create Your PIN
      </h2>
      <p style={{ color: '#8888aa', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>
        Set a 4-6 digit PIN for theft lock protection
      </p>

      {error && (
        <p style={{ color: '#ff3355', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
      )}

      <input
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        value={pinValue}
        onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
        placeholder="Enter PIN"
        style={{
          background: '#12121a',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#00ff88',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '20px',
          textAlign: 'center',
          width: '180px',
          outline: 'none',
          marginBottom: '16px',
          letterSpacing: '8px',
        }}
      />

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => { setShowPinSetup(false); setError(''); setPinValue(''); }}
          style={{
            background: 'transparent',
            color: '#8888aa',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '10px 20px',
            fontFamily: "'Inter', sans-serif",
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Back
        </button>
        <button
          onClick={handlePinSetup}
          style={{
            background: '#00ff88',
            color: '#0a0a0f',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Save PIN
        </button>
      </div>
    </div>
  );
}

