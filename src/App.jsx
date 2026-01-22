import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { translations } from './translations';

// Импорт компонентов и страниц
import Header from './components/Header';
import Home from './pages/Home';
import ListingsPage from './pages/ListingsPage';
import FavoritesPage from './pages/FavoritesPage';
import ListingDetail from './pages/ListingDetail';
import PostAdPage from './pages/PostAdPage';
import MyListings from './pages/MyListings';
import Footer from './components/Footer';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import AGB from './pages/AGB';

function App() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);

  // ⬇️ ТВОЯ строка — НЕ ТРОГАЕМ
  const [lang, setLang] = useState(localStorage.getItem('lifehub_lang') || 'de');

  const t = translations[lang];

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("lifehub_favs_v1");
    return saved ? JSON.parse(saved) : [];
  });

  const ADMIN_EMAIL = "vpovolotskyi25@gmail.com";

  /* ======================================================
     🟢 АВТОДЕТЕКТ ЯЗЫКА (ДОБАВЛЕНО)
     ====================================================== */
  useEffect(() => {
    // если язык уже сохранён — НЕ трогаем
    const savedLang = localStorage.getItem('lifehub_lang');
    if (savedLang) return;

    const browserLang = navigator.language.toLowerCase();
    let detectedLang = 'de';

    if (browserLang.startsWith('uk')) detectedLang = 'ua';
    else if (browserLang.startsWith('ru')) detectedLang = 'ru';
    else if (browserLang.startsWith('de')) detectedLang = 'de';

    localStorage.setItem('lifehub_lang', detectedLang);
    setLang(detectedLang);
  }, []);
  /* ====================================================== */

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
        console.error("Ошибка при загрузке данных:", error.message);
      } else {
        setListings(data || []);
      }
    };

    fetchListings();
  }, []);

  const handleAddListing = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const handleDeleteListing = async (id) => {
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (!error) {
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter((favId) => favId !== id) : [...prev, id];
      localStorage.setItem("lifehub_favs_v1", JSON.stringify(updated));
      return updated;
    });
  };

  // ⬇️ ТВОЯ функция — НЕ МЕНЯЕМ, она уже правильная
  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lifehub_lang', newLang);
  };

  return (
    <Router>
      <Header user={user} lang={lang} onLangChange={toggleLang} t={t} />

      <Routes>
        <Route path="/" element={<Home t={t} lang={lang} />} />

        {['wohnung', 'job', 'dating'].map((type) => (
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
                t={t}
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
              t={t}
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
              t={t}
            />
          }
        />

        <Route
          path="/listing/:type/:id"
          element={
            <ListingDetail
              favorites={favorites}
              onToggleFav={toggleFavorite}
              t={t}
            />
          }
        />

        <Route
          path="/post-ad"
          element={<PostAdPage onAddListing={handleAddListing} currentUser={user} t={t} />}
        />

        <Route
          path="/edit/:id"
          element={<PostAdPage onAddListing={handleAddListing} currentUser={user} t={t} />}
        />

        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/agb" element={<AGB />} />
      </Routes>

      <Footer t={t} />
    </Router>
  );
}

export default App;
