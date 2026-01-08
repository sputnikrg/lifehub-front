import React from 'react';
import ListingCard from '../components/ListingCard';

const MyListings = ({ listings, currentUser, favorites, onToggleFav, onDelete }) => {
  // Фильтруем только те объявления, которые принадлежат текущему юзеру
  const myItems = listings.filter(item => item.user_id === currentUser?.id);

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <h1>Meine Anzeigen</h1>
          <p>Hier finden Sie alle Ihre veröffentlichten Anzeigen</p>
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
                  onDelete={onDelete} // Тут корзина будет всегда, так как это свои посты
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <h3>Sie haben noch keine Anzeigen erstellt.</h3>
              <button 
                onClick={() => window.location.href='/post-ad'}
                className="card-button"
                style={{ marginTop: '20px', width: 'auto' }}
              >
                Anzeige aufgeben
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MyListings;