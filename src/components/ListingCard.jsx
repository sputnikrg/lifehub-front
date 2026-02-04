import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ListingCard = ({ item, badge, isFav, onToggleFav, onDelete, viewMode }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const navigate = useNavigate();

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

        {/* IMAGE + BADGE */}
        <div className="listing-image">
          <img
            src={images[imgIndex]}
            className="listing-img"
            alt={item.title}
          />

          {item.type === "wohnung" && item.mode && (
            <span className={`listing-badge ${item.mode}`}>
              {item.mode === "offer" ? "Angebot" : "Gesuch"}
            </span>
          )}

          {images.length > 1 && (
            <>
              <button type="button" className="gallery-arrow left" onClick={prevImg}>‹</button>
              <button type="button" className="gallery-arrow right" onClick={nextImg}>›</button>
            </>
          )}
        </div>

        <div className="listing-content">
          <h3 className="listing-title">
            {item.title.replace(/^Пример:\s*/i, '')}
          </h3>

          <p className="listing-meta">{meta}</p>

          <p className="listing-description">
            {item.description.trim()}
          </p>
        </div>
      </Link>

      <button
        className={`fav-btn ${isFav ? "active" : ""}`}
        onClick={() => onToggleFav(item.id)}
        style={{ zIndex: 5 }}
      >
        ❤
      </button>

      {onDelete && (
        <div className="listing-actions">
          <button
            onClick={() => navigate(`/edit/${item.id}`)}
            className="edit-btn"
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
            className="delete-btn"
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
