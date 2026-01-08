import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ListingDetail = ({ favorites, onToggleFav }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListingAndIncrementViews = async () => {
      setLoading(true);
      try {
        // 1. Сначала загружаем данные объявления
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setListing(data);

        // 2. Затем пробуем обновить просмотры (фоновый процесс)
        // Мы НЕ используем await здесь, чтобы загрузка не зависела от счетчика
        supabase.rpc('increment_views', { row_id: id }).then(({ error: rpcError }) => {
          if (rpcError) console.warn("Счетчик не обновился:", rpcError.message);
        });

      } catch (err) {
        console.error("Ошибка загрузки:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListingAndIncrementViews();
  }, [id]);

  if (loading) return <div className="container"><h3>Laden...</h3></div>;
  if (!listing) return <div className="container"><h3>Anzeige nicht gefunden</h3></div>;

  const isFav = favorites.includes(listing.id);

  return (
    <main className="page-main">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-link" style={{marginBottom: '20px', cursor: 'pointer'}}>← Zurück</button>
        
        <div className="listing-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '30px' }}>
          <div className="listing-gallery" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {listing.images && listing.images.length > 0 ? (
              listing.images.map((img, i) => (
                <img key={i} src={img} alt={listing.title} style={{ width: '100%', borderRadius: '12px', objectFit: 'contain', maxHeight: '70vh', background: '#f5f5f5' }} />
              ))
            ) : (
              <img src="/assets/img/placeholder.jpg" alt="No images" style={{ width: '100%', borderRadius: '12px' }} />
            )}
          </div>

          <div className="listing-info">
            <div className="info-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>{listing.title}</h1>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <span style={{color: '#666', fontSize: '14px'}}>👁 {listing.views || 0}</span>
                <button 
                  className={`fav-btn ${isFav ? 'active' : ''}`} 
                  onClick={() => onToggleFav(listing.id)}
                  style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {isFav ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
            <p className="price" style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>
              {listing.price ? `${listing.price} €` : 'Preis auf Anfrage'}
            </p>
            <p className="city">📍 {listing.city}</p>
            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
            <div className="description">
              <h3>Beschreibung</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{listing.description}</p>
            </div>
            <button className="contact-button" style={{ marginTop: '30px', width: '100%', padding: '15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}>
              Anbieter kontaktieren
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListingDetail;