// Backup simple del menú móvil por si falla el principal
window.addEventListener('load', () => {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  
  // Si otro módulo ya inicializó el menú, no hacemos nada
  if (window.__MOBILE_MENU_INIT) {
    return;
  }

  if (toggle && menu) {
    
    // Verificar si ya está inicializado por esta emergencia
    if (!toggle.hasAttribute('data-emergency-init')) {
      toggle.setAttribute('data-emergency-init', 'true');
      
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = menu.classList.contains('active');
        
        if (isActive) {
          menu.classList.remove('active');
          toggle.classList.remove('active');
          document.body.style.overflow = '';
          document.body.classList.remove('mobile-menu-open');
        } else {
          menu.classList.add('active');
          toggle.classList.add('active');
          document.body.style.overflow = 'hidden';
          document.body.classList.add('mobile-menu-open');
        }
      });
      
      // Cerrar al hacer click en links
      menu.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('active');
          toggle.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
      
      // Cerrar con ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
          menu.classList.remove('active');
          toggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }
});
