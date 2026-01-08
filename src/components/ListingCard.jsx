import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ item, isFav, onToggleFav, onDelete }) => {
  // Исправляем путь к картинке: берем первую из массива images
  const displayImage = (item.images && item.images.length > 0) 
    ? item.images[0] 
    : "/assets/img/placeholder.jpg";

  let meta = "";
  if (item.type === "wohnung") meta = `${item.city} • ${item.price} € / Monat`;
  if (item.type === "job") meta = `${item.city} • ab ${item.price} € / Std`; // Поправил на price
  if (item.type === "dating") meta = `${item.city} • ${item.price} Jahre`;

  return (
    <article className="listing-card" style={{ position: 'relative' }}>
      <Link to={`/listing/${item.type}/${item.id}`} className="listing-link">
        <img 
          src={displayImage} 
          className="listing-img" 
          alt={item.title} 
        />
        <div className="listing-content">
          <h3>{item.title}</h3>
          <p className="listing-meta">{meta}</p>
          <p className="listing-desc">{item.description}</p>
        </div>
      </Link>

      <button
        className={`fav-btn ${isFav ? "active" : ""}`}
        onClick={() => onToggleFav(item.id)}
        title="В избранное"
      >
        ❤
      </button>

      {onDelete && (
        <button
          className="delete-card-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(item.id);
          }}
          title="Удалить объявление"
        >
          🗑
        </button>
      )}
    </article>
  );
};

export default ListingCard;