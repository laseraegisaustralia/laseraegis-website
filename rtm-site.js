(() => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open'); links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  const dialog = document.querySelector('.rtm-lightbox');
  const close = () => { dialog.close(); document.body.style.overflow = ''; };
  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('.rtm-image-link').forEach(a => a.addEventListener('click', event => {
      event.preventDefault();
      const image = dialog.querySelector('img');
      image.src = a.href; image.alt = a.querySelector('img').alt;
      dialog.querySelector('p').textContent = a.closest('figure').querySelector('figcaption').textContent;
      dialog.showModal(); document.body.style.overflow = 'hidden';
    }));
    dialog.querySelector('button').addEventListener('click', close);
    dialog.addEventListener('click', event => { if(event.target === dialog) close(); });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  }
})();
