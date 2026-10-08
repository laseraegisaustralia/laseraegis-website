(() => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const closeMenu = () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });
  const details = document.querySelector('.article-sidebar details');
  if (details && window.matchMedia('(max-width: 900px)').matches) details.open = false;
  const progress = document.getElementById('readingProgress');
  const article = document.querySelector('.article-body');
  if (article && progress) {
    let pending = false;
    const update = () => {
      const start = article.getBoundingClientRect().top + window.scrollY;
      const end = start + article.offsetHeight - window.innerHeight * .65;
      const fraction = Math.max(0, Math.min(1, (window.scrollY - start + 140) / Math.max(1, end - start)));
      progress.style.transform = `scaleX(${fraction})`;
      pending = false;
    };
    window.addEventListener('scroll', () => {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.article-sidebar nav a').forEach(a => {
            const current = a.hash === `#${entry.target.id}`;
            a.classList.toggle('current', current);
            if (current) a.setAttribute('aria-current', 'location');
            else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    article.querySelectorAll('section[id]').forEach(section => observer.observe(section));
  }
})();
