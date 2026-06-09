import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { styles } from './styles';
import { useCallBlocker } from './hooks';

export default function CallBlocker() {
  const { blockedNumbers, blockLog, isMonitoring, toggleMonitoring, logBlockedEvent, setBlockedNumbers, setBlockLog } = useCallBlocker();
  const [newNumber, setNewNumber] = useState('');
  const [blockAllUnknown, setBlockAllUnknown] = useState(true);
  const [activeTab, setActiveTab] = useState('blocklist');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const addNumber = useCallback(() => {
    if (!newNumber.trim()) return;
    let normalized = newNumber.trim().replace(/[\s\-\(\)]/g, '');
    if (normalized.startsWith('0')) normalized = '+62' + normalized.substring(1);

    if (blockedNumbers.some(n => n.number === normalized)) {
      setStatus({ type: 'error', message: 'Nomor sudah ada di daftar blokir!' });
      return;
    }

    const updated = [...blockedNumbers, { id: Date.now(), number: normalized, label: 'MANUAL_SPAM', addedAt: new Date().toISOString(), blocked: 0 }];
    setBlockedNumbers(updated);
    setNewNumber('');
    setStatus({ type: 'success', message: 'Nomor berhasil diblokir!' });
  }, [newNumber, blockedNumbers, setBlockedNumbers]);

  const simulateCall = useCallback(() => {
    const list = ['+628123456789', '+628999998888', '+628571112223'];
    const randomNum = list[Math.floor(Math.random() * list.length)];
    logBlockedEvent(randomNum, 'incoming_call', 'Nomor Tidak Dikenal (Otomatis Ditolak)');
    setStatus({ type: 'error', message: `🔒 Panggilan dari ${randomNum} berhasil diblokir!` });
  }, [logBlockedEvent]);

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={styles.header}>🚫 Call & SMS Blocker</h2>
        <p style={styles.subheader}>Blokir otomatis semua nomor asing tidak dikenal dari sistem Android/iOS lewat Web API</p>
      </div>

      <div style={styles.toggleContainer}>
        <div>
          <div style={styles.toggleLabel}>Blokir Semua Jalur Tidak Dikenal</div>
          <div style={styles.toggleDesc}>Otomatis tolak panggilan & SMS yang kodenya tidak terdaftar di kontak internal.</div>
        </div>
        <button onClick={() => setBlockAllUnknown(!blockAllUnknown)} style={styles.toggleSwitch(blockAllUnknown)}>
          <div style={styles.toggleKnob(blockAllUnknown)} />
        </button>
      </div>

      <button onClick={simulateCall} style={{ width: '100%', padding: '10px', background: '#1a1a2e', border: '1px solid #ff3355', color: '#ff3355', borderRadius: '8px', cursor: 'pointer', marginBottom: '16px' }}>
        ⚡ Simulasikan Blokir Otomatis Nomor Tak Dikenal (Demo Masuk)
      </button>

      <div style={styles.tabBar}>
        {[{ id: 'blocklist', label: 'Daftar Hitam', icon: '📋' }, { id: 'add', label: 'Tambah', icon: '➕' }, { id: 'log', label: 'Log Aktivitas', icon: '📝' }].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={styles.tabButton(activeTab === t.id)}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {activeTab === 'blocklist' && (
        <div>
          {blockedNumbers.length === 0 ? (
            <div style={styles.emptyState}>Daftar blokir kosong. Sistem bekerja penuh pada mode deteksi nomor tidak dikenal.</div>
          ) : (
            blockedNumbers.map(n => (
              <div key={n.id} style={styles.numberCard}>
                <div>
                  <div style={styles.numberText}>{n.number}</div>
                  <div style={styles.numberSubtext}>{n.label}</div>
                </div>
                <button onClick={() => setBlockedNumbers(blockedNumbers.filter(x => x.id !== n.id))} style={{ background: 'none', border: 'none', color: '#ff3355', cursor: 'pointer' }}>✕</button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div style={styles.card}>
          <input value={newNumber} onChange={e => setNewNumber(e.target.value)} placeholder="Masukkan nomor (contoh: 0812xxxx)" style={styles.input} />
          <button onClick={addNumber} style={{ ...styles.btnDanger, width: '100%', marginTop: '12px' }}>Blokir Permanen</button>
        </div>
      )}

      {activeTab === 'log' && (
        <div style={styles.card}>
          <h4 style={{ color: '#4488ff', marginBottom: '12px' }}>Log Penolakan Otomatis</h4>
          {blockLog.length === 0 ? (
            <p style={{ color: '#8888aa', fontSize: '12px' }}>Belum ada log serangan siber panggilan.</p>
          ) : (
            blockLog.map((l, i) => (
              <div key={i} style={styles.logEntry}>
                <span>{l.type === 'incoming_call' ? '📞' : '💬'}</span>
                <div style={{ flex: 1 }}>
                  <div style={styles.logNumber}>{l.number}</div>
                  <div style={{ fontSize: '11px', color: '#8888aa' }}>{l.name}</div>
                </div>
                <div style={styles.logTime}>{new Date(l.timestamp).toLocaleTimeString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

