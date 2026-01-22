import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { PayPalButtons } from "@paypal/react-paypal-js";

const ListingDetail = ({ favorites, onToggleFav }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Состояния для галереи
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---- Paywall для kontaktdaten ----
  const CONTACT_PRICE = 5;
  const PAYMENTS_ENABLED = false;
  const [showPayModal, setShowPayModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchListingAndIncrementViews = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setListing(data);

        if (data.type === 'dating' && user) {
          const { data: paid } = await supabase
            .from('paid_contacts')
            .select('id')
            .eq('user_id', user.id)
            .eq('listing_id', data.id)
            .maybeSingle();
          if (paid) setIsPaid(true);
        }

        supabase.rpc('increment_views', { row_id: id });
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
  const images = (listing.images && listing.images.length > 0)
    ? listing.images
    : ["/assets/img/placeholder.jpg"];

  const nextImg = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1 === images.length ? 0 : prev + 1));
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <main className="page-main">
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            className="back-link"
            style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}
          >
            ← Zurück
          </button>

          <div className="listing-detail-grid">
            <div className="listing-gallery-side">
              <div className="listing-gallery-container">
                <div className="main-image-wrapper" onClick={() => setIsModalOpen(true)}>
                  <img src={images[activeIndex]} alt={listing.title} className="main-image" />
                  {images.length > 1 && <span className="zoom-hint">🔍 Klick для увеличения</span>}
                </div>

                {/* СЕКЦИЯ МИНИАТЮР */}
                {images.length > 1 && (
                  <div className="thumbnails-grid">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className={`thumb-item ${i === activeIndex ? 'active' : ''}`}
                        style={{ position: 'relative' }}
                      >
                        <img 
                          src={img} 
                          alt={`Thumb ${i}`} 
                          onClick={() => setActiveIndex(i)} 
                        />

                        {/* Кнопка удаления для автора */}
                        {currentUser && currentUser.id === listing.user_id && listing.images?.length > 0 && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm("Удалить это фото?")) {
                                const updatedImages = listing.images.filter((_, index) => index !== i);
                                const { error } = await supabase
                                  .from('listings')
                                  .update({ images: updatedImages })
                                  .eq('id', listing.id);

                                if (!error) {
                                  setListing({ ...listing, images: updatedImages });
                                  if (activeIndex >= updatedImages.length) setActiveIndex(0);
                                }
                              }
                            }}
                            style={{
                              position: 'absolute', top: '-5px', right: '-5px',
                              background: '#e74c3c', color: 'white', border: 'none',
                              borderRadius: '50%', width: '22px', height: '22px',
                              cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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

              <p className="price" style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: '15px 0' }}>
                {listing.price
                  ? `${listing.price} ${listing.type === 'dating' ? 'Jahre' : '€'}`
                  : 'Preis auf Anfrage'}
              </p>
              <p className="city" style={{ color: '#666', fontSize: '16px' }}>📍 {listing.city}</p>
              
              <hr style={{ margin: '25px 0', border: '0', borderTop: '1px solid #eee' }} />

              <div className="description">
                <h3>Beschreibung</h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#444' }}>{listing.description}</p>
              </div>

              {listing.kontaktdaten && (
                <div className="description" style={{ marginTop: '20px' }}>
                  <h3>Kontaktdaten</h3>
                  <p>{listing.kontaktdaten}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* LIGHTBOX */}
      {isModalOpen && (
        <div
          className="lightbox-overlay"
          onClick={() => setIsModalOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            style={{ position: 'absolute', top: '20px', right: '25px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '30px', cursor: 'pointer', zIndex: 10001 }}
          > × </button>

          {images.length > 1 && (
            <>
              <button className="nav-btn prev" onClick={(e) => { e.stopPropagation(); prevImg(e); }} style={{ position: 'absolute', left: '20px', top: '50%', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', width: '60px', height: '60px', border: '2px solid white', cursor: 'pointer' }}>
                ❮
              </button>
              <button className="nav-btn next" onClick={(e) => { e.stopPropagation(); nextImg(e); }} style={{ position: 'absolute', right: '20px', top: '50%', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', width: '60px', height: '60px', border: '2px solid white', cursor: 'pointer' }}>
                ❯
              </button>
            </>
          )}

          <div className="lightbox-content">
            <img src={images[activeIndex]} alt="Full" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }} />
          </div>
        </div>
      )}

      {/* PAY MODAL */}
      {showPayModal && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }} onClick={() => setShowPayModal(false)}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '400px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h3>Kontaktdaten freischalten</h3>
            <p>Preis: <strong>{CONTACT_PRICE} €</strong></p>
            <PayPalButtons 
              createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: CONTACT_PRICE.toString() } }] })}
              onApprove={async (data, actions) => {
                await actions.order.capture();
                await supabase.from('paid_contacts').insert({ user_id: currentUser.id, listing_id: listing.id });
                setIsPaid(true);
                setShowPayModal(false);
              }}
            />
            <button onClick={() => setShowPayModal(false)} style={{ marginTop: '10px' }}>Abbrechen</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ListingDetail;