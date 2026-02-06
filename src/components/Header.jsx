import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';


const Header = ({ user, lang, onLangChange, t, onOpenAddModal }) => {
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
          Die Website befindet sich im Testmodus. Сайт функционирует в тестовом режиме. Сайт функціонує у тестовому режимі.
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
          <LanguageSwitcher lang={lang} onLangChange={onLangChange} />

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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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

            {/* КНОПКА + (теперь открывает модал) */}
            <button
              className="btn-post"
              onClick={() => onOpenAddModal && onOpenAddModal()}
            >
              {isMobile ? '➕' : t.nav_post_ad}
            </button>

          </div>
        </nav>
      </div>

    </header>
  );
};

export default Header;
