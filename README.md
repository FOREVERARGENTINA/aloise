# Gabriela Aloise Propiedades - Sitio Web

Sitio web profesional para inmobiliaria en Caseros, Buenos Aires.

## Información del Negocio

- **Nombre**: Gabriela Aloise Propiedades
- **Matrícula**: 2987
- **Dirección**: Tres de Febrero 2958, Caseros, Buenos Aires
- **Servicios**: Ventas, Alquileres, Tasaciones y Administraciones

## Características Técnicas

### Stack Tecnológico
- HTML5 semántico
- CSS3 con variables (Design System)
- JavaScript vanilla (sin frameworks)
- Mobile-first responsive design

### Optimizaciones Implementadas

✅ **Accesibilidad (WCAG 2.1)**
- Alt texts descriptivos en todas las imágenes
- Navegación por teclado completa
- Contraste de colores 4.5:1 mínimo
- Labels asociados en formularios
- ARIA attributes cuando necesario

✅ **SEO**
- Meta tags completos (title, description, OG, Twitter)
- Structured Data (JSON-LD) con información del negocio
- Sitemap.xml y robots.txt
- URLs semánticas
- HTML semántico

✅ **Performance**
- CSS modularizado y organizado
- Lazy loading de imágenes
- JavaScript optimizado
- Sin dependencias externas pesadas
- Fonts con preconnect

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch targets mínimo 44x44px
- Menú móvil optimizado

## Estructura del Proyecto

```
aloise/
├── index.html                 # Página principal
├── servicios.html            # Servicios (por crear)
├── propiedades.html          # Listado de propiedades (por crear)
├── quienes-somos.html        # Sobre nosotros (por crear)
├── contacto.html             # Formulario de contacto (por crear)
├── vende-con-nosotros.html   # CTA vendedores (por crear)
├── robots.txt
├── sitemap.xml
├── css/
│   ├── design-system.css     # Variables y sistema de diseño
│   ├── global.css            # Reset, base, utilidades
│   ├── components.css        # Componentes reutilizables
│   └── sections/             # CSS por sección
│       ├── navigation.css
│       ├── hero.css
│       └── footer.css
├── js/
│   ├── main.js               # JavaScript principal
│   └── modules/              # Módulos específicos (futuro)
├── images/
│   ├── hero/                 # Imágenes del hero
│   ├── properties/           # Imágenes de propiedades
│   └── icons/                # Iconos y logos
└── assets/
    └── fonts/                # Fuentes (si se usan locales)
```

## Tareas Pendientes

### Alto Prioridad
- [ ] Actualizar número de WhatsApp real en:
  - index.html (botón flotante y footer)
  - js/main.js (CONFIG.whatsappNumber)
- [ ] Actualizar email real en footer (actualmente: info@mariascarpino.com)
- [ ] Actualizar número de teléfono real en footer
- [ ] Agregar logo real (reemplazar SVG placeholder)
- [ ] Agregar imágenes de propiedades reales

### Páginas por Crear
- [ ] servicios.html - Detalle de servicios
- [ ] propiedades.html - Listado completo de propiedades
- [ ] quienes-somos.html - Sobre el equipo
- [ ] contacto.html - Formulario de contacto
- [ ] vende-con-nosotros.html - Landing para vendedores
- [ ] privacidad.html - Política de privacidad
- [ ] terminos.html - Términos y condiciones

### Funcionalidades por Agregar
- [ ] Integración con backend/CMS para propiedades
- [ ] Formulario de contacto funcional (integración con email)
- [ ] Buscador de propiedades con filtros
- [ ] Galería de imágenes para propiedades individuales
- [ ] Google Maps con ubicación de la oficina
- [ ] Testimonios de clientes

### Optimizaciones Futuras
- [ ] Implementar Service Worker para PWA
- [ ] Optimizar imágenes a WebP/AVIF
- [ ] Agregar Google Analytics o Plausible
- [ ] Implementar caché headers
- [ ] CDN para assets estáticos

## Instalación y Uso

### Desarrollo Local

1. Clonar el repositorio
2. Usar un servidor local (NO abrir directamente el HTML):

**Opción 1: Python**
```bash
python -m http.server 8000
```

**Opción 2: Node.js (http-server)**
```bash
npx http-server -p 8000
```

**Opción 3: VS Code**
- Instalar extensión "Live Server"
- Click derecho en index.html → "Open with Live Server"

3. Abrir en navegador: `http://localhost:8000`

### Deployment

**Hosting Recomendado (Gratis):**
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

**Pasos para Netlify:**
1. Conectar repositorio de GitHub
2. Build command: (dejar vacío)
3. Publish directory: `/`
4. Deploy

**Dominio Personalizado:**
- Configurar DNS apuntando a Netlify/Vercel
- Agregar dominio en configuración del hosting
- SSL automático incluido

## Testing

### Checklist Pre-lanzamiento

**Funcionalidad:**
- [ ] Navegación funciona en todas las páginas
- [ ] Menú móvil abre y cierra correctamente
- [ ] Links externos abren en nueva pestaña
- [ ] Botón WhatsApp redirige correctamente
- [ ] Formularios validan correctamente

**Responsive:**
- [ ] Probado en móvil real (iOS)
- [ ] Probado en móvil real (Android)
- [ ] Probado en tablet
- [ ] Probado en desktop (1920px)

**Navegadores:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Performance:**
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] Lighthouse Best Practices > 95
- [ ] Lighthouse SEO > 95

**SEO:**
- [ ] Google Search Console configurado
- [ ] Sitemap enviado
- [ ] Todas las páginas indexables
- [ ] Meta tags únicos por página

**Herramientas de Testing:**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (en Chrome DevTools)
- [WAVE](https://wave.webaim.org/) (accesibilidad)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

## Datos de Contacto a Actualizar

Buscar y reemplazar en todo el proyecto:

- **WhatsApp**: `5491112345678` → [NÚMERO REAL]
- **Email**: `info@mariascarpino.com` → [EMAIL REAL]
- **Teléfono**: `+54 11 1234-5678` → [TELÉFONO REAL]
- **Facebook**: `gabrielaaloisepropiedades` → [USERNAME REAL]
- **Instagram**: `gabrielaaloisepropiedades` → [USERNAME REAL]

## Paleta de Colores

- **Azul Royal**: `#0047AB` - Navegación, botones principales
- **Dorado**: `#D4AF37` - CTAs, acentos, detalles elegantes
- **Dorado Oscuro**: `#B8941F` - Hover states
- **Gris Azulado**: `#2C3E50` - Textos, headers

## Tipografía

- **Headings**: Playfair Display (serif, elegante)
- **Body**: Inter (sans-serif, moderna y legible)

## Licencia

© 2025 Gabriela Aloise Propiedades. Todos los derechos reservados.

---

**Desarrollado siguiendo las mejores prácticas de desarrollo web moderno**
- Mobile-first design
- Accesibilidad WCAG 2.1
- SEO optimizado
- Performance optimizado
- Código semántico y modular
