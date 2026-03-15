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

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
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

/* ── WORK PREVIEW (cursor-follow image) ── */
const preview      = document.getElementById('work-preview');
const previewInner = document.getElementById('work-preview-inner');

const previewColors = [
  'linear-gradient(135deg,#1a0800,#3d1f00)',
  'linear-gradient(135deg,#001a08,#003d1f)',
  'linear-gradient(135deg,#0a001a,#1f003d)',
  'linear-gradient(135deg,#1a1200,#3d2e00)',
  'linear-gradient(135deg,#1a0600,#3d1500)',
  'linear-gradient(135deg,#001416,#002d30)',
];
const previewNames = ['Barber King','FitZone','Clínica Sorrir','Advocacia Mendes','RestaurantePrime','LogiTrack'];

let px = 0, py = 0, ptx = 0, pty = 0;

document.querySelectorAll('.work-item').forEach((item, i) => {
  item.addEventListener('mouseenter', () => {
    previewInner.style.background = previewColors[i];
    previewInner.innerHTML = `<span style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:rgba(240,232,216,.35);letter-spacing:.06em;display:flex;align-items:center;justify-content:center;height:100%">${previewNames[i]}</span>`;
    previewInner.style.transform = `rotate(${(Math.random()-.5)*8}deg)`;
    preview.classList.add('show');
  });
  item.addEventListener('mouseleave', () => {
    preview.classList.remove('show');
  });
});

document.addEventListener('mousemove', e => { ptx = e.clientX; pty = e.clientY; });
(function loopPreview() {
  px += (ptx - px) * .1;
  py += (pty - py) * .1;
  if (preview) {
    preview.style.left = px + 'px';
    preview.style.top  = py + 'px';
  }
  requestAnimationFrame(loopPreview);
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

  /* works list — stagger */
  gsap.from('.work-item', {
    opacity: 0,
    x: -30,
    stagger: .055,
    duration: .65,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.works-list', start: 'top 82%' },
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
