import React from 'react';

const Datenschutz = () => {
  return (
    <main className="page-main">
      <div className="container" style={{ padding: '40px 20px', lineHeight: '1.6' }}>
        <h1>Datenschutz­erklärung</h1>

        <h3>1. Datenschutz auf einen Blick</h3>
        <p>
          Wir erheben personenbezogene Daten wie Ihre E-Mail-Adresse ausschließlich
          zum Zweck der Authentifizierung über Google OAuth / Supabase.
        </p>

        <h3>2. Hosting und Storage</h3>
        <p>
          Unsere Website wird über eine Cloud-Infrastruktur bereitgestellt.
          Inhalte und Nutzerdaten werden sicher in Supabase-Datenbanken gespeichert.
        </p>

        <h3>3. Cookies</h3>
        <p>
          Wir verwenden technisch notwendige Cookies, die für grundlegende
          Funktionen wie Anmeldung und Sicherheit erforderlich sind.
        </p>

        {/* ✅ ДОБАВЛЕНО */}
        <h3>4. Google Analytics</h3>
        <p>
          Diese Website nutzt Google Analytics, einen Webanalysedienst der
          Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
        </p>
        <p>
          Google Analytics verwendet Cookies, die eine Analyse der Benutzung
          dieser Website durch Sie ermöglichen. Die dadurch erzeugten Informationen
          über Ihre Nutzung dieser Website werden in der Regel an einen Server von
          Google übertragen und dort gespeichert.
        </p>
        <p>
          Die Nutzung von Google Analytics erfolgt ausschließlich auf Grundlage
          Ihrer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
          Vor Ihrer Zustimmung werden keine Analyse-Cookies gesetzt.
        </p>
        <p>
          Sie können Ihre Einwilligung jederzeit über die Cookie-Einstellungen
          widerrufen oder ändern.
        </p>
      </div>
    </main>
  );
};

export default Datenschutz;
