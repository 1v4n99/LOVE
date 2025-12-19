(function() {
  'use strict';

  // Desactivar en móvil o bajo rendimiento
  if (window.IS_MOBILE || window.LOW_PERFORMANCE) {
    console.log('⏭️ Particles desactivadas (bajo rendimiento)');
    return;
  }

  const particleLayer = document.createElement('div');
  particleLayer.id = 'particle-layer';
  particleLayer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 8;
    overflow: hidden;
  `;
  document.body.appendChild(particleLayer);

  const particles = [];
  const mousePos = { x: 0, y: 0 };
  const MAX_PARTICLES = 12; // Reducir de 28 a 12

  class FloatingParticle {
    constructor() {
      if (particles.length >= MAX_PARTICLES) return;
      
      this.emoji = ['💕', '❤️', '💖', '✨', '🌟'][Math.floor(Math.random() * 5)];
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.life = 1;
      this.decay = Math.random() * 0.0003 + 0.0001;
      this.size = 16 + Math.random() * 8;
      this.el = document.createElement('div');
      this.el.textContent = this.emoji;
      this.el.style.cssText = `
        position: absolute;
        font-size: ${this.size}px;
        opacity: ${this.life};
        user-select: none;
        pointer-events: none;
        will-change: transform;
      `;
      particleLayer.appendChild(this.el);
      particles.push(this);
    }

    update() {
      this.life -= this.decay;
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.005; // gravedad reducida

      // Repel por mouse (menos intenso)
      const dx = mousePos.x - this.x;
      const dy = mousePos.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const angle = Math.atan2(dy, dx);
        this.vx -= Math.cos(angle) * 0.15;
        this.vy -= Math.sin(angle) * 0.15;
      }

      if (this.x < 0 || this.x > window.innerWidth) this.vx *= -0.8;
      if (this.y < 0 || this.y > window.innerHeight) this.vy *= -0.8;

      this.el.style.left = this.x + 'px';
      this.el.style.top = this.y + 'px';
      this.el.style.opacity = this.life;

      if (this.life <= 0) {
        this.el.remove();
        return false;
      }
      return true;
    }
  }

  let lastFrameTime = 0;
  const minFrameInterval = 16; // ~60fps

  function animate(now) {
    if (now - lastFrameTime < minFrameInterval) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = now;

    particles.forEach((p, i) => {
      if (!p.update()) particles.splice(i, 1);
    });
    requestAnimationFrame(animate);
  }

  function createBurst() {
    if (particles.length >= MAX_PARTICLES) return;
    for (let i = 0; i < 1; i++) {
      new FloatingParticle();
    }
  }

  function init() {
    for (let i = 0; i < 6; i++) new FloatingParticle();
    setInterval(createBurst, 5000 + Math.random() * 2000);
    document.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    }, { passive: true });

    animate(0);
    console.log('✨ Particles initialized (optimized)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();