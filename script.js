/* ════════════════════════════════════════════════
   SOUZATECH — script.js
   ════════════════════════════════════════════════ */

/* ── GRAIN ── */
(function grain() {
  const c = document.getElementById('grain');
  if (!c) return;
  const ctx = c.getContext('2d');
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  (function draw() {
    const img = ctx.createImageData(c.width, c.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d[i] = d[i+1] = d[i+2] = v;
      d[i+3] = 18;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(draw);
  })();
})();

/* ── CURSOR ── */
const cDot  = document.getElementById('cursor-dot');
const cRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cDot.style.left = mx + 'px';
  cDot.style.top  = my + 'px';
});

(function loopRing() {
  rx += (mx - rx) * .1;
  ry += (my - ry) * .1;
  cRing.style.left = rx + 'px';
  cRing.style.top  = ry + 'px';
  requestAnimationFrame(loopRing);
})();

document.querySelectorAll('a, button, .work-item, .svc').forEach(el => {
  el.addEventListener('mouseenter', () => cRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cRing.classList.remove('hovered'));
});

/* ── LOADER ── */
(function loader() {
  const el  = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');
  const num = document.getElementById('loader-num');

  let p = 0;
  const iv = setInterval(() => {
    const step = p < 70 ? Math.random() * 14 + 3 : Math.random() * 4 + 1;
    p = Math.min(p + step, 100);

    if (bar) bar.style.width = p + '%';
    if (num) num.textContent = Math.floor(p);

    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        el.classList.add('exit');
        setTimeout(() => { el.style.display = 'none'; initAnimations(); }, 720);
      }, 600);
    }
  }, 65);
})();

/* ── GLITCH NO LOGO ── */
const brand = document.getElementById('nav-brand');
if (brand) {
  brand.addEventListener('mouseenter', () => {
    brand.classList.add('glitch');
    setTimeout(() => brand.classList.remove('glitch'), 320);
  });
}

/* ── NAV SCROLL + SCROLL PROGRESS ── */
const nav = document.getElementById('nav');
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
  if (scrollBar) {
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    scrollBar.style.width = p + '%';
  }
}, { passive: true });

/* ── BADGE FLOAT ── */
const badge = document.querySelector('.hero-badge');
if (badge) {
  let t = 0;
  (function floatBadge() {
    t += .007;
    badge.style.transform = `translate(${Math.sin(t * .8) * 5}px, ${Math.sin(t) * 8}px)`;
    requestAnimationFrame(floatBadge);
  })();
}

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── EASTER EGG ── */
const easter = document.getElementById('easter');
const toast  = document.getElementById('toast');
if (easter && toast) {
  easter.addEventListener('click', e => {
    e.preventDefault();
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    setTimeout(() => {
      window.location.href = 'mailto:contato@souzatech.dev?subject=Quero%20um%20caf%C3%A9%20☕';
    }, 700);
  });
}

/* ── SECTION DIVIDERS (sem GSAP) ── */
(function initDividers() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: .3 });
  document.querySelectorAll('.section-divider').forEach(d => obs.observe(d));
})();


/* ── LIVE COUNTER NO HERO ── */
(function initLiveCount() {
  const el = document.getElementById('live-count');
  if (!el) return;
  let n = 50;
  setInterval(() => {
    n++;
    el.classList.add('flip');
    setTimeout(() => {
      el.textContent = n;
      el.style.transform = 'translateY(100%)';
      el.style.opacity = '0';
      requestAnimationFrame(() => {
        el.style.transition = 'none';
        requestAnimationFrame(() => {
          el.style.transition = '';
          el.classList.remove('flip');
          el.style.transform = '';
          el.style.opacity = '';
        });
      });
    }, 250);
  }, 8000);
})();


/* ── GSAP ANIMATIONS (só roda após loader) ── */
function initAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* hero title — linhas entram de baixo */
  gsap.from('.hero-title .line', {
    yPercent: 110,
    duration: 1.1,
    stagger: .1,
    ease: 'expo.out',
    delay: .1,
  });

  gsap.from('.hero-tag', { opacity: 0, y: 16, duration: .9, ease: 'expo.out', delay: .5 });
  gsap.from('.hero-badge', { opacity: 0, scale: .8, duration: .8, ease: 'back.out(1.5)', delay: .7 });
  gsap.from('.hero-desc',  { opacity: 0, y: 20, duration: .9, ease: 'expo.out', delay: .85 });
  gsap.from('.btn-pill',   { opacity: 0, y: 16, duration: .8, ease: 'expo.out', delay: 1 });

  /* hero parallax ao scroll */
  gsap.to('.hero-title', {
    yPercent: 22,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
  });

  /* about — título char reveal */
  const aboutTitle = document.querySelector('.about-title');
  if (aboutTitle) {
    gsap.from(aboutTitle, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: aboutTitle, start: 'top 82%' },
    });
  }

  /* stagger genérico para todos os blocos de texto */
  gsap.utils.toArray('.about-body, .about-stats, .section-label, .works-header, .numbers-header, .services-header, .footer-question').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: .8,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  /* works list — entrada + linha se desenhando */
  gsap.utils.toArray('.work-item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      x: -40,
      duration: .7,
      ease: 'expo.out',
      delay: i * .08,
      scrollTrigger: { trigger: '.works-list', start: 'top 80%', once: true },
    });
    gsap.fromTo(item,
      { borderBottomColor: 'rgba(240,232,216,0)' },
      { borderBottomColor: 'rgba(240,232,216,.1)', duration: .8, delay: i * .08,
        scrollTrigger: { trigger: '.works-list', start: 'top 80%', once: true } }
    );
  });

  /* numbers table rows */
  gsap.from('.nt-row:not(.nt-head)', {
    opacity: 0,
    x: -24,
    stagger: .07,
    duration: .6,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.numbers-table', start: 'top 82%' },
  });

  /* services */
  gsap.from('.services-list .svc', {
    opacity: 0,
    x: -30,
    stagger: .05,
    duration: .6,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.services-list', start: 'top 82%' },
  });

  /* footer */
  gsap.from('.footer-question', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.footer-question', start: 'top 88%' },
  });
  gsap.from('.footer-social a, .fp-group span, .footer-copy', {
    opacity: 0,
    y: 16,
    stagger: .04,
    duration: .5,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.footer-bottom', start: 'top 88%' },
  });

  /* counters */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.fromTo(el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.8,
            ease: 'power3.out',
            snap: { textContent: 1 },
            onUpdate() { el.textContent = Math.ceil(+el.textContent); },
          }
        );
      },
    });
  });

  /* skew leve ao scrollar */
  let lastY = window.scrollY, skew = 0;
  window.addEventListener('scroll', () => {
    const v = (window.scrollY - lastY) * .035;
    skew += (v - skew) * .18;
    lastY = window.scrollY;
    document.querySelectorAll('.about-title,.works-title,.numbers-title,.services-title').forEach(h => {
      h.style.transform = `skewY(${skew}deg)`;
    });
  }, { passive: true });

  /* scramble no section-label do about */
  const lbl = document.querySelector('#about .section-label');
  if (lbl) {
    const original = 'sobre';
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    ScrollTrigger.create({
      trigger: lbl, start: 'top 88%', once: true,
      onEnter() {
        let i = 0;
        const max = original.length * 4;
        const id  = setInterval(() => {
          lbl.textContent = original.split('').map((c, idx) =>
            idx < Math.floor(i / 4) ? c : chars[Math.random() * chars.length | 0]
          ).join('');
          if (++i > max) { lbl.textContent = original; clearInterval(id); }
        }, 35);
      },
    });
  }

  /* ── ABOUT skills ── */
  gsap.from('.about-skills span', {
    scale: .85, opacity: 0, stagger: .04, duration: .5, ease: 'back.out(1.5)',
    scrollTrigger: { trigger: '.about-skills', start: 'top 88%' },
  });

  /* ── ABOUT timeline ── */
  gsap.from('.about-tl-title', {
    x: -40, opacity: 0, duration: .9, ease: 'expo.out',
    scrollTrigger: { trigger: '.about-timeline-wrap', start: 'top 85%' },
  });
  gsap.from('.about-tl-item', {
    y: 30, opacity: 0, stagger: .12, duration: .7, ease: 'expo.out',
    scrollTrigger: { trigger: '.about-tl-items', start: 'top 88%' },
  });

  /* ── HERO LIVE COUNT ── */
  gsap.from('.hero-live-count', {
    opacity: 0, y: 12, duration: .7, ease: 'expo.out', delay: 1.1,
  });

  /* ── CLIP-PATH REVEAL nas seções ── */
  gsap.utils.toArray('.about-inner, .founder-inner, .works-inner, .numbers-inner, .services-inner').forEach(el => {
    gsap.from(el, {
      clipPath: 'inset(0 0 8% 0)',
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  /* ── SPLIT TITLES — linha 1 da esquerda, linha 2 da direita ── */
  document.querySelectorAll('.works-title, .numbers-title, .services-title').forEach(title => {
    const lines = title.querySelectorAll('*');
    if (lines.length >= 1) {
      gsap.from(lines[0], { x: -60, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: title, start: 'top 85%' } });
    }
    if (lines.length >= 2) {
      gsap.from(lines[1], { x: 60, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: title, start: 'top 85%' } });
    }
  });

  /* ── TILT 3D + COR DE FUNDO nos work-items ── */
  const worksSection = document.getElementById('works');
  const defaultBg = 'rgba(12,12,12,.86)';
  const itemColors = [
    'rgba(30,15,5,.92)',
    'rgba(5,20,10,.92)',
    'rgba(5,10,25,.92)',
    'rgba(20,10,5,.92)',
    'rgba(25,8,0,.92)',
    'rgba(5,15,20,.92)',
  ];

  document.querySelectorAll('.work-item').forEach((item, i) => {
    item.style.transition = 'transform .4s cubic-bezier(.76,0,.24,1), padding-left .3s cubic-bezier(.76,0,.24,1)';

    item.addEventListener('mousemove', e => {
      const r = item.getBoundingClientRect();
      const y =  ((e.clientX - r.left) / r.width  - .5) * 4;
      const x = -((e.clientY - r.top)  / r.height - .5) * 2;
      item.style.transform = `perspective(800px) rotateX(${x}deg) rotateY(${y}deg) translateZ(4px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });

    item.addEventListener('mouseenter', () => {
      if (worksSection) gsap.to(worksSection, { backgroundColor: itemColors[i], duration: .5, ease: 'power2.out' });
    });

    item.addEventListener('mouseleave', () => {
      if (worksSection) gsap.to(worksSection, { backgroundColor: defaultBg, duration: .5, ease: 'power2.out' });
      item.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  /* magnetic buttons */
  document.querySelectorAll('.btn-pill').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width  / 2) * .25,
        y: (e.clientY - r.top  - r.height / 2) * .25,
        duration: .35, ease: 'expo.out',
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' });
    });
  });

  console.log('%cSouzaTech', 'font:700 3rem/1 Georgia,serif;color:#c4922a');
  console.log('%carte clássica × código moderno', 'font:300 .9rem/1 system-ui;color:#f0e8d8');
}
