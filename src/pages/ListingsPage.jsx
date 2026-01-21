import React, { useState } from 'react';
import ListingCard from '../components/ListingCard';

const ListingsPage = ({ type, listings, favorites, onToggleFav, onDelete, currentUser, t }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showExternal, setShowExternal] = useState(true);


  const ADMIN_EMAIL = "vpovolotskyi25@gmail.com";

  let filtered = listings.filter(item => {
    const matchesType = item.type === type;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = item.city.toLowerCase().includes(cityFilter.toLowerCase());
    const itemPrice = item.price || 0;
    const matchesPrice = maxPrice ? (itemPrice <= Number(maxPrice)) : true;
    const matchesExternal = showExternal || !item.external_url;
    return matchesType && matchesSearch && matchesCity && matchesPrice && matchesExternal;

  });

  filtered.sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Определяем заголовок категории
  const pageTitle = type === 'wohnung' ? t.cat_wohnung : type === 'job' ? t.cat_job : t.cat_dating;

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <h1>{pageTitle}</h1>
        </div>
      </section>

      <section className="page-listings">
        <div className="container">
          <div className="filters-bar" style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '15px', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
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
              Externe Jobs anzeigen
            </label>

          </div>
          <div className="listings-hint">
            {type === 'job' && (
              <span>
                {t.hint_job}
              </span>
            )}
            {type === 'wohnung' && (
              <span>
                {t.hint_wohnung}
              </span>
            )}
            {type === 'dating' && (
              <span>
                {t.hint_dating}
              </span>
            )}
          </div>

          <div className="listing-grid">
            {filtered.map(item => {
              const isOwner = currentUser && item.user_id === currentUser.id;
              const isAdmin = currentUser && currentUser.email === ADMIN_EMAIL;
              const showDelete = isOwner || isAdmin;

              return (
                <ListingCard
                  key={item.id}
                  item={item}
                  isFav={favorites.includes(item.id)}
                  onToggleFav={onToggleFav}
                  onDelete={showDelete ? onDelete : null}
                  t={t}
                />
              );
            })}
          </div>
          {filtered.length === 0 && <p style={{ textAlign: 'center', marginTop: '50px' }}>{t.no_results || 'Nichts gefunden'}</p>}
        </div>
      </section>
    </main>
  );
};

export default ListingsPage;