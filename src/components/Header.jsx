import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Header = ({ user }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Следим за размером экрана для адаптивности
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) console.error("Ошибка авторизации:", error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Ошибка при выходе:", error.message);
  };

  return (
    <header style={{ 
      padding: isMobile ? '10px' : '10px 20px', 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', // На мобилках логотип будет сверху
      justifyContent: 'space-between', 
      alignItems: 'center', 
      background: '#fff', 
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      gap: isMobile ? '10px' : '0'
    }}>
      <Link to="/" className="logo">
        <img src="/assets/img/logo.png" alt="LifeHub" style={{ height: isMobile ? '35px' : '40px' }} />
      </Link>

      <nav style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? '8px' : '15px',
        flexWrap: 'wrap', // Разрешаем перенос кнопок на мобилках
        justifyContent: 'center'
      }}>
        {!isMobile && <span style={{ fontSize: '14px', color: '#666', marginRight: '5px' }}>DE | RU</span>}

        {/* Кнопка Избранное */}
        <Link to="/favorites" style={{ textDecoration: 'none' }}>
          <button style={{ 
            background: '#fff', 
            border: '1px solid #dee2e6', 
            padding: isMobile ? '6px 10px' : '8px 15px', 
            borderRadius: '20px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: isMobile ? '12px' : '14px'
          }}>
            ❤️ <span style={{ color: '#333', fontWeight: '500' }}>{isMobile ? '' : 'Favoriten'}</span>
          </button>
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '15px' }}>
            {/* Кнопка Мои объявления */}
            <Link to="/my-listings">
              <button style={{ 
                background: '#e74c3c', 
                color: 'white', 
                padding: isMobile ? '8px 12px' : '10px 18px', 
                borderRadius: '8px', 
                border: 'none', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                fontSize: isMobile ? '12px' : '14px'
              }}>
                {isMobile ? 'Meine' : 'Meine Anzeigen'}
              </button>
            </Link>

            {/* Блок пользователя */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {!isMobile && <span style={{ fontSize: '11px', color: '#888' }}>{user.email}</span>}
              <button onClick={handleLogout} style={{ 
                background: '#f1f3f5', 
                border: 'none', 
                color: '#495057', 
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer', 
                fontSize: '11px'
              }}>
                {isMobile ? 'Exit' : 'Abmelden'}
              </button>
            </div>
          </div>
        ) : (
          <button className="google" onClick={handleLogin} style={{ padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px' }}>
            {isMobile ? 'Google' : 'Mit Google anmelden'}
          </button>
        )}

        {/* Кнопка подать объявление */}
        <Link to="/post-ad">
          <button className="ad" style={{ 
            background: 'linear-gradient(135deg, #3498db, #2980b9)', 
            color: 'white', 
            padding: isMobile ? '8px 12px' : '10px 18px', 
            borderRadius: '8px', 
            border: 'none', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: isMobile ? '12px' : '14px'
          }}>
            {isMobile ? '+' : 'Anzeige на русском'}
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;