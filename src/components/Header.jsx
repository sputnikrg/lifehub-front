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
          Die Website befindet sich im Testmodus. The site is operating in test mode. Сайт функционирует в тестовом режиме.
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
              style={{ fontWeight: lang === 'de' ? '700' : '400', cursor: 'pointer' }}
            >
              DE
            </span>
            <span className="separator"> | </span>
            <span
              onClick={() => onLangChange('ru')}
              className={lang === 'ru' ? 'active' : ''}
              style={{ fontWeight: lang === 'ru' ? '700' : '400', cursor: 'pointer' }}
            >
              RU
            </span>
          </div>

          {/* Кнопки действий */}
          <div className="nav-actions">
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