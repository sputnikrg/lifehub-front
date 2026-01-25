import React from 'react';
import ListingCard from '../components/ListingCard';
import { useLocation } from 'react-router-dom';

const MyListings = ({ listings, currentUser, favorites, onToggleFav, onDelete, t }) => {
  const location = useLocation();
  const showSuccess = location.state?.published;
  const myItems = listings.filter(item => item.user_id === currentUser?.id);

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <h1>{t.nav_my_ads}</h1>
          <p>{t.my_ads_subtitle || 'Verwalten Sie Ihre Anzeigen'}</p>
        </div>
      </section>

      <section className="page-listings">
        <div className="container">
          {myItems.length > 0 ? (
            <div className="listing-grid">
              {myItems.map(item => (
                <ListingCard 
                  key={item.id} 
                  item={item} 
                  isFav={favorites.includes(item.id)}
                  onToggleFav={onToggleFav}
                  onDelete={onDelete}
                  t={t}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <h3>{t.no_my_ads || 'Sie haben noch keine Anzeigen.'}</h3>
              <button 
                onClick={() => window.location.href='/post-ad'}
                className="card-button"
                style={{ marginTop: '20px', width: 'auto' }}
              >
                {t.nav_post_ad}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MyListings;