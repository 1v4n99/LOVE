(function() {
  'use strict';

  // Desactivar en móvil
  if (window.IS_MOBILE) {
    console.log('⏭️ Cursor effects desactivados (móvil)');
    return;
  }

  const trailContainer = document.createElement('div');
  trailContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 7;
    overflow: hidden;
  `;
  document.body.appendChild(trailContainer);

  let mouseX = 0, mouseY = 0;
  const trails = [];
  const MAX_TRAILS = 8; // Limitar trails simultáneos

  class CursorTrail {
    constructor(x, y) {
      if (trails.length >= MAX_TRAILS) return;
      
      this.el = document.createElement('div');
      this.el.innerHTML = '💕';
      this.x = x;
      this.y = y;
      this.life = 1;
      this.el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 12px;
        pointer-events: none;
        opacity: 0.6;
        user-select: none;
        will-change: transform, opacity;
      `;
      trailContainer.appendChild(this.el);
      trails.push(this);
    }

    update() {
      this.life -= 0.08;
      this.el.style.opacity = this.life * 0.6;
      this.el.style.transform = `scale(${this.life}) translateY(-${(1 - this.life) * 15}px)`;
      
      if (this.life <= 0) {
        this.el.remove();
        return false;
      }
      return true;
    }
  }

  function animate() {
    trails.forEach((t, i) => {
      if (!t.update()) trails.splice(i, 1);
    });
    requestAnimationFrame(animate);
  }

  let lastTrailTime = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Crear trail cada 100ms (no cada move)
    const now = performance.now();
    if (now - lastTrailTime > 100) {
      if (Math.random() < 0.6) {
        new CursorTrail(mouseX, mouseY);
      }
      lastTrailTime = now;
    }
  }, { passive: true });

  animate();
  console.log('🎯 Cursor effects initialized (optimized)');
})();