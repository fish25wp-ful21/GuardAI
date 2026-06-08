import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { SECURITY_STATUS } from '../../utils/constants';

export default function Dashboard() {
  const { state } = useAppContext();
  const { securityStatus } = state;

  const statusConfig = useMemo(() => {
    switch (securityStatus) {
      case SECURITY_STATUS.PROTECTED:
        return {
          color: '#00ff88',
          label: 'Protected',
          message: 'All systems secure — Aegis Guardian is active.',
          borderColor: 'rgba(0, 255, 136, 0.3)',
          shadowColor: 'rgba(0, 255, 136, 0.15)',
        };
      case SECURITY_STATUS.WARNING:
        return {
          color: '#ffaa00',
          label: 'Warning',
          message: 'Unusual activity detected — review your modules.',
          borderColor: 'rgba(255, 170, 0, 0.3)',
          shadowColor: 'rgba(255, 170, 0, 0.15)',
        };
      case SECURITY_STATUS.ALERT:
        return {
          color: '#ff3355',
          label: 'Alert',
          message: 'Threat detected — take immediate action.',
          borderColor: 'rgba(255, 51, 85, 0.3)',
          shadowColor: 'rgba(255, 51, 85, 0.15)',
        };
      default:
        return {
          color: '#00ff88',
          label: 'Protected',
          message: 'All systems secure.',
          borderColor: 'rgba(0, 255, 136, 0.3)',
          shadowColor: 'rgba(0, 255, 136, 0.15)',
        };
    }
  }, [securityStatus]);

  const moduleCards = useMemo(() => [
    { icon: '🔬', title: 'Defence', desc: 'Anti-phishing & validation', color: '#4488ff' },
    { icon: '🔒', title: 'Theft Lock', desc: 'Motion-based phone protection', color: '#ffaa00' },
    { icon: '🧹', title: 'File Sweeper', desc: 'Clean junk & duplicates', color: '#00ff88' },
    { icon: '📖', title: 'Learn', desc: 'Security awareness tips', color: '#ff8844' },
  ], []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 16px' }}>
        <div style={{ position: 'relative', width: '180px', height: '180px' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%',
            border: '2px solid', borderColor: statusConfig.borderColor, animation: 'radarSweep 3s linear infinite',
            opacity: 0.3, clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)',
          }} />
          <div style={{
            position: 'absolute', top: '8px', left: '8px', right: '8px', bottom: '8px', borderRadius: '50%',
            border: '2px solid', borderColor: statusConfig.borderColor, animation: 'pulse 2s ease-in-out infinite',
            boxShadow: `0 0 20px ${statusConfig.shadowColor}`,
          }} />
          <div style={{
            position: 'absolute', top: '24px', left: '24px', right: '24px', bottom: '24px', borderRadius: '50%',
            background: `radial-gradient(circle, ${statusConfig.color}11, transparent)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '52px', lineHeight: 1 }}>🛡️</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: statusConfig.color, marginTop: '4px', fontWeight: 600 }}>
              {statusConfig.label}
            </div>
          </div>
        </div>
        <p style={{ color: statusConfig.color, fontSize: '13px', textAlign: 'center', marginTop: '12px', maxWidth: '280px', lineHeight: '1.4' }}>
          {statusConfig.message}
        </p>
      </div>

      <div style={{ padding: '0 4px' }}>
        {moduleCards.map((card) => (
          <div key={card.title} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
              {card.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#e0e0e0' }}>{card.title}</div>
              <div style={{ fontSize: '12px', color: '#8888aa', marginTop: '2px' }}>{card.desc}</div>
            </div>
            <div style={{ color: card.color, fontSize: '16px' }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

