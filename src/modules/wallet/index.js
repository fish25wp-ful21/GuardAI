import React, { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const CryptoJS = require('crypto-js');
const WALLET_KEY = 'aegis-wallet-key-v1';

export default function WalletModule() {
  const { state } = useAppContext();
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMemo, setPaymentMemo] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [activeTab, setActiveTab] = useState('wallet');

  // Load saved wallet data
  useEffect(() => {
    try {
      const encrypted = localStorage.getItem('aegis_wallet_data');
      if (encrypted) {
        const decrypted = CryptoJS.AES.decrypt(encrypted, WALLET_KEY).toString(CryptoJS.enc.Utf8);
        if (decrypted) {
          const data = JSON.parse(decrypted);
          setWalletAddress(data.address || '');
          setPaymentHistory(data.history || []);
        }
      }
    } catch (e) {
      console.error('Wallet load error:', e);
    }
  }, []);

  // Save wallet data
  const saveWalletData = useCallback((address, history) => {
    try {
      const data = JSON.stringify({ address, history });
      const encrypted = CryptoJS.AES.encrypt(data, WALLET_KEY).toString();
      localStorage.setItem('aegis_wallet_data', encrypted);
    } catch (e) {
      console.error('Wallet save error:', e);
    }
  }, []);

  // Connect Pi Wallet
  const connectWallet = useCallback(async () => {
    if (!window.Pi) {
      setStatus({ type: 'error', message: 'Pi SDK tidak tersedia. Pastikan Anda membuka melalui Pi Browser.' });
      return;
    }

    setIsConnecting(true);
    setStatus({ type: '', message: '' });

    try {
      const authResult = await window.Pi.authenticate(['username', 'payments'], (payment) => {
        console.log('Payment callback:', payment);
        handlePaymentComplete(payment);
      });

      if (authResult) {
        const address = authResult.user?.wallet_address || prompt('Masukkan alamat wallet Pi Anda:');
        if (address) {
          setWalletAddress(address);
          saveWalletData(address, paymentHistory);
          setStatus({ type: 'success', message: 'Wallet berhasil terhubung!' });
        }
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setStatus({ type: 'error', message: 'Gagal menghubungkan wallet. Coba lagi.' });
    } finally {
      setIsConnecting(false);
    }
  }, [paymentHistory, saveWalletData]);

  // Disconnect Wallet
  const disconnectWallet = useCallback(() => {
    setWalletAddress('');
    setBalance(null);
    localStorage.removeItem('aegis_wallet_data');
    setStatus({ type: 'info', message: 'Wallet terputus.' });
  }, []);

  // Handle payment completion
  const handlePaymentComplete = useCallback((payment) => {
    const newPayment = {
      id: payment.identifier,
      amount: payment.amount,
      memo: payment.memo,
      from: payment.from,
      to: payment.to,
      status: payment.status,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [newPayment, ...paymentHistory];
    setPaymentHistory(updatedHistory);
    saveWalletData(walletAddress, updatedHistory);
  }, [paymentHistory, walletAddress, saveWalletData]);

  // Send Pi Payment
  const sendPayment = useCallback(async () => {
    if (!window.Pi) {
      setStatus({ type: 'error', message: 'Pi SDK tidak tersedia.' });
      return;
    }

    if (!sendAddress || !paymentAmount) {
      setStatus({ type: 'error', message: 'Alamat dan jumlah harus diisi.' });
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setStatus({ type: 'error', message: 'Jumlah tidak valid.' });
      return;
    }

    setIsSending(true);
    setStatus({ type: '', message: '' });

    try {
      const payment = await window.Pi.createPayment({
        amount: amount,
        memo: paymentMemo || 'Aegis Guardian Payment',
        metadata: { app: 'Aegis Guardian AI' },
      }, {
        onReadyForServerApproval: (paymentId) => {
          console.log('Ready for approval:', paymentId);
        },
        onReadyForServerCompletion: (paymentId) => {
          console.log('Ready for completion:', paymentId);
        },
        onCancel: (paymentId) => {
          console.log('Payment cancelled:', paymentId);
          setStatus({ type: 'info', message: 'Pembayaran dibatalkan.' });
        },
        onError: (error) => {
          console.error('Payment error:', error);
          setStatus({ type: 'error', message: 'Gagal memproses pembayaran.' });
        },
      });

      if (payment) {
        handlePaymentComplete(payment);
        setStatus({ type: 'success', message: `Berhasil mengirim ${amount} π!` });
        setPaymentAmount('');
        setPaymentMemo('');
        setSendAddress('');
      }
    } catch (err) {
      console.error('Send payment error:', err);
      setStatus({ type: 'error', message: 'Gagal mengirim pembayaran.' });
    } finally {
      setIsSending(false);
    }
  }, [sendAddress, paymentAmount, paymentMemo, handlePaymentComplete]);

  // Check Balance Simulation
  const checkBalance = useCallback(() => {
    setStatus({ type: 'info', message: 'Gunakan Pi Browser resmi untuk melihat saldo utama Anda.' });
    setBalance(null);
  }, []);

  return (
    <div className="fade-in" style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', color: '#4488ff', marginBottom: '4px' }}>
          💰 Pi Wallet
        </h2>
        <p style={{ color: '#8888aa', fontSize: '12px' }}>Hubungkan wallet Pi Anda untuk langkah checklist ke-10</p>
      </div>

      {status.message && (
        <div className={`card ${status.type === 'error' ? 'card-red' : status.type === 'success' ? 'card-green' : ''}`} style={{ padding: '12px 16px', marginBottom: '12px', fontSize: '13px' }}>
          <span>{status.type === 'error' ? '⚠️ ' : status.type === 'success' ? '✅ ' : 'ℹ️ '}{status.message}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', background: '#12121a', borderRadius: '10px', padding: '4px' }}>
        {[{ id: 'wallet', label: 'Wallet', icon: '💳' }, { id: 'send', label: 'Kirim', icon: '📤' }, { id: 'history', label: 'Riwayat', icon: '📋' }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, background: activeTab === tab.id ? '#1a1a2e' : 'transparent', border: 'none', borderRadius: '8px', padding: '10px 8px', color: activeTab === tab.id ? '#4488ff' : '#8888aa', fontSize: '11px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'wallet' && (
        <div>
          <div className="card" style={{ textAlign: 'center', padding: '24px', background: 'rgba(26,26,46,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{walletAddress ? '💳' : '🔗'}</div>
            {walletAddress ? (
              <>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#00ff88', background: '#12121a', borderRadius: '8px', padding: '10px', marginBottom: '12px', wordBreak: 'break-all' }}>{walletAddress}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={checkBalance} className="btn-secondary" style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Cek Saldo</button>
                  <button onClick={disconnectWallet} className="btn-danger" style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#ff3355', color: 'white', border: 'none', cursor: 'pointer' }}>Putuskan</button>
                </div>
              </>
            ) : (
              <>
                <p style={{ color: '#8888aa', fontSize: '13px', marginBottom: '16px' }}>Hubungkan dompet Pi Network Anda untuk memproses integrasi pembayaran Sandbox / Mainnet.</p>
                <button onClick={connectWallet} disabled={isConnecting} style={{ width: '100%', padding: '12px', background: '#4488ff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isConnecting ? 'Menghubungkan...' : 'Hubungkan Wallet Pi'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'send' && (
        <div className="card" style={{ padding: '16px', background: 'rgba(26,26,46,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#8888aa', display: 'block', marginBottom: '4px' }}>Alamat Tujuan</label>
            <input value={sendAddress} onChange={(e) => setSendAddress(e.target.value)} placeholder="G..." style={{ width: '100%', background: '#12121a', border: '1px solid rgba(68,136,255,0.2)', borderRadius: '8px', padding: '12px', color: 'white' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#8888aa', display: 'block', marginBottom: '4px' }}>Jumlah (π)</label>
            <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', background: '#12121a', border: '1px solid rgba(68,136,255,0.2)', borderRadius: '8px', padding: '12px', color: '#00ff88', fontSize: '18px', textAlign: 'center' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#8888aa', display: 'block', marginBottom: '4px' }}>Catatan</label>
            <input value={paymentMemo} onChange={(e) => setPaymentMemo(e.target.value)} placeholder="Contoh: Pembayaran Akses Premium" style={{ width: '100%', background: '#12121a', border: '1px solid rgba(68,136,255,0.2)', borderRadius: '8px', padding: '12px', color: 'white' }} />
          </div>
          <button onClick={sendPayment} disabled={isSending || !walletAddress} style={{ width: '100%', padding: '12px', background: '#00ff88', color: '#12121a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: walletAddress ? 1 : 0.5 }}>
            {isSending ? 'Memproses Transaksi...' : 'Kirim Transaksi π'}
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card" style={{ padding: '16px', background: 'rgba(26,26,46,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ fontSize: '13px', color: '#4488ff', marginBottom: '12px' }}>Riwayat Transaksi Lokal</h4>
          {paymentHistory.length === 0 ? (
            <p style={{ color: '#8888aa', fontSize: '12px', textAlign: 'center' }}>Belum ada rekaman transaksi.</p>
          ) : (
            paymentHistory.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'white' }}>{item.memo}</div>
                  <div style={{ fontSize: '10px', color: '#8888aa' }}>{new Date(item.timestamp).toLocaleDateString()}</div>
                </div>
                <div style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '13px' }}>{item.amount} π</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

