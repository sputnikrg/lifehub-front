import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ListingDetail = ({ favorites, onToggleFav }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single(); // Получаем только один объект

      if (error) {
        console.error("Ошибка загрузки:", error.message);
      } else {
        setListing(data);
      }
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  if (loading) return <div className="container"><h3>Laden...</h3></div>;
  if (!listing) return <div className="container"><h3>Anzeige nicht gefunden</h3></div>;

  const isFav = favorites.includes(listing.id);

  return (
    <main className="page-main">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-link">← Zurück</button>
        
        <div className="listing-detail-grid">
          <div className="listing-gallery">
            {/* Если картинок несколько, выводим их */}
            {listing.images && listing.images.length > 0 ? (
              listing.images.map((img, i) => <img key={i} src={img} alt={listing.title} />)
            ) : (
              <img src="/assets/img/placeholder.jpg" alt="No images" />
            )}
          </div>

          <div className="listing-info">
            <div className="info-header">
              <h1>{listing.title}</h1>
              <button 
                className={`fav-btn ${isFav ? 'active' : ''}`} 
                onClick={() => onToggleFav(listing.id)}
              >
                {isFav ? '❤️' : '🤍'}
              </button>
            </div>
            <p className="price">{listing.price ? `${listing.price} €` : 'Preis auf Anfrage'}</p>
            <p className="city">📍 {listing.city}</p>
            <div className="description">
              <h3>Beschreibung</h3>
              <p>{listing.description}</p>
            </div>
            <button className="contact-button">Anbieter kontaktieren</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListingDetail;