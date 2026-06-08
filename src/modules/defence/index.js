import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { sanitizeInput, validateNotes, validateName } from '../../utils/validation';
import { STORAGE_KEYS } from '../../utils/constants';

const CryptoJS = require('crypto-js');
const ENCRYPTION_KEY = 'aegis-defence-key-v1';

export default function Defence() {
  const [activeTab, setActiveTab] = useState('validator');

  const tabs = useMemo(() => [
    { id: 'validator', label: 'Input Validator', icon: '🔍' },
    { id: 'notes', label: 'Secure Notes', icon: '📝' },
    { id: 'logs', label: 'Security Log', icon: '📋' },
  ], []);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', color: '#4488ff', marginBottom: '4px' }}>🔬 Defence Module</h2>
        <p style={{ color: '#8888aa', fontSize: '12px' }}>Input validation, encrypted notes & security logging</p>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', background: '#12121a', borderRadius: '10px', padding: '4px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, background: activeTab === tab.id ? '#1a1a2e' : 'transparent', border: 'none', borderRadius: '8px',
              padding: '10px 8px', color: activeTab === tab.id ? '#4488ff' : '#8888aa', fontFamily: "'Inter', sans-serif",
              fontSize: '11px', fontWeight: activeTab === tab.id ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            }}
          >
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'validator' && <InputValidator />}
      {activeTab === 'notes' && <SecureNotes />}
      {activeTab === 'logs' && <SecurityLog />}
    </div>
  );
}

function InputValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleValidate = useCallback(() => {
    const sanitized = sanitizeInput(input);
    const nameValid = validateName(sanitized);
    const notesValid = validateNotes(sanitized);

    setResult({
      original: input, sanitized, nameValid, notesValid,
      threatsDetected: input !== sanitized ? ['HTML/script characters removed'] : [],
    });
  }, [input]);

  return (
    <div>
      <div className="card">
        <textarea
          value={input} onChange={(e) => setInput(e.target.value)}
          placeholder='Try pasting: <script>alert("xss")</script>' rows={3}
          style={{ width: '100%', background: '#12121a', border: '1px solid rgba(68, 136, 255, 0.2)', borderRadius: '8px', padding: '12px', color: '#e0e0e0', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', resize: 'none', outline: 'none', marginBottom: '12px' }}
        />
        <button onClick={handleValidate} className="btn-primary" style={{ width: '100%' }}>Validate Input</button>
      </div>

      {result && (
        <div className="card fade-in">
          <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#4488ff' }}>Validation Result</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div><span style={{ color: '#8888aa' }}>Sanitized: </span><span className="mono" style={{ color: '#00ff88' }}>{result.sanitized || '(empty)'}</span></div>
            {result.threatsDetected.length > 0 && (
              <div style={{ marginTop: '6px' }}><span style={{ color: '#ff3355' }}>⚠ Threats neutralized: </span><span style={{ color: '#ffaa00' }}>{result.threatsDetected.join(', ')}</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SecureNotes() {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [showDecrypted, setShowDecrypted] = useState(false);

  const loadNotes = useCallback(() => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (encrypted) {
        const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        if (decrypted) setSavedNotes(JSON.parse(decrypted));
      }
    } catch (e) { console.error(e); }
  }, []);

  React.useEffect(() => { loadNotes(); }, [loadNotes]);

  const saveNote = useCallback(() => {
    const sanitized = sanitizeInput(note);
    if (!sanitized) return;
    const updated = [...savedNotes, { id: Date.now(), text: sanitized, createdAt: new Date().toISOString() }];
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(updated), ENCRYPTION_KEY).toString();
      localStorage.setItem(STORAGE_KEYS.NOTES, encrypted);
      setSavedNotes(updated);
      setNote('');
    } catch (e) { console.error(e); }
  }, [note, savedNotes]);

  return (
    <div>
      <div className="card">
        <textarea
          value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Write a secure note (AES-256 encrypted locally)..." rows={3}
          style={{ width: '100%', background: '#12121a', border: '1px solid rgba(68, 136, 255, 0.2)', borderRadius: '8px', padding: '12px', color: '#e0e0e0', fontSize: '13px', resize: 'none', outline: 'none', marginBottom: '12px' }}
        />
        <button onClick={saveNote} className="btn-primary" style={{ width: '100%' }}>Encrypt & Save Note</button>
      </div>

      {savedNotes.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#4488ff' }}>Saved Notes</h4>
            <button onClick={() => setShowDecrypted(!showDecrypted)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
              {showDecrypted ? '🔒 Hide' : '👁️ Show'}
            </button>
          </div>
          {savedNotes.map((n) => (
            <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
              <div style={{ color: showDecrypted ? '#e0e0e0' : '#00ff88' }}>{showDecrypted ? n.text : '🔒 Encrypted'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SecurityLog() {
  const [logs, setLogs] = useState([]);
  React.useEffect(() => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.SECURITY_LOGS);
      if (encrypted) {
        const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        if (decrypted) setLogs(JSON.parse(decrypted));
      }
    } catch (e) { console.error(e); }
  }, []);

  return (
    <div className="card">
      <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#4488ff' }}>📋 Security Activity Log</h4>
      {logs.length === 0 ? <p style={{ color: '#8888aa', fontSize: '12px' }}>No security events recorded yet.</p> : 
        logs.map((log, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', padding: '6px 0', fontSize: '11px' }}>
            <span style={{ color: '#00ff88' }}>{log.message}</span>
          </div>
        ))
      }
    </div>
  );
}

