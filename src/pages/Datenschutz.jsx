import React from 'react';

const Datenschutz = () => {
  return (
    <main className="page-main">
      <div className="container" style={{ padding: '40px 20px', lineHeight: '1.6' }}>
        <h1>Datenschutz­erklärung</h1>
        <h3>1. Datenschutz auf einen Blick</h3>
        <p>Wir erheben Daten wie Ihre E-Mail-Adresse nur zum Zweck der Authentifizierung über Google Firebase/Supabase.</p>
        <h3>2. Hosting und Storage</h3>
        <p>Unsere Website wird bei Netlify gehostet. Bilder und Daten werden sicher in Supabase-Datenbanken gespeichert.</p>
        <h3>3. Cookies</h3>
        <p>Wir verwenden nur technisch notwendige Cookies, die für die Anmeldung erforderlich sind.</p>
      </div>
    </main>
  );
};

export default Datenschutz;