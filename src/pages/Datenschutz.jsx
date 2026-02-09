import React from 'react';

const Datenschutz = () => {
  return (
    <main className="page-main">
      <div className="container" style={{ padding: '40px 20px', lineHeight: '1.6' }}>
        <h1>Datenschutzerklärung</h1>

        <h3>1. Verantwortlicher</h3>
        <p>
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <p>
          <strong>Vadym Povolotskyi</strong><br />
          Karl-Baish-Str. 8<br />
          71384 Weinstadt<br />
          E-Mail: mylifehubde@gmail.com
        </p>

        <h3>2. Datenschutz auf einen Blick</h3>
        <p>
          Wir verarbeiten personenbezogene Daten der Nutzer ausschließlich im
          Rahmen der gesetzlichen Bestimmungen, insbesondere der DSGVO.
          Personenbezogene Daten werden nur erhoben, soweit dies zur Bereitstellung
          der Plattform LifeHub erforderlich ist.
        </p>

        <h3>3. Registrierung und Authentifizierung</h3>
        <p>
          Für die Nutzung bestimmter Funktionen (z.B. das Erstellen von Anzeigen)
          ist eine Registrierung über Google OAuth erforderlich. Dabei werden
          personenbezogene Daten wie Ihre E-Mail-Adresse verarbeitet.
        </p>
        <p>
          Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
          (Erfüllung eines Nutzungsverhältnisses) sowie Art. 6 Abs. 1 lit. a DSGVO
          (Einwilligung).
        </p>

        <h3>4. Hosting und Datenverarbeitung</h3>
        <p>
          Die Plattform wird über eine Cloud-Infrastruktur betrieben. Inhalte und
          Nutzerdaten werden in Datenbanken des Dienstleisters Supabase gespeichert.
          Eine Verarbeitung erfolgt ausschließlich zur Bereitstellung und Sicherheit
          der Plattform.
        </p>

        <h3>5. Cookies</h3>
        <p>
          Wir verwenden technisch notwendige Cookies, die für den Betrieb der
          Website und grundlegende Funktionen wie Anmeldung und Sicherheit
          erforderlich sind.
        </p>

        <h3>6. Google Analytics</h3>
        <p>
          Diese Website nutzt Google Analytics, einen Webanalysedienst der Google
          Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
        </p>
        <p>
          Google Analytics verwendet Cookies, die eine Analyse der Benutzung dieser
          Website ermöglichen. Die Nutzung von Google Analytics erfolgt ausschließlich
          auf Grundlage Ihrer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
        </p>
        <p>
          Vor Ihrer Zustimmung werden keine Analyse-Cookies gesetzt. Sie können Ihre
          Einwilligung jederzeit über die Cookie-Einstellungen widerrufen.
        </p>

        <h3>7. Speicherdauer</h3>
        <p>
          Personenbezogene Daten werden nur so lange gespeichert, wie dies für die
          jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten
          bestehen. Nutzer können jederzeit die Löschung ihres Kontos und ihrer Daten
          verlangen.
        </p>

        <h3>8. Rechte der betroffenen Personen</h3>
        <p>
          Sie haben das Recht auf Auskunft über die Verarbeitung Ihrer personenbezogenen
          Daten (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
          Einschränkung der Verarbeitung (Art. 18 DSGVO), Widerspruch (Art. 21 DSGVO)
          sowie Datenübertragbarkeit (Art. 20 DSGVO).
        </p>

        <h3>9. Beschwerderecht</h3>
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren,
          wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten
          gegen die DSGVO verstößt.
        </p>

        <p style={{ marginTop: '30px', fontSize: '13px', color: '#777' }}>
          Stand: {new Date().toLocaleDateString('de-DE')}
        </p>
      </div>
    </main>
  );
};

export default Datenschutz;
