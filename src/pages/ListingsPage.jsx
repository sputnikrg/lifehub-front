import React, { useState } from 'react';
import ListingCard from '../components/ListingCard';
import { bundeslaender } from '../data/bundeslaender';
import { useLocation } from 'react-router-dom';

const ListingsPage = ({ type, listings, favorites, onToggleFav, onDelete, currentUser, t }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [bundeslandFilter, setBundeslandFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const location = useLocation();

  const immoBadge = location.pathname.startsWith('/immo/search')
    ? { label: 'Gesuch' }
    : location.pathname.startsWith('/immo/offer')
      ? { label: 'Angebot' }
      : null;

  const filtered = listings.filter(item => {
    const isImmoSearch = location.pathname.startsWith('/immo/search');
    const isImmoOffer = location.pathname.startsWith('/immo/offer');

    const matchesType = isImmoSearch
      ? item.type === 'wohnung' && item.mode === 'search'
      : isImmoOffer
        ? item.type === 'wohnung' && item.mode === 'offer'
        : item.type === type;

    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = item.city?.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesBundesland = bundeslandFilter ? item.bundesland === bundeslandFilter : true;
    const matchesPrice = maxPrice ? item.price <= Number(maxPrice) : true;

    return (
      matchesType &&
      matchesSearch &&
      matchesCity &&
      matchesBundesland &&
      matchesPrice
    );
  });

  return (
    <main className="page-main">
      <div className="container">
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
          <p style={{ textAlign: 'center', marginTop: '40px' }}>
            {t.no_results || 'Keine Ergebnisse gefunden'}
          </p>
        )}
      </div>
    </main>
  );
};

export default ListingsPage;
