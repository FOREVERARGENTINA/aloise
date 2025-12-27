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
    // Los elementos pueden cargarse de forma asíncrona (Components loader).
    // Esperar que el navbar sea insertado y reintentar.
    // Evitar múltiples observadores
    if (document.body.dataset.mobileMenuWatcher) return;
    document.body.dataset.mobileMenuWatcher = '1';

    const target = document.getElementById('navbar') || document.body;
    const observer = new MutationObserver((mutations, obs) => {
      const newToggle = document.querySelector('.mobile-menu-toggle');
      const newMenu = document.querySelector('.mobile-menu');
      if (newToggle && newMenu) {
        obs.disconnect();
        delete document.body.dataset.mobileMenuWatcher;
        // Reintentar inicialización
        initMobileMenu();
      }
    });

    observer.observe(target, { childList: true, subtree: true });
    return;
  }

  window.__MOBILE_MENU_INIT = true;
  toggle.setAttribute('data-initialized', 'true');

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isActive = menu.classList.contains('active');

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
    menu.classList.add('active');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    document.body.classList.add('mobile-menu-open');
  }

  function closeMenu() {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = ''; // Restaurar scroll
    document.body.classList.remove('mobile-menu-open');
  }
}

// ========== HEADER SCROLL ==========

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;

  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Agregar clase cuando se hace scroll
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

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
  // Inyectar meta author y JSON-LD para atribución si está configurado
  (function injectAuthorMetadata() {
    try {
      const seo = window.CONFIG && window.CONFIG.seo ? window.CONFIG.seo : {};
      const authorName = seo.authorName || '';
      const authorUrl = seo.authorUrl || '';

      if (authorName) {
        // Meta author
        let meta = document.querySelector('meta[name="author"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', 'author');
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', authorName);
      }

      // JSON-LD Person
      if (authorName) {
        const existing = document.getElementById('site-author-jsonld');
        if (!existing) {
          const script = document.createElement('script');
          script.id = 'site-author-jsonld';
          script.type = 'application/ld+json';

          const sameAs = [];
          if (window.CONFIG && window.CONFIG.social) {
            const s = window.CONFIG.social;
            if (s.facebook) sameAs.push(s.facebook);
            if (s.instagram) sameAs.push(s.instagram);
            if (s.linkedin) sameAs.push(s.linkedin);
            if (s.youtube) sameAs.push(s.youtube);
          }

          const json = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            'name': authorName
          };

          if (authorUrl) json.url = authorUrl;
          if (sameAs.length) json.sameAs = sameAs;

          script.textContent = JSON.stringify(json);
          document.head.appendChild(script);
        }
      }

      // JSON-LD Organization (publisher)
      try {
        const existingOrg = document.getElementById('site-publisher-jsonld');
        if (!existingOrg) {
          const orgName = (window.CONFIG && window.CONFIG.business && window.CONFIG.business.name) || seo.siteName || authorName || '';
          const orgUrl = seo.siteUrl || authorUrl || '';
          const logoPath = seo.defaultImage || '/images/logo/logo1.jpg';
          let logoFull = '';
          if (logoPath) {
            if (logoPath.startsWith('http')) logoFull = logoPath;
            else if (orgUrl) logoFull = orgUrl.replace(/\/$/, '') + (logoPath.startsWith('/') ? logoPath : '/' + logoPath);
            else logoFull = logoPath;
          }

          const contact = window.CONFIG && window.CONFIG.contact ? window.CONFIG.contact : {};
          const contactPoint = [];
          if (contact.phone) contactPoint.push({ '@type': 'ContactPoint', 'telephone': contact.phone, 'contactType': 'customer support' });
          if (contact.email) contactPoint.push({ '@type': 'ContactPoint', 'email': contact.email, 'contactType': 'customer support' });

          const sameAsOrg = [];
          if (window.CONFIG && window.CONFIG.social) {
            const s = window.CONFIG.social;
            if (s.facebook) sameAsOrg.push(s.facebook);
            if (s.instagram) sameAsOrg.push(s.instagram);
            if (s.linkedin) sameAsOrg.push(s.linkedin);
            if (s.youtube) sameAsOrg.push(s.youtube);
          }

          const orgJson = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': orgName
          };

          if (orgUrl) orgJson.url = orgUrl;
          if (logoFull) orgJson.logo = logoFull;
          if (sameAsOrg.length) orgJson.sameAs = sameAsOrg;
          if (contactPoint.length) orgJson.contactPoint = contactPoint;

          const scriptOrg = document.createElement('script');
          scriptOrg.id = 'site-publisher-jsonld';
          scriptOrg.type = 'application/ld+json';
          scriptOrg.textContent = JSON.stringify(orgJson);
          document.head.appendChild(scriptOrg);
        }
      } catch (err) {
        console.warn('No se pudo inyectar metadata de publisher:', err);
      }
    } catch (e) {
      console.warn('No se pudo inyectar metadata de autor:', e);
    }
  })();

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
