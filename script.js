document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor (Hardware Accelerated) ──────────────────
  const dot  = document.querySelector('.c-dot');
  const ring = document.querySelector('.c-ring');

  if (dot && ring && window.innerWidth > 768) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    // Fast mouse tracking
    window.addEventListener('mousemove', e => {
      mx = e.clientX; 
      my = e.clientY;
      
      // OPTIMIZATION: Use translate3d for the dot (instant response)
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(1)`;
    }, { passive: true });

    // Smooth ring tracking using RequestAnimationFrame
    const trackRing = () => {
      rx += (mx - rx) * 0.15; // Increased speed slightly for better feel
      ry += (my - ry) * 0.15;
      
      // OPTIMIZATION: Use translate3d for the ring
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(1)`;
      requestAnimationFrame(trackRing);
    };
    trackRing();

    // PERFORMANCE FIX: Use Event Delegation instead of looping through every link
    // This is much lighter on the memory and works for dynamically added buttons
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .hoverable')) {
        document.body.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, .hoverable')) {
        document.body.classList.remove('hover');
      }
    });
  }

  // ── Navbar (Optimized Scroll) ─────────────────────────────
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  let lastY    = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    
    // Toggle solid background
    nav.classList.toggle('solid', y > 40);

    // Smart Hide/Show Navbar
    if (y > lastY && y > 300) {
      nav.style.transform = 'translate3d(0, -100%, 0)';
    } else {
      nav.style.transform = 'translate3d(0, 0, 0)';
    }
    lastY = y;
  }, { passive: true });

  // ── Mobile Menu ──────────────────────────────────────────
  if (burger && drawer) {
    const toggleMenu = (state) => {
      const isOpen = state ?? !drawer.classList.contains('open');
      burger.classList.toggle('open', isOpen);
      drawer.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    burger.addEventListener('click', () => toggleMenu());

    drawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // ── Reveal & Utils ───────────────────────────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Dynamic Year
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ── Page Fade In ────────────────────────────────────────
  // Removing the manual transition setting to avoid "jumpy" loads
  document.body.style.opacity = '1';

  console.log('%c[ ZANGI ]', 'font-size:24px;font-weight:900;color:#b8ff57;');
});
