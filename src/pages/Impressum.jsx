import React from 'react';

const Impressum = () => {
  return (
    <main className="page-main">
      <div className="container" style={{ padding: '40px 20px', lineHeight: '1.6' }}>
        <h1>Impressum</h1>
        <p>Angaben gemäß § 5 TMG:</p>
        <p>
          <strong>Betreiber:</strong> [Твое Имя и Фамилия]<br />
          <strong>Adresse:</strong> [Твой адрес в Германии]<br />
          <strong>Kontakt:</strong> vpovolotskyi25@gmail.com
        </p>
        <h3>Haftungsausschluss</h3>
        <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
      </div>
    </main>
  );
};

export default Impressum;