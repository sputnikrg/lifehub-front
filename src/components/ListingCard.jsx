import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ListingCard = ({ item, isFav, onToggleFav, onDelete }) => {
  const navigate = useNavigate();
  const isExternalJob = item.type === "job" && Boolean(item.external_url);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3>{item.title}</h3>
            <span style={{ fontSize: '12px', color: '#999' }}>👁 {item.views || 0}</span>
          </div>
          {isExternalJob && (
            <span
              style={{
                display: 'inline-block',
                marginBottom: '6px',
                fontSize: '11px',
                color: '#555',
                background: '#eef2ff',
                padding: '3px 6px',
                borderRadius: '5px'
              }}
            >
              External
            </span>
          )}

          <p className="listing-meta">{meta}</p>
          <p className="listing-desc">{item.description}</p>
        </div>
      </Link>

      <button
        className={`fav-btn ${isFav ? "active" : ""}`}
        onClick={() => onToggleFav(item.id)}
      >
        ❤
      </button>

      {/* КНОПКИ УПРАВЛЕНИЯ (только для владельца/админа) */}
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '5px' }}>
        {onDelete && (
          <>
            {/* Кнопка Редактировать */}
            <button
              onClick={() => navigate(`/edit/${item.id}`)}
              style={{ background: '#f1c40f', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
              title="Bearbeiten"
            >
              ✏️
            </button>

            {/* Кнопка Удалить */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(item.id);
              }}
              style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
              title="Löschen"
            >
              🗑
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default ListingCard;