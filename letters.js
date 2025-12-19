(function () {
  'use strict';

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  const modal = qs('#letterModal');
  const letterContent = qs('#letterContent');
  const closeBtn = qs('.letter-close');
  const letterContainer = qs('.letter-container');
  const messageBlock = qs('.message');
  const confettiCanvas = qs('#confetti-canvas');
  const themeToggle = qs('#themeToggle');

  // CONFETTI
  function runConfetti(duration = 1200, particleCount = 60) {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    let W = confettiCanvas.width = innerWidth;
    let H = confettiCanvas.height = innerHeight;
    confettiCanvas.classList.add('playing');

    const colors = ['#ff6b9a', '#ffd1dc', '#ffd166', '#8fe3ff', '#f8b195', '#f67280'];
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: W/2 + (Math.random()-0.5)*160,
        y: H/2 + (Math.random()-0.5)*60,
        vx: (Math.random()-0.5) * 8,
        vy: -6 - Math.random()*6,
        r: 6 + Math.random()*8,
        color: colors[Math.floor(Math.random()*colors.length)],
        rot: Math.random()*360,
        vr: (Math.random()-0.5)*10
      });
    }

    let start = performance.now();
    function frame(now) {
      const t = now - start;
      ctx.clearRect(0,0,W,H);
      particles.forEach(p => {
        p.vy += 0.25;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
        ctx.restore();
      });
      if (t < duration) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0,0,W,H);
        confettiCanvas.classList.remove('playing');
      }
    }
    requestAnimationFrame(frame);
  }

  // SONIDOS
  const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
  function playPop() {
    if (!audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = 480;
    g.gain.value = 0;
    o.connect(g);
    g.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
    o.stop(now + 0.3);
  }
  function playCloseTone() {
    if (!audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'triangle';
    o.frequency.value = 320;
    g.gain.value = 0;
    o.connect(g);
    g.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    o.stop(now + 0.34);
  }

  // TEMA
  function applyTheme(name) {
    if (name === 'light') document.body.classList.add('theme-light');
    else document.body.classList.remove('theme-light');
    localStorage.setItem('amor_theme', name);
  }
  function initTheme() {
    const stored = localStorage.getItem('amor_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(stored);
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        themeToggle.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 480 });
      });
    }
  }

  // CARTAS
  function initMessages() {
    let items = qsa('.message-item');
    if (!items.length) {
      items = qsa('.message p');
      items.forEach(it => it.classList.add('message-item'));
    }

    // Store full text and replace visible content with a preview
    items.forEach(item => {
      try {
        const fullText = (item.dataset.full && item.dataset.full.trim()) || item.textContent.trim();
        item.dataset.full = fullText;
        item.innerHTML = `<span class="preview">🔒 Haz clic para abrir la carta</span>`;
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
      } catch (err) {
        console.error('letters.js: failed preparing item', err, item);
      }
    });

    // Use event delegation on the message container for robustness
    function openLetterFor(item) {
      if (!item) return;
      const text = item.dataset.full || '';
      if (!letterContent || !modal) return;
      letterContent.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = text;
      letterContent.appendChild(p);

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (messageBlock) messageBlock.classList.add('revealed');

      try { playPop(); } catch (e) { /* ignore */ }
      try { runConfetti(); } catch (e) { /* ignore */ }
      if (window.emojiRain) {
        try { window.emojiRain(['💕', '❤️', '💖', '✨'], 60, 1800); } catch (e) { /* ignore */ }
      }
      if (window.trackLetterOpen) {
        try { window.trackLetterOpen(); } catch (e) { /* ignore */ }
      }
      if (letterContainer) letterContainer.focus({ preventScroll: true });
    }

    // Delegate clicks and keydowns from the container
    if (messageBlock) {
      messageBlock.addEventListener('click', (e) => {
        const target = e.target.closest && e.target.closest('.message-item');
        if (target) openLetterFor(target);
      });
      messageBlock.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const target = e.target.closest && e.target.closest('.message-item');
          if (target) {
            e.preventDefault();
            openLetterFor(target);
          }
        }
      });
    } else {
      console.warn('letters.js: .message container not found for delegation');
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (messageBlock) messageBlock.classList.remove('revealed');
      try { playCloseTone(); } catch (e) { /* ignore */ }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal(); });
  }

  function initCanvasResize() {
    if (!confettiCanvas) return;
    function resize() {
      confettiCanvas.width = innerWidth;
      confettiCanvas.height = innerHeight;
    }
    addEventListener('resize', resize);
    resize();
  }

  function init() {
    initTheme();
    initCanvasResize();
    initMessages();
    console.log('💌 Letter system (enhanced) ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();