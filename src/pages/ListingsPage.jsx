import React, { useState } from 'react';
import ListingCard from '../components/ListingCard';
import { bundeslaender } from '../data/bundeslaender';
import { useLocation } from 'react-router-dom';


const ListingsPage = ({ type, listings, favorites, onToggleFav, onDelete, currentUser, t }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [bundeslandFilter, setBundeslandFilter] = useState(""); // ✅ НОВОЕ
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showExternal, setShowExternal] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const location = useLocation();
  const immoBadge =
    location.pathname.startsWith('/immo/offer')
      ? { label: 'Angebot', className: 'badge-offer' }
      : location.pathname.startsWith('/immo/search')
        ? { label: 'Gesuch', className: 'badge-search' }
        : null;
  const showSuccess = new URLSearchParams(location.search).get('published') === '1';


  const ADMIN_EMAILS = [
    "vpovolotskyi25@gmail.com",
    "druckauftragag@gmail.com"
  ];

  let filtered = listings.filter(item => {
    const matchesType = item.type === type;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = item.city.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesBundesland = bundeslandFilter
      ? item.bundesland === bundeslandFilter
      : true;
    const itemPrice = item.price || 0;
    const matchesPrice = maxPrice ? (itemPrice <= Number(maxPrice)) : true;
    const matchesExternal = showExternal || !item.external_url;

    return (
      matchesType &&
      matchesSearch &&
      matchesCity &&
      matchesBundesland &&
      matchesPrice &&
      matchesExternal
    );
  });

  filtered.sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const pageTitle =
    type === 'wohnung' ? t.cat_wohnung :
      type === 'job' ? t.cat_job :
        t.cat_dating;

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <h1>{pageTitle}</h1>
          {showSuccess && (
            <div
              style={{
                margin: '15px 0',
                padding: '12px 16px',
                background: '#e8f5e9',
                color: '#2e7d32',
                borderRadius: '8px',
                fontSize: '15px'
              }}
            >
              {t.ad_published_success || 'Ihre Anzeige wurde erfolgreich veröffentlicht.'}
            </div>
          )}
        </div>
      </section>

      <section className="page-listings">
        <div className="container">
          <div
            className="filters-bar"
            style={{
              marginBottom: '30px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              alignItems: 'center'
            }}
          >
            <input
              placeholder={t.label_title}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: '1', minWidth: '200px' }}
            />

            <input
              placeholder={t.label_city}
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '150px' }}
            />

            {/* ✅ НОВЫЙ ФИЛЬТР ПО BUNDESLAND */}
            <select
              value={bundeslandFilter}
              onChange={(e) => setBundeslandFilter(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '220px' }}
            >
              <option value="">Alle Bundesländer</option>
              {bundeslaender.map(bl => (
                <option key={bl.value} value={bl.value}>
                  {bl.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder={type === 'dating' ? 'Max. Alter' : t.label_price}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '120px' }}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="newest">{t.sort_newest || 'Zuerst neue'}</option>
              <option value="price-asc">{t.sort_price_asc || 'Günstigste'}</option>
              <option value="price-desc">{t.sort_price_desc || 'Teuerste'}</option>
            </select>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={showExternal}
                onChange={() => setShowExternal(!showExternal)}
              />
              Externe Jobs
            </label>

            <div className="view-toggle" style={{ display: 'flex', gap: '5px', marginLeft: 'auto' }}>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  background: viewMode === "grid" ? "#4a90e2" : "#f5f5f5",
                  color: viewMode === "grid" ? "white" : "#666",
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                title="Grid"
              >
                田
              </button>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  background: viewMode === "list" ? "#4a90e2" : "#f5f5f5",
                  color: viewMode === "list" ? "white" : "#666",
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                title="List"
              >
                ☰
              </button>
            </div>
          </div>

          <div className="listings-hint">
            {type === 'job' && <span>{t.hint_job}</span>}
            {type === 'wohnung' && <span>{t.hint_wohnung}</span>}
            {type === 'dating' && <span>{t.hint_dating}</span>}
          </div>

          <div className={`listing-grid ${viewMode}`}>
            {filtered.map(item => {
              const isOwner = currentUser && item.user_id === currentUser.id;
              const isAdmin =
                currentUser &&
                ADMIN_EMAILS.includes(currentUser.email);

              const showDelete = isOwner || isAdmin;

              return (
                <ListingCard
                  key={item.id}
                  item={item}
                  badge={immoBadge}   // ← ВОТ ОНО
                  isFav={favorites.includes(item.id)}
                  onToggleFav={onToggleFav}
                  onDelete={showDelete ? onDelete : null}
                  t={t}
                  viewMode={viewMode}
                />

              );
            })}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '50px' }}>
              {t.no_results || 'Nichts gefunden'}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default ListingsPage;
