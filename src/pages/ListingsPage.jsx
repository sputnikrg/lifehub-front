import React, { useState } from 'react';
import ListingCard from '../components/ListingCard';

const ListingsPage = ({ type, listings, favorites, onToggleFav, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // состояние сортировки

  // 1. Фильтрация
  let filtered = listings.filter(item => {
    const matchesType = item.type === type;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = item.city.toLowerCase().includes(cityFilter.toLowerCase());
    const itemPrice = item.price || item.salary || 0;
    const matchesPrice = maxPrice ? (itemPrice <= Number(maxPrice)) : true;
    return matchesType && matchesSearch && matchesCity && matchesPrice;
  });

  // 2. Сортировка
  filtered.sort((a, b) => {
    const priceA = a.price || a.salary || 0;
    const priceB = b.price || b.salary || 0;

    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    if (sortBy === "newest") return b.id - a.id; // новые ID обычно больше
    return 0;
  });

  const titles = { wohnung: "Wohnungen", job: "Jobs", dating: "Dating" };

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <h1>{titles[type]}</h1>
        </div>
      </section>

      <section className="page-listings">
        <div className="container">
          <div className="search-filters-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            <input 
              className="search-input"
              type="text" 
              placeholder="Suche..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input 
                placeholder="Stadt" 
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
              />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="newest">Zuerst neue</option>
                <option value="price-asc">Günstigste zuerst</option>
                <option value="price-desc">Teuerste zuerst</option>
              </select>
            </div>
          </div>

          <div className="listing-grid">
            {filtered.map(item => (
              <ListingCard 
                key={item.id} 
                item={item} 
                isFav={favorites.includes(item.id)}
                onToggleFav={onToggleFav}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ListingsPage;