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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: window.location.origin,
        // Добавили выбор аккаунта здесь:
        queryParams: { prompt: 'select_account' }
      }
    });
    if (error) console.error("Ошибка авторизации:", error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header style={{ 
      padding: '10px 15px', 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      background: '#fff', 
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      gap: isMobile ? '12px' : '0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" className="logo">
        <img src="/assets/img/logo.png" alt="LifeHub" style={{ height: isMobile ? '35px' : '40px' }} />
      </Link>

      <nav style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? '10px' : '15px',
        justifyContent: 'center',
        width: isMobile ? '100%' : 'auto'
      }}>
        
        {/* Переключатель языков */}
        <div style={{ fontSize: '14px', cursor: 'pointer', display: 'flex', gap: '4px' }}>
          <span onClick={() => onLangChange('de')} style={{ fontWeight: lang === 'de' ? 'bold' : '400', color: lang === 'de' ? '#3498db' : '#888' }}>DE</span>
          <span style={{ color: '#ccc' }}>|</span>
          <span onClick={() => onLangChange('ru')} style={{ fontWeight: lang === 'ru' ? 'bold' : '400', color: lang === 'ru' ? '#3498db' : '#888' }}>RU</span>
        </div>

        <Link to="/favorites" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#fff', border: '1px solid #dee2e6', padding: '8px 12px', borderRadius: '20px', cursor: 'pointer' }}>
            ❤️ {!isMobile && t.nav_favorites}
          </button>
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '15px' }}>
            <Link to="/my-listings">
              <button style={{ background: '#e74c3c', color: 'white', padding: '8px 14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                {isMobile ? '📁' : t.nav_my_ads}
              </button>
            </Link>
            
            <button onClick={handleLogout} style={{ background: '#f1f3f5', border: 'none', color: '#495057', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
              {isMobile ? '🚪' : t.nav_logout}
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} style={{ padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
            {isMobile ? '👤' : t.nav_login}
          </button>
        )}

        <Link to="/post-ad">
          <button style={{ background: 'linear-gradient(135deg, #3498db, #2980b9)', color: 'white', padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {isMobile ? '➕' : t.nav_post_ad}
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;