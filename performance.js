(function() {
  'use strict';

  // Detectar si el dispositivo es móvil o bajo rendimiento
  function getLowPerformanceMode() {
    // Detectar móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Detectar navegador lento (IE, etc)
    const isSlowBrowser = /MSIE|Trident/i.test(navigator.userAgent);
    
    // Detectar CPU cores (aprox)
    const cores = navigator.hardwareConcurrency || 4;
    const isLowCore = cores <= 2;

    // Detectar RAM disponible (approximado)
    const memory = navigator.deviceMemory || 8;
    const isLowMemory = memory <= 2;

    return isMobile || isSlowBrowser || isLowCore || isLowMemory;
  }

  window.LOW_PERFORMANCE = getLowPerformanceMode();
  window.IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  console.log('📊 Performance mode:', window.LOW_PERFORMANCE ? '⚠️ LOW' : '✅ HIGH');
  console.log('📱 Mobile:', window.IS_MOBILE ? 'SI' : 'NO');
})();