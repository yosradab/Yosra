(() => {
  'use strict';

  /* ══════════════════════════════════
     CURSOR
  ══════════════════════════════════ */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const lbl  = document.getElementById('cursor-label');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * .13;
    ry += (my - ry) * .13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('.hover-target').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('expanded');
      lbl.textContent = el.dataset.label || '';
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('expanded');
      lbl.textContent = '';
    });
  });

  /* ══════════════════════════════════
     PROGRESS BAR
  ══════════════════════════════════ */
  const pgBar = document.getElementById('pg-bar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement, b = document.body;
    const pct = (h.scrollTop || b.scrollTop) /
                ((h.scrollHeight || b.scrollHeight) - h.clientHeight) * 100;
    pgBar.style.width = pct + '%';
  }, { passive: true });

  /* ══════════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════════ */
  const rvObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      // Animate skill bars when revealed
      e.target.querySelectorAll('.bar-fill').forEach(b => {
        b.style.width = b.dataset.w + '%';
      });
      // Animate edu cards line
      if (e.target.classList.contains('edu-card')) {
        e.target.classList.add('in');
      }
      rvObs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '-40px 0px' });

  document.querySelectorAll('.rv, .edu-card, .int-card').forEach(el => rvObs.observe(el));

  // Animate experience row left border
  const expObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        expObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.exp-row').forEach(el => expObs.observe(el));

  /* ══════════════════════════════════
     COUNTER ANIMATION
  ══════════════════════════════════ */
  const counters = document.querySelectorAll('.hstat-n[data-count]');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.ceil(target / 30);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 40);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObs.observe(c));

  /* ══════════════════════════════════
     3D TILT ON PROJECT CARDS
  ══════════════════════════════════ */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale3d(1.01,1.01,1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ══════════════════════════════════
     HEADER SCROLL EFFECT
  ══════════════════════════════════ */
  const header = document.getElementById('site-header');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      header.style.opacity = y > lastY && y > 200 ? '0' : '1';
    } else {
      header.style.opacity = '1';
    }
    lastY = y;
  }, { passive: true });
  header.style.transition = 'opacity .4s, background .5s, border .5s';

  /* ══════════════════════════════════
     LANGUAGE TOGGLE
  ══════════════════════════════════ */
  let lang = 'en';
  const cvLinks = document.querySelectorAll('.cv-link');

  document.getElementById('langBtn').addEventListener('click', () => {
    lang = lang === 'en' ? 'fr' : 'en';
    document.documentElement.classList.toggle('fr', lang === 'fr');
    cvLinks.forEach(link => {
      link.href = lang === 'fr' ? 'assets/CVYosra-fr.pdf' : 'assets/Yosra_CV_Ang.pdf';
    });
  });

  /* ══════════════════════════════════
     THEME TOGGLE
  ══════════════════════════════════ */
  let light = false;
  document.getElementById('themeBtn').addEventListener('click', () => {
    light = !light;
    document.documentElement.classList.toggle('light', light);
  });

  /* ══════════════════════════════════
     MOBILE MENU
  ══════════════════════════════════ */
  const menuBtn  = document.getElementById('menuBtn');
  const mOverlay = document.getElementById('mOverlay');
  const menuIcon = document.getElementById('menuIcon');
  const mLinks   = document.querySelectorAll('.m-link');

  if (menuBtn && mOverlay) {
    menuBtn.addEventListener('click', () => {
      const open = mOverlay.classList.toggle('active');
      menuIcon.className = open ? 'fas fa-times' : 'fas fa-bars';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mLinks.forEach(l => l.addEventListener('click', () => {
      mOverlay.classList.remove('active');
      menuIcon.className = 'fas fa-bars';
      document.body.style.overflow = '';
    }));
  }

  /* ══════════════════════════════════
     ACTIVE NAV HIGHLIGHT ON SCROLL
  ══════════════════════════════════ */
  const sections  = document.querySelectorAll('section[id], div[id="projects"], div[id="github"]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + e.target.id) {
          a.style.color = 'var(--lime)';
        }
      });
    });
  }, { threshold: 0.4 });
  sections.forEach(s => navObs.observe(s));

  /* ══════════════════════════════════
     SMOOTH ANCHOR SCROLL
  ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════
     TICKER PAUSE ON HOVER
  ══════════════════════════════════ */
  const ticker = document.querySelector('.ticker-inner');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

  /* ══════════════════════════════════
     HIDE CURSOR ON LEAVE
  ══════════════════════════════════ */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '';
  });

})();