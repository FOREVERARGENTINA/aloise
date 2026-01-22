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
    const closeBtn = document.querySelector('.mobile-menu-close');

    if (!toggle || !menu) return;

    // Marcar inicializado para que otros no vuelvan a registrar handlers
    window.__MOBILE_MENU_INIT = true;

    // Función para abrir el menú
    const openMenu = () => {
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('mobile-menu--open', 'active');
      toggle.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    };

    // Función para cerrar el menú
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('mobile-menu--open', 'active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };

    // Toggle al hacer clic en el botón hamburguesa
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Cerrar al hacer clic en el botón X dentro del menú
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Cerrar al hacer click en links dentro del menú
    menu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
      }
    });
  }
}

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => Components.init());