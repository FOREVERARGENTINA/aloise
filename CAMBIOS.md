# Cambios

## 2026-08-14 — `.git` expuesto en producción

**El repositorio `.git` de este sitio estaba publicado en internet.** Cualquiera
podía descargar el código y todo el historial.

Se auditó el historial completo buscando claves de API, tokens y llaves
privadas: **no había ninguna credencial**. Lo expuesto fue código HTML/CSS/JS
—visible desde el navegador de todos modos— y el historial de cambios. Por eso
**no hizo falta rotar nada**.

### Qué se tocó en `firebase.json`

**`"**/.*/**"` agregado al `ignore`.** El patrón `"**/.*"` que ya estaba excluye
*archivos* ocultos, pero **no el contenido de carpetas ocultas**, así que
`.git/objects/ab/cdef` se subía igual. Ese es el único cambio: las cabeceras de
seguridad de este sitio ya estaban bien (tiene incluso CSP completa, es de los
mejor configurados del grupo).

Desplegado y verificado el mismo día.

### Ojo al re-desplegar

Corregir el `firebase.json` **no basta** — hay que desplegar para que tenga
efecto.

### Al verificar, mirar el contenido y no el código HTTP

Este sitio tiene rewrite tipo SPA: cualquier ruta inexistente devuelve
`index.html` con código **200**. Un 200 en `/.git/config` no prueba exposición.
Un `.git/config` real empieza con `[core]` y pesa ~300 bytes.

---

Expediente completo:
`D:\Aideas\FRANDOWEB\BOOSTRAP\docs\incidente-git-expuesto.md`
