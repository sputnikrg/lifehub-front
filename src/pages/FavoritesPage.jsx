import React from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

const FavoritesPage = ({ listings, favorites, onToggleFav, t }) => {
  const favoriteItems = listings.filter(item => favorites.includes(item.id));

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <h1>{t.nav_favorites}</h1>
        </div>
      </section>

      <section className="page-listings">
        <div className="container">
          {favoriteItems.length > 0 ? (
            <div className="listing-grid">
              {favoriteItems.map(item => (
                <ListingCard 
                  key={item.id} 
                  item={item} 
                  isFav={true} 
                  onToggleFav={onToggleFav} 
                  t={t}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: 'center', padding: '50px 0' }}>
              <h2>{t.no_favs || 'Noch keine Favoriten'}</h2>
              <Link to="/" className="card-button" style={{ display: 'inline-block', marginTop: '20px' }}>
                {t.back}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default FavoritesPage;