import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Импорт начальных данных
import { listings as initialData } from './data';

// Импорт компонентов и страниц
import Header from './components/Header';
import Home from './pages/Home';
import ListingsPage from './pages/ListingsPage';
import FavoritesPage from './pages/FavoritesPage';
import ListingDetail from './pages/ListingDetail';
import PostAdPage from './pages/PostAdPage';

function App() {
  // Состояние списка объявлений (загружаем из localStorage или берем начальные)
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem("lifehub_listings_db");
    return saved ? JSON.parse(saved) : initialData;
  });

  // Состояние избранного
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("lifehub_favs_v1");
    return saved ? JSON.parse(saved) : [];
  });

  // Сохранение данных при изменениях
  useEffect(() => {
    localStorage.setItem("lifehub_listings_db", JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem("lifehub_favs_v1", JSON.stringify(favorites));
  }, [favorites]);

  // --- ФУНКЦИИ ОБРАБОТКИ ---

  // 1. Добавление нового объявления
  const handleAddListing = (newAd) => {
    setListings((prev) => [newAd, ...prev]);
  };

  // 2. УДАЛЕНИЕ объявления
  const handleDeleteListing = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить это объявление?")) {
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // 3. Переключение избранного
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Страницы категорий с функцией удаления */}
        <Route 
          path="/wohnung" 
          element={
            <ListingsPage 
              type="wohnung" 
              listings={listings} 
              favorites={favorites} 
              onToggleFav={toggleFavorite} 
              onDelete={handleDeleteListing} 
            />
          } 
        />
        <Route 
          path="/job" 
          element={
            <ListingsPage 
              type="job" 
              listings={listings} 
              favorites={favorites} 
              onToggleFav={toggleFavorite} 
              onDelete={handleDeleteListing} 
            />
          } 
        />
        <Route 
          path="/dating" 
          element={
            <ListingsPage 
              type="dating" 
              listings={listings} 
              favorites={favorites} 
              onToggleFav={toggleFavorite} 
              onDelete={handleDeleteListing} 
            />
          } 
        />

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
          element={<PostAdPage onAddListing={handleAddListing} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;