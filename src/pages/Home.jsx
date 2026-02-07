import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { supabase } from '../supabaseClient';

const Home = ({ t, lang }) => {
  const [hotRent, setHotRent] = useState([]);
  const [topJobs, setTopJobs] = useState([]);

  useEffect(() => {
    document.title =
      lang === "de"
        ? "LifeHub — Anzeigen, Jobs und Community in Deutschland"
        : "LifeHub — объявления, работа и сообщество в Германии";

    fetchSideData();
  }, [lang]);

  const fetchSideData = async () => {
    const { data: rent } = await supabase.from('listings').select('*').eq('type', 'wohnung').limit(4).order('created_at', { ascending: false });
    if (rent) setHotRent(rent);

    const { data: jobs } = await supabase
      .from('listings')
      .select('*')
      .eq('type', 'job')     // Берем работу
      .eq('mode', 'offer')   // Только вакансии (предложения)
      .limit(4)
      .order('created_at', { ascending: false });

    if (jobs) setTopJobs(jobs);
  };

  const categories = [
    { type: 'wohnung', title: t.cat_wohnung, img: '/assets/img/wohnung.jpg', desc: t.cat_wohnung_desc || 'Modernes Wohnen' },
    { type: 'job', title: t.cat_job, img: '/assets/img/job.jpg', desc: t.cat_job_desc || 'Karrierechancen' },
    { type: 'dating', title: t.cat_dating, img: '/assets/img/dating.jpg', desc: t.cat_dating_desc || 'Lerne Leute kennen' }
  ];

  return (
    <>
      <Helmet>
        <title>{lang === "de" ? "LifeHub — Anzeigen, Jobs und Community in Deutschland" : "LifeHub — объявления, работа и сообщество в Германии"}</title>

        <meta name="description" content={
          lang === "de"
            ? "Suchen und finden Sie aktuelle Stellenangebote, Mietwohnungen und neue Kontakte in Deutschland. LifeHub — Ihr lokaler Marktplatz für Arbeit, Immobilien und Community."
            : "Ищите и находите актуальные вакансии, жилье и новые знакомства в Германии. LifeHub — ваша локальная платформа для поиска работы, недвижимости и общения."
        } />

        {/* Добавим ключевые слова для поисковиков */}
        <meta name="keywords" content="Работа в Германии, Жилье в Германии, Знакомства в Германии, Работа Штутгарт, Jobs in Deutschland, Wohnung mieten, Community Deutschland" />

        <link rel="canonical" href="https://mylifehub.de/" />
      </Helmet>

      <section className="hero">
        <div className="hero-content">
          <h1>{t.hero_main_title}</h1>
          <p style={{ marginTop: '10px', fontSize: '16px', opacity: 0.85 }}>{t.hero_main_subtitle}</p>
        </div>
      </section>

      <div className="home-layout-wrapper">
        {/* ЛЕВАЯ КОЛОНКА */}
        <aside className="home-side-widget">
          <h3 className="widget-title">Hot-Immobile</h3>
          <div className="mini-card-grid">
            {hotRent.map(item => (
              <Link key={item.id} to={`/listing/wohnung/${item.id}`} className="mini-item">
                <div className="mini-img-box"><img src={item.images?.[0] || "/assets/img/placeholder.jpg"} alt="" /></div>
                <span className="mini-label">{item.title}</span>
                <span className="mini-price">{item.price} €</span>
                <span className="mini-city">{item.city}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* ЦЕНТР: КАТЕГОРИИ */}
        <main className="home-center-main">
          <div className="cards">
            {categories.map((cat) => (
              <div key={cat.type} className={`card ${cat.type}`}>
                <img src={cat.img} alt={cat.title} />
                <div className="overlay">
                  <h2>{cat.title}</h2>
                  <p>{cat.desc}</p>

                  {/* Логика кнопок: для жилья и работы разделяем на Offer/Search */}
                  {(cat.type === 'wohnung' || cat.type === 'job') ? (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', width: '100%', justifyContent: 'center' }}>
                      <Link
                        to={cat.type === 'wohnung' ? '/immo/offer' : '/job/offer'}
                        className="card-button"
                        style={{ flex: 1, padding: '8px 5px', fontSize: '13px', textAlign: 'center' }}
                      >
                        {t.offer_label || (lang === 'de' ? 'Angebote' : 'Предложения')}
                      </Link>
                      <Link
                        to={cat.type === 'wohnung' ? '/immo/search' : '/job/search'}
                        className="card-button"
                        style={{ flex: 1, padding: '8px 5px', fontSize: '13px', textAlign: 'center' }}
                      >
                        {t.search_label || (lang === 'de' ? 'Gesuche' : 'Поиск')}
                      </Link>
                    </div>
                  ) : (
                    <Link to={`/${cat.type}`} className="card-button">
                      {t.cat_all}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* ПРАВАЯ КОЛОНКА */}
        <aside className="home-side-widget">
          {/* Понятный заголовок для раздела работы */}
          <h3 className="widget-title">{lang === 'de' ? 'Es gibt Arbeit!' : 'Есть работа!'}</h3>
          <div className="mini-card-grid">
            {topJobs.map(item => (
              <Link key={item.id} to={`/listing/job/${item.id}`} className="mini-item">
                <div className="mini-img-box">
                  <img src={item.images?.[0] || "/assets/img/placeholder.jpg"} alt="" />
                </div>
                <span className="mini-label">{item.title}</span>
                <span className="mini-price">{item.price > 0 ? `${item.price} €` : (lang === 'de' ? 'VB' : 'Договорная')}</span>
                <span className="mini-city">{item.city}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Home;