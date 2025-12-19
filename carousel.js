(function(){
  'use strict';

  if (window.LOW_PERFORMANCE) {
    console.log('⏭️ Carousel skipped (low performance)');
    return;
  }

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  const root = qs('#memories');
  if (!root) return;

  const track = qs('.carousel-track', root);
  const items = qsa('.carousel-item', root);
  const prevBtn = qs('.carousel-btn.prev', root);
  const nextBtn = qs('.carousel-btn.next', root);
  const playBtn = qs('#carouselPlay');

  let index = 0;
  let autoplay = false;
  let autoplayId = null;

  // Lazy-load images using IntersectionObserver
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const src = el.dataset.src;
        if (src && !el.dataset.loaded) {
          el.style.backgroundImage = `url(${src})`;
          el.dataset.loaded = '1';
          // preload next
          const next = el.nextElementSibling;
          if (next && next.dataset && next.dataset.src) {
            const img = new Image(); img.src = next.dataset.src;
          }
        }
        io.unobserve(el);
      }
    });
  }, {rootMargin: '200px'} ) : null;

  items.forEach(it => { if (io) io.observe(it); else { const s = it.dataset.src; if (s) { it.style.backgroundImage = `url(${s})`; it.dataset.loaded = '1'; } } });

  function goTo(i){
    index = (i + items.length) % items.length;
    const x = -index * 100;
    if (track) track.style.transform = `translateX(${x}%)`;
    // ensure current image loaded
    const cur = items[index]; if (cur && !cur.dataset.loaded) { const s = cur.dataset.src; if (s) { cur.style.backgroundImage = `url(${s})`; cur.dataset.loaded = '1'; } }
  }

  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }

  function startAutoplay(){
    if (autoplayId) return;
    autoplay = true;
    autoplayId = setInterval(() => { next(); }, 5000);
    if (playBtn) playBtn.textContent = '⏸ Pausar';
  }
  function stopAutoplay(){
    autoplay = false;
    if (autoplayId) { clearInterval(autoplayId); autoplayId = null; }
    if (playBtn) playBtn.textContent = '▶ Reproducir';
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); stopAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); stopAutoplay(); });
  if (playBtn) playBtn.addEventListener('click', () => { autoplay ? stopAutoplay() : startAutoplay(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); stopAutoplay(); }
    if (e.key === 'ArrowLeft') { prev(); stopAutoplay(); }
  });

  // Touch swipe (very lightweight)
  let startX = null;
  track && track.addEventListener('touchstart', (e) => { startX = e.touches && e.touches[0] && e.touches[0].clientX; });
  track && track.addEventListener('touchend', (e) => {
    if (startX === null) return; const endX = (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX) || 0; const dx = endX - startX; if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); stopAutoplay(); } startX = null;
  });

  // initial
  goTo(0);
  console.log('🖼️ Carousel initialized');

  // Accessibility: announce slide change (visually hidden update)
  const live = document.createElement('div'); live.setAttribute('aria-live','polite'); live.style.position='absolute'; live.style.left='-9999px'; live.style.width='1px'; live.style.height='1px'; live.style.overflow='hidden'; root.appendChild(live);
  const updateLive = () => { live.textContent = `Slide ${index+1} de ${items.length}`; };
  setInterval(updateLive, 800);
  
  // IMAGE MODAL: open on item click, show time/place and allow saving notes
  const body = document.body;
  const modal = document.createElement('div'); modal.className = 'image-modal'; modal.id = 'imageModal';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-img" id="modalImg" aria-hidden="true"></div>
      <div class="modal-meta">
        <h3 style="margin:0 0 6px">Detalle de recuerdo</h3>
        <label>Hora y fecha</label>
        <input id="metaTime" type="text" />
        <label>Lugar</label>
        <input id="metaPlace" type="text" />
        <label>Notas</label>
        <textarea id="metaNotes" placeholder="Añade una anécdota o comentario..."></textarea>
        <div class="modal-actions">
          <button id="saveMeta" class="btn small">Guardar</button>
          <button id="closeMeta" class="btn small">Cerrar</button>
        </div>
      </div>
    </div>
    <div class="modal-close" id="modalX">✕</div>
  `;
  body.appendChild(modal);

  const modalImg = document.getElementById('modalImg');
  const metaTime = document.getElementById('metaTime');
  const metaPlace = document.getElementById('metaPlace');
  const metaNotes = document.getElementById('metaNotes');
  const saveMeta = document.getElementById('saveMeta');
  const closeMeta = document.getElementById('closeMeta');
  const modalX = document.getElementById('modalX');

  function metaKeyFor(src){ return 'mem_meta_' + btoa(src).replace(/=/g,''); }

  function openImageModal(item){
    if (!item) return;
    const src = item.dataset.src;
    if (!src) return;
    // ensure image loaded
    if (!item.dataset.loaded) { item.style.backgroundImage = `url(${src})`; item.dataset.loaded = '1'; }
    modalImg.style.backgroundImage = `url(${src})`;
    const key = metaKeyFor(src);
    const saved = localStorage.getItem(key);
    if (saved) {
      try { const obj = JSON.parse(saved); metaTime.value = obj.time || item.dataset.time || ''; metaPlace.value = obj.place || item.dataset.place || ''; metaNotes.value = obj.notes || ''; } catch(e){ metaTime.value = item.dataset.time || ''; metaPlace.value = item.dataset.place || ''; metaNotes.value = ''; }
    } else {
      metaTime.value = item.dataset.time || '';
      metaPlace.value = item.dataset.place || '';
      metaNotes.value = '';
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    if (modalImg) modalImg.focus && modalImg.focus();
  }

  function closeImageModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }

  // delegate click on items to open modal
  root.addEventListener('click', (e) => {
    const it = e.target.closest && e.target.closest('.carousel-item');
    if (it) { openImageModal(it); stopAutoplay(); }
  });

  saveMeta.addEventListener('click', () => {
    const bg = modalImg.style.backgroundImage || '';
    const m = bg.match(/url\(("|')?(.*)("|')?\)/); const src = (m && m[2]) || '';
    if (!src) return;
    const key = metaKeyFor(src);
    const obj = { time: metaTime.value.trim(), place: metaPlace.value.trim(), notes: metaNotes.value.trim() };
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch(e) { console.warn('No se pudo guardar metadata', e); }
    closeImageModal();
  });

  closeMeta.addEventListener('click', closeImageModal);
  modalX.addEventListener('click', closeImageModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeImageModal(); });

})();
