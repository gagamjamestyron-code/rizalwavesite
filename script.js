/* Interactive enhancements for the José Rizal archive. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .menu-toggle {
      display: none;
      align-items: center;
      justify-content: center;
      gap: .55rem;
      min-height: 42px;
      padding: 8px 13px;
      border: 1px solid rgba(255,250,242,.3);
      border-radius: 9px;
      background: rgba(255,250,242,.08);
      color: #fffaf2;
      font: inherit;
      cursor: pointer;
    }
    .menu-toggle .menu-icon { font-size: 1.25rem; line-height: 1; }
    .back-to-top {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 20;
      display: grid;
      width: 48px;
      height: 48px;
      place-items: center;
      border: 1px solid rgba(255,250,242,.35);
      border-radius: 50%;
      background: #99552f;
      color: #fffaf2;
      box-shadow: 0 8px 24px rgba(0,0,0,.28);
      font-size: 1.4rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transform: translateY(8px);
      transition: opacity 180ms ease, transform 180ms ease, visibility 180ms;
    }
    .back-to-top.is-visible { opacity: 1; visibility: visible; transform: translateY(0); }
    .js-reveal { opacity: 0; transform: translateY(14px); transition: opacity 450ms ease, transform 450ms ease; }
    .js-reveal.is-visible { opacity: 1; transform: translateY(0); }
    .timeline-item.is-current { border-radius: 8px; background: rgba(255,250,242,.08); }
    @media (max-width: 760px) {
      .nav-wrap.menu-enhanced { align-items: stretch; }
      .menu-toggle { display: inline-flex; align-self: flex-start; }
      .nav-wrap.menu-enhanced .nav-links { display: none; flex-direction: column; align-items: stretch; width: 100%; padding: 4px 0 8px; }
      .nav-wrap.menu-enhanced .nav-links.is-open { display: flex; }
      .nav-wrap.menu-enhanced .nav-links a { width: 100%; padding: 10px 12px; font-size: .9rem; }
      .back-to-top { right: 14px; bottom: 14px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .js-reveal, .back-to-top { transition: none !important; }
      .js-reveal { opacity: 1; transform: none; }
    }
  `;
  document.head.append(style);

  const nav = document.querySelector('.nav-links');
  const navWrap = nav?.closest('.nav-wrap');
  if (nav && navWrap) {
    navWrap.classList.add('menu-enhanced');
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'site-navigation');
    toggle.innerHTML = '<span class="menu-icon" aria-hidden="true">☰</span><span>Menu</span>';
    nav.id = 'site-navigation';
    navWrap.insertBefore(toggle, nav);

    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.menu-icon').textContent = '☰';
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      toggle.querySelector('.menu-icon').textContent = open ? '×' : '☰';
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  const topButton = document.createElement('button');
  topButton.className = 'back-to-top';
  topButton.type = 'button';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.title = 'Back to top';
  topButton.textContent = '↑';
  document.body.append(topButton);
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const updateTopButton = () => topButton.classList.toggle('is-visible', window.scrollY > 320);
  window.addEventListener('scroll', updateTopButton, { passive: true });
  updateTopButton();

  const revealTargets = document.querySelectorAll(
    '.info-card, .photo-grid .photo-frame, .work-card, .book-feature, .source-card, .timeline-item, .article-copy, .fact-card, .reflection-author, .reflection-box'
  );
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((element) => {
      element.classList.add('js-reveal');
      observer.observe(element);
    });

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.timeline-item.is-current').forEach((item) => item.classList.remove('is-current'));
          entry.target.classList.add('is-current');
        }
      });
    }, { rootMargin: '-35% 0px -45% 0px' });
    document.querySelectorAll('.timeline-item').forEach((item) => timelineObserver.observe(item));
  }
})();
