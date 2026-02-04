import React, { useState } from 'react';
import ListingCard from '../components/ListingCard';
import { bundeslaender } from '../data/bundeslaender';
import { useLocation } from 'react-router-dom';

const ListingsPage = ({ type, listings, favorites, onToggleFav, onDelete, currentUser, t }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [bundeslandFilter, setBundeslandFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showExternal, setShowExternal] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const location = useLocation();

  // ✅ БЕЙДЖ ПО МАРШРУТУ (ТОЛЬКО UI)
  const immoBadge = location.pathname.includes('/immo/offer')
    ? { label: 'Angebot' }
    : location.pathname.includes('/immo/search')
      ? { label: 'Gesuch' }
      : null;

  const ADMIN_EMAILS = [
    "vpovolotskyi25@gmail.com",
    "druckauftragag@gmail.com"
  ];

  let filtered = listings.filter(item => {
    const matchesType = item.type === type;
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = item.city?.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesBundesland = bundeslandFilter
      ? item.bundesland === bundeslandFilter
      : true;
    const itemPrice = item.price || 0;
    const matchesPrice = maxPrice ? itemPrice <= Number(maxPrice) : true;
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

  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <main className="page-main">
      <section className="page-listings">
        <div className="container">

          {/* СПИСОК ОБЪЯВЛЕНИЙ */}
          <div className={`listing-grid ${viewMode}`}>

            {/* НОРМАЛЬНЫЙ РЕНДЕР */}
            {filtered.map(item => {
              const isOwner = currentUser && item.user_id === currentUser.id;
              const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);
              const showDelete = isOwner || isAdmin;

              return (
                <ListingCard
                  key={item.id}
                  item={item}
                  badge={immoBadge}
                  isFav={favorites.includes(item.id)}
                  onToggleFav={onToggleFav}
                  onDelete={showDelete ? onDelete : null}
                  viewMode={viewMode}
                />
              );
            })}
          </div>

        </div>
      </section>
    </main>
  );
};

export default ListingsPage;
