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

### Dorado Elegante (Acento)

El dorado que aporta elegancia y diferenciación premium.

| Nombre | HEX | RGB | Uso |
|--------|-----|-----|-----|
| **Accent** | `#C9A961` | `rgb(201, 169, 97)` | Botones CTA, highlights, elementos destacados |
| **Accent Dark** | `#A38841` | `rgb(163, 136, 65)` | Hover en botones, sombras doradas |
| **Accent Light** | `#E4D4A8` | `rgb(228, 212, 168)` | Hover brillante, backgrounds claros |
| **Accent Subtle** | `#D4B976` | `rgb(212, 185, 118)` | Bordes, detalles sutiles, líneas |

**Ejemplo visual:**
```
████████  #C9A961 - Accent (Dorado principal)
████████  #A38841 - Accent Dark
████████  #E4D4A8 - Accent Light
████████  #D4B976 - Accent Subtle
```

---

## 📐 Uso de Colores

### Navbar
- **Fondo**: Gradiente de Primary Dark → Primary → Primary Light
- **Texto links**: Blanco (#ffffff)
- **Hover links**: Accent (#C9A961)
- **Borde inferior**: Accent con transparencia (rgba(201, 169, 97, 0.15))
- **Botón CTA**: Gradiente de Accent Dark → Accent

### Botones

#### Botón Principal (CTA)
```css
background: linear-gradient(135deg, #A38841, #C9A961);
color: #1a1f2e;
border: 1px solid #D4B976;
box-shadow: 0 4px 15px rgba(201, 169, 97, 0.3);
```

#### Botón Hover
```css
background: linear-gradient(135deg, #C9A961, #E4D4A8);
box-shadow: 0 6px 20px rgba(201, 169, 97, 0.5);
```

#### Botón Outline
```css
border: 2px solid #C9A961;
color: #C9A961;
background: transparent;
```

### Hero Section
- **Overlay**: rgba(0, 0, 0, 0.6) sobre la imagen
- **Título**: Blanco con "Gabriela Aloise" en Accent (#C9A961)
- **Botones**: Accent para CTA principal, outline blanco para secundario

### Footer
- **Fondo**: Gradiente de Primary Dark → Primary
- **Texto**: Gris claro (#f5f5f5)
- **Links hover**: Accent (#C9A961)
- **Matrícula**: Accent (#C9A961) en negrita

---

## 🎯 Combinaciones Recomendadas

### Combinación 1: Profesional y Elegante
- Fondo: Primary (#252b3b)
- Texto: Blanco (#ffffff)
- Acento: Accent (#C9A961)
- **Uso**: Navbar, footer, secciones oscuras

### Combinación 2: Limpio y Luminoso
- Fondo: Blanco (#ffffff)
- Texto: Primary (#252b3b)
- Acento: Accent (#C9A961)
- **Uso**: Contenido principal, cards, secciones claras

### Combinación 3: Destacado Premium
- Fondo: Accent Light (#E4D4A8)
- Texto: Primary Dark (#1a1f2e)
- Acento: Accent Dark (#A38841)
- **Uso**: Banners especiales, propiedades destacadas

### Combinación 4: Sutil y Sofisticado
- Fondo: Gray 50 (#F8F9FA)
- Texto: Primary (#252b3b)
- Acento: Accent Subtle (#D4B976)
- **Uso**: Backgrounds alternos, secciones sutiles

---

## 🚫 No Hacer

❌ No usar amarillo brillante (#FFFF00) - usar nuestros dorados
❌ No usar el azul brillante anterior (#0047AB) - usar el azul corporativo
❌ No mezclar más de 2 tonos de dorado en el mismo elemento
❌ No usar texto dorado sobre fondo blanco sin contraste adecuado

---

## ✅ Hacer

✅ Usar gradientes dorados en botones importantes
✅ Usar el azul oscuro como fondo principal para secciones importantes
✅ Combinar el dorado con blanco para crear contraste
✅ Usar sombras doradas sutiles para dar profundidad
✅ Mantener consistencia: azul para estructura, dorado para acción

---

## 📊 Ratios de Contraste (WCAG)

### Texto Blanco sobre Primary
- Primary (#252b3b): **14.5:1** ✅ AAA
- Primary Dark (#1a1f2e): **16.8:1** ✅ AAA
- Primary Light (#2a3142): **13.2:1** ✅ AAA

### Texto Primary sobre Blanco
- Primary (#252b3b): **14.5:1** ✅ AAA

### Texto sobre Accent
- Primary Dark sobre Accent (#C9A961): **4.8:1** ✅ AA
- Blanco sobre Accent Dark (#A38841): **4.2:1** ✅ AA

---

## 🎨 Variables CSS

Para usar en tu código:

```css
/* Azul Corporativo */
--color-primary: #252b3b;
--color-primary-dark: #1a1f2e;
--color-primary-light: #2a3142;

/* Dorado Elegante */
--color-accent: #C9A961;
--color-accent-dark: #A38841;
--color-accent-light: #E4D4A8;
--color-accent-subtle: #D4B976;
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
│ Precio (Accent - Dorado)    │
│ Descripción (Gray 700)      │
│                             │
│ [Botón CTA - Gradiente      │
│  Dorado]                    │
└─────────────────────────────┘
```

### Sección Destacada
```
┌───────────────────────────────────────┐
│  Fondo: Primary Dark con gradiente   │
│                                       │
│  Título: Blanco                       │
│  Subtítulo: Accent (Dorado)          │
│  Texto: Gray 100                      │
│                                       │
│  [Botón: Accent con gradiente]       │
└───────────────────────────────────────┘
```

---

## 📱 Aplicación en Diferentes Medios

### Web
- Navbar: Azul corporativo con gradiente
- Hero: Imagen con overlay oscuro + texto blanco + acento dorado
- CTAs: Botones dorados con gradiente
- Footer: Fondo azul oscuro

### Redes Sociales
- Publicaciones: Fondo blanco o azul corporativo
- Texto destacado: Dorado (#C9A961)
- Logo: Siempre sobre fondo que contraste

### Impresos
- Tarjetas personales: Azul corporativo con detalles dorados
- Folletos: Combinación blanco/azul con acentos dorados
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

1. **El dorado es elegancia**: Úsalo con moderación para destacar elementos importantes
2. **El azul es confianza**: Base sólida para estructura y profesionalismo
3. **Gradientes sutiles**: Aportan profundidad sin sobrecargar
4. **Sombras doradas**: Añaden un toque premium a los elementos interactivos
5. **Contraste es clave**: Siempre verificar legibilidad

---

**Fecha de creación**: 2025-01-20
**Última actualización**: 2025-01-20
**Versión**: 1.0
**Creado para**: Gabriela Aloise Propiedades
