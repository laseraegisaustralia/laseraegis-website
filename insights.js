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

/* Article share bar: LinkedIn, email and copy link. No third-party scripts; links carry UTM tags so shared visits are attributable. */
(() => {
  const body = document.querySelector('.article-body');
  if (!body || document.querySelector('.article-share')) return;
  const canonical = document.querySelector('link[rel="canonical"]')?.href || (location.origin + location.pathname);
  const title = document.querySelector('meta[property="og:title"]')?.content || document.title;
  const tagged = (source, medium) => {
    const u = new URL(canonical);
    u.searchParams.set('utm_source', source);
    u.searchParams.set('utm_medium', medium);
    u.searchParams.set('utm_campaign', 'article_share');
    return u.href;
  };
  const linkedIn = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(tagged('linkedin', 'social'));
  const mail = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent('I thought this might be useful:\n\n' + title + '\n' + tagged('email', 'share'));
  const icon = {
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M10 14a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5M14 10a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5"/></svg>'
  };
  const bar = document.createElement('aside');
  bar.className = 'article-share';
  bar.setAttribute('aria-label', 'Share this article');
  bar.innerHTML = `<p class="article-share-label">Share this article</p><div class="article-share-actions">
    <a class="article-share-btn is-linkedin" href="${linkedIn}" target="_blank" rel="noopener" data-share="linkedin">${icon.linkedin}<span>LinkedIn</span></a>
    <a class="article-share-btn" href="${mail}" data-share="email">${icon.mail}<span>Email</span></a>
    <button class="article-share-btn" type="button" data-share="copy_link">${icon.link}<span>Copy link</span></button>
  </div><p class="article-share-status" role="status" aria-live="polite"></p>`;
  body.append(bar);
  const status = bar.querySelector('.article-share-status');
  const track = method => { if (typeof window.gtag === 'function') window.gtag('event', 'share', { method, content_type: 'article', item_id: location.pathname }); };
  bar.querySelectorAll('a[data-share]').forEach(a => a.addEventListener('click', () => track(a.dataset.share)));
  bar.querySelector('button[data-share]').addEventListener('click', async () => {
    const url = tagged('shared_link', 'share');
    try { await navigator.clipboard.writeText(url); status.textContent = 'Link copied.'; }
    catch { window.prompt('Copy this link:', url); }
    track('copy_link');
    setTimeout(() => { status.textContent = ''; }, 2500);
  });
})();
