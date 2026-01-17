import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ListingDetail = ({ favorites, onToggleFav }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Состояния для галереи
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---- Paywall для kontaktdaten (dating) ----
  const CONTACT_PRICE = 5;

  const [showPayModal, setShowPayModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const fetchListingAndIncrementViews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setListing(data);

        // ---- Проверка: платил ли пользователь за kontaktdaten ----
        if (data.type === 'dating') {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            const { data: paid } = await supabase
              .from('paid_contacts')
              .select('id')
              .eq('user_id', user.id)
              .eq('listing_id', data.id)
              .single();

            if (paid) {
              setIsPaid(true);
            }
          }
        }

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
  const images = (listing.images && listing.images.length > 0) ? listing.images : ["/assets/img/placeholder.jpg"];

  // Навигация в модалке
  const nextImg = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1 === images.length ? 0 : prev + 1));
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const isExternalJob =
    listing?.type === "job" && Boolean(listing?.external_url);
  return (
    <main className="page-main">
      <div className="container">
        {/* Кнопка назад */}
        <button
          onClick={() => navigate(-1)}
          className="back-link"
          style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}
        >
          ← Zurück
        </button>

        <div className="listing-detail-grid">
          {/* ЛЕВАЯ КОЛОНКА: ГАЛЕРЕЯ */}
          <div className="listing-gallery-side">
            <div className="listing-gallery-container">
              {/* Главное фото */}
              <div className="main-image-wrapper" onClick={() => setIsModalOpen(true)}>
                <img src={images[activeIndex]} alt={listing.title} className="main-image" />
                {images.length > 1 && <span className="zoom-hint">🔍 Klick для увеличения</span>}
              </div>

              {/* Миниатюры под главным фото */}
              {images.length > 1 && (
                <div className="thumbnails-grid">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className={`thumb-item ${i === activeIndex ? 'active' : ''}`}
                      onClick={() => setActiveIndex(i)}
                    >
                      <img src={img} alt={`Thumb ${i}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: ИНФОРМАЦИЯ */}
          <div className="listing-info">
            <div className="info-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0 }}>{listing.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>👁 {listing.views || 0}</span>
                <button
                  className={`fav-btn ${isFav ? 'active' : ''}`}
                  onClick={() => onToggleFav(listing.id)}
                  style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {isFav ? '❤️' : '🤍'}
                </button>
              </div>
            </div>

            {/* ТОЧЕЧНАЯ ПРАВКА ВЫВОДА ЦЕНЫ/ВОЗРАСТА */}
            <p className="price" style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: '15px 0' }}>
              {listing.price
                ? `${listing.price} ${listing.type === 'dating' ? 'Jahre' : '€'}`
                : 'Preis auf Anfrage'}
            </p>

            <p className="city" style={{ color: '#666', fontSize: '16px' }}>📍 {listing.city}</p>

            <hr style={{ margin: '25px 0', border: '0', borderTop: '1px solid #eee' }} />

            <div className="description">
              <h3 style={{ marginBottom: '10px' }}>Beschreibung</h3>

              {isExternalJob ? (
                <>
                  <p style={{ lineHeight: '1.6', color: '#444' }}>
                    {listing.description?.slice(0, 500)}…
                  </p>

                  <a
                    href={listing.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-button"
                  >
                    🔗 Zur externen Anzeige
                  </a>
                  {isExternalJob && (
                    <p className="source-note">
                      Quelle: Adzuna
                    </p>
                  )}

                </>
              ) : (
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#444' }}>
                  {listing.description}
                </p>
              )}
            </div>
            {listing.kontaktdaten && listing.type !== 'dating' && (
              <div className="description" style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>Kontaktdaten</h3>
                <p>{listing.kontaktdaten}</p>
              </div>
            )}

            {listing.type === 'dating' && (
              <div className="description" style={{ marginTop: '20px' }}>
                <button className="contact-btn">
                  Kontaktdaten ansehen
                </button>
              </div>
            )}


            {!isExternalJob && (
              <button className="contact-button">
                Anbieter kontaktieren
              </button>
            )}
          </div>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО (LIGHTBOX) */}
      {isModalOpen && (
        <div className="lightbox-overlay" onClick={() => setIsModalOpen(false)}>
          <button className="close-lightbox" onClick={() => setIsModalOpen(false)}>×</button>

          {images.length > 1 && (
            <>
              {/* Левая стрелка */}
              <button className="nav-btn prev" onClick={prevImg}>
                <span className="arrow-icon"></span>
              </button>

              {/* Правая стрелка */}
              <button className="nav-btn next" onClick={nextImg}>
                <span className="arrow-icon"></span>
              </button>
            </>
          )}

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={images[activeIndex]} alt="Full view" />
            <div className="img-counter">{activeIndex + 1} / {images.length}</div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ListingDetail;