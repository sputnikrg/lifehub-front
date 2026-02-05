import React from 'react';
import ListingCard from '../components/ListingCard';

const MyListings = ({ listings, currentUser, favorites, onToggleFav, onDelete, t }) => {
  // Фильтруем объявления так, чтобы показывать только те, что принадлежат текущему пользователю
  const userListings = listings.filter(item => item.user_id === currentUser?.id);

  return (
    <main className="page-main">
      {/* ===== HERO SECTION ===== */}
      <section className="page-hero">
        <div className="container">
          <h1>{t.nav_my_ads}</h1>
          <p>{t.my_ads_subtitle}</p>
        </div>
      </section>

      {/* ===== LISTINGS SECTION ===== */}
      <section className="page-listings">
        <div className="container">
          {userListings.length > 0 ? (
            <div className="listing-grid grid">
              {userListings.map(item => {
                // Динамически определяем текст бейджа для каждой карточки пользователя
                // Если mode === 'search', берем перевод для поиска, если 'offer' — для предложения
                const itemBadge = item.mode === 'search' 
                  ? { label: t.job_search || 'Gesuch' } 
                  : item.mode === 'offer' 
                    ? { label: t.job_offer || 'Angebot' } 
                    : null;

                return (
                  <ListingCard
                    key={item.id}
                    item={item}
                    badge={itemBadge} // Передаем вычисленный бейдж в карточку
                    isFav={favorites.includes(item.id)}
                    onToggleFav={onToggleFav}
                    onDelete={onDelete}
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: 'center', marginTop: '50px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>{t.no_my_ads}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MyListings;