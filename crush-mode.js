(function() {
  'use strict';

  // Desactivar en móvil
  if (window.IS_MOBILE) {
    console.log('⏭️ Crush mode desactivado (móvil)');
    return;
  }

  let lastHeartbeatTime = 0;

  function initCrushMode() {
    const cards = document.querySelectorAll('.message-item');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.animation = 'heartPulse 0.6s cubic-bezier(.25,.7,.4,1) 1';
        
        // Trigger heartbeat (máximo 1 por segundo)
        const now = performance.now();
        if (now - lastHeartbeatTime > 1000 && window.triggerHeartbeat) {
          window.triggerHeartbeat();
          lastHeartbeatTime = now;
        }
      });
    });

    const style = document.createElement('style');
    if (!document.querySelector('style[data-crush]')) {
      style.setAttribute('data-crush', 'true');
      style.textContent = `
        @keyframes heartPulse {
          0%, 100% { transform: translateY(-10px) scale(1.02); }
          50% { transform: translateY(-14px) scale(1.04); }
        }
      `;
      document.head.appendChild(style);
    }

    console.log('💫 Crush mode initialized (optimized)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrushMode);
  } else {
    initCrushMode();
  }
})();