/* ============================================================
   ZANGI PORTFOLIO — SHARED JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ─────────────────────────────────────────
  const dot  = document.querySelector('.c-dot');
  const ring = document.querySelector('.c-ring');

  if (dot && ring && window.innerWidth > 768) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    const trackRing = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(trackRing);
    };
    trackRing();

    document.querySelectorAll('a, button, .hoverable').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hover'));
    });
  }

  // ── Navbar ───────────────────────────────────────────────
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  let lastY    = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 40) nav.classList.add('solid');
    else nav.classList.remove('solid');
    if (y > lastY && y > 300) nav.style.transform = 'translateY(-100%)';
    else nav.style.transform = 'translateY(0)';
    lastY = y;
  }, { passive: true });

  if (burger && drawer) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });

    drawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active');
  });

  // ── Scroll Reveal ────────────────────────────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ── Smooth Scroll ────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Dynamic Year ─────────────────────────────────────────
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ── FAQ Accordion ────────────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Page fade in ─────────────────────────────────────────
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.55s ease';
    document.body.style.opacity = '1';
  });

  // ── Console Easter Egg ───────────────────────────────────
  console.log('%c[ ZANGI ]', 'font-size:24px;font-weight:900;color:#b8ff57;');
  console.log('%cFellow developer spotted 👋  Let\'s connect!', 'color:#eeeef2;font-size:13px;');
  console.log('%c📧  zangi@gmail.com', 'color:#b8ff57;font-size:13px;');

});
