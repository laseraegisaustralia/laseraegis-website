// Directory URLs are served by GitHub Pages, but file:// needs an explicit file.
// Leave all published links and canonical URLs unchanged on HTTP and HTTPS.
(() => {
  if (window.location.protocol !== 'file:') return;
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.getAttribute('href'), window.location.href);
    if (url.protocol === 'file:' && url.pathname.endsWith('/')) {
      url.pathname += 'index.html';
      link.href = url.href;
    }
  });
})();
