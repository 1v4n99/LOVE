(function() {
  'use strict';

  const leafLayer = document.getElementById('leaf-layer');
  if (!leafLayer) {
    console.warn('⚠️ leaf-layer no encontrado');
    return;
  }

  const PERSIST_KEY = 'amor_landed_leaves_v1';
  const leafCount = window.IS_MOBILE ? 12 : (window.LOW_PERFORMANCE ? 16 : 28);
  const colors = ['v1', 'v2', 'v3', 'v4'];
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const maxPersist = 40;

  window.addEventListener('resize', () => {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
  });

  function loadPersisted() {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (!raw) return;
      const items = JSON.parse(raw);
      items.slice(0, maxPersist).forEach(data => {
        const leaf = document.createElement('div');
        leaf.className = `leaf ${data.color} land`;
        leaf.style.setProperty('--left', data.left + 'px');
        leaf.style.setProperty('--bottom', data.bottom + 'px');
        leaf.style.setProperty('--rot', data.rot + 'deg');
        leaf.style.setProperty('--s', data.s);
        leaf.style.left = data.left + 'px';
        leaf.style.bottom = data.bottom + 'px';
        leafLayer.appendChild(leaf);
        leaf.addEventListener('click', () => {
          removePersistedLeaf(data.id);
          leaf.remove();
        });
      });
    } catch (e) {
      console.warn('Error cargando hojas persistentes', e);
    }
  }

  function savePersistedLeaf(obj) {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(obj);
      while (arr.length > maxPersist) arr.shift();
      localStorage.setItem(PERSIST_KEY, JSON.stringify(arr));
    } catch (e) { console.warn(e); }
  }

  function removePersistedLeaf(id) {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw).filter(x => x.id !== id);
      localStorage.setItem(PERSIST_KEY, JSON.stringify(arr));
    } catch (e) { console.warn(e); }
  }

  function createLeaf() {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf', 'animate');
    const colorClass = colors[Math.floor(Math.random() * colors.length)];
    leaf.classList.add(colorClass);

    const startX = Math.random() * viewport.width;
    const duration = 6000 + Math.random() * 4000;
    const delay = Math.random() * 1400;
    const rotation = (Math.random() - 0.5) * 60;
    const scale = (0.7 + Math.random() * 0.4).toFixed(2);

    leaf.style.left = startX + 'px';
    leaf.style.top = '-30px';
    leaf.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    leaf.style.animationDuration = duration + 'ms';
    leaf.style.animationDelay = delay + 'ms';

    leafLayer.appendChild(leaf);

    const total = duration + delay + 60;
    setTimeout(() => {
      const willPersist = Math.random() < 0.25;
      const left = Math.min(Math.max(startX + (Math.random() - 0.5) * 60, 8), viewport.width - 8);
      const bottomPx = (Math.random() * 8 + 6) * (viewport.height / 100);
      if (willPersist) {
        const id = 'leaf_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
        const data = { id, left: Math.round(left), bottom: Math.round(bottomPx), rot: Math.round(rotation), color: colorClass, s: scale };
        leaf.classList.remove('animate');
        leaf.classList.add('land');
        leaf.style.left = data.left + 'px';
        leaf.style.bottom = data.bottom + 'px';
        leaf.style.top = 'auto';
        leaf.style.setProperty('--left', data.left + 'px');
        leaf.style.setProperty('--bottom', data.bottom + 'px');
        leaf.style.setProperty('--rot', data.rot + 'deg');
        leaf.style.setProperty('--s', data.s);
        savePersistedLeaf(data);
        leaf.addEventListener('click', () => {
          leaf.remove();
          removePersistedLeaf(id);
        });
      } else {
        leaf.style.transition = 'opacity 560ms, transform 560ms';
        leaf.style.opacity = '0';
        setTimeout(() => leaf.remove(), 620);
      }
    }, total);
  }

  function startLeafGeneration() {
    for (let i = 0; i < leafCount / 2; i++) {
      setTimeout(createLeaf, i * 200);
    }
    setInterval(() => {
      const burst = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < burst; i++) setTimeout(createLeaf, i * 120);
    }, 4200 + Math.random() * 2000);
  }

  function attachTreeInteractions() {
    const trees = document.querySelectorAll('.tree');
    trees.forEach(tree => {
      tree.addEventListener('mouseenter', () => {
        for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
          setTimeout(createLeaf, i * 80);
        }
      });
    });
  }

  function init() {
    loadPersisted();
    startLeafGeneration();
    attachTreeInteractions();
    console.log('🍂 Leaf animation system initialized with persistence');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();