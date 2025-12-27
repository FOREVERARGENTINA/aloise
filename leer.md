/**
 * MAIN.JS - Inicialización principal
 * Gabriela Aloise Propiedades
 */

// Importar módulos (cuando uses ES6 modules)
// import { initMobileMenu } from './modules/mobile-menu.js';

// ========== CONFIGURACIÓN GLOBAL ==========
// CONFIG se carga desde config.js

// ========== UTILIDADES ==========

/**
 * Detecta si el dispositivo es táctil
 */
function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

/**
 * Agrega clase touch-device al body si aplica
 */
function detectTouchDevice() {
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }
}

/**
 * Smooth scroll para links internos
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Ignorar links vacíos o solo '#'
      if (href === '#' || href === '#main-content') {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========== NAVEGACIÓN MÓVIL ==========

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const body = document.body;

  if (!toggle || !menu) {
    console.warn('⚠️ Elementos del menú móvil no encontrados');
    return;
  }

  console.log('✅ Inicializando menú móvil');

  // Toggle menú
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isActive = menu.classList.contains('active');
    console.log('🔄 Toggle menú - Estado actual:', isActive ? 'abierto' : 'cerrado');

    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cerrar al hacer click en un link
  menu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Cerrar al hacer click fuera del menú
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  function openMenu() {
    console.log('📱 Abriendo menú móvil');
    menu.classList.add('active');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden'; // Prevenir scroll
  }

  function closeMenu() {
    console.log('📱 Cerrando menú móvil');
    menu.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = ''; // Restaurar scroll
  }
}

// ========== HEADER SCROLL ==========

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollTop = 0;
  let ticking = false;

  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Agregar clase cuando se hace scroll
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

// ========== LAZY LOADING IMÁGENES ==========

function initLazyLoading() {
  // Si el navegador soporta loading="lazy", no hacer nada
  if ('loading' in HTMLImageElement.prototype) {
    return;
  }

  // Fallback con Intersection Observer
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback: cargar todas las imágenes
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }
}

// ========== ANIMACIONES ON SCROLL ==========

function initScrollAnimations() {
  // Solo si el navegador soporta IntersectionObserver
  if (!('IntersectionObserver' in window)) return;

  const elements = document.querySelectorAll('.fade-in, .slide-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => {
    el.style.opacity = '0';
    if (el.classList.contains('slide-up')) {
      el.style.transform = 'translateY(40px)';
    }
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ========== FORMULARIOS ==========

function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validación básica
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');

          // Mostrar error si existe
          const errorMsg = input.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('form-error')) {
            errorMsg.textContent = 'Este campo es requerido';
          }
        } else {
          input.classList.remove('is-invalid');
        }
      });

      // Validación de email
      const emailInputs = form.querySelectorAll('input[type="email"]');
      emailInputs.forEach(input => {
        if (input.value && !isValidEmail(input.value)) {
          isValid = false;
          input.classList.add('is-invalid');
          const errorMsg = input.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('form-error')) {
            errorMsg.textContent = 'Email inválido';
          }
        }
      });

      if (isValid) {
        // Aquí iría el envío del formulario
        console.log('Formulario válido - enviar');
        // form.submit(); o AJAX
      }
    });

    // Limpiar error al escribir
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('form-error')) {
          errorMsg.textContent = '';
        }
      });
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========== MODAL ==========

function initModals() {
  const modals = document.querySelectorAll('.modal');

  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal__close');
    const backdrop = modal.querySelector('.modal__backdrop');

    // Cerrar con botón
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Cerrar con backdrop
    if (backdrop) {
      backdrop.addEventListener('click', () => closeModal(modal));
    }

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal(modal);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Focus en el primer elemento focuseable
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) {
      setTimeout(() => focusable.focus(), 100);
    }
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }
}

// Exponer funciones globalmente si se necesitan
window.openModal = openModal;
window.closeModal = closeModal;

// ========== ACTIVE LINK EN NAVEGACIÓN ==========

function initActiveNavLinks() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath ||
        (currentPath === '/' && linkPath === '/') ||
        (currentPath.includes(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
    }
  });
}

// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando sitio...');
  
  // Detectar dispositivos táctiles
  detectTouchDevice();

  // Inicializar componentes
  initMobileMenu();
  initHeaderScroll();
  initSmoothScroll();
  initLazyLoading();
  initScrollAnimations();
  initFormValidation();
  initModals();
  initActiveNavLinks();

  console.log('✅ Gabriela Aloise Propiedades - Sitio inicializado correctamente');
});

// ========== PERFORMANCE ==========

// Reportar Web Vitals a consola (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.addEventListener('load', () => {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsScore = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      console.log('CLS:', clsScore);
    }).observe({ entryTypes: ['layout-shift'] });
  });
}