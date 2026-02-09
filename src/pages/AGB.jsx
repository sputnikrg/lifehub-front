import React from 'react';

const AGB = () => {
  return (
    <main className="page-main">
      <div
        className="container"
        style={{ padding: '40px 20px', lineHeight: '1.6', color: '#333' }}
      >
        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

        <section>
          <h3>§ 1 Geltungsbereich und Anbieter</h3>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der
            Plattform <strong>LifeHub</strong>. Betreiber der Plattform ist
            Vadym Povolotskyi, Karl-Baish-Str 8, 71384, Weinstadt.
          </p>
        </section>

        <section>
          <h3>§ 2 Leistungsbeschreibung</h3>
          <p>
            LifeHub stellt ein Online-Portal zur Verfügung, auf dem Nutzer
            kostenfrei Anzeigen (z.B. Immobilien und Jobs) veröffentlichen
            können. LifeHub stellt lediglich die technische Plattform bereit
            und wird nicht Vertragspartner der zwischen den Nutzern
            zustande kommenden Verträge.
          </p>
        </section>

        <section>
          <h3>§ 3 Registrierung</h3>
          <p>
            Für das Erstellen von Anzeigen ist eine Registrierung über Google
            OAuth erforderlich. Der Nutzer ist verpflichtet, seine Zugangsdaten
            geheim zu halten. Die Nutzung der Plattform ist ausschließlich
            volljährigen Personen (ab 18 Jahren) gestattet.
          </p>
        </section>

        <section>
          <h3>§ 4 Pflichten der Nutzer</h3>
          <p>
            Nutzer sind für die von ihnen eingestellten Inhalte selbst
            verantwortlich. Es ist untersagt, Inhalte zu veröffentlichen, die
            gegen geltende gesetzliche Vorschriften, Rechte Dritter oder die
            guten Sitten verstoßen.
          </p>
        </section>

        <section>
          <h3>§ 5 Haftung</h3>
          <p>
            LifeHub übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit
            oder Aktualität der von Nutzern eingestellten Inhalte. LifeHub
            haftet nur bei Vorsatz und grober Fahrlässigkeit sowie bei
            Verletzung wesentlicher Vertragspflichten im Rahmen der
            gesetzlichen Bestimmungen.
          </p>
        </section>

        <section>
          <h3>§ 6 Schlussbestimmungen</h3>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne
            Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die
            Wirksamkeit der übrigen Bestimmungen unberührt.
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
