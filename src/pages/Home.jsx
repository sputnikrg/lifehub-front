import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ t }) => {
  // Данные для карточек категорий теперь используют объект t
  const categories = [
    {
      type: 'wohnung',
      title: t.cat_wohnung,
      img: '/assets/img/wohnung.jpg',
      desc: t.cat_wohnung_desc || 'Modernes Wohnen' // Можно добавить описание в translations.js позже
    },
    {
      type: 'job',
      title: t.cat_job,
      img: '/assets/img/job.jpg',
      desc: t.cat_job_desc || 'Karrierechancen'
    },
    {
      type: 'dating',
      title: t.cat_dating,
      img: '/assets/img/dating.jpg',
      desc: t.cat_dating_desc || 'Lerne Leute kennen'
    }
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>{t.hero_title || 'LifeHub'}</h1>
          <p>{t.hero_subtitle || 'Deutschland'}</p>
        </div>
      </section>

      <main className="cards">
        {categories.map((cat) => (
          <div key={cat.type} className={`card ${cat.type}`}>
            <img src={cat.img} alt={cat.title} />
            <div className="overlay">
              <h2>{cat.title}</h2>
              <p>{cat.desc}</p>
              <Link to={`/${cat.type}`} className="card-button">
                {t.cat_all}
              </Link>
            </div>
          </div>
        ))}
      </main>
    </>
  );
};

export default Home;