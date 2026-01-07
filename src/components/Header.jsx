import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Header = ({ user }) => {
  const location = useLocation();

  // Функция входа через Google
  const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Это заставит Supabase использовать "Site URL", который мы указали в консоли
      redirectTo: window.location.origin 
    }
  });
  if (error) console.error("Ошибка авторизации:", error.message);
};

  // Функция выхода
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

        {/* Если пользователь вошел — показываем кнопку Выйти, если нет — войти через Google */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
             <button onClick={handleLogout} style={{ background: '#eee', color: '#333' }}>
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

        <Link 
          to="/favorites" 
          className={`fav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
        >
          ❤️ Favoriten
        </Link>
      </nav>
    </header>
  );
};

export default Header;