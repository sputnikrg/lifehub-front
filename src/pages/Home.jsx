import React, { useState, useEffect } from 'react'; // Добавил useState для данных
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { supabase } from '../supabaseClient'; // Добавил импорт базы

const Home = ({ t, lang }) => {
  const [hotRent, setHotRent] = useState([]);
  const [topDating, setTopDating] = useState([]);

  useEffect(() => {
    document.title =
      lang === "de"
        ? "LifeHub — Anzeigen, Jobs und Community in Deutschland"
        : "LifeHub — объявления, работа и сообщество в Германии";
    
    // Загружаем данные для боковых колонок
    fetchSideData();
  }, [lang]);

  const fetchSideData = async () => {
    // Берем 4 свежих квартиры
    const { data: rent } = await supabase.from('listings').select('*').eq('type', 'wohnung').limit(4).order('created_at', { ascending: false });
    if (rent) setHotRent(rent);

    // Берем 4 свежих анкеты
    const { data: dating } = await supabase.from('listings').select('*').eq('type', 'dating').limit(4).order('created_at', { ascending: false });
    if (dating) setTopDating(dating);
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
        <meta name="description" content={lang === "de" ? "LifeHub ist eine..." : "LifeHub — платформа для..."} />
        <link rel="canonical" href="https://mylifehub.de/" />
      </Helmet>

      <section className="hero">
        <div className="hero-content">
          <h1>{t.hero_main_title}</h1>
          <p style={{ marginTop: '10px', fontSize: '16px', opacity: 0.85 }}>{t.hero_main_subtitle}</p>
        </div>
      </section>

      {/* НОВАЯ СТРУКТУРА С БОКОВЫМИ ПАНЕЛЯМИ */}
      <div className="home-layout-wrapper">
        
        {/* ЛЕВАЯ КОЛОНКА: HOT-IMMOBILE */}
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

        {/* ЦЕНТР: ТВОИ ТЕКУЩИЕ КАТЕГОРИИ (БЕЗ ИЗМЕНЕНИЙ) */}
        <main className="home-center-main">
          <div className="cards">
            {categories.map((cat) => (
              <div key={cat.type} className={`card ${cat.type}`}>
                <img src={cat.img} alt={cat.title} />
                <div className="overlay">
                  <h2>{cat.title}</h2>
                  <p>{cat.desc}</p>
                  <Link to={`/${cat.type}`} className="card-button">{t.cat_all}</Link>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* ПРАВАЯ КОЛОНКА: TOP-DATING */}
        <aside className="home-side-widget">
          <h3 className="widget-title">Top-Dating</h3>
          <div className="mini-card-grid">
            {topDating.map(item => (
              <Link key={item.id} to={`/listing/dating/${item.id}`} className="mini-item">
                <div className="mini-img-box"><img src={item.images?.[0] || "/assets/img/placeholder.jpg"} alt="" /></div>
                <span className="mini-label">{item.title}</span>
                <span className="mini-price">{item.price} Jahre</span>
                <span className="mini-city">{item.city}</span>
              </Link>
            ))}
          </div>
        </aside>

      </div>
      
      {/* Твой футер и заметки остаются ниже... */}
    </>
  );
};

export default Home;