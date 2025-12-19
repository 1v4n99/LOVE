(function() {
  'use strict';

  const rainLayer = document.createElement('div');
  rainLayer.id = 'emoji-rain-layer';
  rainLayer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2500;
    overflow: hidden;
  `;
  document.body.appendChild(rainLayer);

  function rainEmojis(emojiList, count = window.IS_MOBILE ? 40 : 80, duration = 2200) {
    for (let i = 0; i < count; i++) {
      const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
      const x = Math.random() * window.innerWidth;
      const size = 24 + Math.random() * 16;
      const delay = Math.random() * 200;
      const spin = (Math.random() - 0.5) * 360;

      const el = document.createElement('div');
      el.textContent = emoji;
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: -50px;
        font-size: ${size}px;
        opacity: 0.95;
        pointer-events: none;
        user-select: none;
        animation: rainDown ${duration}ms linear ${delay}ms forwards;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        transform: rotate(${spin}deg);
      `;
      rainLayer.appendChild(el);

      setTimeout(() => el.remove(), duration + delay + 100);
    }
  }

  // Crear animación keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainDown {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Exportar función global
  window.emojiRain = rainEmojis;

  console.log('🎆 Emoji rain system initialized');
})();