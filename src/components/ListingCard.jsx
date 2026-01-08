import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ item, isFav, onToggleFav, onDelete }) => {
  const displayImage = (item.images && item.images.length > 0) 
    ? item.images[0] 
    : "/assets/img/placeholder.jpg";

  let meta = "";
  if (item.type === "wohnung") meta = `${item.city} • ${item.price} € / Monat`;
  if (item.type === "job") meta = `${item.city} • ab ${item.price} € / Std`;
  if (item.type === "dating") meta = `${item.city} • ${item.price} Jahre`;

  return (
    <article className="listing-card" style={{ position: 'relative' }}>
      <Link to={`/listing/${item.type}/${item.id}`} className="listing-link">
        <img src={displayImage} className="listing-img" alt={item.title} />
        <div className="listing-content">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <h3>{item.title}</h3>
            <span style={{fontSize: '12px', color: '#999', whiteSpace: 'nowrap'}}>👁 {item.views || 0}</span>
          </div>
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
          title="Удалить"
        >
          🗑
        </button>
      )}
    </article>
  );
};

export default ListingCard;