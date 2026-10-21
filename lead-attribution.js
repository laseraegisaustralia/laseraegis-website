/* Session campaign attribution. Contact details never enter storage or GA events. */
(() => {
  'use strict';
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const storageKey = 'laseraegis_campaign_v1';
  const clean = value => String(value || '').replace(/[<>]/g, '').replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted]').slice(0, 100);
  const safePath = value => {
    try { const u = new URL(value, location.href); return (u.origin + u.pathname).slice(0, 240); }
    catch { return ''; }
  };
  let record = {};
  try { record = JSON.parse(sessionStorage.getItem(storageKey) || '{}'); } catch { /* Storage can be unavailable. */ }
  const q = new URLSearchParams(location.search);
  const incoming = Object.fromEntries(keys.map(key => [key, clean(q.get(key))]));
  if (!record.landing_page) {
    record = { landing_page: safePath(location.href), referrer: document.referrer ? safePath(document.referrer) : '', first: incoming, latest: incoming };
  } else if (keys.some(key => incoming[key])) {
    record.latest = incoming;
  }
  try { sessionStorage.setItem(storageKey, JSON.stringify(record)); } catch { /* Forms still work without storage. */ }
  const fields = () => ({
    ...Object.fromEntries(keys.map(key => [key, record.latest?.[key] || ''])),
    ...Object.fromEntries(keys.map(key => ['first_' + key, record.first?.[key] || ''])),
    landing_page: record.landing_page || safePath(location.href),
    referrer: record.referrer || ''
  });
  const eventFields = () => Object.fromEntries(keys.map(key => [key, clean(record.latest?.[key])]));
  const fillForm = form => {
    Object.entries(fields()).forEach(([name, value]) => {
      let input = form.querySelector(`input[name="${name}"]`);
      if (!input) { input = document.createElement('input'); input.type = 'hidden'; input.name = name; form.append(input); }
      input.value = value;
    });
  };
  window.LaserAegisAttribution = { fields, eventFields, fillForm, clean };
  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('form').forEach(fillForm));
  document.addEventListener('click', event => {
    const a = event.target.closest?.('a[data-product="RTM"][data-request-type]');
    if (!a || typeof window.gtag !== 'function') return;
    window.gtag('event', 'rtm_cta_click', {
      product_id: 'RTM', request_type: clean(a.dataset.requestType),
      cta_id: clean(a.dataset.ctaId || a.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')),
      source_page: location.pathname, ...eventFields()
    });
  });
})();
