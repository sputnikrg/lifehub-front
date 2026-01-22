import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Header = ({ user, lang, onLangChange, t }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' }
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header>
      {/* 1. БЕГУЩАЯ СТРОКА */}
      <div className="test-banner">
        <div className="test-banner__text">
          Die Website befindet sich im Testmodus. The site is operating in test mode. Сайт функционирует в тестовом режиме
        </div>
      </div>

      {/* 2. ОСНОВНОЙ КОНТЕНТ ШАПКИ */}
      <div className="header-inner">
        <div className="header-left">
          <Link to="/" className="logo">
            <img src="/assets/img/logo.png" alt="LifeHub" />
          </Link>
        </div>

        <nav className="header-right">
          {/* Языки */}
          <div className="lang-switcher">
            <span
              onClick={() => onLangChange('de')}
              className={lang === 'de' ? 'active' : ''}
            >
              DE
            </span>
            <span className="separator"> | </span>
            <span
              onClick={() => onLangChange('ru')}
              className={lang === 'ru' ? 'active' : ''}
            >
              RU
            </span>
            <span className="separator"> | </span>
            <span
              onClick={() => onLangChange('ua')}
              className={lang === 'ua' ? 'active' : ''}
            >
              UA
            </span>
          </div>

          {/* Кнопки действий */}
          <div className="nav-actions">
            {/* TELEGRAM */}
            <a
              href="https://t.me/lifehub_de"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-telegram"
              title="LifeHub в Telegram"
              aria-label="LifeHub в Telegram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22.05 2.37L1.93 10.23c-1.38.54-1.36 1.31-.25 1.65l5.15 1.61 1.97 6.01c.24.66.12.92.86.92.57 0 .82.26 1.13.56l2.47-2.4 5.14 3.79c.94.52 1.61.25 1.85-.87l3.35-15.8c.35-1.38-.52-1.97-1.45-1.57z" />
              </svg>
            </a>

            <Link to="/favorites" className="btn-fav">
              <span className="icon">❤️</span> {!isMobile && t.nav_favorites}
            </Link>

            {user ? (
              <>
                <Link to="/my-listings" className="btn-my-ads">
                  {isMobile ? '📁' : t.nav_my_ads}
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                  {isMobile ? '🚪' : t.nav_logout}
                </button>
              </>
            ) : (
              <button onClick={handleLogin} className="btn-login">
                {isMobile ? '👤' : t.nav_login}
              </button>
            )}

            <Link to="/post-ad" className="btn-post">
              {isMobile ? '➕' : t.nav_post_ad}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
