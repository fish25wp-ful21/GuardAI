import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useFileSweeper } from './hooks';

export default function FileSweeper() {
  const { state, setSweeperConfig } = useAppContext();
  const { scan, results, isScanning, deleteItem, deleteAll } = useFileSweeper();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = useMemo(() => {
    if (!results) return [];
    if (activeCategory === 'all') {
      return Object.entries(results).flatMap(([cat, items]) => items.map(item => ({ ...item, category: cat })));
    }
    return (results[activeCategory] || []).map(item => ({ ...item, category: activeCategory }));
  }, [results, activeCategory]);

  return (
    <div className="fade-in">
      <h2 style={{ color: '#00ff88', fontSize: '18px', marginBottom: '12px' }}>🧹 File Sweeper</h2>
      <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
        {isScanning ? <p>Scanning localStorage...</p> : results ? (
          <div>
            <p style={{ color: '#00ff88' }}>Scan Complete</p>
            <button onClick={deleteAll} className="btn-danger" style={{ marginTop: '10px' }}>Delete All Junk</button>
          </div>
        ) : <button onClick={scan} className="btn-primary" style={{ width: '100%' }}>Start Storage Scan</button>}
      </div>

      {results && (
        <div style={{ marginTop: '16px' }}>
          {filteredItems.map((item, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontFamily: 'mono' }}>{item.key}</span>
              <button onClick={() => deleteItem(item.key)} style={{ background: 'none', border: 'none', color: '#ff3355', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

