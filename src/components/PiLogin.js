import React, { useCallback, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { STORAGE_KEYS } from '../utils/constants';

const CryptoJS = require('crypto-js');
const PIN_KEY = 'aegis-pin-key-v1';

export default function PiLogin() {
  const { setAuth, setPIN } = useAppContext();
  const [isPiLoading, setIsPiLoading] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [error, setError] = useState('');
  const [piStatus, setPiStatus] = useState('checking'); // checking, available, unavailable

  // Check Pi SDK availability
  useEffect(() => {
    const checkPiSDK = () => {
      if (window.Pi) {
        setPiStatus('available');
        console.log('✅ Pi SDK detected');
      } else {
        setPiStatus('unavailable');
        console.log('⚠️ Pi SDK not detected - using demo mode');
      }
    };

    checkPiSDK();
    const timer = setTimeout(checkPiSDK, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle Pi Login with proper auth scopes
  const handlePiLogin = useCallback(async () => {
    setIsPiLoading(true);
    setError('');

    try {
      if (window.Pi) {
        console.log('🔄 Attempting Pi authentication...');
        
        const scopes = ['username', 'payments'];
        
        const authResult = await window.Pi.authenticate(scopes, (payment) => {
          console.log('Pi Payment callback:', payment);
        });

        console.log('✅ Pi auth result:', authResult);

        if (authResult && authResult.accessToken) {
          const authData = JSON.stringify({
            username: authResult.user?.username || 'pi_user',
            uid: authResult.user?.uid || 'unknown',
            accessToken: authResult.accessToken,
            timestamp: new Date().toISOString(),
          });
          
          const encrypted = CryptoJS.AES.encrypt(authData, 'aegis-pi-auth-key').toString();
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, encrypted);
          
          setAuth(true);
          setError('');
        } else {
          throw new Error('Authentication failed - no token received');
        }
      } else {
        console.log('⚠️ Pi SDK not available - using demo mode');
        
        const demoData = JSON.stringify({
          username: 'demo_user',
          uid: 'demo_' + Date.now(),
          accessToken: 'demo_token',
          timestamp: new Date().toISOString(),
          isDemo: true,
        });
        
        const encrypted = CryptoJS.AES.encrypt(demoData, 'aegis-pi-auth-key').toString();
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, encrypted);
        
        setAuth(true);
        setError('Demo mode - not connected to Pi Network');
      }
    } catch (err) {
      console.error('❌ Pi auth error:', err);
      setError(err.message || 'Gagal autentikasi. Coba lagi.');
    } finally {
      setIsPiLoading(false);
    }
  }, [setAuth]);

  // Handle PIN setup
  const handlePinSetup = useCallback(() => {
    if (pinValue.length < 4 || pinValue.length > 6) {
      setError('PIN harus 4-6 digit');
      return;
    }
    if (!/^\d+$/.test(pinValue)) {
      setError('PIN hanya boleh angka');
      return;
    }

    try {
      const encryptedPIN = CryptoJS.AES.encrypt(pinValue, PIN_KEY).toString();
      localStorage.setItem(STORAGE_KEYS.USER_PIN, encryptedPIN);
      setPIN(true);
      setShowPinSetup(false);
      setError('');
      
      const demoData = JSON.stringify({
        username: 'pin_user',
        uid: 'pin_' + Date.now(),
        accessToken: 'pin_token',
        timestamp: new Date().toISOString(),
        isDemo: true,
      });
      
      const encrypted = CryptoJS.AES.encrypt(demoData, 'aegis-pi-auth-key').toString();
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, encrypted);
      setAuth(true);
    } catch (e) {
      console.error('PIN setup error:', e);
      setError('Gagal menyimpan PIN');
    }
  }, [pinValue, setPIN, setAuth]);

  if (!showPinSetup) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '32px', background: '#0a0a0f' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '3px solid #00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', marginBottom: '24px', boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)' }}>
          🛡️
        </div>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00ff88', fontSize: '22px', textAlign: 'center', marginBottom: '8px' }}>
          AEGIS GUARDIAN AI
        </h1>
        <p style={{ color: '#8888aa', fontSize: '14px', textAlign: 'center', marginBottom: '8px' }}>On-device AGI Security</p>
        <div style={{ fontSize: '11px', color: piStatus === 'available' ? '#00ff88' : '#ffaa00', marginBottom: '24px', fontFamily: "'JetBrains Mono', monospace" }}>
          {piStatus === 'checking' ? '⏳ Checking Pi SDK...' : piStatus === 'available' ? '✅ Pi Network Ready' : '⚠️ Open in Pi Browser for full features'}
        </div>
        {error && (
          <div style={{ background: 'rgba(255, 51, 85, 0.1)', border: '1px solid rgba(255, 51, 85, 0.3)', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', fontSize: '12px', color: '#ff3355', textAlign: 'center', maxWidth: '280px' }}>
            {error}
          </div>
        )}
        <button onClick={handlePiLogin} disabled={isPiLoading} style={{ background: isPiLoading ? '#333' : '#00ff88', color: '#0a0a0f', border: 'none', borderRadius: '12px', padding: '14px 32px', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '15px', cursor: isPiLoading ? 'not-allowed' : 'pointer', width: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {isPiLoading ? (<>⏳ Menghubungkan...</>) : (<><span>π</span> Connect with Pi</>)}
        </button>
        <button onClick={() => setShowPinSetup(true)} style={{ background: 'transparent', color: '#8888aa', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 24px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', cursor: 'pointer', marginTop: '12px', width: '240px' }}>
          🔐 Set PIN (Offline Mode)
        </button>
        <div style={{ marginTop: '24px', padding: '12px', background: '#12121a', borderRadius: '8px', fontSize: '10px', color: '#666', textAlign: 'center', maxWidth: '280px', lineHeight: '1.5' }}>
          🛡️ Aegis Guardian AI v2.0 • AGI Edition<br />{piStatus === 'available' ? 'Connected to Pi Network' : 'Running in demo mode'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '32px', background: '#0a0a0f' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
      <h2 style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00ff88', fontSize: '18px', marginBottom: '8px' }}>Create Your PIN</h2>
      <p style={{ color: '#8888aa', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>Set 4-6 digit PIN untuk proteksi theft lock</p>
      {error && <p style={{ color: '#ff3355', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
      <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={pinValue} onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))} placeholder="Enter PIN" autoFocus style={{ background: '#12121a', border: '1px solid rgba(0, 255, 136, 0.3)', borderRadius: '8px', padding: '12px 16px', color: '#00ff88', fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', textAlign: 'center', width: '180px', outline: 'none', marginBottom: '16px', letterSpacing: '8px' }} />
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => { setShowPinSetup(false); setError(''); setPinValue(''); }} style={{ background: 'transparent', color: '#8888aa', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 20px', fontFamily: "'Inter', sans-serif", cursor: 'pointer', fontSize: '13px' }}>Back</button>
        <button onClick={handlePinSetup} style={{ background: '#00ff88', color: '#0a0a0f', border: 'none', borderRadius: '8px', padding: '10px 20px', fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Save & Enter</button>
      </div>
    </div>
  );
}
