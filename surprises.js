(function() {
  'use strict';

  const OPENS_KEY = 'amor_letter_opens';
  let totalOpens = parseInt(localStorage.getItem(OPENS_KEY)) || 0;

  // Counter UI removed for performance — no DOM updates here.

  function showSurpriseModal(milestone) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(8px);
      z-index: 4000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 420ms cubic-bezier(.2,.9,.3,1);
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 24px;
      padding: 48px 40px;
      text-align: center;
      max-width: 500px;
      backdrop-filter: blur(12px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      animation: popIn 500ms cubic-bezier(.34,.1,.68,.55);
    `;

    const messages = {
      5: { title: '🎉 ¡5 CARTAS!', text: '¡Steff mi amor, está leyendo mis sentimientos! Eres especial 💕' },
      10: { title: '🌟 ¡10 CARTAS!', text: '¡Te amo cada vez más, Steff! Gracias por leerme 💖' },
      20: { title: '👑 ¡20 CARTAS!', text: '¡STEFF, Mi corazón es completamente tuyo ❤️' },
      50: { title: '🏆 ¡50 CARTAS!', text: '¡STEFF, Eres la persona más especial del universo 🌌✨' }
    };

    const msg = messages[milestone] || { title: '🎊 ¡HITO!', text: `¡${milestone} cartas! ¡Te amo! 💕` };

    content.innerHTML = `
      <h2 style="font-size:32px;margin:0 0 16px;background:linear-gradient(90deg,#ff6b9a,#ffd1dc);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${msg.title}</h2>
      <p style="font-size:16px;color:rgba(255,255,255,0.9);margin:0;line-height:1.6">${msg.text}</p>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    const style = document.createElement('style');
    if (!document.querySelector('style[data-surprise]')) {
      style.setAttribute('data-surprise', 'true');
      style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.8) translateY(-20px); } to { transform: scale(1) translateY(0); } }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      modal.style.animation = 'fadeIn 420ms reverse forwards';
      setTimeout(() => modal.remove(), 420);
    }, 2400);
  }

  function trackLetterOpen() {
    totalOpens++;
    localStorage.setItem(OPENS_KEY, totalOpens);
    // UI update removed to avoid layout thrashing

    // Milestones
    if ([5, 10, 20, 50].includes(totalOpens)) {
      showSurpriseModal(totalOpens);
      if (window.emojiRain) {
        window.emojiRain(['🎉', '🎊', '✨', '💕', '👑'], 100, 2000);
      }
    }
  }

  // Interceptar apertura de cartas
  function init() {
    window.trackLetterOpen = trackLetterOpen;
    console.log('🎁 Surprise system initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();