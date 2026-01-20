import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

// ✅ ДОБАВЛЕНО: принимаем lang
const Home = ({ t, lang }) => {

  // ✅ ДОБАВЛЕНО: мгновенное обновление title при смене языка
  useEffect(() => {
    document.title =
      lang === "de"
        ? "LifeHub — Anzeigen, Jobs und Community in Deutschland"
        : "LifeHub — объявления, работа и сообщество в Германии";
  }, [lang]);

  // Данные для карточек категорий теперь используют объект t
  const categories = [
    {
      type: 'wohnung',
      title: t.cat_wohnung,
      img: '/assets/img/wohnung.jpg',
      desc: t.cat_wohnung_desc || 'Modernes Wohnen'
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
      <Helmet>
        <title>
          {lang === "de"
            ? "LifeHub — Anzeigen, Jobs und Community in Deutschland"
            : "LifeHub — объявления, работа и сообщество в Германии"}
        </title>
      </Helmet>

      <section className="hero">
        <div className="hero-content">
          <h1>{t.hero_main_title}</h1>
          <p style={{ marginTop: '10px', fontSize: '16px', opacity: 0.85 }}>
            {t.hero_main_subtitle}
          </p>
        </div>
      </section>

      <section style={{ padding: '10px 20px 5px', textAlign: 'center' }}>
        <p
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            fontSize: '14px',
            opacity: 0.85
          }}
        >
          🔹 {t.trust_block}
        </p>
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
