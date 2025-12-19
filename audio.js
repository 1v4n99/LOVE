(function() {
  'use strict';

  const MUSIC_KEY = 'amor_music_muted';
  const HEARTBEAT_KEY = 'amor_heartbeat_muted';

  let audioElement = null;

  // CREAR ELEMENTO DE AUDIO (reproducir MP3)
  function initAudio() {
    audioElement = new Audio('music.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.15; // volumen bajo (15%)

    const isMuted = localStorage.getItem(MUSIC_KEY) === 'true';
    if (!isMuted) {
      audioElement.play().catch(err => console.log('Autoplay bloqueado:', err));
    }
  }

  // CONTROLES UI
  function initAudioControls() {
    // Botón de música
    const musicBtn = document.querySelector('#musicToggle');
    if (musicBtn) {
      const isMuted = localStorage.getItem(MUSIC_KEY) === 'true';
      musicBtn.textContent = isMuted ? '🔇' : '🎵';
      
      musicBtn.addEventListener('click', () => {
        const current = localStorage.getItem(MUSIC_KEY) === 'true';
        localStorage.setItem(MUSIC_KEY, !current);
        musicBtn.textContent = !current ? '🔇' : '🎵';

        if (!audioElement) initAudio();
        
        if (!current) {
          audioElement.play().catch(err => console.log('Error reproduciendo:', err));
        } else {
          audioElement.pause();
        }
      });
    }

    // Botón de latido (síntesis - sin cambios)
    const heartbeatBtn = document.querySelector('#heartbeatToggle');
    if (heartbeatBtn) {
      const isMuted = localStorage.getItem(HEARTBEAT_KEY) === 'true';
      heartbeatBtn.textContent = isMuted ? '💔' : '💕';
      heartbeatBtn.addEventListener('click', () => {
        const current = localStorage.getItem(HEARTBEAT_KEY) === 'true';
        localStorage.setItem(HEARTBEAT_KEY, !current);
        heartbeatBtn.textContent = !current ? '💔' : '💕';
      });
    }
  }

  // LATIDO DEL CORAZÓN (síntesis WebAudio)
  const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
  
  function playHeartbeat() {
    if (!audioCtx) return;

    const isHeartbeatMuted = localStorage.getItem(HEARTBEAT_KEY) === 'true';
    if (isHeartbeatMuted) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 120;
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // TRIGGER heartbeat en eventos
  window.triggerHeartbeat = playHeartbeat;

  // INIT
  function init() {
    initAudio();
    initAudioControls();
    
    // Permitir autoplay tras interacción
    document.addEventListener('click', () => {
      if (audioElement && audioElement.paused && localStorage.getItem(MUSIC_KEY) !== 'true') {
        audioElement.play().catch(err => console.log('Error:', err));
      }
    }, { once: true });

    console.log('🎵 Música para Steff - Sistema de audio inicializado');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();