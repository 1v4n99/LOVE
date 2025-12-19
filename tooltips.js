(function() {
  'use strict';

  // Desactivar en móvil
  if (window.IS_MOBILE) {
    console.log('⏭️ Tooltips desactivados (móvil)');
    return;
  }

  const messages = [
    '¡Te amo, Steff! 💕',
    'Steff, eres increíble ✨',
    'Mi amor por ti es infinito ❤️',
    'Cada día contigo, amor, es especial 💖',
    'Eres mi favorita, mi Steff 🌟',
    'Steff, eres lo mejor que me pasó 💗',
    'Te quiero un millón, Steff 💫',
  ];

  class Tooltip {
    constructor(text, x, y) {
      this.el = document.createElement('div');
      this.el.textContent = text;
      this.el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        background: linear-gradient(135deg, rgba(255,107,154,0.95), rgba(255,209,220,0.88));
        color: white;
        padding: 8px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        animation: tooltipPop 1.8s cubic-bezier(.2,.9,.3,1) forwards;
        white-space: nowrap;
        will-change: transform, opacity;
      `;
      
      const style = document.createElement('style');
      if (!document.querySelector('style[data-tooltip]')) {
        style.setAttribute('data-tooltip', 'true');
        style.textContent = `
          @keyframes tooltipPop {
            0% { transform: scale(0) translateY(-12px); opacity: 0; }
            20% { transform: scale(1) translateY(0); opacity: 1; }
            80% { transform: scale(1) translateY(0); opacity: 1; }
            100% { transform: scale(0.8) translateY(8px); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(this.el);
      setTimeout(() => this.el.remove(), 1800);
    }
  }

  function showRandomTooltip(x, y) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    new Tooltip(msg, x, y);
  }

  function init() {
    // Aumentar intervalo (menos tooltips)
    setInterval(() => {
      const x = Math.random() * (window.innerWidth - 120);
      const y = Math.random() * (window.innerHeight * 0.6) + 60;
      showRandomTooltip(x, y);
    }, 14000 + Math.random() * 6000); // AUMENTADO de 8s a 14s

    console.log('💬 Tooltip system initialized (optimized)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();