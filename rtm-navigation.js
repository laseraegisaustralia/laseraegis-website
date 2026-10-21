(() => {
  const item = document.querySelector('.rtm-nav-item');
  if (!item) return;
  const toggle = item.querySelector('.rtm-dropdown-toggle');
  const set = open => { item.dataset.open = String(open); toggle.setAttribute('aria-expanded', String(open)); };
  item.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover) and (min-width:901px)').matches) set(true); });
  item.addEventListener('mouseleave', () => { if (matchMedia('(hover:hover) and (min-width:901px)').matches && !item.contains(document.activeElement)) set(false); });
  item.addEventListener('focusin', event => { if (!item.contains(event.relatedTarget) && matchMedia('(min-width:901px)').matches) set(true); });
  toggle.addEventListener('click', () => set(item.dataset.open !== 'true'));
  document.addEventListener('click', event => { if (!item.contains(event.target)) set(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && item.dataset.open === 'true') { set(false); toggle.focus(); }
  });
  item.addEventListener('focusout', event => { if (!item.contains(event.relatedTarget)) set(false); });
})();
