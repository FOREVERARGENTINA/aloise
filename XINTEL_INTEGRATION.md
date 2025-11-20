# Integración con API de Xintel

Documentación completa para integrar la API de Xintel con el sitio de Gabriela Aloise Propiedades.

## ¿Qué es Xintel?

Xintel es la plataforma líder de datos inmobiliarios en Argentina, que proporciona:
- Base de datos de propiedades actualizada
- Información de mercado y tasaciones
- APIs para integración con sitios web
- Herramientas de gestión inmobiliaria

Sitio web: https://www.xintel.com.ar/

## Arquitectura Implementada

### Estructura de Archivos

```
js/
├── config.js                      # Configuración global (API keys, settings)
├── main.js                        # JavaScript principal
└── modules/
    ├── xintel-api.js             # Cliente de API de Xintel
    ├── property-service.js       # Servicio con fallback a mock data
    └── property-renderer.js      # Renderizado de propiedades en HTML
```

### Flujo de Datos

```
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  property-service.js │ ◄──── Decide: ¿API real o mock data?
└──────────────────────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐  ┌──────────┐
│ xintel-api  │  │ MOCK_    │
│     .js     │  │ DATA     │
└─────────────┘  └──────────┘
       │             │
       └──────┬──────┘
              ▼
     ┌──────────────────┐
     │ property-        │
     │ renderer.js      │
     └──────────────────┘
              ▼
     ┌──────────────────┐
     │   HTML (DOM)     │
     └──────────────────┘
```

## Configuración Paso a Paso

### 1. Obtener API Key de Xintel

**Opción A: Cuenta Xintel existente**
1. Ir a https://www.xintel.com.ar/
2. Iniciar sesión en tu cuenta
3. Ir a Configuración → API
4. Generar nueva API Key
5. Copiar la key

**Opción B: Nueva cuenta**
1. Registrarse en https://www.xintel.com.ar/
2. Contratar plan con acceso a API
3. Seguir pasos de Opción A

### 2. Configurar el Sitio Web

Editar `/js/config.js`:

```javascript
xintel: {
  enabled: true,  // ⚠️ Cambiar a true
  apiKey: 'TU_API_KEY_AQUI',  // ⚠️ Pegar tu API key
  baseURL: 'https://api.xintel.com.ar/v1',
  timeout: 10000,
  cacheTimeout: 5 * 60 * 1000
}
```

**También actualizar:**
```javascript
development: {
  useMockData: false,  // ⚠️ Cambiar a false para usar API real
  enableLogs: true
}
```

### 3. Verificar Configuración

Abrir el sitio en el navegador y revisar la consola (F12):

**✅ Configuración correcta:**
```
✅ Gabriela Aloise Propiedades - Sitio inicializado correctamente
```

**❌ Usando datos mock:**
```
⚠️ Usando datos de prueba. Configurá la API de Xintel en js/config.js
```

## Modo de Desarrollo (Mock Data)

### ¿Cuándo usar Mock Data?

- ✅ Durante desarrollo local sin API
- ✅ Para testing sin consumir cuota de API
- ✅ Para demostración sin cuenta de Xintel
- ❌ **NO** usar en producción

### Configuración de Mock Data

En `/js/config.js`:

```javascript
development: {
  useMockData: true,  // Activar mock data
  mockDataDelay: 1000,  // Simular delay de red (ms)
  enableLogs: true
}
```

Los datos mock están definidos en `/js/config.js` en el array `MOCK_PROPERTIES`.

### Personalizar Datos Mock

Editar el array `MOCK_PROPERTIES` en `/js/config.js`:

```javascript
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'Tu Propiedad',
    description: 'Descripción detallada...',
    price: 150000,
    currency: 'USD',
    operation_type: 'venta',  // o 'alquiler'
    property_type: 'casa',  // casa, departamento, ph, local, terreno
    location: 'Caseros, Buenos Aires',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: ['/images/properties/tu-imagen.jpg'],
    featured: true
  }
];
```

## API de Xintel - Endpoints Disponibles

### 1. Listar Propiedades

**Endpoint:** `GET /properties`

**Filtros disponibles:**
- `operation_type`: 'venta', 'alquiler'
- `property_type`: 'casa', 'departamento', 'ph', 'local', 'terreno'
- `location`: string de búsqueda
- `min_price`, `max_price`: rangos de precio
- `min_rooms`, `max_rooms`: cantidad de dormitorios
- `min_area`, `max_area`: superficie en m²
- `page`: número de página (default: 1)
- `limit`: items por página (default: 12)
- `sort`: 'price_asc', 'price_desc', 'date_desc'

**Ejemplo de uso:**

```javascript
const propertyService = new PropertyService(CONFIG);

const result = await propertyService.getProperties({
  operationType: 'venta',
  propertyType: 'casa',
  location: 'Caseros',
  minPrice: 80000,
  maxPrice: 200000,
  page: 1,
  limit: 12
});

if (result.success) {
  console.log(result.data.properties);
}
```

### 2. Detalle de Propiedad

**Endpoint:** `GET /properties/:id`

```javascript
const result = await propertyService.getPropertyDetail(123);
```

### 3. Propiedades Destacadas

**Endpoint:** `GET /properties/featured`

```javascript
const result = await propertyService.getFeaturedProperties(6);
```

### 4. Crear Consulta

**Endpoint:** `POST /inquiries`

```javascript
const result = await propertyService.createInquiry({
  property_id: 123,
  name: 'Juan Pérez',
  email: 'juan@email.com',
  phone: '+54 11 1234-5678',
  message: 'Consulta sobre la propiedad'
});
```

## Estructura de Respuesta de la API

### Respuesta Exitosa

```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 123,
        "title": "Departamento en Palermo",
        "description": "Descripción completa...",
        "price": 180000,
        "currency": "USD",
        "operation_type": "venta",
        "property_type": "departamento",
        "location": "Palermo, CABA",
        "bedrooms": 2,
        "bathrooms": 1,
        "rooms": 3,
        "area": 65,
        "covered_area": 60,
        "images": [
          "https://api.xintel.com.ar/images/123-1.jpg",
          "https://api.xintel.com.ar/images/123-2.jpg"
        ],
        "url": "https://www.xintel.com.ar/propiedades/123",
        "created_at": "2025-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 58,
      "items_per_page": 12
    }
  },
  "cached": false
}
```

### Respuesta con Error

```json
{
  "success": false,
  "error": "Invalid API key",
  "data": null
}
```

## Caché y Performance

### Sistema de Caché Implementado

El módulo `xintel-api.js` incluye caché en memoria:

- **Duración:** 5 minutos (configurable)
- **Alcance:** Por query específico
- **Beneficios:**
  - Reduce llamadas a la API
  - Mejora velocidad de carga
  - Reduce costos de API

### Limpiar Caché Manualmente

```javascript
const api = new XintelAPI(CONFIG.xintel);
api.clearCache();
```

### Verificar Caché

```javascript
console.log('Items en caché:', api.getCacheSize());
```

## Páginas Implementadas

### 1. Home (index.html)

**Funcionalidad:**
- Carga últimos 3 ingresos dinámicamente
- Fallback a propiedades estáticas si falla la API

**JavaScript relevante:**
```javascript
const result = await propertyService.getLatestProperties(3);
renderer.renderPropertiesGrid(result.data.properties, '#latest-properties-grid');
```

### 2. Listado de Propiedades (propiedades.html)

**Funcionalidad completa:**
- Búsqueda con filtros múltiples
- Ordenamiento (precio, fecha)
- Paginación automática
- Estados: loading, error, vacío
- Contador de resultados

**Filtros disponibles:**
- Tipo de operación (venta/alquiler)
- Tipo de propiedad (casa, depto, PH, etc.)
- Ubicación (búsqueda por texto)
- Cantidad mínima de dormitorios

## Componentes Reutilizables

### PropertyRenderer

Clase para renderizar propiedades en HTML.

**Métodos principales:**

```javascript
const renderer = new PropertyRenderer();

// Renderizar tarjeta individual
const html = renderer.renderPropertyCard(property);

// Renderizar grid completo
renderer.renderPropertiesGrid(properties, '#container');

// Estados especiales
renderer.renderLoadingState('#container');
renderer.renderErrorState('#container', 'Mensaje de error');
renderer.renderEmptyState('#container');

// Paginación
const paginationHTML = renderer.renderPagination(currentPage, totalPages, 'goToPage');
```

### PropertyService

Servicio con lógica de negocio y fallback automático.

**Características:**
- Detecta automáticamente si usar API o mock data
- Fallback a mock si API falla
- Caché integrado
- Manejo de errores

```javascript
const service = new PropertyService(CONFIG);

// Obtener estado
const status = service.getAPIStatus();
console.log(status);
// { useMockData: false, apiConfigured: true, xintelEnabled: true }
```

## Troubleshooting

### Problema: "Usando datos de prueba"

**Causa:** Mock data está activado o API no configurada

**Solución:**
1. Verificar que `CONFIG.xintel.enabled = true`
2. Verificar que `CONFIG.xintel.apiKey` tiene un valor
3. Verificar que `CONFIG.development.useMockData = false`

### Problema: Error 401 (No autorizado)

**Causa:** API key inválida o expirada

**Solución:**
1. Verificar que la API key sea correcta
2. Regenerar API key en panel de Xintel
3. Verificar que la cuenta tenga acceso a API

### Problema: Error de CORS

**Causa:** Xintel requiere dominio autorizado

**Solución:**
1. En panel de Xintel, agregar tu dominio a "Dominios autorizados"
2. Para desarrollo local, agregar `http://localhost:8000`

### Problema: Propiedades no se cargan

**Solución paso a paso:**

1. Abrir consola del navegador (F12)
2. Buscar errores en rojo
3. Verificar llamadas en pestaña "Network"
4. Revisar que los scripts estén en orden correcto:

```html
<script src="/js/config.js"></script>
<script src="/js/modules/xintel-api.js"></script>
<script src="/js/modules/property-service.js"></script>
<script src="/js/modules/property-renderer.js"></script>
<script src="/js/main.js"></script>
```

## Mejores Prácticas

### 1. Seguridad de API Key

**❌ NO hacer:**
- Commitear API key al repositorio público
- Compartir API key públicamente
- Usar misma key en múltiples sitios

**✅ HACER:**
- Usar variables de entorno en producción
- Rotar API keys periódicamente
- Monitorear uso de API

### 2. Optimización

**Recomendaciones:**
- Usar caché agresivamente
- Implementar paginación siempre
- Lazy load de imágenes
- Comprimir imágenes de propiedades

### 3. Experiencia de Usuario

**Estados importantes:**
- Mostrar loading mientras carga
- Mostrar mensaje claro en errores
- Ofrecer "retry" en errores
- Mostrar "0 resultados" con sugerencias

## Costos y Límites

**Verificar con Xintel:**
- Límite de llamadas por mes
- Costo por llamada adicional
- Límite de requests por minuto
- Cuota de imágenes

**Optimizar costos:**
- Usar caché efectivamente
- Limitar número de propiedades por página
- Evitar refrescos innecesarios
- Implementar debounce en búsquedas

## Próximos Pasos

### Funcionalidades Recomendadas

1. **Página de Detalle de Propiedad**
   - Galería de imágenes
   - Google Maps con ubicación
   - Formulario de consulta
   - Propiedades similares

2. **Búsqueda Avanzada**
   - Filtro por rango de precio
   - Filtro por superficie
   - Filtro por amenities
   - Búsqueda por mapa

3. **Comparador de Propiedades**
   - Seleccionar múltiples propiedades
   - Comparar lado a lado
   - Exportar comparación a PDF

4. **Favoritos**
   - Guardar propiedades en localStorage
   - Compartir favoritos por email
   - Recibir alertas de nuevas propiedades

## Soporte

**Xintel:**
- Sitio: https://www.xintel.com.ar/
- Email: soporte@xintel.com.ar
- Documentación API: https://docs.xintel.com.ar/

**Desarrollador del sitio:**
- Ver README.md para información de contacto
- Revisar issues en GitHub

---

**Última actualización:** Enero 2025
**Versión del sitio:** 1.0.0
**Versión de API Xintel:** v1
