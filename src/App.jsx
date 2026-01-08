import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Импорт клиента Supabase
import { supabase } from './supabaseClient';

// Импорт начальных данных (на случай, если база пуста)
//import { listings as initialData } from './data';

// Импорт компонентов и страниц
import Header from './components/Header';
import Home from './pages/Home';
import ListingsPage from './pages/ListingsPage';
import FavoritesPage from './pages/FavoritesPage';
import ListingDetail from './pages/ListingDetail';
import PostAdPage from './pages/PostAdPage';

function App() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("lifehub_favs_v1");
    return saved ? JSON.parse(saved) : [];
  });

  // 1. СЛЕДИМ ЗА АВТОРИЗАЦИЕЙ
  useEffect(() => {
    // Проверяем сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Слушаем изменения (вход/выход)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. ЗАГРУЖАЕМ ОБЪЯВЛЕНИЯ ИЗ SUPABASE
  useEffect(() => {
  const fetchListings = async () => {
    // Больше не берем данные из INITIAL_DATA
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false }); // Сначала новые

    if (error) {
      console.error("Ошибка при получении данных:", error.message);
    } else {
      setListings(data || []);
    }
  };

  fetchListings();
}, []);

  // 3. СОХРАНЯЕМ ИЗБРАННОЕ (пока оставляем в localStorage для простоты)
  useEffect(() => {
    localStorage.setItem("lifehub_favs_v1", JSON.stringify(favorites));
  }, [favorites]);

  // --- ФУНКЦИИ ОБРАБОТКИ ---

  // Добавление (теперь мы передаем эту функцию в PostAdPage, где будет логика Supabase)
  const handleAddListing = (newAd) => {
    setListings((prev) => [newAd, ...prev]);
  };

  // Удаление из базы
  const handleDeleteListing = async (id) => {
    if (!user) {
      alert("Войдите в систему, чтобы удалять объявления");
      return;
    }

    if (window.confirm("Удалить это объявление?")) {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Ошибка: " + error.message + " (Возможно, это не ваше объявление)");
      } else {
        setListings((prev) => prev.filter((item) => item.id !== id));
        alert("Объявление удалено");
      }
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <Router>
      {/* Передаем user в Header, чтобы показывать кнопку входа/выхода или аватар */}
      <Header user={user} />
      
      <Routes>
        <Route path="/" element={<Home listings={listings} />} />
        
        {/* Маппинг страниц категорий */}
        {['wohnung', 'job', 'dating'].map(type => (
          <Route 
            key={type}
            path={`/${type}`} 
            element={
              <ListingsPage 
                type={type}
                listings={listings} 
                favorites={favorites} 
                onToggleFav={toggleFavorite} 
                onDelete={handleDeleteListing}
                currentUser={user} // Передаем юзера для проверки прав на удаление
              />
            } 
          />
        ))}

        <Route 
          path="/favorites" 
          element={
            <FavoritesPage 
              listings={listings} 
              favorites={favorites} 
              onToggleFav={toggleFavorite} 
            />
          } 
        />

        <Route 
          path="/listing/:type/:id" 
          element={
            <ListingDetail 
              listings={listings} 
              favorites={favorites} 
              onToggleFav={toggleFavorite} 
            />
          } 
        />

        <Route 
          path="/post-ad" 
          element={<PostAdPage onAddListing={handleAddListing} currentUser={user} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;