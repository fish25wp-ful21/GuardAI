import React, { useState, useMemo, Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import { NAV_TABS } from './utils/constants';

const WalletModule = lazy(() => import('./modules/wallet/index'));
const CallBlocker = lazy(() => import('./modules/callBlocker/index'));

function AppContent() {
  const [activeTab, setActiveTab] = useState('wallet');

  const content = useMemo(() => {
    if (activeTab === 'wallet') return <WalletModule />;
    if (activeTab === 'blocker') return <CallBlocker />;
    return <WalletModule />;
  }, [activeTab]);

  return (
    <div style={{ background: '#0a0a12', minHeight: '100vh', color: '#e0e0e0', paddingBottom: '70px', fontFamily: "'Inter', sans-serif" }}>
      <Suspense fallback={<div style={{ color: '#00ff88', padding: '20px', textAlign: 'center' }}>Loading Aegis System...</div>}>
        {content}
      </Suspense>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', background: '#12121a', display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 1000 }}>
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: activeTab === tab.id ? '#00ff88' : '#8888aa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            <span style={{ fontSize: '10px' }}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
