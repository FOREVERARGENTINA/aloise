# Changelog

## 2026-07-16

### Security: hardening pragmático del sitio estático

Se revisó `SECURITY_AGENT.md` contra la arquitectura real del repo para
evitar sobreingeniería: el proyecto es un sitio estático en Firebase
Hosting, sin backend propio, auth, sesiones, SQL ni endpoints privados.

- `js/modules/property-renderer.js`: se agregaron helpers de escape HTML,
  validación de URLs, tokens de clase y callbacks para reducir XSS al
  renderizar datos externos de Xintel.
- `ficha.html`: se endureció el render de detalle de propiedad
  (título, estado, ubicación, descripción, galería, miniaturas, popup del
  mapa y mensajes de error) para no insertar datos externos sin codificar.
- `firebase.json`: se agregaron headers de seguridad compatibles con el
  sitio actual (`Content-Security-Policy`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, HSTS) y se
  excluyeron del deploy archivos auxiliares/sensibles de trabajo
  (`docs`, `scripts`, configs internas de `DATOS`, PDFs, TXT e INI).
- `firebase.json`: `/js/config.js` queda con `no-store` para evitar cache
  agresiva de configuración operativa.
- `.gitignore`: se ampliaron patrones para `.env.*`, credenciales locales,
  service accounts y claves privadas comunes.
- `.github/workflows/codeql.yml` y `.github/dependabot.yml`: se agregaron
  CodeQL y Dependabot para GitHub Actions.
- `SECURITY.md`: se documentó el modelo de riesgo real, controles
  aplicados, pendientes del propietario y puntos que no aplican por no
  existir backend en este repo.

**Pendiente importante:** `CONFIG.xintel.apiKey` está publicado en el
frontend. En un sitio estático no se puede ocultar; debe tratarse como
público, restringirse/rotarse en el proveedor o moverse a un backend/proxy
si otorga permisos sensibles.

## 2026-07-04

### Fix: navbar no quedaba sticky al hacer scroll

El `<header>` tiene `position: sticky`, pero `components.js` lo inyectaba
con `innerHTML` dentro de `<div id="navbar">`, y ese wrapper terminaba
con la misma altura que el header — un elemento sticky necesita que su
contenedor sea más alto que él para tener recorrido donde pegarse.

- `js/components.js`: el navbar ahora se inyecta con `outerHTML` (elimina
  el wrapper limitante). El footer conserva `innerHTML` porque su wrapper
  `#footer` es el host del CSS de `footer-reveal`.

### Fix: el navbar nunca se achicaba al hacer scroll

`initHeaderScroll()` en `js/main.js` buscaba `.header` una sola vez al
cargar la página, antes de que el navbar existiera (se inyecta de forma
asíncrona). El listener de scroll nunca llegaba a registrarse.

- `js/main.js`: `updateHeader()` ahora busca `.header` en cada scroll en
  vez de cachearlo una vez.
- `css/sections/navigation.css`: agregada transición suave (300ms) del
  alto del navbar y del logo cuando se agrega la clase `.scrolled`
  (90px → 64px de alto, logo 48-56px → 36-42px).
- `index.html` + todas las páginas (`ficha`, `propiedades`,
  `quienes-somos`, `servicios`, `vende-con-nosotros`,
  `politica-privacidad`, `terminos-y-condiciones`, `contacto`):
  cache-busting `?v=20260704c` en `/js/main.js` para que navegadores con
  el JS viejo cacheado reciban el fix. `contacto.html` no cargaba
  `main.js` en absoluto — se agregó.

### Fix: logo del navbar se veía pixelado

`css/sections/navigation.css` forzaba `image-rendering: crisp-edges` /
`-webkit-optimize-contrast` en `.header__logo-image`, lo que desactiva
el antialiasing al escalar — muy notorio en pantallas retina/HiDPI.

- Se sacaron esas dos propiedades (y `-webkit-font-smoothing`, que no
  aplica a imágenes). El navegador vuelve a usar su escalado normal con
  suavizado.

### Feat: formulario de contacto envía por EmailJS en vez de `mailto:`

`js/contact.js` armaba un link `mailto:` y redirigía el navegador ahí —
dependía de que el visitante tuviera un cliente de correo de escritorio
configurado (Outlook, Mail). En celular, con Gmail/Outlook web, el botón
"Enviar mensaje" no hacía nada visible.

- `js/config.js`: nuevo bloque `CONFIG.contactForm` con
  `templateId: 'template_t7uoflo'`, reutilizando el `serviceId` y
  `publicKey` de EmailJS que ya usaba `CONFIG.alerts` (alertas de fallo
  de Xintel).
- `js/contact.js`: reescrito para usar `emailjs.send()`. Maneja estados
  de enviando/éxito/error, deshabilita el botón mientras envía y
  resetea el formulario al terminar. Si EmailJS no está disponible,
  muestra el email de contacto como fallback.
- `contacto.html`: se agregó el SDK de EmailJS y `config.js` (no se
  cargaban ahí antes). Se sacó el texto "se abrirá tu cliente de
  correo".
- `css/global.css`: agregada la clase `.text-success` para el mensaje
  de confirmación de envío.

**Importante — cuenta de EmailJS:** el `service_xzwb6d2` / `publicKey`
usados están dados de alta con la cuenta de **`frandoweb@gmail.com`**
(la misma que ya se usaba para las alertas de Xintel), no con una
cuenta de Gabriela Aloise Propiedades. El plan gratuito de EmailJS
permite 200 mails/mes combinando todos los templates de esa cuenta
(alertas de Xintel + formulario de contacto).

**Pendiente:** confirmar que el mail de prueba enviado durante esta
sesión llegó correctamente a `aloisepropiedades@gmail.com`.

### Sin cambios en Firestore

Estos cambios no tocan Firestore — `firebase.json` de este proyecto
sólo tiene la sección `hosting` (no hay `firestore.rules` ni
`firestore.indexes.json` en el repo). El deploy correspondiente es:

```
firebase deploy --only hosting
```
