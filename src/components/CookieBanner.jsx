import { useEffect, useState } from 'react';
import { translations } from '../translations';
import { applyConsent, getStoredConsent } from '../utils/consent';

export default function CookieBanner({ lang }) {
  const [visible, setVisible] = useState(false);
  const t = translations[lang] || translations.de;

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    } else {
      applyConsent(stored.analytics);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <strong>{t.cookie_title}</strong>
      <p>{t.cookie_text}</p>

      <div className="cookie-actions">
        <button onClick={() => {
          applyConsent(true);
          setVisible(false);
        }}>
          {t.cookie_accept}
        </button>

        <button onClick={() => {
          applyConsent(false);
          setVisible(false);
        }}>
          {t.cookie_decline}
        </button>
      </div>
    </div>
  );
}
