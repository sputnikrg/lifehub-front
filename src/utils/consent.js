const STORAGE_KEY = 'lh_consent';
const GA_ID = 'G-HCSTJ31YZ4'; // ← твой GA ID

export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadGoogleAnalytics() {
  if (window.gtag) return;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    anonymize_ip: true
  });
}

export function applyConsent(analyticsGranted) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      analytics: analyticsGranted,
      timestamp: Date.now()
    })
  );

  if (analyticsGranted === true) {
    loadGoogleAnalytics();
  }
}
