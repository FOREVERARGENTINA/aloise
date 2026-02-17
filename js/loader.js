/**
 * PAGE LOADER — js/loader.js
 *
 * Controla la aparición y desaparición del overlay de carga.
 * Se ejecuta en cuanto el DOM está listo.
 *
 * Comportamiento:
 *  - El overlay (#page-loader) ya está visible gracias a loader.css
 *  - Este script lo descarta al disparar el evento 'load' de window
 *  - Se garantiza un tiempo mínimo de 500ms para que la animación
 *    de entrada del logo se complete antes de iniciar el exit
 */
(function () {
  'use strict';

  var loader = document.getElementById('page-loader');
  if (!loader) return;

  var MIN_MS = 500; // mínimo visible para completar la animación de entrada
  var startTime = Date.now();

  function dismiss() {
    var elapsed = Date.now() - startTime;
    var wait = Math.max(0, MIN_MS - elapsed);

    setTimeout(function () {
      // Iniciar animación de salida (deslizamiento hacia arriba)
      loader.classList.add('is-leaving');

      // Remover del DOM tras la transición para liberar memoria
      loader.addEventListener('transitionend', function remove() {
        loader.removeEventListener('transitionend', remove);
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      });

      // Fallback: forzar remoción si transitionend no dispara
      setTimeout(function () {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 900);
    }, wait);
  }

  // Si la página ya cargó completamente (ej: recarga desde caché)
  if (document.readyState === 'complete') {
    dismiss();
  } else {
    window.addEventListener('load', dismiss);
  }
})();
