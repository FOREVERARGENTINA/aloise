# Cómo Ver las Analíticas de Firebase

## 🔍 Dónde se guardan y cómo verlas

Todas las analíticas de tu sitio **aloisepropiedades** se guardan en **Google Firebase** y se pueden ver de dos formas principales:

---

## 1️⃣ Firebase Analytics Dashboard (Principal)

### Acceso:
1. Ve a: **https://console.firebase.google.com**
2. Inicia sesión con tu cuenta de Google
3. Selecciona el proyecto: **frandoweb-4c2c7**
4. En el menú lateral izquierdo, busca la sección **Analytics**

### Opciones en Analytics:

#### 📊 **Dashboard**
- **Ubicación**: Analytics > Dashboard
- **Qué muestra**:
  - Usuarios activos en tiempo real
  - Usuarios en los últimos 30 minutos
  - Usuarios por día/semana/mes
  - Países de origen
  - Dispositivos (móvil/desktop)
  - Sistema operativo
  - Navegadores

#### 📈 **Eventos (Events)**
- **Ubicación**: Analytics > Events
- **Qué muestra**: Todos los eventos que estás trackeando
  - `page_view` - Visualizaciones de página
  - `view_item` - Cuando ven una propiedad (si lo implementas)
  - `contact_whatsapp` - Clicks en WhatsApp (si lo implementas)
  - `search` - Búsquedas realizadas
  - `generate_lead` - Consultas enviadas
  - `share` - Compartidos
  - Cualquier evento personalizado que agregues

**Cómo ver detalles de un evento:**
1. Click en el nombre del evento
2. Verás gráficos y datos como:
   - Cantidad de veces que ocurrió
   - Usuarios únicos que lo activaron
   - Parámetros del evento (property_id, location, etc.)

#### 👥 **Audiencias (Audiences)**
- **Ubicación**: Analytics > Audiences
- **Qué permite**: Crear grupos de usuarios según comportamiento
- **Ejemplos útiles**:
  - Usuarios que vieron más de 3 propiedades
  - Usuarios que hicieron click en WhatsApp pero no enviaron consulta
  - Usuarios que volvieron más de 2 veces

#### 🔄 **Conversiones (Conversions)**
- **Ubicación**: Analytics > Conversions
- **Qué muestra**: Eventos marcados como conversiones
- **Recomendación**: Marca estos eventos como conversiones:
  - `generate_lead` - La conversión más importante
  - `contact_whatsapp` - Contacto por WhatsApp
  - `view_item` - Ver propiedad (opcional)

#### 🛤️ **User Journey (Embudo/Funnel)**
- **Ubicación**: Analytics > Analysis > Funnel exploration
- **Qué muestra**: El camino que siguen los usuarios
- **Ejemplo de embudo**:
  1. `page_view` en home (100%)
  2. `select_content` - Click en propiedad (60%)
  3. `view_item` - Ver detalle (40%)
  4. `contact_whatsapp` - Click WhatsApp (15%)
  5. `generate_lead` - Envío de consulta (8%)

---

## 2️⃣ Google Analytics 4 (GA4) - Integrado con Firebase

Como Firebase Analytics usa el mismo Measurement ID de Google Analytics, también puedes ver los datos en:

### Acceso:
1. Ve a: **https://analytics.google.com**
2. Selecciona la propiedad con ID: **G-1X8T159RTT**

### Ventajas de GA4:
- **Reportes más avanzados**
- **Análisis de rutas de usuario**
- **Segmentación más detallada**
- **Integración con Google Ads** (si usas publicidad)

### Informes útiles en GA4:

#### 📍 **Tiempo Real**
- Ubicación: Informes > Tiempo real
- Muestra: Usuarios activos AHORA mismo
- Útil para: Ver si el tracking funciona inmediatamente

#### 👤 **Adquisición de usuarios**
- Ubicación: Informes > Adquisición > Adquisición de usuarios
- Muestra: De dónde vienen tus usuarios
  - Búsqueda orgánica (Google)
  - Redes sociales (Facebook, Instagram)
  - Directo (escribieron la URL)
  - Referencias (links desde otros sitios)

#### 🔥 **Engagement**
- Ubicación: Informes > Engagement > Eventos
- Muestra: Los mismos eventos que en Firebase
- Ventaja: Mejores visualizaciones y filtros

#### 💰 **Monetización** (si configuras valores)
- Ubicación: Informes > Monetización
- Útil si: Asignas valores a las conversiones
- Ejemplo: `generate_lead` con valor = precio de la propiedad

---

## 3️⃣ Firestore Database (Consultas guardadas)

### Acceso:
1. Ve a: **https://console.firebase.google.com**
2. Selecciona el proyecto: **frandoweb-4c2c7**
3. En el menú lateral: **Firestore Database**

### Qué verás:
- **Colección**: `consultas`
- **Documentos**: Cada consulta enviada desde el sitio
- **Filtro importante**: Busca donde `site == "aloisepropiedades"`

### Datos de cada consulta:
```javascript
{
  nombre: "Juan Pérez",
  email: "juan@example.com",
  telefono: "+54 11 1234-5678",
  mensaje: "Me interesa el departamento...",
  propertyId: "123",
  propertyTitle: "Departamento en Palermo",
  url: "https://aloisepropiedades.com.ar/propiedad/123",
  site: "aloisepropiedades",
  timestamp: "2025-01-20 14:30:00"
}
```

### Cómo filtrar las consultas de tu sitio:
1. En Firestore, ve a la colección `consultas`
2. Click en "Filter" (Filtro)
3. Agrega condición: `site` == `aloisepropiedades`
4. Click en "Apply" (Aplicar)

### Exportar consultas:
No hay botón de exportar directo, pero puedes:
- **Opción 1**: Ver y copiar manualmente
- **Opción 2**: Crear un script para exportar a CSV/Excel
- **Opción 3**: Usar Firebase Admin SDK desde Node.js

---

## 4️⃣ Firebase Storage (Imágenes subidas)

### Acceso:
1. Firebase Console > **Storage**
2. Busca la carpeta: `aloisepropiedades/`

### Estructura sugerida:
```
aloisepropiedades/
├── properties/
│   ├── 123/
│   │   ├── image1.jpg
│   │   └── image2.jpg
│   └── 456/
│       └── image1.jpg
└── otros/
```

---

## 📊 Reportes más útiles para inmobiliaria

### 1. **Propiedades más vistas**
- **Dónde**: Firebase > Events > `view_item`
- **Parámetros**: Filtra por `item_id` para ver qué propiedades interesan más

### 2. **Conversión WhatsApp**
- **Dónde**: Firebase > Events > `contact_whatsapp`
- **Cálculo**:
  - Total `page_view` = 1000
  - Total `contact_whatsapp` = 50
  - **Tasa de conversión = 5%**

### 3. **Embudo de conversión completo**
```
1000 visitantes (page_view)
  ↓ 60%
600 vieron propiedades (select_content)
  ↓ 50%
300 vieron detalle (view_item)
  ↓ 20%
60 clickearon WhatsApp (contact_whatsapp)
  ↓ 50%
30 enviaron consulta (generate_lead)

CONVERSIÓN FINAL: 3%
```

### 4. **Búsquedas más frecuentes**
- **Dónde**: Firebase > Events > `search`
- **Parámetros**: `search_term`, `operation_type`, `property_type`
- **Útil para**: Saber qué buscan tus clientes

### 5. **Horarios de mayor actividad**
- **Dónde**: Firebase > Dashboard
- **Muestra**: Gráfico de usuarios por hora
- **Útil para**: Saber cuándo publicar en redes sociales

---

## 🎯 Configurar conversiones (IMPORTANTE)

Para que Firebase marque eventos como conversiones:

1. Ve a: **Firebase > Analytics > Events**
2. Busca el evento `generate_lead`
3. Click en el toggle "Mark as conversion"
4. Repite con `contact_whatsapp`

**Esto permitirá**:
- Ver conversiones en reportes
- Optimizar campañas de Google Ads
- Mejor tracking de objetivos

---

## 🔔 Configurar alertas

### En Firebase:
1. Firebase > Analytics > Events
2. Click en cualquier evento
3. "Create alert" (Crear alerta)
4. Ejemplo: Alerta si `generate_lead` > 10 por día

### En Google Analytics:
1. GA4 > Admin > Custom definitions
2. Crear dimensiones personalizadas
3. Configurar alertas por email

---

## 📱 App móvil de Firebase

Puedes ver analíticas desde tu celular:

1. Descarga **"Firebase Console"** (Google Play / App Store)
2. Inicia sesión
3. Selecciona proyecto **frandoweb-4c2c7**
4. Ve estadísticas en tiempo real

---

## ⏰ Demora en ver datos

### Datos en tiempo real:
- **Firebase Analytics > Dashboard**: 5-10 minutos
- **Google Analytics > Tiempo real**: Instantáneo (segundos)

### Datos históricos:
- **Reportes completos**: 24-48 horas
- **Algunos eventos**: Hasta 72 horas

**Consejo**: Usa "Tiempo real" en GA4 para verificar que funciona hoy mismo.

---

## 🧪 Cómo probar que funciona AHORA

1. Abre tu sitio web en una pestaña de incógnito
2. En otra pestaña abre: https://analytics.google.com
3. Ve a: **Informes > Tiempo real**
4. Navega por tu sitio y verás:
   - Usuario activo (tú)
   - Páginas que visitas
   - Eventos que se disparan

---

## 📞 Datos de acceso

**Firebase Console**: https://console.firebase.google.com
- **Proyecto**: frandoweb-4c2c7
- **Sitio**: aloisepropiedades

**Google Analytics**: https://analytics.google.com
- **Measurement ID**: G-1X8T159RTT

**Nota**: Necesitas tener acceso con tu cuenta de Google al proyecto.

---

## 🆘 Si no ves datos

1. **Verifica que Firebase se inicializó**:
   - Abre consola del navegador (F12)
   - Busca: "✅ Firebase inicializado correctamente"

2. **Verifica en tiempo real**:
   - GA4 > Tiempo real
   - Navega por el sitio
   - Deberías verte como usuario activo

3. **Revisa el Measurement ID**:
   - Debe ser: `G-1X8T159RTT`
   - Está en `js/firebase-init.js`

4. **Verifica la consola de errores**:
   - F12 > Console
   - No debe haber errores de Firebase

---

## 📈 Eventos a implementar (próximos pasos)

Para tener analíticas completas, deberías agregar:

✅ Ya configurado:
- `page_view` - Automático

⏳ Por implementar:
- `view_item` - Ver detalle de propiedad
- `contact_whatsapp` - Click en WhatsApp
- `search` - Búsquedas
- `generate_lead` - Consultas enviadas
- `share` - Compartir propiedad
- `select_content` - Click en propiedad del listado

**Ver**: `js/firebase-examples.js` para el código.

---

## 💡 Consejos finales

1. **Revisa Analytics semanalmente** para entender a tu audiencia
2. **Configura conversiones** para medir el éxito
3. **Crea embudos** para ver dónde abandonan los usuarios
4. **Usa los datos** para mejorar el sitio (qué propiedades destacar, etc.)
5. **Integra con Google Ads** si haces publicidad (optimización automática)

---

**¿Necesitas ayuda para configurar algo específico?**
