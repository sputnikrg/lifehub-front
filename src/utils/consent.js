const STORAGE_KEY = 'lh_consent';

export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function applyConsent(analyticsGranted) {
  if (!window.gtag) return;

  window.gtag('consent', 'update', {
    analytics_storage: analyticsGranted ? 'granted' : 'denied'
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      analytics: analyticsGranted,
      timestamp: Date.now()
    })
  );
}
