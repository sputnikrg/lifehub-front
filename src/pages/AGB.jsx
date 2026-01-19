import React from 'react';

const AGB = () => {
  return (
    <main className="page-main">
      <div className="container" style={{ padding: '40px 20px', lineHeight: '1.6', color: '#333' }}>
        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
        
        <section>
          <h3>§ 1 Geltungsbereich und Anbieter</h3>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Plattform <strong>LifeHub</strong>. 
            Betreiber der Seite ist [Ваше Имя и Фамилия], [Ваш адрес в Германии].
          </p>
        </section>

        <section>
          <h3>§ 2 Leistungsbeschreibung</h3>
          <p>
            LifeHub stellt ein Online-Portal zur Verfügung, auf dem Nutzer Anzeigen (z.B. Immobilien, Jobs, Dating) veröffentlichen können. 
            LifeHub ist lediglich Vermittler und wird nicht selbst Vertragspartner der zwischen den Nutzern geschlossenen Verträge.
          </p>
        </section>

        <section>
          <h3>§ 3 Registrierung (Google Auth)</h3>
          <p>
            Für das Erstellen von Anzeigen ist eine Registrierung über Google OAuth erforderlich. 
            Der Nutzer ist verpflichtet, seine Zugangsdaten geheim zu halten. 
            Die Nutzung ist ausschließlich volljährigen Personen (ab 18 Jahren) gestattet.
          </p>
        </section>

        <section>
          <h3>§ 4 Pflichten der Nutzer</h3>
          <p>
            Die Nutzer sind für die von ihnen eingestellten Inhalte selbst verantwortlich. 
            Es ist untersagt, Inhalte zu veröffentlichen, die gegen gesetzliche Vorschriften (z.B. Urheberrecht, Strafrecht) oder die guten Sitten verstoßen.
          </p>
        </section>

        <section>
          <h3>§ 5 Haftungsausschluss</h3>
          <p>
            LifeHub übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der von Nutzern eingestellten Inhalte. 
            Die Haftung für Schäden aus der Nutzung der Plattform ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.
          </p>
        </section>

        <section>
          <h3>§ 6 Widerrufsrecht</h3>
          <p>
            Verbraucher haben ein gesetzliches Widerrufsrecht von 14 Tagen. 
            Bei digitalen Dienstleistungen erlischt dieses vorzeitig, wenn die Dienstleistung mit ausdrücklicher Zustimmung des Nutzers vor Ablauf der Frist vollständig erbracht wurde.
          </p>
        </section>

        <section>
          <h3>§ 7 Schlussbestimmungen</h3>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland. 
            Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
          </p>
        </section>

        <p style={{ marginTop: '30px', fontSize: '13px', color: '#777' }}>
          Stand: {new Date().toLocaleDateString('de-DE')}
        </p>
      </div>
    </main>
  );
};

export default AGB;