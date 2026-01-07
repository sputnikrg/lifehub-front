import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Данные для карточек категорий
  const categories = [
    {
      type: 'wohnung',
      title: 'Wohnung',
      img: '/assets/img/wohnung.jpg',
      desc: 'Modernes 3-Zimmer-Apartment mit Südbalkon в центральном районе.'
    },
    {
      type: 'job',
      title: 'Job',
      img: '/assets/img/job.jpg',
      desc: 'Entdecke spannende Karrierechancen. Найди работу своей мечты!'
    },
    {
      type: 'dating',
      title: 'Dating',
      img: '/assets/img/dating.jpg',
      desc: 'Lerne neue Leute kennen. Найди друзей или вторую половинку.'
    }
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Finde Wohnung, Job und neue Leute an einem Ort</h1>
          <p>Die neuesten Angebote ganzer Welt</p>
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
                Alle ansehen &gt;
              </Link>
            </div>
          </div>
        ))}
      </main>
    </>
  );
};

export default Home;