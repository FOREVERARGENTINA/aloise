# Seguridad

Ultima revision local: 2026-07-16.

Este repositorio es un sitio estatico publicado en Firebase Hosting. No tiene backend propio, sesiones, base de datos SQL ni endpoints privados dentro del repo.

## Registro 2026-07-16

- Se aplico hardening pragmatico segun `SECURITY_AGENT.md`, ajustado al alcance real del repo para evitar sobreingenieria.
- Se endurecio el render de datos externos de Xintel contra XSS en `js/modules/property-renderer.js` y `ficha.html`.
- Se agregaron headers de seguridad en `firebase.json`, incluyendo CSP compatible con los scripts inline y CDNs que el sitio ya usa.
- Se redujo la superficie publicada por Firebase Hosting excluyendo archivos auxiliares, docs internas, scripts, PDFs, TXT e INI de trabajo.
- Se amplio `.gitignore` para bloquear credenciales locales y archivos `.env.*`.
- Se agregaron CodeQL y Dependabot para GitHub Actions.
- No se agrego rate limiting server-side, CSRF, middleware de auth ni validadores de backend porque este repo no tiene servidor propio.

## Modelo de riesgo real

- La API de Xintel se consume desde el navegador. Cualquier clave incluida en `js/config.js` debe considerarse publica.
- Las claves web de Firebase no son secretos por si solas, pero deben estar restringidas por dominio y acompanadas por reglas estrictas de Firestore/Storage.
- EmailJS usa clave publica del navegador; debe limitarse por dominio, plantilla y destinatarios permitidos desde el panel de EmailJS.
- Los datos de Xintel son entrada externa. Antes de renderizarse en HTML se deben codificar por contexto.

## Controles aplicados

- Headers de seguridad en `firebase.json`: CSP compatible con el sitio actual, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, framing por mismo origen y HSTS.
- Exclusiones de hosting para archivos de trabajo: `docs`, `scripts`, configuracion interna bajo `DATOS/config`, PDFs, TXT e INI en `DATOS`.
- `js/config.js` queda sin cache agresiva para que cambios de configuracion se propaguen rapido.
- Renderizado de propiedades endurecido contra XSS en tarjetas y detalle de ficha.
- `.gitignore` bloquea `.env.*`, credenciales locales, service accounts y claves privadas comunes.
- CodeQL y Dependabot quedan preparados para GitHub.

## Pendientes del propietario

- Rotar o restringir la clave de Xintel expuesta actualmente en frontend. La solucion robusta es mover esa llamada a un backend/proxy con rate limiting.
- Restringir Firebase API key por dominio en Google Cloud Console.
- Revisar reglas de Firestore y Storage en Firebase Console: denegacion por defecto, escritura publica solo donde sea indispensable.
- Restringir EmailJS por dominio y revisar que las plantillas no permitan destinatarios arbitrarios.
- Activar en GitHub: secret scanning, push protection, Dependabot alerts, CodeQL/code scanning.

## No aplica actualmente

- SQL/NoSQL injection en backend propio.
- CSRF de sesiones propias.
- Autenticacion, autorizacion y MFA de usuarios del sitio.
- Rate limiting server-side local, porque no hay servidor en este repo.

Si se agrega backend, formularios server-side, panel admin o subida de archivos, este documento debe actualizarse antes de publicar.
