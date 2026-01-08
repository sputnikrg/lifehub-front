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
        <span>Deutsch | Русский</span>

        {user && (
          <Link to="/my-listings" className="nav-link" style={{marginRight: '15px', color: '#333', textDecoration: 'none', fontWeight: '500'}}>
            Meine Anzeigen
          </Link>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
             <button onClick={handleLogout} style={{ background: '#eee', color: '#333', padding: '5px 10px', borderRadius: '5px' }}>
               Выйти
             </button>
          </div>
        ) : (
          <button className="google" onClick={handleLogin}>
            Mit Google anmelden
          </button>
        )}

        <Link to="/post-ad">
          <button className="ad">Anzeige aufgeben</button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;