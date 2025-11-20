# 🚀 Guía Consolidada de Desarrollo Web Moderno

> **"La complejidad es el enemigo del lanzamiento. El mejor código es el que no escribiste."**

## 📋 Índice Rápido
1. [Filosofía Central](#filosofía-central)
2. [Clasificación de Proyectos](#clasificación-de-proyectos)
3. [Arquitectura de Archivos](#arquitectura-de-archivos)
4. [Accesibilidad](#accesibilidad-crítico-siempre)
5. [Mobile-First](#mobile-first)
6. [HTML Semántico](#html-semántico)
7. [CSS](#css-decisiones-y-organización)
8. [JavaScript](#javascript-modularidad)
9. [SEO](#seo-básico-vs-avanzado)
10. [Imágenes y Multimedia](#imágenes-y-multimedia)
11. [Performance](#performance-y-optimización)
12. [Hosting](#hosting-por-tipo)
13. [Testing](#testing-por-tipo)
14. [Seguridad](#seguridad-básica)
15. [Checklist de Lanzamiento](#checklist-de-lanzamiento)

---

## 🎯 Filosofía Central

### Principios Fundamentales

**1. Separación de Responsabilidades**
- HTML = Estructura y contenido
- CSS = Presentación y diseño  
- JavaScript = Comportamiento e interactividad

**2. Regla de Oro: Simplicidad Primero**
- Empieza simple. Agrega complejidad solo con evidencia de que la necesitas
- Si copias código más de 2 veces → crea un componente reutilizable
- Si un archivo HTML supera 500 líneas → tiene CSS/JS que debe externalizarse

**3. Proceso de Decisión en 3 Pasos**

Para CUALQUIER técnica/herramienta/librería pregúntate:

```
1. ¿RESUELVE UN PROBLEMA REAL?
   NO → Skip  
   SÍ → Continúa

2. ¿EL BENEFICIO JUSTIFICA LA COMPLEJIDAD?
   NO → Busca alternativa más simple  
   SÍ → Continúa

3. ¿PUEDES MANTENERLO EN 6 MESES?
   NO → No lo implementes  
   SÍ → Adelante
```

---

## 📊 Clasificación de Proyectos

**Antes de tomar cualquier decisión técnica, clasifica tu proyecto:**

### Tipo A: Landing Page / Portafolio Simple
- **Características**: 1-5 páginas, contenido mayormente estático
- **Tráfico esperado**: < 1,000 visitas/mes
- **Complejidad**: Baja
- **Stack recomendado**: HTML + CSS + JavaScript vanilla
- **Ejemplo**: Portafolio personal, página de restaurante local

### Tipo B: Sitio Corporativo / Blog
- **Características**: 10-50 páginas, algo de interactividad
- **Tráfico esperado**: 1,000-50,000 visitas/mes
- **Complejidad**: Media
- **Stack recomendado**: SSG (Astro, 11ty) o HTML + framework ligero
- **Ejemplo**: Blog profesional, sitio de empresa mediana

### Tipo C: Aplicación Web / E-commerce
- **Características**: Múltiples vistas, alta interactividad, datos dinámicos
- **Tráfico esperado**: 50,000+ visitas/mes
- **Complejidad**: Alta
- **Stack recomendado**: Framework moderno (Next.js, Nuxt, SvelteKit)
- **Ejemplo**: Tienda online, dashboard, SaaS

---

## 📁 Arquitectura de Archivos

### Estructura Tipo A/B (Simple/Medio)

```
proyecto/
├── index.html
├── css/
│   ├── design-system.css      # Variables, colores, tipografía
│   ├── global.css             # Reset, base, utilidades
│   ├── components.css         # Botones, cards, modales
│   └── sections/              # CSS por sección
│       ├── hero.css
│       ├── navigation.css
│       └── footer.css
├── js/
│   ├── main.js                # Inicialización principal
│   └── modules/               # Módulos específicos
│       ├── gallery.js
│       ├── forms.js
│       └── animations.js
├── images/
│   ├── hero/
│   ├── gallery/
│   └── icons/
└── assets/
    └── fonts/
```

### Estructura Tipo C (App Web)

```
proyecto/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── ui/               # Componentes reutilizables
│   │   └── sections/         # Secciones específicas
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── lib/                  # Utilidades
│   ├── pages/                # Rutas
│   └── data/                 # Tipos, constantes
├── tests/
└── package.json
```

### Reglas de Nomenclatura

- **Archivos**: kebab-case.css (minúsculas con guiones)
- **Clases CSS**: .kebab-case o .component__element--modifier (BEM)
- **IDs**: #camelCase (solo cuando sea absolutamente necesario)
- **JavaScript**: camelCase para variables, PascalCase para clases

---

## ♿ Accesibilidad (CRÍTICO SIEMPRE)

### ✅ SIEMPRE - Nivel Mínimo No Negociable

**1. Alt Textos DESCRIPTIVOS**
- ❌ alt="imagen" → genérico, inútil
- ❌ alt="" → solo si decorativa
- ✅ alt="Gráfico de ventas Q4 mostrando crecimiento del 23%"

**2. Contraste de Color**
- Texto normal: Mínimo 4.5:1
- Texto grande (>24px): Mínimo 3:1
- Herramienta: WebAIM Contrast Checker

**3. Navegación por Teclado**
- Todo clickeable debe alcanzarse con Tab
- Focus visible (NUNCA outline: none sin alternativa)
- Orden lógico de tabulación

**4. HTML Semántico**
- `<button>` para acciones, `<a>` para navegación
- `<label>` asociado a cada `<input>` (for/id)
- Landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`

**5. Tamaños Táctiles (Móvil)**
- Botones/links mínimo 44x44px
- Espaciado entre elementos mínimo 8px

### 🟡 ARIA: Solo si HTML Semántico No Alcanza

**✅ Usar ARIA cuando:**
- Componentes custom (tab panels, accordions)
- Estados dinámicos (aria-expanded, aria-hidden)
- Regiones de live updates (aria-live)

**❌ NO usar ARIA si:**
- Existe elemento HTML nativo (usar `<button>` no role="button")
- No entiendes completamente el atributo
- Agregas complejidad sin beneficio

**Regla**: "No ARIA es mejor que ARIA mal usado"

### 🧪 Testing Accesibilidad

**Tipo A/B/C (SIEMPRE):**
- [ ] axe DevTools (extensión Chrome/Firefox)
- [ ] WAVE (extensión navegador)
- [ ] Teclado only: navega tu sitio sin mouse
- [ ] Lighthouse Accessibility score > 95

**Tipo C (adicional):**
- [ ] Lector de pantalla: NVDA (Win), VoiceOver (Mac)
- [ ] axe-core en tests automatizados

---

## 📱 Mobile-First

### ✅ SIEMPRE: Pruebas en Dispositivo Real

**❌ INSUFICIENTE:**
- Solo Chrome DevTools responsive mode
- Solo emulador Android Studio

**✅ MÍNIMO VIABLE:**
1. Prueba en TU teléfono (el que tengas)
2. Pide a 2 personas que prueben en sus teléfonos
3. Cubre: iOS + Android (no necesitas 10 dispositivos)

**Herramientas gratuitas:**
- BrowserStack (trial 30 días)
- LambdaTest (100 min/mes gratis)

### 📱 Checklist Dispositivo Real

- [ ] Touch gestures funcionan (no solo clicks)
- [ ] Zoom de página no rompe layout
- [ ] Inputs no causan zoom automático (font-size ≥ 16px)
- [ ] Teclado móvil no tapa inputs (scroll adecuado)
- [ ] Performance real (no solo Lighthouse simulado)
- [ ] Consumo de datos razonable

### ⚡ Mobile-First Técnico

**Enfoque:**
- Estilos base = móvil (siempre)
- Media queries = mejora progresiva para desktop
- Usar min-width, NO max-width

**Detectar touch devices:**
- Adapta UX (aumenta áreas de click, quita hover effects)
- Usa JavaScript para agregar clase .touch-device al body

---

## 📄 HTML Semántico

### Meta Tags Esenciales (SIEMPRE)

**Críticos:**
- charset UTF-8
- viewport para responsive
- title único por página (50-60 caracteres)
- description (150-160 caracteres)

**SEO Social:**
- Open Graph: og:title, og:description, og:image, og:url
- Twitter Cards: twitter:card, twitter:image
- Favicon + apple-touch-icon

**Performance:**
- Preconnect para fuentes (Google Fonts, CDNs)

### Orden de Carga Óptimo

1. Charset y viewport
2. Preconnects (antes de CSS)
3. CSS: design system → global → componentes → secciones
4. JavaScript crítico (máximo 5-10 líneas)
5. Contenido del body
6. JavaScript al final con defer/async

### Evitar Inline Styles/Scripts

**Regla:** CSS y JS deben estar en archivos externos

**Excepción válida:** Critical CSS inline (menos de 50 líneas) para above-the-fold en páginas de alta performance

---

## 🎨 CSS: Decisiones y Organización

### 1. Variables CSS (Custom Properties)

**Define una vez, usa en todas partes:**

Sistema de diseño centralizado en design-system.css:
- Colores (primary, secondary, success, error, neutrales)
- Tipografía (familias, tamaños)
- Espaciado (xs, sm, md, lg, xl)
- Bordes (radius-sm, md, lg)
- Sombras (shadow-sm, md, lg)
- Breakpoints (para usar en JavaScript)

### 2. Estrategia por Tipo de Proyecto

**Tipo A (Simple):**

**Opción 1: Bootstrap + custom.css**
- ✅ Ventajas: Rápido, componentes listos, documentación extensa
- ❌ Desventajas: "Look genérico", archivo CSS grande
- Ideal para: Deadlines cortos, poca customización

**Opción 2: Tailwind CSS**
- ✅ Ventajas: Flexible, utility-first, archivo final pequeño (purge)
- ❌ Desventajas: Curva aprendizaje, HTML verboso
- Ideal para: Diseños únicos, proyectos modernos

**Decisión:**
- ¿Necesitas rapidez y componentes pre-hechos? → Bootstrap
- ¿Quieres diseño único sin "look genérico"? → Tailwind
- ¿Primera vez con CSS frameworks? → Bootstrap (más amigable)

**Tipo B (Medio):**
- Tailwind CSS o Bootstrap + módulos CSS
- Variables CSS (custom properties)
- Media queries organizadas

**Tipo C (Complejo):**
- CSS-in-JS (styled-components, Emotion) o Tailwind + sistema de diseño
- Componentes atómicos
- Temas dinámicos
- Purge CSS automático

### 3. Reglas de Oro CSS

**✅ HACER:**
- Mobile-first siempre (base = móvil, @media min-width = desktop)
- Usar variables para valores repetidos
- Clases únicas o BEM para naming
- Combinar propiedades con shorthand
- Agrupar media queries

**❌ EVITAR:**
- !important (indica problema de especificidad)
- IDs para estilos (usar solo para JavaScript)
- Selectores complejos (más de 3 niveles)
- Inline styles (salvo critical CSS)
- Valores hardcodeados repetidos

### 4. Modularización CSS

**Por tipo de responsabilidad:**
- design-system.css → Variables globales
- global.css → Reset, base, utilidades
- components.css → Botones, cards, modales (reutilizables)
- sections/ → CSS específico por sección (hero, footer, etc.)

---

## ⚡ JavaScript: Modularidad

### 1. Progresión de Complejidad

**Nivel 0: HTML puro**
- Sitio 100% estático
- Ejemplo: CV imprimible

**Nivel 1: Vanilla JS (sin frameworks)**
- Toggle menu, slider, smooth scroll, form validation
- Uso: Tipo A/B con interactividad mínima

**Nivel 2: Framework ligero (Alpine.js, Petite Vue)**
- Interactividad en componentes específicos
- Sin build process
- Uso: Tipo B con áreas dinámicas

**Nivel 3: Framework completo (React, Vue, Svelte)**
- SPA completo, estado global complejo
- Uso: Tipo C solamente

### 2. Red Flags: NO uses framework si...

❌ Solo necesitas un menú hamburguesa
❌ Solo necesitas un carousel de imágenes
❌ Solo necesitas validación de formulario
❌ Tu proyecto tiene menos de 10 componentes interactivos
❌ No hay estado compartido entre componentes

✅ En su lugar: Vanilla JS o Alpine.js

### 3. Organización: Un Archivo, Una Responsabilidad

**Modularizar por funcionalidad:**
- main.js → Inicialización, imports
- modules/gallery.js → Lógica de galería
- modules/forms.js → Validación formularios
- modules/animations.js → Efectos visuales
- config.js → Constantes, configuración

**Regla:** Si un módulo supera 200 líneas, dividirlo

### 4. Técnicas de Performance

**Event Delegation:**
- Un solo listener en el documento, no uno por elemento
- Mejora performance con muchos elementos interactivos

**Lazy Loading y Code Splitting:**
- Cargar módulos solo cuando se necesiten
- Usar dynamic import()
- Lazy load imágenes con Intersection Observer

**Constantes centralizadas:**
- API_URL, configuraciones, breakpoints
- Facilita mantenimiento y cambios

### 5. Librerías Específicas: Sí/No

**✅ USAR (solo si realmente necesitas la funcionalidad):**
- Swiper.js para carousels complejos
- GLightbox para galerías
- AOS para animaciones on-scroll
- Chart.js para gráficos

**❌ NO USAR:**
- jQuery (es 2025, usa fetch() y querySelector())
- Moment.js (usa date-fns o Intl.DateTimeFormat)
- Lodash completo (importa solo funciones específicas)

---

## 🔍 SEO: Básico vs Avanzado

### ✅ SIEMPRE (Todos los proyectos)

**Meta tags esenciales:**
- title único por página (50-60 caracteres)
- meta description (150-160 caracteres)
- charset UTF-8
- viewport
- canonical link si hay riesgo de duplicados

**Semántica HTML:**
- header, main, footer, nav
- h1 único por página (jerarquía h1 > h2 > h3)
- article para contenido independiente
- alt descriptivo en TODAS las imágenes

**URLs limpias:**
- ✅ /sobre-nosotros
- ❌ /page?id=2
- Sin guiones bajos, usar guiones medios
- Sin caracteres especiales

**Robots.txt:**
- Aunque sea básico, siempre incluirlo
- Mínimo: User-agent: *, Allow: /, Sitemap: URL

### ✅ Sitemap XML: Regla Actualizada

**SIEMPRE si:**
- Tipo A con más de 5 páginas
- Tipo B/C (siempre)
- Quieres indexación rápida (nuevo sitio)

**NO necesario si:**
- Landing de 1-3 páginas
- Proyecto temporal/experimental

**Generación:**
- Manual: xml-sitemaps.com (gratis, menos de 500 URLs)
- Automático: SSG (Astro, 11ty) lo genera automáticamente

### 🟡 CONDICIONAL

**Structured Data (JSON-LD):**

**Estrategia:**
- Si es Blog → Article schema
- Si es Negocio local → LocalBusiness schema
- Si es Productos → Product schema
- Si NADA encaja → WebPage o Organization (fallback universal)

**Regla Pragmática:**
1. ¿Tu contenido encaja en schema.org común? → Úsalo
2. ¿No estás seguro? → WebPage o Organization
3. ¿Pasaste más de 15 min sin resultado? → Solo WebPage y sigue adelante

**NO dejes JSON-LD sin implementar por miedo a "hacerlo mal". WebPage es siempre correcto.**

**Open Graph avanzado:**
- Tipo A: OG básico (title, description, image)
- Tipo B/C: + og:type, article:published_time, etc.

---

## 🖼️ Imágenes y Multimedia

### 1. Formatos por Uso

**Fotografías / Imágenes complejas:**
1. AVIF (mejor, soporte moderno)
2. WebP (buen balance soporte/compresión)
3. JPG (fallback universal)

**Gráficos / Ilustraciones / Logos:**
1. SVG (siempre que sea posible)
2. WebP (si SVG no funciona)
3. PNG (solo si necesitas transparencia + soporte viejo)

**Animaciones:**
1. CSS animations (preferido)
2. Lottie (JSON, ligero)
3. GIF (último recurso, pesado)

### 2. Dimensiones y Compresión

**Hero images:**
- Desktop: 1920x1080 (Full HD max)
- Mobile: 800x600
- Compresión: 80% quality JPG / 85% WebP

**Thumbnails:**
- 400x300 max
- Compresión: 70% quality

**Optimización:**
- Herramientas: Squoosh.app, TinyPNG, ImageOptim
- Target: menos de 200KB por imagen
- Ideal: menos de 100KB para above-the-fold

### 3. Responsive Images

**✅ Usa picture + srcset SI:**
- Imagen ocupa más del 50% del viewport
- Tienes versiones mobile/desktop diferentes
- Hero images, featured images

**❌ NO uses srcset si:**
- Imagen es pequeña (menos de 200px de ancho)
- Es un logo o ícono
- Complejidad no justifica beneficio

### 4. Lazy Loading

**✅ SIEMPRE lazy load:**
- Imágenes below the fold (no visibles inicialmente)
- Galerías con 10+ imágenes
- Thumbnails de productos

**❌ NUNCA lazy load:**
- Logo del sitio
- Hero image (primera imagen visible)
- Imágenes críticas above the fold
- Imágenes de LCP (Largest Contentful Paint)

**Implementación:**
- Atributo loading="lazy" (nativo, sin librerías)
- Intersection Observer para control avanzado

### 5. Videos

**Videos de fondo (hero video):**
- Autoplay, muted, loop, playsinline
- Versión móvil más ligera (menos de 2MB)
- Fallback a imagen estática en conexiones lentas
- Poster obligatorio para fallback
- Incluir transcripción o captions (accesibilidad)

**Videos de contenido:**
- Lazy load con poster (preload="none")
- NO autoplay con audio (molesto, consume datos)

**Compatibilidad iOS/Safari crítica:**

**Problema:** iOS Safari bloquea autoplay por políticas de batería/datos

**Solución:**
- Atributos obligatorios: playsinline, muted, poster
- JavaScript para forzar reproducción tras interacción usuario
- Detectar iOS/Safari específicamente
- Poster optimizado (WebP, 1280x720, menos de 150KB)
- Alternativa: Mostrar solo imagen estática en iOS si video no es crítico

**Checklist compatibilidad:**
- [ ] Video tiene playsinline attribute
- [ ] Video tiene muted attribute
- [ ] Poster existe y ruta correcta
- [ ] Poster es WebP optimizado (menos de 150KB)
- [ ] JavaScript detecta iOS/Safari
- [ ] Intentos de reproducción con catch() para errores
- [ ] Poster se ve correctamente si video falla
- [ ] Probado en Safari desktop y iPhone real
- [ ] Video no pesa más de 5MB

### 6. OG Images: Reutilización Inteligente

**Tipo A (Simple):**
- 1 imagen genérica del sitio (1200x630px)
- Misma para todas las páginas
- Peso: menos de 200KB

**Tipo B (Inteligente):**
- 1 imagen base con texto dinámico vía CSS/URL transforms
- Herramienta: Cloudinary (transforma URL con texto)
- Alternativa sin herramienta: 3-5 imágenes template (home, blog, servicios)
- NO una por cada artículo individual

**Tipo C (Avanzado):**
- Generación dinámica por artículo/producto
- Herramienta: Vercel OG, Cloudinary, API custom

**Solución práctica Tipo B:**
- Cloudinary gratuito: 25 GB storage
- 1 imagen física, infinitas variaciones vía URL
- Sin rebuild de imágenes

---

## ⚡ Performance y Optimización

### 1. Lazy Loading: Matriz de Decisión

**Imágenes:**
- ✅ Lazy load: below the fold, galerías, thumbnails
- ❌ NUNCA: logo, hero image, above the fold, LCP

**Videos:**
- ✅ Lazy load con poster
- ❌ NUNCA autoplay con audio

**JavaScript:**
- ✅ Code splitting: módulos grandes, funcionalidad opcional
- ❌ NO: si JS total pesa menos de 50KB

### 2. Caché: Estrategia Pragmática

**Nivel 1: Browser Cache (Headers HTTP) - SIEMPRE**

**Assets estáticos (CSS/JS/imágenes):**
- Cache-Control: public, max-age=31536000, immutable
- 1 año porque usas versioning (style.v2.css)

**HTML:**
- Cache-Control: no-cache
- Fuerza revalidación, pero permite caché

**Fonts:**
- Cache-Control: public, max-age=31536000

**API responses:**
- Cache-Control: private, max-age=300
- 5 minutos para datos que cambian poco

**Nivel 2: Service Workers (PWA)**
- ✅ Usar solo si: offline-first, contenido estable, Tipo C
- ❌ NO: sitio simple (Tipo A/B), sin necesidad offline

**Nivel 3: CDN**
- ✅ Usar si: tráfico mayor a 10,000 visitas/mes, audiencia internacional, assets pesados
- ❌ NO: Tipo A con menos de 1,000 visitas/mes, audiencia 100% local

**Opciones CDN gratuitas:**
- Cloudflare (free tier generoso)
- Netlify/Vercel (si hostas con ellos)

### 3. Fuentes (Web Fonts)

**Regla de Decisión:**

¿Necesitas fuente custom?
- NO → Usa system fonts (0 KB, máxima velocidad)
- SÍ → Sigue estas reglas:
  - Máximo 2 familias (heading + body)
  - Máximo 4 variantes (regular, italic, bold, bold-italic)
  - Formato: WOFF2 (mejor compresión)
  - Preload de fuentes críticas

**Google Fonts optimizado:**
- Preconnect a fonts.googleapis.com y fonts.gstatic.com
- font-display: swap (muestra texto inmediatamente con sistema, luego cambia)

**❌ NUNCA:**
- Fuentes mayores a 100KB por variante
- Más de 6 variantes totales
- font-display: block (texto invisible hasta cargar)

### 4. Renderizado (SSR vs CSR vs SSG)

**Mapa de Decisión:**

¿Contenido cambia frecuentemente?
- NO → SSG (Static Site Generation)
  - Blog, portafolio, landing pages
  - Frameworks: Astro, 11ty, Next.js (export)
  - Ventajas: SEO perfecto, máxima velocidad, hosting barato
  - Desventajas: Rebuild para cambios

- SÍ → ¿Requiere datos del usuario?
  - NO → SSR (Server-Side Rendering)
    - Contenido personalizado, cambios frecuentes pero SEO crítico
    - Frameworks: Next.js, Nuxt, SvelteKit
    - Ventajas: SEO + contenido dinámico
    - Desventajas: Servidor necesario, más caro
  
  - SÍ → CSR (Client-Side Rendering)
    - Aplicación web (dashboard, SaaS)
    - SEO no prioritario, todo tras login
    - Frameworks: React SPA, Vue SPA
    - Ventajas: Interactividad máxima
    - Desventajas: SEO pobre, loading inicial lento

**Para la Mayoría (Tipo A/B):**

**RECOMENDACIÓN: HTML estático + JavaScript progresivo**
1. Escribe HTML normal
2. Agrega CSS
3. Agrega JS solo para interactividad (menú, slider)
4. No uses framework si no necesitas SPA

¿Bootstrap? ✅ Perfecto para Tipo A/B
¿React? ❌ Overkill para landing page

---

## 🏠 Hosting por Tipo

### Tipo A (Landing/Portafolio)

**✅ GRATIS (Recomendado):**
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

**Todos incluyen:**
- SSL gratis
- Deploy automático con Git
- CDN global
- Dominio custom

### Tipo B (Corporativo/Blog)

**✅ GRATIS/Freemium:**
- Netlify/Vercel (hasta 100GB bandwidth/mes)
- Cloudflare Pages

**✅ Si necesitas PHP (WordPress, etc.):**

**Para PRUEBAS DE CONCEPTO únicamente (1-2 semanas):**
- InfinityFree (5GB espacio)
- 000webhost (300MB)
- ⚠️ Advertencia: Rendimiento inconsistente, downtime frecuente, sin soporte. NO usar para producción.

**Para PRODUCCIÓN (proyectos reales):**

**PAGOS económicos ($3-10/mes) - RECOMENDADO:**
- SiteGround StartUp ($3/mes primer año)
- Hostinger Business ($4/mes)
- WebempresaHosting (desde €5/mes)

**Regla:** Si es para un cliente o negocio real, invierte $5/mes mínimo. El hosting gratis te costará más en tiempo de troubleshooting.

### Tipo C (App Web)

**✅ Stack Moderno Gratis:**

**Frontend:**
- Vercel (Next.js ideal)
- Netlify (cualquier framework)

**Backend:**
- Railway (tier gratis: $5 crédito/mes)
- Render (tier gratis con sleep)
- Fly.io (tier gratis limitado)

**Database:**
- PlanetScale (MySQL, 5GB gratis)
- Supabase (PostgreSQL, 500MB gratis)
- Railway (incluye Postgres en tier gratis)

**Migra a pago cuando:**
- Sleep time de servidor gratis te afecta
- Superas límites gratuitos
- Necesitas SLA/soporte

---

## 🧪 Testing por Tipo

### Tipo A (Landing/Portafolio)

**✅ Manual testing:**
- [ ] Chrome, Firefox, Safari (desktop)
- [ ] 2 dispositivos móviles reales (tu teléfono + otro)
- [ ] Lighthouse: Performance, Accessibility, SEO > 90
- [ ] axe DevTools: 0 errores críticos
- [ ] Navegación solo con teclado funciona

### Tipo B (Corporativo/Blog)

**✅ Tipo A +**
- [ ] Formularios: Envío real + validación
- [ ] Links: Broken Link Checker (extensión)
- [ ] Cross-browser: BrowserStack trial o LambdaTest
- [ ] Velocidad real: WebPageTest (3 ubicaciones geográficas)
- [ ] WAVE: 0 errores accesibilidad

### Tipo C (App Web/E-commerce)

**✅ Tipo B +**

**Automatizado:**
- [ ] Unit tests: Jest/Vitest (lógica crítica)
- [ ] E2E tests: Playwright o Cypress (user flows críticos)
- [ ] Accesibilidad automática: @axe-core/playwright
- [ ] Performance continua: Lighthouse CI en cada deploy

**CI/CD Pipeline:**
1. Commit → GitHub Actions
2. Run tests (unit + a11y)
3. Deploy a staging
4. E2E tests en staging
5. Lighthouse CI (bloquea si score < 85)
6. Deploy a producción si todo pasa

**Herramientas:**
- Lighthouse CI: github.com/GoogleChrome/lighthouse-ci
- GitHub Actions workflows (gratis para repos públicos)

---

## 🔒 Seguridad Básica

### Nivel Mínimo (Todos los Proyectos)

**✅ HTTPS:**
- Certificado SSL (gratis con Let's Encrypt)
- Forzar HTTPS (redirect de HTTP)

**✅ Headers de Seguridad:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Referrer-Policy: strict-origin-when-cross-origin

**✅ Formularios:**
- Validación client-side (UX)
- Validación server-side (seguridad - CRÍTICO)
- Rate limiting (anti-spam)
- CAPTCHA si recibes spam (hCaptcha o Cloudflare Turnstile)

### Nivel Medio (Tipo B/C)

**✅ Content Security Policy (CSP):**
- Define qué recursos puede cargar tu sitio
- Previene XSS (Cross-Site Scripting)

**✅ Autenticación:**
- NUNCA almacenes passwords en plaintext
- Usa bcrypt para hashing (mínimo 10 rounds)
- Implementa rate limiting en login

**✅ Dependencias:**
- Revisa vulnerabilidades: npm audit / Snyk
- Actualiza librerías cada 3 meses

### ❌ NO Hagas (Errores Comunes)

- ❌ Exponer API keys en código frontend
- ❌ Confiar en validación client-side únicamente
- ❌ Usar MD5 o SHA1 para passwords
- ❌ Permitir file uploads sin validación
- ❌ No sanitizar inputs de usuario

---

## 📈 Analytics y Tracking

### 📊 Qué Medir Siempre

**✅ Esencial (todos los proyectos):**
- Pageviews
- Sessions
- Bounce rate
- Top pages
- Traffic sources

**Herramienta mínima:**
- Google Analytics 4 (GA4) o
- Plausible (privacy-friendly, más simple)

### 🎯 Eventos Personalizados

**✅ Trackear solo si importa para tu negocio:**
- Click en CTA principal
- Envío de formulario
- Descarga de archivo
- Video reproducido (si es clave)

**❌ NO trackees:**
- Cada click en cada botón
- Scroll depth (salvo caso muy específico)
- Mouse movements (overkill)

### 🔐 GDPR / Privacidad

**✅ SIEMPRE:**
- Cookie banner si usas tracking
- Opción de opt-out
- Política de privacidad visible

**Alternativa simple:**
- Usa Plausible o Fathom (no cookies, GDPR-compliant)
- No necesitas banner

---

## 📋 Checklist de Lanzamiento

### 🚨 Fase 1: CRÍTICO (No negociable - Bloquea Deploy)

**1. Accesibilidad mínima:**
- [ ] Alt textos descriptivos en imágenes
- [ ] Contraste de color 4.5:1 (texto normal)
- [ ] Navegación por teclado funciona
- [ ] axe DevTools: 0 errores críticos

**2. HTML semántico correcto:**
- [ ] header, main, footer, nav
- [ ] H1-H6 jerárquicamente correctos
- [ ] Formularios con label asociados

**3. Meta tags básicos:**
- [ ] title único por página
- [ ] meta description
- [ ] meta viewport

**4. Responsive mobile-first:**
- [ ] Funciona en móvil real (tu teléfono)
- [ ] Touch targets ≥ 44x44px

**5. HTTPS configurado**

**6. Lighthouse Performance > 70:**
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

### 🟡 Fase 2: IMPORTANTE (Antes de lanzamiento público)

**1. SEO optimizado:**
- [ ] Sitemap XML (si >10 páginas)
- [ ] Robots.txt
- [ ] JSON-LD (WebPage o schema específico)
- [ ] Open Graph images

**2. Performance avanzada:**
- [ ] Lazy loading imágenes
- [ ] Imágenes optimizadas (WebP/AVIF)
- [ ] Lighthouse Performance > 90

**3. Analytics básico implementado**

**4. Pruebas cross-browser:**
- [ ] Chrome, Firefox, Safari
- [ ] 2 dispositivos móviles reales

**5. Seguridad básica:**
- [ ] Headers de seguridad
- [ ] Validación server-side en formularios
- [ ] Rate limiting si aplica

### 🟢 Fase 3: MEJORAS (Post-lanzamiento - Solo si proyecto justifica)

**1. Performance extrema:**
- [ ] Service Workers / PWA
- [ ] Advanced caching strategies
- [ ] CDN para assets

**2. Monitoreo avanzado:**
- [ ] Sentry / LogRocket
- [ ] Real User Monitoring (RUM)

**3. Testing automatizado:**
- [ ] E2E tests (Playwright/Cypress)
- [ ] Visual regression tests

**4. Optimizaciones avanzadas:**
- [ ] A/B testing
- [ ] Personalización por usuario
- [ ] Edge computing

---

## 🔄 Evolución del Proyecto

### Re-evaluación Continua

**Tu proyecto NO es estático. Re-evalúa cada 3-6 meses.**

### 🚦 Señales de que tu Tipo A → Tipo B

**Indicadores:**
- [ ] Pasaste de 5 a 10+ páginas
- [ ] Traffic creció >1,000 visitas/mes
- [ ] Agregaste blog o sección de noticias
- [ ] Clientes piden features nuevas constantemente
- [ ] Pasas >2 horas/semana actualizando contenido

**Acción:**
1. Migra de hosting gratis a pago ($5/mes)
2. Implementa sitemap XML
3. Considera CMS (WordPress, Strapi, Sanity)
4. Agrega analytics más robusto
5. Implementa proceso de deploy automatizado

### 🚦 Señales de que tu Tipo B → Tipo C

**Indicadores:**
- [ ] Traffic >50,000 visitas/mes
- [ ] Necesitas login/autenticación de usuarios
- [ ] Datos dinámicos por usuario
- [ ] Múltiples roles (admin, editor, usuario)
- [ ] Features complejas (carrito, dashboard, reportes)

**Acción:**
1. Migra a framework (Next.js, Nuxt, SvelteKit)
2. Implementa base de datos real (no solo archivos)
3. Backend API robusto
4. CDN para assets estáticos
5. Monitoreo y logging (Sentry, LogRocket)
6. Tests automatizados (E2E + Unit)
7. Staging environment separado

### ⚠️ Red Flags de "Sobre-ingeniería Prematura"

**❌ NO escales antes de tiempo si:**
- Implementaste microservicios para 100 usuarios
- Agregaste Kubernetes para un blog
- Usas GraphQL cuando REST basta
- Tienes 5 ambientes de deploy para proyecto personal
- Pasas más tiempo en DevOps que en features

**Regla:** "Escala cuando duela, no antes"

### ✅ Checklist de Re-evaluación Trimestral

**Cada 3 meses, pregúntate:**

**1. ¿Mi stack actual me frena o me ayuda?**
- Frena: Deploy toma >30 min, bugs frecuentes
- Ayuda: Desarrollo fluido, pocos problemas

**2. ¿Mis métricas justifican complejidad adicional?**
- Traffic, conversiones, tiempo de carga
- Usa herramientas: Google Analytics, PageSpeed

**3. ¿Estoy pagando por servicios que no uso?**
- Revisa facturas de hosting, CDN, SaaS
- Cancela lo que no aporta valor medible

**4. ¿Mi código sigue las reglas de este documento?**
- Si no: Refactoriza o documenta por qué no
- Consistencia > perfección

**5. ¿Aparecieron nuevas herramientas mejores?**
- Lee release notes de tus frameworks
- Evalúa migración solo si ROI claro

---

## 🔧 Checklist de Mantenimiento

### Semanal
- [ ] Revisar consola del navegador (errores JS/CSS)
- [ ] Verificar enlaces rotos (404s)
- [ ] Comprobar formularios funcionan

### Mensual

**Auditar tamaño de archivos:**
- [ ] HTML: Idealmente < 100KB sin comprimir
- [ ] CSS: Cada archivo < 50KB
- [ ] JS: Cada módulo < 30KB

**PageSpeed Insights:**
- [ ] Score > 90 en mobile y desktop
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s

**Lighthouse Audit:**
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 95
- [ ] SEO > 95

**CSS Audit:**
- [ ] Buscar CSS inline en HTML
- [ ] Buscar selectores complejos (más de 3 niveles)
- [ ] Eliminar CSS no usado con DevTools Coverage

**JavaScript Audit:**
- [ ] Buscar JS inline en HTML
- [ ] Verificar módulos > 200 líneas (candidatos a división)
- [ ] Comprobar librerías desactualizadas

### Trimestral
- [ ] Actualizar dependencias (npm, CDNs)
- [ ] Re-optimizar imágenes (nuevos formatos)
- [ ] Revisar compatibilidad con navegadores nuevos
- [ ] Backup completo del código

---

## 🚨 Red Flags: Qué Evitar

### Señales de Código Desorganizado

**1. HTML > 500 líneas**
- Indica CSS/JS inline o falta de modularización

**2. Múltiples tags style en HTML**
- Todo CSS debe estar en archivos externos

**3. onclick, onload, etc. en HTML**
- Usar event listeners en JavaScript

**4. Archivos CSS > 2000 líneas**
- Dividir por responsabilidad (componentes, secciones)

**5. JavaScript en tags script inline**
- Excepto: inicialización crítica < 5 líneas

**6. Selectores CSS con !important**
- Indica problemas de especificidad

**7. Colores/valores hardcodeados repetidos**
- Usar variables CSS (custom properties)

**8. IDs usados para styling**
- IDs son para JavaScript, clases para CSS

**9. Nombres genéricos: div1, section2, style1**
- Usar nombres descriptivos: .hero-section, .cta-button

**10. Código comentado "por las dudas"**
- Usar control de versiones (Git), eliminar código muerto

---

## 🤖 Instrucciones para IDE Agente

### Cuando Recibas un Proyecto:

**1. Clasifica: ¿Tipo A, B o C?**

**2. Consulta sección correspondiente**

**3. Aplica solo reglas "✅ SIEMPRE"**

**4. Evalúa "🟡 CONDICIONAL" caso por caso**

**5. Ignora "❌ NUNCA"**

**6. Antes de sugerir librería/framework:**
- Ejecuta "Proceso de 3 Pasos"

**7. Prioriza: Fase 1 → Fase 2 → Fase 3**

**8. Si dudas → Elige opción más simple**

### Red Flags Automáticos (Rechaza Propuesta):

- ❌ React para landing page estática
- ❌ Microservicios para <1000 usuarios
- ❌ GraphQL sin justificación clara
- ❌ Más de 3 librerías para misma funcionalidad
- ❌ Cualquier cosa que agregue >20% complejidad para <10% beneficio

### Al Generar Código:

**Separación estricta:**
- HTML limpio, semántico, sin inline styles/scripts
- CSS en archivos externos, modularizado
- JavaScript en archivos externos, modularizado

**Accesibilidad no negociable:**
- Alt textos descriptivos (nunca genéricos)
- HTML semántico correcto
- Navegación por teclado funcional
- Contraste de color verificado

**Mobile-first siempre:**
- Estilos base = móvil
- Media queries con min-width
- Touch targets ≥ 44px

**Variables CSS:**
- Centralizar colores, espaciado, tipografía
- Nunca valores hardcodeados repetidos

**Modularidad:**
- Archivos pequeños, responsabilidad única
- Reutilización sobre duplicación
- Nombres descriptivos

---

## 📚 Recursos de Referencia Rápida

**Performance:**
- web.dev/vitals
- pagespeed.web.dev
- webpagetest.org

**SEO:**
- developers.google.com/search/docs
- schema.org

**Accesibilidad:**
- a11yproject.com
- webaim.org (Contrast Checker)
- axe DevTools (extensión navegador)
- WAVE (extensión navegador)

**Compatibilidad:**
- caniuse.com

**Testing:**
- BrowserStack (trial gratuito)
- LambdaTest (100 min/mes gratis)

**Herramientas:**
- Lighthouse (auditoría completa)
- axe DevTools (accesibilidad)
- WebAIM Contrast Checker
- Squoosh.app (optimización imágenes)
- TinyPNG (compresión imágenes)

---

## 🎬 Conclusión

### Tu Checklist Mental

**Antes de agregar CUALQUIER técnica/librería/optimización:**

```
1. ¿Agrega valor real al usuario?
2. ¿Es la solución más simple posible?
3. ¿Puedo medirlo/testearlo?
4. ¿Lo entenderé en 6 meses?
5. ¿Pasaré menos de 2 horas implementándolo?

Si 3+ respuestas son NO → No lo hagas.
```

### Recuerda:

**🧭 La mejor optimización es la que no necesitas hacer.**

**🚀 La mejor arquitectura es la que puedes explicar en 5 minutos.**

**📦 El mejor código es el que no escribiste.**

**♿ La accesibilidad no es opcional.**

**📱 Mobile-first no es una sugerencia.**

**🎯 Simplicidad > Complejidad**

---

**Versión:** 1.0 Consolidada
**Última actualización:** Noviembre 2025