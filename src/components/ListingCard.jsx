import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";

const ListingCard = ({ item, badge, isFav, onToggleFav, onDelete, viewMode }) => {
  const [imgIndex, setImgIndex] = useState(0);

  const images = item.images?.length
    ? item.images
    : ["/assets/img/placeholder.jpg"];

  const prevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const nextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  const navigate = useNavigate();
  const isExternalJob = item.type === "job" && Boolean(item.external_url);

  const location = item.bundesland
    ? `${item.bundesland} • ${item.city}`
    : item.city;

  let meta = "";
  if (item.type === "wohnung") meta = `${location} • ${item.price} € / Monat`;
  if (item.type === "job") meta = `${location} • ab ${item.price} € / Std`;
  if (item.type === "dating") meta = `${location} • ${item.price} Jahre`;

  return (
    <article className={`listing-card ${viewMode === 'list' ? 'list-layout' : ''}`}>
      <Link to={`/listing/${item.type}/${item.id}`} className="listing-link">

        <div className="card-image">
          <img src={images[imgIndex]} className="listing-img" alt={item.title} />

          {images.length > 1 && (
            <>
              <button type="button" className="gallery-arrow left" onClick={prevImg}>‹</button>
              <button type="button" className="gallery-arrow right" onClick={nextImg}>›</button>
            </>
          )}
        </div>

        <div className="listing-content">

          {badge && (
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              {badge.label}
            </div>
          )}

          {/* 🔹 ЗАГОЛОВОК — ВСЕГДА ПЕРВЫЙ */}
          <h3 className="listing-title">
            {item.title.replace(/^Пример:\s*/i, '')}
          </h3>

          {/* 🔹 ЛОКАЦИЯ + ЦЕНА */}
          <p className="listing-meta">{meta}</p>

          {/* 🔹 ОПИСАНИЕ (в grid видно, в list скрыто CSS-ом) */}
          <p className="listing-description">
            {item.description.trim()}
          </p>

        </div>
      </Link>

      <button
        className={`fav-btn ${isFav ? "active" : ""}`}
        onClick={() => onToggleFav(item.id)}
      >
        ❤
      </button>

      {onDelete && (
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '5px' }}>
          <button
            onClick={() => navigate(`/edit/${item.id}`)}
            style={{ background: '#f1c40f', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
            title="Bearbeiten"
          >
            ✏️
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(item.id);
            }}
            style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
            title="Löschen"
          >
            🗑
          </button>
        </div>
      )}
    </article>
  );
};

export default ListingCard;
