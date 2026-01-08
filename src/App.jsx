import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Импорт компонентов и страниц
import Header from './components/Header';
import Home from './pages/Home';
import ListingsPage from './pages/ListingsPage';
import FavoritesPage from './pages/FavoritesPage';
import ListingDetail from './pages/ListingDetail';
import PostAdPage from './pages/PostAdPage';
import MyListings from './pages/MyListings';
import Footer from './components/Footer'; // 1. Импортируем Footer
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';

function App() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("lifehub_favs_v1");
    return saved ? JSON.parse(saved) : [];
  });

  const ADMIN_EMAIL = "vpovolotskyi25@gmail.com";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Ошибка при получении данных:", error.message);
      } else {
        setListings(data || []);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    localStorage.setItem("lifehub_favs_v1", JSON.stringify(favorites));
  }, [favorites]);

  const handleAddListing = (newAd) => {
    setListings((prev) => [newAd, ...prev]);
  };

  const handleDeleteListing = async (id) => {
    if (!user) return;

    const listingToDelete = listings.find(l => l.id === id);
    const isOwner = listingToDelete?.user_id === user.id;
    const isAdmin = user.email === ADMIN_EMAIL;

    if (!isOwner && !isAdmin) return;

    if (window.confirm("Вы уверены, что хотите удалить это объявление?")) {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Ошибка при удалении: " + error.message);
      } else {
        setListings((prev) => prev.filter((item) => item.id !== id));
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
      <Header user={user} />

      <Routes>
        <Route path="/" element={<Home listings={listings} />} />

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
                currentUser={user}
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
          path="/my-listings"
          element={
            <MyListings
              listings={listings}
              currentUser={user}
              favorites={favorites}
              onToggleFav={toggleFavorite}
              onDelete={handleDeleteListing}
            />
          }
        />

        <Route
          path="/listing/:type/:id"
          element={
            <ListingDetail
              favorites={favorites}
              onToggleFav={toggleFavorite}
            />
          }
        />

        <Route
          path="/post-ad"
          element={<PostAdPage onAddListing={handleAddListing} currentUser={user} />}
        />

        <Route
          path="/edit/:id"
          element={<PostAdPage onAddListing={handleAddListing} currentUser={user} />}
        />

        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />

      </Routes>

      {/* 2. Добавляем Footer в конец, чтобы он был виден на всех страницах */}
      <Footer />
    </Router>
  );
}

export default App;