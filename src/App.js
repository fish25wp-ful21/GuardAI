import React, { useState } from 'react';
import { translations } from './utils/languages';
import './App.css'; // Sesuaikan dengan file CSS Anda

function App() {
  // Secara default menggunakan bahasa Indonesia ('id')
  const [lang, setLang] = useState('id');
  const t = translations[lang];

  // Simulasi status error autentikasi seperti di layar
  const [authError, setAuthError] = useState(true); 

  return (
    <div className="app-container">
      {/* Pengalih Bahasa di Pojok Atas */}
      <div className="language-selector" style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
        <button 
          onClick={() => setLang('id')} 
          style={{ fontWeight: lang === 'id' ? 'bold' : 'normal', padding: '5px 10px', cursor: 'pointer' }}
        >
          ID
        </button>
        <button 
          onClick={() => setLang('en')} 
          style={{ fontWeight: lang === 'en' ? 'bold' : 'normal', padding: '5px 10px', cursor: 'pointer' }}
        >
          EN
        </button>
      </div>

      {/* Header Aplikasi */}
      <header className="app-header" style={{ textAlign: 'center', marginTop: '40px' }}>
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </header>

      {/* Kotak Error Autentikasi */}
      {authError && (
        <div className="error-box" style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px', margin: '20px auto', maxWidth: '300px', textAlign: 'center' }}>
          {t.authFailed}
        </div>
      )}

      {/* Tombol Aksi Utama */}
      <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', margin: '20px 0' }}>
        <button className="btn-pi" style={{ padding: '12px 24px', backgroundColor: '#6200ee', color: '#fff', border: 'none', borderRadius: '25px', width: '280px', fontWeight: 'bold' }}>
          {t.loginBtn}
        </button>
        <button className="btn-offline" style={{ padding: '12px 24px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '25px', width: '280px' }}>
          {t.offlineBtn}
        </button>
      </div>

      {/* Daftar Fitur/Pilar Utama */}
      <section className="features-list" style={{ maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
        <div className="feature-item" style={{ marginBottom: '15px' }}>
          <h3>1. {t.zeroDep}</h3>
          <p>{t.zeroDepDesc}</p>
        </div>
        <div className="feature-item" style={{ marginBottom: '15px' }}>
          <h3>2. {t.battery}</h3>
          <p>{t.batteryDesc}</p>
        </div>
        <div className="feature-item" style={{ marginBottom: '15px' }}>
          <h3>3. {t.crypto}</h3>
          <p>{t.cryptoDesc}</p>
        </div>
        <div className="feature-item" style={{ marginBottom: '15px' }}>
          <h3>4. {t.selfHealing}</h3>
          <p>{t.selfHealingDesc}</p>
        </div>
      </section>
    </div>
  );
}

export default App;
