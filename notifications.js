(function() {
  'use strict';

  const notificationMessages = [
    '¿Sabías que te amo, Steff? 💕',
    'Steff, eres mi persona favorita 👑',
    'Te extraño cuando no estás, Steff 🥺',
    '¡Gracias por estar aquí, Steff! 🌟',
    'Steff, mi vida es mejor contigo 💖',
  ];

  class Notification {
    constructor(message) {
      this.el = document.createElement('div');
      this.el.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: linear-gradient(135deg, rgba(255,107,154,0.98), rgba(255,209,220,0.92));
        color: white;
        padding: 16px 24px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 12px 32px rgba(0,0,0,0.35);
        z-index: 9998;
        max-width: 300px;
        animation: notifySlide 400ms cubic-bezier(.2,.9,.3,1) forwards;
        border: 1px solid rgba(255,255,255,0.2);
        will-change: transform, opacity;
      `;
      this.el.textContent = message;
      document.body.appendChild(this.el);

      const style = document.createElement('style');
      if (!document.querySelector('style[data-notify]')) {
        style.setAttribute('data-notify', 'true');
        style.textContent = `
          @keyframes notifySlide {
            from { transform: translateX(400px) rotateZ(6deg); opacity: 0; }
            to { transform: translateX(0) rotateZ(0); opacity: 1; }
          }
          @keyframes notifyOut {
            to { transform: translateX(400px) rotateZ(-6deg); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      setTimeout(() => {
        this.el.style.animation = 'notifyOut 400ms cubic-bezier(.2,.7,.3,1) forwards';
        setTimeout(() => this.el.remove(), 400);
      }, 3500);
    }
  }

  function showRandomNotification() {
    const msg = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
    new Notification(msg);
  }

  function init() {
    // Aumentar intervalo (menos notificaciones)
    setInterval(() => {
      showRandomNotification();
    }, 18000 + Math.random() * 8000); // AUMENTADO de 12s a 18s

    console.log('🔔 Notification system initialized (optimized)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();