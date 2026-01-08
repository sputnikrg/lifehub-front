import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Header = ({ user }) => {
  const location = useLocation();

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
    <header style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <Link to="/" className="logo">
        <img src="/assets/img/logo.png" alt="LifeHub" style={{ height: '40px' }} />
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontSize: '14px', color: '#666', marginRight: '5px' }}>Deutsch | Русский</span>

        {/* Красивая кнопка Избранное */}
        <Link to="/favorites" style={{ textDecoration: 'none' }}>
          <button style={{ 
            background: '#fff', 
            border: '1px solid #dee2e6', 
            padding: '8px 15px', 
            borderRadius: '20px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <span style={{ color: '#e74c3c' }}>❤️</span>
            <span style={{ color: '#333', fontWeight: '500' }}>Favoriten</span>
          </button>
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Кнопка Мои объявления */}
            <Link to="/my-listings">
              <button style={{ 
                background: '#e74c3c', 
                color: 'white', 
                padding: '10px 18px', 
                borderRadius: '8px', 
                border: 'none', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }}>
                Meine Anzeigen
              </button>
            </Link>

            {/* Блок пользователя (вертикальная центровка) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
              <span style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>{user.email}</span>
              <button onClick={handleLogout} style={{ 
                background: '#f1f3f5', 
                border: 'none', 
                color: '#495057', 
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer', 
                fontSize: '11px',
                fontWeight: '600'
              }}>
                Abmelden
              </button>
            </div>
          </div>
        ) : (
          <button className="google" onClick={handleLogin} style={{ padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
            Mit Google anmelden
          </button>
        )}

        <Link to="/post-ad">
          <button className="ad" style={{ 
            background: 'linear-gradient(135deg, #3498db, #2980b9)', 
            color: 'white', 
            padding: '10px 18px', 
            borderRadius: '8px', 
            border: 'none', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(52,152,219,0.3)'
          }}>
            Anzeige aufgeben
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;