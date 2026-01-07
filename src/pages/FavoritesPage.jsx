import React from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

const FavoritesPage = ({ listings, favorites, onToggleFav }) => {
  // Фильтруем основной массив данных, оставляя только избранные ID
  const favoriteItems = listings.filter(item => favorites.includes(item.id));

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <h1>Meine Favoriten</h1>
          <p>Deine gespeicherten Anzeigen</p>
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
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Noch keine Favoriten</h2>
              <p>Entdecke Anzeigen и füge sie zu deiner Liste hinzu!</p>
              <Link to="/" className="card-button">Zur Startseite</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default FavoritesPage;