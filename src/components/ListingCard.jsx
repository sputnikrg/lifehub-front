import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ item, isFav, onToggleFav, onDelete }) => {
  // Формируем мета-информацию в зависимости от типа
  let meta = "";
  if (item.type === "wohnung") meta = `${item.city} • ${item.price} € / Monat`;
  if (item.type === "job") meta = `${item.city} • ab ${item.salary} € / Std`;
  if (item.type === "dating") meta = `${item.city} • ${item.age} Jahre`;

  return (
    <article className="listing-card" style={{ position: 'relative' }}>
      {/* Ссылка на детальную страницу */}
      <Link to={`/listing/${item.type}/${item.id}`} className="listing-link">
        <img 
          src={item.image || "/assets/img/placeholder.jpg"} 
          className="listing-img" 
          alt={item.title} 
        />
        <div className="listing-content">
          <h3>{item.title}</h3>
          <p className="listing-meta">{meta}</p>
          <p className="listing-desc">{item.description}</p>
        </div>
      </Link>

      {/* Кнопка Избранного */}
      <button
        className={`fav-btn ${isFav ? "active" : ""}`}
        onClick={() => onToggleFav(item.id)}
        title="В избранное"
      >
        ❤
      </button>

      {/* КНОПКА УДАЛЕНИЯ */}
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