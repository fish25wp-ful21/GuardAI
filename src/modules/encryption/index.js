import React from 'react';

export default function EncryptionModule() {
  return (
    <div className="fade-in" style={{ padding: '16px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔐</div>
        <h3 style={{ color: '#00ff88', fontSize: '16px' }}>Encryption Active</h3>
        <p style={{ color: '#8888aa', fontSize: '13px' }}>All data is AES-256 encrypted locally inside your device storage.</p>
      </div>
    </div>
  );
}

