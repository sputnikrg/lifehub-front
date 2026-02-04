import React, { useState } from 'react';
import ListingCard from '../components/ListingCard';
import { bundeslaender } from '../data/bundeslaender';
import { useLocation, useNavigate } from 'react-router-dom';



const ListingsPage = ({
  type,
  listings,
  favorites,
  onToggleFav,
  onDelete,
  currentUser,
  t
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  /* =====================
     STATE
  ===================== */
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [bundeslandFilter, setBundeslandFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  /* =====================
     ROUTE CONTEXT (IMMO)
  ===================== */
  const isImmoSearch = location.pathname.startsWith('/immo/search');
  const isImmoOffer = location.pathname.startsWith('/immo/offer');
  const isImmo = isImmoSearch || isImmoOffer;

  const immoBadge = isImmoSearch
    ? { label: 'Gesuch' }
    : isImmoOffer
      ? { label: 'Angebot' }
      : null;

  /* =====================
     FILTERING
  ===================== */
  const filtered = listings.filter(item => {
    const matchesType = isImmo
      ? item.type === 'wohnung' && item.mode === (isImmoSearch ? 'search' : 'offer')
      : item.type === type;

    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = item.city?.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesBundesland = bundeslandFilter
      ? item.bundesland === bundeslandFilter
      : true;
    const matchesPrice = maxPrice
      ? Number(item.price || 0) <= Number(maxPrice)
      : true;

    return (
      matchesType &&
      matchesSearch &&
      matchesCity &&
      matchesBundesland &&
      matchesPrice
    );
  });

  /* =====================
     TITLE
  ===================== */
  const pageTitle = isImmo
    ? isImmoSearch
      ? t.immo_search || 'Wohnung gesucht'
      : t.immo_offer || 'Wohnung anbieten'
    : type === 'wohnung'
      ? t.cat_wohnung
      : type === 'job'
        ? t.cat_job
        : t.cat_dating;

  /* =====================
     RENDER
  ===================== */
  return (
    <main className="page-main">

      {/* ===== HERO ===== */}
      <section className="page-hero">
        <div className="container">
          <h1>{pageTitle}</h1>
        </div>
      </section>

      {/* ===== LISTINGS ===== */}
      <section className="page-listings">
        <div className="container">

          {/* ===== FILTERS BAR ===== */}
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
            {isImmo && (
              <div style={{ display: 'flex', gap: '8px', marginRight: '10px' }}>
                <button
                  onClick={() => navigate('/immo/offer')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    background: isImmoOffer ? '#4a90e2' : '#f5f5f5',
                    color: isImmoOffer ? '#fff' : '#333',
                    fontWeight: 500
                  }}
                >
                  Angebot
                </button>

                <button
                  onClick={() => navigate('/immo/search')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    background: isImmoSearch ? '#4a90e2' : '#f5f5f5',
                    color: isImmoSearch ? '#fff' : '#333',
                    fontWeight: 500
                  }}
                >
                  Gesuch
                </button>
              </div>
            )}

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

            <select
              value={bundeslandFilter}
              onChange={(e) => setBundeslandFilter(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '220px' }}
            >
              <option value="">{t.all_bundeslaender || 'Alle Bundesländer'}</option>
              {bundeslaender.map(bl => (
                <option key={bl.value} value={bl.value}>
                  {bl.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder={
                isImmoSearch
                  ? (t.label_budget || 'Max. Budget (€)')
                  : t.label_price
              }
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '120px' }}
            />

            {/* VIEW TOGGLE */}
            <div style={{ display: 'flex', gap: '5px', marginLeft: 'auto' }}>
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

          {/* ===== GRID ===== */}
          <div className={`listing-grid ${viewMode}`}>
            {filtered.map(item => (
              <ListingCard
                key={item.id}
                item={item}
                badge={immoBadge}
                isFav={favorites.includes(item.id)}
                onToggleFav={onToggleFav}
                onDelete={onDelete}
                viewMode={viewMode}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <p style={{ fontSize: '18px', marginBottom: '12px' }}>
                {isImmoSearch && (t.empty_immo_search || 'Noch keine Wohnungsgesuche gefunden')}
                {isImmoOffer && (t.empty_immo_offer || 'Noch keine Wohnungsangebote gefunden')}
                {!isImmo && (t.no_results || 'Keine Ergebnisse gefunden')}
              </p>

              {isImmo && (
                <button
                  onClick={() => navigate('/post-immo')}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#4a90e2',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  {isImmoSearch
                    ? (t.btn_post_search || 'Wohnung suchen')
                    : (t.btn_post_offer || 'Wohnung anbieten')}
                </button>
              )}
            </div>
          )}

        </div>
      </section>
    </main>
  );
};

export default ListingsPage;
