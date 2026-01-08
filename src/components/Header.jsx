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

      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>Deutsch | Русский</span>

        {/* Кнопка Favorites */}
        <Link to="/favorites" style={{ textDecoration: 'none' }}>
          <button style={{ 
            background: '#f8f9fa', 
            border: '1px solid #dee2e6', 
            padding: '8px 15px', 
            borderRadius: '20px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#e74c3c'
          }}>
            ❤️ <span style={{ color: '#333' }}>Favoriten</span>
          </button>
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Кнопка Мои объявления */}
            <Link to="/my-listings">
              <button style={{ 
                background: '#e74c3c', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '5px', 
                border: 'none', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }}>
                Meine Anzeigen
              </button>
            </Link>

            {/* Блок пользователя (отцентрован) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.2' }}>
              <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>{user.email}</span>
              <button onClick={handleLogout} style={{ 
                background: 'none', 
                border: 'none', 
                color: '#3498db', 
                textDecoration: 'underline', 
                cursor: 'pointer', 
                fontSize: '12px',
                padding: '2px 0'
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
          <button className="ad" style={{ background: '#3498db', color: 'white', padding: '8px 16px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Anzeige aufgeben
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;