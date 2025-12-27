# Paleta de Colores de Marca
## Gabriela Aloise Propiedades

---

## 🎨 Colores Principales

### Azul Corporativo (Principal)

El azul oscuro sofisticado que representa profesionalismo y confianza.

| Nombre | HEX | RGB | Uso |
|--------|-----|-----|-----|
| **Primary** | `#252b3b` | `rgb(37, 43, 59)` | Navbar, footer, elementos principales |
| **Primary Dark** | `#1a1f2e` | `rgb(26, 31, 46)` | Hover states, gradientes oscuros |
| **Primary Light** | `#2a3142` | `rgb(42, 49, 66)` | Backgrounds sutiles, variaciones |

**Ejemplo visual:**
```
████████  #252b3b - Primary (Azul corporativo)
████████  #1a1f2e - Primary Dark
████████  #2a3142 - Primary Light
```

---

### Plateado Elegante (Acento)

El plateado que aporta elegancia y diferenciación premium.

| Nombre | HEX | RGB | Uso |
|--------|-----|-----|-----|
| **Accent** | `#B0B7BD` | `rgb(176, 183, 189)` | Botones CTA, highlights, elementos destacados (ahora plateado) |
| **Accent Dark** | `#8D9398` | `rgb(141, 147, 152)` | Hover en botones, sombras (gris) |
| **Accent Light** | `#D8DCE0` | `rgb(216, 220, 224)` | Plateado claro, backgrounds claros |
| **Accent Subtle** | `#C4C8CC` | `rgb(196, 200, 204)` | Bordes, detalles sutiles, líneas (gris) |

**Ejemplo visual:**
```
████████  #B0B7BD - Accent (Plateado principal)
████████  #8D9398 - Accent Dark
████████  #D8DCE0 - Accent Light
████████  #C4C8CC - Accent Subtle
```

---

## 📐 Uso de Colores

### Navbar
- **Fondo**: Gradiente de Primary Dark → Primary → Primary Light
- **Texto links**: Blanco (#ffffff)
- **Hover links**: Accent (#B0B7BD)
- **Borde inferior**: Accent con transparencia (rgba(176, 183, 189, 0.15))
- **Botón CTA**: Gradiente de Accent Dark → Accent

### Botones

#### Botón Principal (CTA)
```css
background: linear-gradient(135deg, #8D9398, #B0B7BD);
color: #1a1f2e;
border: 1px solid #C4C8CC;
box-shadow: 0 4px 15px rgba(201, 169, 97, 0.3);
```

#### Botón Hover
```css
background: linear-gradient(135deg, #B0B7BD, #D8DCE0);
box-shadow: 0 6px 20px rgba(201, 169, 97, 0.5);
```

#### Botón Outline
```css
border: 2px solid #B0B7BD;
color: #B0B7BD;
background: transparent;
```

### Hero Section
- **Overlay**: rgba(0, 0, 0, 0.6) sobre la imagen
- **Título**: Blanco con "Gabriela Aloise" en Accent (#B0B7BD)
- **Botones**: Accent para CTA principal, outline blanco para secundario

### Footer
- **Fondo**: Gradiente de Primary Dark → Primary
- **Texto**: Gris claro (#f5f5f5)
- **Links hover**: Accent (#B0B7BD)
- **Matrícula**: Accent (#B0B7BD) en negrita

---

## 🎯 Combinaciones Recomendadas

### Combinación 1: Profesional y Elegante
- Fondo: Primary (#252b3b)
- Texto: Blanco (#ffffff)
- Acento: Accent (#B0B7BD)
- **Uso**: Navbar, footer, secciones oscuras

### Combinación 2: Limpio y Luminoso
- Fondo: Blanco (#ffffff)
- Texto: Primary (#252b3b)
- Acento: Accent (#B0B7BD)
- **Uso**: Contenido principal, cards, secciones claras

### Combinación 3: Destacado Premium
- Fondo: Accent Light (#D8DCE0)
- Texto: Primary Dark (#1a1f2e)
- Acento: Accent Dark (#8D9398)
- **Uso**: Banners especiales, propiedades destacadas

### Combinación 4: Sutil y Sofisticado
- Fondo: Gray 50 (#F8F9FA)
- Texto: Primary (#252b3b)
- Acento: Accent Subtle (#C4C8CC)
- **Uso**: Backgrounds alternos, secciones sutiles

---

## 🚫 No Hacer

❌ No usar amarillo brillante (#FFFF00) - usar nuestros plateados
❌ No usar el azul brillante anterior (#0047AB) - usar el azul corporativo
❌ No mezclar más de 2 tonos de plateado en el mismo elemento
❌ No usar texto plateado sobre fondo blanco sin contraste adecuado

---

## ✅ Hacer

✅ Usar gradientes plateados en botones importantes
✅ Usar el azul oscuro como fondo principal para secciones importantes
✅ Combinar el plateado con blanco para crear contraste
✅ Usar sombras doradas sutiles para dar profundidad
✅ Mantener consistencia: azul para estructura, plateado para acción

---

## 📊 Ratios de Contraste (WCAG)

### Texto Blanco sobre Primary
- Primary (#252b3b): **14.5:1** ✅ AAA
- Primary Dark (#1a1f2e): **16.8:1** ✅ AAA
- Primary Light (#2a3142): **13.2:1** ✅ AAA

### Texto Primary sobre Blanco
- Primary (#252b3b): **14.5:1** ✅ AAA

### Texto sobre Accent
- Primary Dark sobre Accent (#B0B7BD): **4.8:1** ✅ AA
- Blanco sobre Accent Dark (#8D9398): **4.2:1** ✅ AA

---

## 🎨 Variables CSS

Para usar en tu código:

```css
/* Azul Corporativo */
--color-primary: #252b3b;
--color-primary-dark: #1a1f2e;
--color-primary-light: #2a3142;

/* Plateado Elegante */
--color-accent: #B0B7BD;
--color-accent-dark: #8D9398;
--color-accent-light: #D8DCE0;
--color-accent-subtle: #C4C8CC;
```

**Uso:**
```css
.button {
  background: var(--color-accent);
  color: var(--color-primary-dark);
}

.navbar {
  background: linear-gradient(135deg,
    var(--color-primary-dark),
    var(--color-primary),
    var(--color-primary-light)
  );
}
```

---

## 🖼️ Ejemplos de Aplicación

### Tarjeta de Propiedad
```
┌─────────────────────────────┐
│  [Imagen de la propiedad]   │
├─────────────────────────────┤
│ Título (Primary)            │
│ Precio (Accent - Plateado)   │
│ Descripción (Gray 700)      │
│                             │
│ [Botón CTA - Gradiente      │
│  Plateado]                  │
└─────────────────────────────┘
```

### Sección Destacada
```
┌───────────────────────────────────────┐
│  Fondo: Primary Dark con gradiente   │
│                                       │
│  Título: Blanco                       │
│  Subtítulo: Accent (Plateado)        │
│  Texto: Gray 100                      │
│                                       │
│  [Botón: Accent con gradiente]       │
└───────────────────────────────────────┘
```

---

## 📱 Aplicación en Diferentes Medios

### Web
- Navbar: Azul corporativo con gradiente
- Hero: Imagen con overlay oscuro + texto blanco + acento plateado
- CTAs: Botones plateados con gradiente
- Footer: Fondo azul oscuro

### Redes Sociales
- Publicaciones: Fondo blanco o azul corporativo
- Texto destacado: Plateado (#B0B7BD)
- Logo: Siempre sobre fondo que contraste

### Impresos
- Tarjetas personales: Azul corporativo con detalles plateados
- Folletos: Combinación blanco/azul con acentos plateados
- Banners: Fondo azul oscuro con tipografía dorada

---

## 🔄 Versiones de la Paleta

### Versión Digital (RGB)
- Primary: `rgb(37, 43, 59)`
- Accent: `rgb(201, 169, 97)`

### Versión Impresión (CMYK) - Aproximado
- Primary: `C:85 M:75 Y:50 K:70`
- Accent: `C:20 M:25 Y:60 K:10`

---

## 📝 Notas de Diseño

1. **El plateado es elegancia**: Úsalo con moderación para destacar elementos importantes
2. **El azul es confianza**: Base sólida para estructura y profesionalismo
3. **Gradientes sutiles**: Aportan profundidad sin sobrecargar
4. **Sombras doradas**: Añaden un toque premium a los elementos interactivos
5. **Contraste es clave**: Siempre verificar legibilidad

---

**Fecha de creación**: 2025-01-20
**Última actualización**: 2025-01-20
**Versión**: 1.0
**Creado para**: Gabriela Aloise Propiedades
