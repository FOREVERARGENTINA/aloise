# 🧠 Guía para Agentes de IA — Gabriela Aloise Propiedades

**Naturaleza:** Reglas de decisión para asistente técnico  
**Principio:** Delimitar, no confiar en criterio  
**Estado:** 🚧 En construcción iterativa

---

## 📚 Jerarquía de Documentación

**Orden de lectura obligatorio:**

1. **Este archivo (AGENTS.md)** → Decisiones específicas de ESTE proyecto
2. **guia.md** → Principios generales de desarrollo web
3. **Conocimiento base del agente** → Solo si los anteriores no cubren el tema

**Regla de conflicto:**
```
Si AGENTS.md dice algo diferente a guia.md
→ AGENTS.md tiene prioridad (decisión de proyecto)

Si AGENTS.md no menciona algo
→ Seguir guia.md

Si ninguno menciona algo
→ Elegir opción más simple y preguntar
```

---

## 🚦 Defaults Mínimos (Aplican si algo no está definido)

Hasta que este documento se complete explícitamente, el agente debe asumir:

- **Seguridad > todo**
- **No tocar producción**
- **No ejecutar deploys**
- **No modificar datos persistentes**
- **Ante cualquier duda → preguntar**
- **Seguir guia.md para temas no especificados aquí**

Estos defaults no se anulan salvo que una sección posterior lo indique explícitamente.

---

## ⚖️ Jerarquía de Resolución de Conflictos

Cuando hay conflicto entre principios, el orden es:

**[PRIORIDAD 1] Seguridad y Cumplimiento Legal**
- Seguridad de usuarios
- GDPR / Privacidad
- Validación server-side
- Sanitización de inputs

**[PRIORIDAD 2] Reglas de Negocio**
- ⏳ PENDIENTE: Completar con reglas específicas del proyecto
- Ejemplo: "Los usuarios free solo pueden crear 3 proyectos"

**[PRIORIDAD 3] Arquitectura del Proyecto**
- ⏳ PENDIENTE: Completar cuando se defina stack
- Ejemplo: "Siempre usar App Router, nunca Pages Router"

**[PRIORIDAD 4] Performance y Costo**
- INP < 200ms (guia.md)
- LCP < 2.5s (guia.md)
- Costo operativo razonable

**[PRIORIDAD 5] Simplicidad**
- Si hay 2 formas de hacer algo, elegir la más simple
- "La complejidad es el enemigo del lanzamiento" (guia.md)

### Ejemplos de aplicación
⏳ PENDIENTE: Agregar ejemplos reales cuando aparezcan conflictos

**Conflicto:** [Describir caso]  
**Resolución:** [Qué principio gana según jerarquía]

---

## 🛑 Zonas Rojas (Frenado Automático)

El agente SIEMPRE frena y consulta en estos casos.

### 1. [ZONA ROJA 1 – Migración de datos]

❌ **Prohibido sin aprobación:**
- Modificar datos existentes
- Cambiar estructuras persistentes (schemas, tablas)
- Eliminar o renombrar campos
- Cualquier ALTER TABLE en producción

✅ **Debe hacer:**
1. Detener
2. Documentar el cambio propuesto (antes/después)
3. Explicar impacto en datos existentes
4. Solicitar aprobación explícita
5. Generar script de rollback

### 2. [ZONA ROJA 2 – Datos sensibles]

❌ **Prohibido:**
-   Loguear passwords, tokens, API keys
-   Exponer datos personales (emails, teléfonos, direcciones)
-   Incluir datos reales en ejemplos de código
-   Commitear archivos .env con secretos (usar js/config.js para keys públicas de cliente)

✅ **Debe hacer:**
1.  Usar sanitización (ver guia.md sección Seguridad)
2.  Aplicar principio de mínimo acceso
3.  Variables de entorno para secretos
4.  DOMPurify para contenido generado por usuario

### 3. [ZONA ROJA 3 – Integración Xintel]

❌ **Prohibido sin aprobación:**
-   Modificar lógica de `xintel-api.js` o `property-service.js`
-   Cambiar el mapeo de campos de la API
-   Sobrescribir `js/config.js` sin preservar las API keys existentes

### 4. [ZONA ROJA 4 – Permisos / Auth]

⏳ PENDIENTE: Completar cuando se defina modelo de usuarios

**Prohibido asumir:**
- Qué roles existen
- Qué permisos tiene cada rol
- Lógica de autorización

**Antes de tocar auth:**
- Documentar qué roles se ven afectados
- Explicar cambio en permisos
- Solicitar aprobación

### 5. [ZONA ROJA 5 – Legal / Compliance]

❌ **Prohibido opinar sobre:**
- Temas legales (contratos, términos de servicio)
- Retención de datos (cuánto tiempo guardar)
- Cumplimiento normativo (GDPR, CCPA, etc.)
- Responsabilidad legal

✅ **Debe hacer:**
1. Detener inmediatamente
2. Flaggear como "requiere asesoría legal"
3. No sugerir workarounds
4. Seguir guia.md para aspectos técnicos (ej: self-hosted fonts para GDPR)

---

## ⚠️ Regla de Incompletitud Crítica

Si una sección marcada con ⏳ afecta directamente una decisión actual, el agente debe:

1. **Detener la acción**
2. **Explicitar qué información falta**
3. **Solicitar definición antes de continuar**

**El agente no debe completar vacíos críticos por inferencia.**

Ejemplo:
```
Usuario: "Agrega un botón para que los admins puedan borrar usuarios"
Agente: "⚠️ La sección 'Permisos / Auth' está incompleta. 
Necesito saber:
- ¿Qué es un 'admin' en este sistema?
- ¿Borrado lógico o físico?
- ¿Qué pasa con los datos del usuario borrado?
Detuve la acción hasta recibir clarificación."
```

---

## 🎯 Rol y Límites del Agente

### ✅ Puede hacer (sin confirmar)

- Generar código siguiendo patrones existentes
- Explicar el sistema
- Debuggear errores
- Proponer refactors
- Sugerir tests
- Aplicar principios de guia.md (accesibilidad, mobile-first, INP)
- Seguir convenciones de código establecidas

### ⚠️ Requiere confirmación

- Cambiar configuraciones críticas (next.config.js, package.json)
- Crear entidades centrales del dominio
- Instalar dependencias nuevas
- Modificar permisos o roles
- Cualquier acción en Zonas Rojas
- Cambiar stack tecnológico definido

### ❌ Prohibido (nunca automático)

- Ejecutar deploys
- Tocar datos de producción
- Eliminar datos persistentes
- Ejecutar migraciones en DB productiva
- Cambiar secrets o API keys
- Modificar configuración de DNS, hosting, dominios

---

## 📦 Stack Técnico

⏳ **Completar progresivamente a medida que se define el proyecto**

### Stack Actual

| Capa | Tecnología | Estado | Notas |
|------|------------|--------|-------|
| **Tipo de Proyecto** | Tipo C (App Web) | ✅ | Integración API dinámica |
| **Frontend** | HTML5 + JS Vanilla | ✅ | Arquitectura modular |
| **Estilos** | CSS Moderno Nativo | ✅ | Design System con Variables |
| **Backend/API** | Xintel API | ✅ | Plataforma inmobiliaria |
| **Database** | Firebase Firestore | ✅ | Datos complementarios |
| **Auth** | Firebase Auth | ⏳ | Previsto, no activo |
| **Validación** | HTML5 + JS nativo | ⚠️ | Zod pendiente de implementación |
| **Hosting** | Firebase Hosting | ✅ | Dominio aloisepropiedades.com.ar |
| **Analytics** | Firebase Analytics | ✅ | Google Analytics G-1X8T159RTT |

### Dependencias Prohibidas

❌ **No instalar sin aprobación explícita:**
- jQuery (usar nativo)
- Moment.js (usar date-fns o Intl)
- Frameworks pesados (React/Vue) sin migración planificada
- Librerías de animaciones JS (usar CSS Scroll-driven)

### Dependencias Aprobadas

✅ **Puede instalar sin consultar:**
- ⏳ PENDIENTE: Completar con lista blanca
- Ejemplo: zod, clsx, date-fns

---

## 🔒 Seguridad y Privacidad

**Aplicar siempre (según guia.md):**

### ❌ NO loguear NUNCA

- Passwords (ni hasheados)
- Tokens de autenticación
- API keys
- Datos personales (emails, teléfonos, direcciones)
- Datos financieros (tarjetas, cuentas)

### ❌ NO agregar al repositorio

- Archivos `.env` con valores reales
- API keys hardcodeadas
- Secrets de producción
- Datos de usuarios reales (usar fixtures/mocks)

### ✅ SIEMPRE hacer

- Validación isomórfica con Zod (cliente + servidor)
- Sanitización de inputs (DOMPurify para HTML)
- Headers de seguridad configurados (CSP, X-Frame-Options)
- HTTPS forzado en producción
- Rate limiting en formularios públicos
- Self-hosted fonts (no Google Fonts CDN)

---

## 🗂️ Estructura del Proyecto

⏳ **Completar cuando se estabilice la arquitectura**

```
```
root/
├── index.html
├── propiedades.html
├── ficha.html             # Detalle de propiedad
├── js/
│   ├── config.js          # Configuración central
│   ├── main.js            # Lógica global
│   └── modules/           # Módulos Xintel
├── css/
│   ├── design-system.css  # Variables
│   └── components.css     # UI reusable
├── DATOS/                 # Assets crudos y guías
└── docs/                  # Documentación agentes
```

### Convenciones de Naming

- Archivos: kebab-case
- Componentes/Clases: PascalCase
- Utilities/Variables: camelCase
- Constantes: UPPER_SNAKE_CASE


---

## 👥 Roles y Permisos

⏳ **Completar cuando exista modelo de usuarios**

### Roles del Sistema

| Rol | Descripción | Permisos Clave |
|-----|-------------|----------------|
| ⏳ | ⏳ | ⏳ |

### Matriz de Permisos

| Acción | Rol 1 | Rol 2 | Rol 3 |
|--------|-------|-------|-------|
| ⏳ | ⏳ | ⏳ | ⏳ |

---

## 🗄️ Modelo de Datos

⏳ **Completar cuando se defina el schema**

### Entidades Principales

**[Entidad 1]**
- Propósito: ⏳
- Relaciones: ⏳
- Campos críticos: ⏳

**[Entidad 2]**
- Propósito: ⏳
- Relaciones: ⏳
- Campos críticos: ⏳

---

## 🚀 Comandos Críticos

**El agente prepara, el humano ejecuta**

⏳ **Completar con comandos específicos del proyecto**

### Desarrollo
```bash
⏳ npm run dev          # Servidor local
⏳ npm run build        # Build producción
⏳ npm run test         # Ejecutar tests
```

### Base de Datos
```bash
⏳ npm run db:migrate   # Aplicar migraciones
⏳ npm run db:seed      # Poblar con datos
⏳ npm run db:reset     # PELIGRO: Resetear DB
```

### Deploy
```bash
⏳ # El agente NO ejecuta deploys
⏳ # Solo genera comandos para revisión manual
```

---

## 🎯 Contexto de Dominio

⏳ **Completar con conceptos clave del negocio**

### Glosario

**[Término 1]:** ⏳ Definición específica del proyecto  
**[Término 2]:** ⏳ Definición específica del proyecto

### Reglas de Negocio

1. ⏳ PENDIENTE: Documentar reglas críticas
2. ⏳ Ejemplo: "Un usuario free solo puede crear 3 proyectos"
3. ⏳ Ejemplo: "Los posts se publican automáticamente a las 00:00 UTC"

---

## ✅ Checklist Pre-Deploy

**Antes de cualquier deploy a producción:**

### Performance (según guia.md)
- [ ] INP < 200ms en Lighthouse
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Lighthouse Performance > 90

### Seguridad (según guia.md)
- [ ] Validación server-side activa
- [ ] Headers de seguridad configurados
- [ ] No hay secrets en código
- [ ] No hay logs de datos sensibles

### Accesibilidad (según guia.md)
- [ ] Lighthouse Accessibility > 95
- [ ] Navegación por teclado funcional
- [ ] Alt textos descriptivos
- [ ] Contraste mínimo 4.5:1

### Funcional
- [ ] Tests pasando
- [ ] Build exitoso
- [ ] Aprobaciones requeridas obtenidas
- [ ] Documentación actualizada
- [ ] ⏳ PENDIENTE: Agregar checks específicos del proyecto

---

## 📝 Cómo usar este template

### Al iniciar un proyecto

1. **Completar sección Stack Técnico** (Frontend, DB, Auth)
2. **Definir 1-2 Zonas Rojas específicas** del proyecto
3. **Establecer tipo de proyecto** (A/B/C según guia.md)
4. **Documentar convenciones** de naming y estructura

### A medida que el proyecto evoluciona

- **Cada conflicto real** → Se documenta en "Ejemplos de aplicación"
- **Cada riesgo nuevo** → Se vuelve Zona Roja
- **Cada decisión arquitectónica** → Se fija como regla en Stack Técnico
- **Cada entidad nueva** → Se agrega a Modelo de Datos

### Mantenimiento

- **Revisar cada 2 semanas** si hay secciones ⏳ que ya se pueden completar
- **Actualizar cuando cambie el stack** (ej: migrar de Pages a App Router)
- **Documentar excepciones** a guia.md cuando sean necesarias

---

## 🎓 Principios de Documentación

### Este documento NO es

- ❌ Un README
- ❌ Un tutorial
- ❌ Documentación exhaustiva del código
- ❌ Una repetición de guia.md

### Este documento ES

- ✅ Un sistema de control de decisiones del agente
- ✅ Un límite explícito al comportamiento automático
- ✅ Decisiones específicas de ESTE proyecto
- ✅ Excepciones o adiciones a guia.md

### Regla de oro

**Si algo no cambia decisiones del agente, no va acá.**

**Si algo ya está en guia.md, referenciar, no duplicar.**

---

## 🔗 Referencias Externas

- **guia.md** → Principios generales de desarrollo web
- **README.md** → Información para desarrolladores humanos
- **ARCHITECTURE.md** → Decisiones arquitectónicas (si existe)

---

**Última actualización:** 12 de Febrero 2026
**Versión:** v1.0
**Estado:** ✅ Configuración avanzada
**Próxima revisión:** Cada 2 semanas o ante cambios en stack.
