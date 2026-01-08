import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Header = ({ user }) => {
  const location = useLocation();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin 
      }
    });
    if (error) console.error("Ошибка авторизации:", error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Ошибка при выходе:", error.message);
  };

  return (
    <header>
      <Link to="/" className="logo">
        <img src="/assets/img/logo.png" alt="LifeHub" />
      </Link>

      <nav className="main-nav">
        <div className="nav-group">
          <span>Deutsch | Русский</span>
          
          {/* Ссылка на Избранное (возвращена) */}
          <Link to="/favorites" className="nav-link">❤ Favoriten</Link>
        </div>

        <div className="nav-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <>
              {/* Кнопка Мои объявления (красная) */}
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

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>{user.email}</span>
                <button onClick={handleLogout} style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#3498db', 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '12px'
                }}>
                  Abmelden
                </button>
              </div>
            </>
          ) : (
            <button className="google" onClick={handleLogin}>
              Mit Google anmelden
            </button>
          )}

          <Link to="/post-ad">
            <button className="ad">Anzeige aufgeben</button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;