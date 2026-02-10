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

            {/* Ссылка на Facebook */}
            <a
              href="https://www.facebook.com/groups/facebook.comgroupslifehub.de/" // Замени на свою ссылку
              target="_blank"
              rel="noopener noreferrer"
              className="social-link fb-link"
              title="LifeHub в Facebook"
              style={{ color: '#1877F2', display: 'flex', alignItems: 'center' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

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
