# 📋 Instrucciones para Agente - Setup Inicial del Proyecto

## 🎯 Tu tarea

Configurar este proyecto para trabajar con las guías y reglas establecidas.

---

## 📚 Paso 1: Leer documentación

Antes de hacer nada, leer estos 2 archivos:

1. **`AGENTS.md`** - Decisiones específicas de este proyecto (completar progresivamente)
2. **`guia.md`** - Principios generales de desarrollo web 2026

**Jerarquía:** AGENTS.md > guia.md > Tu conocimiento base

---

## 📁 Paso 2: Crear estructura de archivos

Crear la siguiente estructura en el proyecto:

```
proyecto/
├── .claude.md             ← CREAR ESTE (tú lo creas)
├── docs/
│   ├── AGENTS.md          ← Ya está aquí (copiado manualmente)
│   └── guia.md            ← Ya está aquí (copiado manualmente)
├── .github/
│   └── copilot-instructions.md  ← CREAR ESTE (tú lo creas)
└── src/
```

**Tu tarea:**

1. Verificar que existen `docs/AGENTS.md` y `docs/guia.md`

2. Crear archivo `.claude.md` en la raíz con este contenido:

```markdown
# Claude Code - Configuración del Proyecto

Lee `docs/AGENTS.md` para decisiones de este proyecto.
Lee `docs/guia.md` para principios generales.

**Jerarquía:** AGENTS.md > guia.md

## Reglas:
- Mobile-first siempre
- Accesibilidad obligatoria
- INP < 200ms
- Validación isomórfica con Zod
- Self-hosted fonts (NO Google Fonts CDN)
- CSS moderno nativo (nesting, :has(), container queries)

**Zonas Rojas:** Frenar antes de modificar DB, auth, instalar dependencias.

Consultar docs/AGENTS.md para stack específico.
Consultar docs/guia.md para ejemplos de código.
```

3. Crear carpeta `.github/` si no existe

4. Crear archivo `.github/copilot-instructions.md` con este contenido:

```markdown
# GitHub Copilot Instructions

Lee `docs/AGENTS.md` para decisiones específicas de este proyecto.
Lee `docs/guia.md` para principios generales de desarrollo web.

**Jerarquía:** AGENTS.md > guia.md > Sugerencias por defecto

## Reglas principales:

- Siempre mobile-first
- Accesibilidad obligatoria (alt descriptivos, contraste 4.5:1)
- Validación isomórfica con Zod (cliente + servidor)
- Self-hosted fonts (NO Google Fonts CDN)
- CSS moderno nativo (nesting, container queries, :has())
- INP < 200ms (event delegation, debouncing)

Consultar docs/AGENTS.md para stack específico del proyecto.
Consultar docs/guia.md para ejemplos de código y mejores prácticas.
```

---

## ⚙️ Paso 3: Completar AGENTS.md

Abrir `docs/AGENTS.md` y completar la sección **Stack Técnico** preguntándome:

1. **Tipo de proyecto:** ¿Es Tipo A, B o C? (ver `guia.md` para clasificación)
2. **Frontend:** ¿Next.js App Router, Astro, HTML+Tailwind, otro?
3. **Estilos:** ¿Tailwind, CSS Modules, CSS nativo?
4. **Database:** ¿Supabase, PlanetScale, PostgreSQL, ninguna?
5. **Auth:** ¿NextAuth, Supabase Auth, Clerk, ninguno?
6. **Hosting:** ¿Vercel, Netlify, Cloudflare Pages?

Actualizar la tabla en AGENTS.md con las respuestas.

---

## 🚦 Paso 4: Definir Zonas Rojas

Preguntarme si hay **restricciones específicas** del proyecto:

- ¿Hay datos sensibles que no puedo tocar?
- ¿Hay dependencias prohibidas?
- ¿Hay partes del código que no debo modificar?

Documentar en `docs/AGENTS.md` sección **Zonas Rojas**.

---

## 🔧 Paso 5: Copiar scripts de encoding

Copiar la carpeta `scripts/` a la raíz del proyecto:

```
proyecto/
├── scripts/
│   ├── check-encoding.js    ← Detecta mojibakes
│   ├── fix-encoding.js      ← Corrige mojibakes
│   └── README.md            ← Documentación
└── package.json
```

Si el proyecto tiene `package.json`, agregar estos comandos:

```json
{
  "scripts": {
    "check:encoding": "node scripts/check-encoding.js",
    "fix:encoding": "node scripts/fix-encoding.js",
    "fix:encoding:apply": "node scripts/fix-encoding.js --apply",
    "prebuild": "node scripts/check-encoding.js"
  }
}
```

**Importante:** Si el proyecto usa ESM (import/export), asegurarse que `package.json` tenga:
```json
{
  "type": "module"
}
```

---

## 📝 Paso 6: Confirmar setup

Mostrarme un resumen:

```
✅ Setup completo:

📁 Archivos copiados:
   - docs/AGENTS.md
   - docs/guia.md
   - .github/copilot-instructions.md
   - scripts/ (check-encoding.js, fix-encoding.js, README.md)

📦 Scripts npm agregados:
   - npm run check:encoding
   - npm run fix:encoding
   - npm run fix:encoding:apply
   - prebuild hook configurado

⚙️ Stack definido:
   - Tipo: [A/B/C]
   - Frontend: [tecnología]
   - Estilos: [tecnología]
   - DB: [tecnología]
   - Hosting: [plataforma]

🛑 Zonas Rojas:
   - [Lista de restricciones]

📚 Listo para trabajar siguiendo:
   1. AGENTS.md (decisiones de este proyecto)
   2. guia.md (principios generales)
```

---

## ✅ Comportamiento de ahora en adelante

Una vez completado el setup:

### Siempre aplicar (de guia.md):
- Mobile-first
- Accesibilidad (alt descriptivos, contraste 4.5:1)
- INP < 200ms (event delegation, debouncing)
- Validación isomórfica con Zod
- Self-hosted fonts (NO Google Fonts CDN)
- CSS moderno nativo (nesting, container queries, :has())
- **UTF-8 correcto** - Ejecutar `npm run check:encoding` antes de commits

### Siempre preguntar antes de:
- Instalar dependencias nuevas
- Modificar configuración crítica
- Cambiar estructura de datos
- Tocar archivos marcados como Zona Roja

### Validar antes de build/deploy:
```bash
npm run check:encoding  # Detecta mojibakes
npm run build          # El prebuild hook valida automáticamente
```

Si encuentra mojibakes:
```bash
npm run fix:encoding          # Preview correcciones
npm run fix:encoding:apply    # Aplicar correcciones
git diff                      # Revisar cambios
```

### Nunca hacer:
- Ejecutar deploys
- Tocar datos de producción
- Loguear datos sensibles

---

## 🔄 Actualización continua

A medida que el proyecto avanza:

- **Decisiones arquitectónicas nuevas** → Actualizar AGENTS.md
- **Secciones ⏳ PENDIENTE completadas** → Marcar como ✅
- **Riesgos encontrados** → Agregar como Zona Roja
- **Conflictos resueltos** → Documentar en "Ejemplos de aplicación"

---

## 📞 Si algo no está claro

Si `AGENTS.md` tiene sección marcada **⏳ PENDIENTE** que afecta tu tarea actual:

1. **Detener**
2. **Explicar qué información falta**
3. **Preguntar antes de continuar**

**NO completar vacíos críticos por inferencia.**

---

**Versión:** 1.0  
**Fecha:** Febrero 2026