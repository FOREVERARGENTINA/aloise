// Sistema de componentes moderno con async/await
class Components {
  static version = '20260704b';

  static async load(name, selector) {
    try {
      const response = await fetch(`/components/${name}.html?v=${this.version}`, {
        cache: 'no-store'
      });
      const html = await response.text();
      const target = document.querySelector(selector);
      // El navbar usa position:sticky; un wrapper de la misma altura que el
      // header le quita el recorrido necesario para pegarse. El footer sí
      // necesita conservar su wrapper #footer (host del CSS de footer-reveal).
      if (name === 'navbar') {
        target.outerHTML = html;
      } else {
        target.innerHTML = html;
      }
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
    this.initFooterReveal();
  }

  static applyFooterReveal() {
    const content = document.querySelector('main');
    const footerHost = document.querySelector('#footer');
    const footer = document.querySelector('#site-footer');
    const header = document.querySelector('.header');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (!content || !footerHost || !footer) return;

    document.body.classList.add('footer-reveal-page');

    if (isMobile) {
      content.style.marginBottom = '';
      document.documentElement.style.setProperty('--footer-header-offset', '0px');
      document.body.classList.remove('footer-reveal-active');
      return;
    }

    const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    const footerHeight = Math.ceil(footer.getBoundingClientRect().height);
    const viewportHeight = Math.ceil(window.innerHeight);
    const availableHeight = Math.max(0, viewportHeight - headerHeight);
    const canReveal = footerHeight <= availableHeight - 16;

    document.documentElement.style.setProperty('--footer-header-offset', `${headerHeight}px`);

    if (!canReveal) {
      content.style.marginBottom = '';
      document.body.classList.remove('footer-reveal-active');
      return;
    }

    document.body.classList.add('footer-reveal-active');
    content.style.marginBottom = `${footerHeight}px`;
  }

  static initFooterReveal() {
    const update = () => this.applyFooterReveal();
    const footer = document.querySelector('#site-footer');

    window.addEventListener('load', update, { once: true });
    window.addEventListener('resize', update, { passive: true });

    if (footer && 'ResizeObserver' in window) {
      this.footerResizeObserver = new ResizeObserver(update);
      this.footerResizeObserver.observe(footer);
    }

    update();
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
