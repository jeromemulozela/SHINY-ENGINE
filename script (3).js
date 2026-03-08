/* ============================================================
   ZANGI PORTFOLIO — SHARED JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

  /* ── Page fade-in (set before DOMContentLoaded) ─────────── */
  document.documentElement.style.opacity = '0';

  document.addEventListener('DOMContentLoaded', () => {

    /* Reveal page */
    requestAnimationFrame(() => {
      document.documentElement.style.transition = 'opacity 0.5s ease';
      document.documentElement.style.opacity    = '1';
    });

    /* ── Custom Cursor (desktop only) ─────────────────────── */
    const dot  = $('.c-dot');
    const ring = $('.c-ring');
    const isTouch = window.matchMedia('(hover: none)').matches ||
                    window.innerWidth <= 768;

    if (dot && ring && !isTouch) {
      let mx = -100, my = -100; // start offscreen
      let rx = -100, ry = -100;
      let rafId;

      /* Dot follows mouse instantly */
      window.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
      }, { passive: true });

      /* Ring follows with lerp — start loop once */
      const lerpRing = () => {
        rx += (mx - rx) * 0.10;
        ry += (my - ry) * 0.10;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        rafId = requestAnimationFrame(lerpRing);
      };
      rafId = requestAnimationFrame(lerpRing);

      /* Hide cursor when it leaves the window */
      document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      });

      /* Hover state on interactive elements */
      const addHover = el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover'));
      };
      $$('a, button, .hoverable').forEach(addHover);

      /* Clean up if page unloads */
      window.addEventListener('pagehide', () => cancelAnimationFrame(rafId));
    }

    /* ── Navbar scroll behaviour ──────────────────────────── */
    const nav = $('#nav');

    if (nav) {
      let lastY    = 0;
      let ticking  = false;

      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;

          /* Solid background once scrolled */
          nav.classList.toggle('solid', y > 40);

          /* Hide on scroll-down, reveal on scroll-up */
          if (y > lastY && y > 320) {
            nav.style.transform = 'translateY(-100%)';
          } else {
            nav.style.transform = 'translateY(0)';
          }

          lastY   = y;
          ticking = false;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });

      /* Always start solid on inner pages (non-home) */
      const page = window.location.pathname.split('/').pop() || 'index.html';
      if (page !== 'index.html') {
        nav.classList.add('solid');
      }
    }

    /* ── Mobile drawer ────────────────────────────────────── */
    const burger = $('#burger');
    const drawer = $('#drawer');

    if (burger && drawer) {
      const openDrawer = () => {
        burger.classList.add('open');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
        burger.setAttribute('aria-expanded', 'true');
      };

      const closeDrawer = () => {
        burger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      };

      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-controls', 'drawer');

      burger.addEventListener('click', () => {
        burger.classList.contains('open') ? closeDrawer() : openDrawer();
      });

      /* Close on any link click inside drawer */
      $$('.nav-link', drawer).forEach(link => {
        link.addEventListener('click', closeDrawer);
      });

      /* Close on Escape key */
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
          closeDrawer();
          burger.focus();
        }
      });
    }

    /* ── Active nav link ──────────────────────────────────── */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link[data-page]').forEach(link => {
      link.classList.toggle('active', link.dataset.page === currentPage);
    });

    /* ── Scroll reveal (IntersectionObserver) ─────────────── */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.07,
        rootMargin: '0px 0px -40px 0px'
      });

      $$('.reveal').forEach(el => io.observe(el));
    } else {
      /* Fallback: show everything immediately */
      $$('.reveal').forEach(el => el.classList.add('in'));
    }

    /* ── Smooth scroll for anchor links ───────────────────── */
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const id     = anchor.getAttribute('href');
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
          10
        ) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    /* ── FAQ accordion ────────────────────────────────────── */
    $$('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        /* Close all */
        $$('.faq-item.open').forEach(i => i.classList.remove('open'));
        /* Open clicked if it was closed */
        if (!isOpen) item.classList.add('open');
      });
    });

    /* ── Dynamic current year ─────────────────────────────── */
    const yr = new Date().getFullYear();
    $$('.year').forEach(el => { el.textContent = yr; });

    /* ── Console easter egg ───────────────────────────────── */
    /* eslint-disable no-console */
    console.log('%c[ ZANGI ]', 'font-size:22px;font-weight:900;color:#b8ff57;font-family:sans-serif;');
    console.log('%cHey — nice to meet a fellow dev 👋', 'color:#eeeef2;font-size:13px;');
    console.log('%c📧  zangi@gmail.com', 'color:#b8ff57;font-size:13px;');
    /* eslint-enable no-console */

  });

})();
