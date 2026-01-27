import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../translations';

const Footer = ({ t }) => {
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
        <p>© 2026 LifeHub. Alle Rechte vorbehalten.</p>

        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
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
