import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header>
      <div className="logo">
        <Link to="/" className="logo-btn">
          <img src="/assets/img/logo.png" alt="LifeHub Logo" />
        </Link>
      </div>
      <nav className="main-nav">
        <span className="lang">Deutsch | Русский</span>
        <button className="google">Mit Google anmelden</button>
        <Link to="/post-ad">
          <button className={`ad ${path === '/post-ad' ? 'active' : ''}`}>
            Anzeige aufgeben
          </button>
        </Link>
        <Link to="/favorites">
          <button className={`fav-link ${path === '/favorites' ? 'active' : ''}`}>
            ❤ Favoriten
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;