// Sistema de componentes moderno con async/await
class Components {
  static async load(name, selector) {
    try {
      const response = await fetch(`/components/${name}.html`);
      const html = await response.text();
      document.querySelector(selector).innerHTML = html;
    } catch (error) {
      console.error(`Error cargando ${name}:`, error);
    }
  }

  static async init() {
    // Cargar componentes en paralelo
    await Promise.all([
      this.load('navbar', '#navbar'),
      this.load('footer', '#footer')
    ]);
    
    // Inicializar funcionalidades
    this.initMobileMenu();
  }

  static initMobileMenu() {
    // Evitar doble inicialización si otro módulo ya inicializó el menú
    if (window.__MOBILE_MENU_INIT) {
      return;
    }

    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    
    if (!toggle || !menu) return;

    // Marcar inicializado para que otros no vuelvan a registrar handlers
    window.__MOBILE_MENU_INIT = true;
    
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isOpen);

      // Cambiar clase moderna y mantener compatibilidad con la clase 'active'
      menu.classList.toggle('mobile-menu--open');
      menu.classList.toggle('active');
      toggle.classList.toggle('active');

      // Controlar overflow y clase en el body para poder ocultar el toggle externo
      if (!isOpen) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('mobile-menu-open');
      } else {
        document.body.style.overflow = '';
        document.body.classList.remove('mobile-menu-open');
      }
    });

    // Cerrar al hacer click en links dentro del menú
    menu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('mobile-menu--open');
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        document.body.classList.remove('mobile-menu-open');
      });
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        menu.classList.remove('mobile-menu--open');
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        document.body.classList.remove('mobile-menu-open');
      }
    });
  }
}

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => Components.init());