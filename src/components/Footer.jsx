import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../translations';

const Footer = ({ t }) => {
  const toggleTheme = () => {
    document.body.classList.toggle('theme-dark');
    const isDark = document.body.classList.contains('theme-dark');
    localStorage.setItem('lifehub_theme', isDark ? 'dark' : 'light');
  };

  return (
    <footer
      style={{
        marginTop: '50px',
        padding: '20px 0',
        borderTop: '1px solid #eee',
        textAlign: 'center',
        fontSize: '14px',
        color: '#666'
      }}
    >
      <div className="container">

        {/* ✅ Первая строка: копирайт + тема */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <p style={{ margin: 0 }}>
            © 2026 LifeHub. Alle Rechte vorbehalten.
          </p>

          <button
            onClick={toggleTheme}
            title="Dark mode"
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '20px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#666',
              lineHeight: '1'
            }}
          >
            🌙 / ☀️
          </button>
        </div>

        {/* ✅ Вторая строка: ссылки */}
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px'
          }}
        >

          <Link to="/agb" style={{ color: '#666' }}>AGB</Link>
          <Link to="/impressum" style={{ color: '#666' }}>Impressum</Link>
          <Link to="/datenschutz" style={{ color: '#666' }}>Datenschutz</Link>

          {/* ✅ Consent-Einstellungen */}
          <button
            onClick={() => {
              localStorage.removeItem('lh_consent');
              window.location.reload();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {t.cookie_settings}
          </button>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
