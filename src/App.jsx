import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { translations } from './translations';
import { useLocation } from 'react-router-dom';
import './layout.css';

// ⬇️ ДОБАВЛЕНО
import CookieBanner from './components/CookieBanner';

// Импорт компонентов и страниц
import Header from './components/Header';
import Home from './pages/Home';
import ListingsPage from './pages/ListingsPage';
import FavoritesPage from './pages/FavoritesPage';
import ListingDetail from './pages/ListingDetail';
import PostAdPage from './pages/PostAdPage';
import PostImmoOffer from './pages/PostImmoOffer';
import PostImmoSearch from './pages/PostImmoSearch';
import PostJobOffer from './pages/PostJobOffer';
import PostJobSearch from './pages/PostJobSearch';
import MyListings from './pages/MyListings';
import Footer from './components/Footer';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import AGB from './pages/AGB';
import AddAdModal from './components/AddAdModal';
import BlogPage from './pages/BlogPage';
import BlogDetail from './pages/BlogDetail';
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminBlogNew from "./pages/AdminBlogNew";
import AdminBlogEdit from "./pages/AdminBlogEdit";
import AdminGuard from './components/AdminGuard'
import Breadcrumbs from './components/Breadcrumbs'; // Импорт крошек

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [lang, setLang] = useState(localStorage.getItem('lifehub_lang') || 'de');

  const t = translations[lang];

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("lifehub_favs_v1");
    return saved ? JSON.parse(saved) : [];
  });

  const ADMIN_EMAIL = "vpovolotskyi25@gmail.com";

  useEffect(() => {
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('lifehub_theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('theme-dark');
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
      const updated = isFav
        ? prev.filter((favId) => favId !== id)
        : [...prev, id];

      localStorage.setItem("lifehub_favs_v1", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lifehub_lang', newLang);
  };

  return (
    <Router>
      <div className="app-layout">
        <ScrollToTop />

        <CookieBanner lang={lang} />

        <Header
          user={user}
          lang={lang}
          onLangChange={toggleLang}
          t={t}
          onOpenAddModal={() => setShowAddModal(true)}
        />

        <AddAdModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          t={t}
        />

        <div className="app-content">
          {/* Хлебные крошки добавлены сюда */}
          <Breadcrumbs t={t} />

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
              path="/immo/offer"
              element={
                <ListingsPage
                  type="immo_offer"
                  listings={listings}
                  favorites={favorites}
                  onToggleFav={toggleFavorite}
                  onDelete={handleDeleteListing}
                  currentUser={user}
                  t={t}
                />
              }
            />

            <Route
              path="/immo/search"
              element={
                <ListingsPage
                  type="immo_search"
                  listings={listings}
                  favorites={favorites}
                  onToggleFav={toggleFavorite}
                  onDelete={handleDeleteListing}
                  currentUser={user}
                  t={t}
                />
              }
            />

            <Route
              path="/job/offer"
              element={
                <ListingsPage
                  type="job"
                  mode="offer"
                  listings={listings}
                  favorites={favorites}
                  onToggleFav={toggleFavorite}
                  onDelete={handleDeleteListing}
                  currentUser={user}
                  t={t}
                />
              }
            />

            <Route
              path="/job/search"
              element={
                <ListingsPage
                  type="job"
                  mode="search"
                  listings={listings}
                  favorites={favorites}
                  onToggleFav={toggleFavorite}
                  onDelete={handleDeleteListing}
                  currentUser={user}
                  t={t}
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
              path="/immo/offer/post"
              element={
                <PostImmoOffer
                  onAddListing={handleAddListing}
                  currentUser={user}
                  t={t}
                />
              }
            />

            <Route
              path="/immo/search/post"
              element={
                <PostImmoSearch
                  onAddListing={handleAddListing}
                  currentUser={user}
                  t={t}
                />
              }
            />

            <Route
              path="/job/offer/post"
              element={
                <PostJobOffer
                  onAddListing={handleAddListing}
                  currentUser={user}
                  t={t}
                />
              }
            />

            <Route
              path="/job/search/post"
              element={
                <PostJobSearch
                  onAddListing={handleAddListing}
                  currentUser={user}
                  t={t}
                />
              }
            />

            <Route
              path="/post-ad"
              element={
                <PostAdPage
                  onAddListing={handleAddListing}
                  currentUser={user}
                  t={t}
                />
              }
            />

            <Route
              path="/edit/:id"
              element={
                <PostAdPage
                  onAddListing={handleAddListing}
                  currentUser={user}
                  t={t}
                />
              }
            />

            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetail currentUser={user} t={t} />} />
            
            <Route element={<AdminGuard />}>
              <Route path="/admin/blog" element={<AdminBlogPage />} />
              <Route path="/admin/blog/new" element={<AdminBlogNew />} />
              <Route path="/admin/blog/edit/:id" element={<AdminBlogEdit />} />
            </Route>

          </Routes> {/* Тег Routes закрыт корректно */}
        </div>

        <Footer t={t} />
      </div>
    </Router>
  );
}

export default App;