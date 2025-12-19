(function(){
  'use strict';

  // Scroll-to-top button
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Parallax sutil en árboles/hojas (desktop only)
  if (!window.IS_MOBILE && !window.LOW_PERFORMANCE) {
    const scene = document.querySelector('.scene');
    const trees = document.querySelector('.trees');
    const leafLayer = document.getElementById('leaf-layer');
    
    if (scene && trees) {
      window.addEventListener('scroll', (e) => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight * 1.5) {
          const offset = scrollY * 0.3;
          trees.style.transform = `translateY(${offset}px)`;
          if (leafLayer) leafLayer.style.transform = `translateY(${offset * 0.5}px)`;
        }
      }, { passive: true });
    }
  }

  // Fade-in on scroll (Intersection Observer para elementos)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px' });

    // Aplicar fade-in a message items y carousel
    document.querySelectorAll('.message-item, .carousel-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 520ms cubic-bezier(.2,.9,.3,1), transform 520ms cubic-bezier(.2,.9,.3,1)';
      io.observe(el);
    });
  }

  // Smooth scroll navigation (para links internos)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return; // skip empty anchors
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  console.log('📜 Scroll effects initialized');
})();
