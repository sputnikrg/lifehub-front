import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ListingDetail = ({ listings, favorites, onToggleFav }) => {
  const { id } = useParams(); // берем ID из ссылки
  const navigate = useNavigate();
  
  const item = listings.find(i => i.id === Number(id));
  const isFav = favorites.includes(Number(id));

  if (!item) return <div className="container">Anzeige nicht gefunden.</div>;

  return (
    <main className="page-main">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">← Zurück</button>
        
        <article className="listing-detail-full">
          <img src={item.image} alt={item.title} className="detail-img" />
          <div className="detail-info">
            <h1>{item.title}</h1>
            <p className="price-tag">{item.price ? `${item.price} €` : item.salary ? `${item.salary} €/Std` : ''}</p>
            <p className="city">📍 {item.city}</p>
            <hr />
            <p className="description">{item.description}</p>
            
            <button 
              className={`fav-btn big ${isFav ? 'active' : ''}`}
              onClick={() => onToggleFav(item.id)}
            >
              {isFav ? '❤ In Favoriten' : '♡ Zu Favoriten hinzufügen'}
            </button>
          </div>
        </article>
      </div>
    </main>
  );
};

export default ListingDetail;