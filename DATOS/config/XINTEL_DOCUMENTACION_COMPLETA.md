# Documentación Completa - Integración Xintel API
## Proyecto Furne Propiedades

---

## 📋 ÍNDICE

### PARTE 1: INFORMACIÓN DEL PROYECTO
1. [Estado de Implementación](#estado-de-implementación)
2. [Credenciales y Configuración](#credenciales-y-configuración)
3. [Archivos del Proyecto](#archivos-del-proyecto)

### PARTE 2: GUÍA TÉCNICA
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Endpoints Disponibles](#endpoints-disponibles)
6. [Estructura de Datos](#estructura-de-datos)
7. [Método de Autenticación](#método-de-autenticación)

### PARTE 3: IMPLEMENTACIÓN
8. [Paso a Paso](#implementación-paso-a-paso)
9. [Ejemplos de Código](#ejemplos-de-código)
10. [Casos de Uso](#casos-de-uso-comunes)

### PARTE 4: REFERENCIA
11. [Limitaciones Conocidas](#limitaciones-conocidas)
12. [Troubleshooting](#troubleshooting)
13. [Contacto y Soporte](#contacto-y-soporte)

---

# PARTE 1: INFORMACIÓN DEL PROYECTO

## Estado de Implementación

### ✅ Funcionalidades Completadas

**Página Principal (index.html)**
- Propiedades destacadas (máximo 6)
- Buscador con pestañas (Comprar/Alquilar funcionales)
- Redirección a página de propiedades con filtros

**Página de Propiedades (propiedades.html)**
- Listado completo con grid responsive
- Filtros avanzados (operación, tipo, ubicación, ambientes)
- Ordenamiento (recientes, precio)
- Paginación (12 por página)
- Autocompletado de ubicación

**Página de Detalle (ficha.html)**
- Galería de fotos completa
- Información detallada
- Características
- Mapa de ubicación
- Header y footer estándar

**Configuración**
- Firebase Hosting configurado
- Redirección `/ficha=FFN3` → `/ficha?ficha=FFN3`
- Cache optimizado (JS: 300s, HTML: no-cache)

---

## Credenciales y Configuración

### Credenciales Furne Propiedades

```javascript
const XINTEL_CONFIG = {
    apiUrl: 'https://xintelapi.com.ar/',
    empresa: 'FFN',
    apiKey: 'NEDJKTI9B0MGJPANBD124IUUG',
    imageBaseUrl: 'https://xintelapi.com.ar/',
    defaults: {
        resultadosPerPage: 10,
        atributos: ''
    }
};
```

### Cómo Obtener Credenciales

1. **Contactar**: soporte@xintel.com.ar
2. **Solicitar**:
   - Código de empresa
   - API Key
   - Activación de dominio para CORS
3. **Documentación**: Solicitar `api-xintel.md`

---

## Archivos del Proyecto

### Configuración
- `js/xintel-config.js` - Credenciales y configuración

### Servicios
- `js/xintel-api.js` - Cliente de API (clase XintelAPI)
- `js/properties.js` - Lógica de UI para propiedades
- `js/properties-list.js` - Listado con filtros y paginación
- `js/ficha.js` - Detalle de propiedad

### Páginas
- `index.html` - Página principal
- `propiedades.html` - Listado de propiedades
- `ficha.html` - Detalle de propiedad
- `404.html` - Página de error

### Configuración Hosting
- `firebase.json` - Configuración Firebase Hosting

---

# PARTE 2: GUÍA TÉCNICA

## Estructura de Archivos

### Mínimo Necesario

```
proyecto/
├── js/
│   ├── xintel-config.js      # Credenciales
│   ├── xintel-api.js          # Cliente API
│   └── properties.js          # UI propiedades
├── index.html                 # Home
└── propiedades.html          # Listado
```

### Orden de Carga en HTML

```html
<!-- IMPORTANTE: Cargar en este orden -->
<script src="/js/xintel-config.js"></script>
<script src="/js/xintel-api.js"></script>
<script src="/js/properties.js"></script>
<script src="/js/main.js"></script>
```

---

## Endpoints Disponibles

### 1. Propiedades Destacadas

**Endpoint**: `fichas.destacadas`

```javascript
const response = await xintelAPI.getFichasDestacadas({
    atributos: '',
    codsuc: '',
    order: '',
    orderT: ''
});
```

**Uso**: Página principal, slider

---

### 2. Últimas Propiedades

**Endpoint**: `fichas.ultimas`

```javascript
const response = await xintelAPI.getFichasUltimas({
    atributos: '',
    limit: 10
});
```

---

### 3. Búsqueda de Propiedades

**Endpoint**: `resultados.fichas`

```javascript
const response = await xintelAPI.searchProperties({
    tipo_operacion: 'A',        // A=Alquiler, V=Venta, T=Temporal
    tipo_inmueble: 'D',         // D=Depto, C=Casa, T=Terreno
    sellocalidades: 'Caseros',
    barrios1: 'Centro',
    Ambientes: '2',
    moneda: 'D',                // D=Pesos, U=USD
    valor_minimo: '50000',
    valor_maximo: '200000',
    codigo_ficha: '',
    page: 0,                    // Empieza en 0
    rppagina: 12
});
```

**⚠️ LIMITACIÓN**: Solo devuelve 1 imagen por propiedad

---

### 4. Propiedad Individual ⭐ IMPORTANTE

**Endpoint**: `fichas.propiedades`

```javascript
const response = await xintelAPI.request('fichas.propiedades', {
    id: '2'  // Solo número, sin FFN
});
```

**Respuesta**:
```javascript
{
    resultado: {
        ficha: [{...}],  // Array con 1 propiedad (singular)
        img: [           // TODAS las fotos
            "url1.jpg",
            "url2.jpg",
            "url3.jpg"
        ]
    }
}
```

**✅ ÚNICO endpoint que devuelve todas las fotos**

---

### 5. Datos del Buscador

**Endpoint**: `datos.select.buscador`

```javascript
const response = await xintelAPI.getDatosBuscador();
```

**Devuelve**: Localidades, barrios, tipos disponibles

---

### 6. Emprendimientos

**Endpoint**: `resultados.emprendimientos`

```javascript
const response = await xintelAPI.getEmprendimientos({
    ed_est: '',
    ed_loc: '',
    ed_bar: ''
});
```

---

### 7. Estilos de Empresa

**Endpoint**: `datos.empresa.estilos`

```javascript
const response = await xintelAPI.getEmpresaEstilos();
```

**Devuelve**: Colores corporativos

---

## Estructura de Datos

### Campos Principales de una Ficha

```javascript
{
    // Identificación
    "in_num": "2",              // Número de ficha
    "in_fic": "2",              // ID de ficha
    "in_suc": "FFN",            // Sucursal
    
    // Operación y Tipo
    "in_ope": "A",              // A=Alquiler, V=Venta, T=Temporal
    "in_tip": "D",              // D=Depto, C=Casa, P=PH, T=Terreno
    
    // Precios
    "in_vaa": "500000",         // Valor alquiler (pesos)
    "in_val": "0",              // Valor venta (pesos)
    "in_vau": "0",              // Valor alquiler (USD)
    "in_vlu": "0",              // Valor venta (USD)
    "in_mon": "D",              // D=Pesos, U=USD
    
    // Ubicación
    "in_loc": "Tres de Febrero",
    "in_bar": "Caseros",
    "in_cal": "Wenceslao de tata",
    "in_nro": "5181",
    "in_pis": "2",
    "in_dto": "D",
    "in_coo": "-34.60,-58.56",  // lat,lng
    
    // Características
    "in_amb": "2",               // Ambientes
    "ti_dor": "1",               // Dormitorios
    "in_bao": "1",               // Baños
    "in_gar": "0",               // Cocheras
    
    // Superficies
    "in_scu": "41",              // Cubierta (m2)
    "in_sto": "45",              // Total (m2)
    
    // Imágenes
    "img_princ": "https://...",
    "fotos": ["url1", "url2"],
    
    // Textos
    "titulo": "Departamento...",
    "in_obs": "Descripción..."
}
```

### Mapeo de Códigos

**Operación (in_ope)**
- `A` = Alquiler
- `V` = Venta
- `T` = Temporal

**Tipo (in_tip)**
- `D` = Departamento
- `C` = Casa
- `P` = PH
- `T` = Terreno
- `L` = Local
- `O` = Oficina
- `G` = Cochera

**Moneda (in_mon)**
- `D` = Pesos (ARS)
- `U` = Dólares (USD)

---

## Método de Autenticación

Xintel usa **POST con FormData**:

```javascript
const formData = new FormData();
formData.append('json', 'resultados.fichas');
formData.append('inm', 'FFN');
formData.append('apiK', 'NEDJKTI9B0MGJPANBD124IUUG');
formData.append('tipo_operacion', 'A');

const response = await fetch('https://xintelapi.com.ar/', {
    method: 'POST',
    body: formData
});
```

**NO usa**:
- ❌ Headers Authorization
- ❌ Bearer tokens
- ❌ Query strings
- ❌ GET requests

---

# PARTE 3: IMPLEMENTACIÓN

## Implementación Paso a Paso

### Paso 1: xintel-config.js

```javascript
const XINTEL_CONFIG = {
    apiUrl: 'https://xintelapi.com.ar/',
    empresa: 'TU_CODIGO',
    apiKey: 'TU_API_KEY',
    imageBaseUrl: 'https://xintelapi.com.ar/',
    defaults: {
        resultadosPerPage: 10,
        atributos: ''
    }
};
```

### Paso 2: xintel-api.js (Clase Completa)

```javascript
class XintelAPI {
    constructor() {
        this.config = XINTEL_CONFIG;
    }

    async request(json, params = {}) {
        const formData = new FormData();
        formData.append('json', json);
        formData.append('inm', this.config.empresa);
        formData.append('apiK', this.config.apiKey);

        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                formData.append(key, params[key]);
            }
        });

        const response = await fetch(this.config.apiUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return this.normalizeResponse(data, json);
    }

    normalizeResponse(data, endpoint) {
        if (data.error) {
            return { fichas: [], total: 0, error: data.error };
        }

        if (data.resultado && Array.isArray(data.resultado.fichas)) {
            const fichas = data.resultado.fichas.map((ficha, index) => {
                if (data.resultado.img && data.resultado.img[index]) {
                    ficha.fotos = Array.isArray(data.resultado.img[index]) 
                        ? data.resultado.img[index] 
                        : [data.resultado.img[index]];
                    ficha.img_princ = ficha.fotos[0];
                }
                return ficha;
            });
            
            return { fichas, total: fichas.length, resultado: data.resultado };
        }

        return data;
    }

    async getFichasDestacadas(options = {}) {
        return await this.request('fichas.destacadas', options);
    }

    async searchProperties(filters = {}) {
        return await this.request('resultados.fichas', filters);
    }

    async getFichaPorNumero(fichaNumero) {
        const numero = String(fichaNumero).replace(/^FFN/i, '');
        
        try {
            const response = await this.request('fichas.propiedades', { id: numero });
            
            if (response.resultado && response.resultado.ficha && response.resultado.ficha.length > 0) {
                const fichas = response.resultado.ficha;
                
                if (response.resultado.img && Array.isArray(response.resultado.img)) {
                    fichas[0].fotos = response.resultado.img;
                    fichas[0].img_princ = response.resultado.img[0];
                }
                
                return { fichas, total: fichas.length, resultado: response.resultado };
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
        return { fichas: [], total: 0 };
    }
}

const xintelAPI = new XintelAPI();
```

### Paso 3: Crear Tarjeta de Propiedad

```javascript
function createPropertyCard(property) {
    const imagen = property.img_princ || property.fotos?.[0] || '/img/placeholder.jpg';
    const precio = property.in_ope === 'A' ? property.in_vaa : property.in_val;
    const moneda = property.in_mon === 'U' ? 'US$' : '$';
    const operacion = property.in_ope === 'A' ? 'Alquiler' : 'Venta';
    const tipo = getTipoInmueble(property.in_tip);
    
    return `
        <article class="property-card">
            <a href="/ficha?ficha=FFN${property.in_num}">
                <div class="property-card-image">
                    <img src="${imagen}" alt="${tipo}" loading="lazy">
                    <span class="badge">${operacion}</span>
                </div>
                <div class="property-card-content">
                    <h3>${tipo} en ${property.in_bar}</h3>
                    <p class="location">${property.in_loc}</p>
                    <p class="price">${moneda} ${formatNumber(precio)}</p>
                    <div class="features">
                        <span>${property.in_amb} amb</span>
                        <span>${property.in_scu} m²</span>
                    </div>
                </div>
            </a>
        </article>
    `;
}

function getTipoInmueble(codigo) {
    const tipos = {
        'D': 'Departamento', 'C': 'Casa', 'P': 'PH',
        'T': 'Terreno', 'L': 'Local', 'O': 'Oficina', 'G': 'Cochera'
    };
    return tipos[codigo] || 'Propiedad';
}

function formatNumber(num) {
    if (!num || num === '0') return 'Consultar';
    return new Intl.NumberFormat('es-AR').format(num);
}
```

### Paso 4: Cargar Propiedades

```javascript
async function loadProperties() {
    try {
        const response = await xintelAPI.getFichasDestacadas();
        
        if (response.fichas && response.fichas.length > 0) {
            const container = document.getElementById('properties-grid');
            container.innerHTML = response.fichas
                .map(prop => createPropertyCard(prop))
                .join('');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProperties);
```

---

## Ejemplos de Código

### Propiedades Destacadas en Home

```javascript
async function loadFeaturedProperties() {
    const container = document.getElementById('featuredPropertiesGrid');
    if (!container) return;

    try {
        container.innerHTML = '<div class="loading">Cargando...</div>';

        const response = await xintelAPI.getFichasDestacadas();

        if (response.fichas && response.fichas.length > 0) {
            const propiedades = response.fichas.slice(0, 6);
            container.innerHTML = propiedades
                .map(property => createPropertyCard(property))
                .join('');
        } else {
            container.innerHTML = '<p>No hay propiedades destacadas.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p>Error al cargar propiedades.</p>';
    }
}
```

### Detalle de Propiedad con Galería

```javascript
class PropertyDetailManager {
    async loadProperty(id) {
        const response = await xintelAPI.getFichaPorNumero(id);
        
        if (response.fichas && response.fichas.length > 0) {
            this.property = response.fichas[0];
            this.renderGallery();
            this.renderDetails();
        }
    }

    renderGallery() {
        const images = this.property.fotos || [];
        const gallery = document.getElementById('photoGallery');
        
        gallery.innerHTML = images
            .map((img, i) => `
                <img src="${img}" 
                     alt="Foto ${i + 1}" 
                     onclick="showImage(${i})">
            `)
            .join('');
    }

    renderDetails() {
        document.getElementById('title').textContent = this.property.titulo;
        document.getElementById('price').textContent = formatPrice(this.property);
        document.getElementById('location').textContent = getUbicacion(this.property);
    }
}
```

### Sistema de Filtros

```javascript
class PropertyFilters {
    constructor() {
        this.filters = {
            tipo_operacion: '',
            tipo_inmueble: '',
            sellocalidades: '',
            page: 0,
            rppagina: 12
        };
    }

    async search() {
        try {
            this.updateFilters();
            const response = await xintelAPI.searchProperties(this.filters);
            
            if (response.fichas && response.fichas.length > 0) {
                this.displayResults(response.fichas);
                this.updatePagination(response.total);
            } else {
                this.showNoResults();
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError();
        }
    }

    updateFilters() {
        this.filters.tipo_operacion = document.getElementById('filterOperation')?.value || '';
        this.filters.tipo_inmueble = document.getElementById('filterType')?.value || '';
        this.filters.sellocalidades = document.getElementById('filterLocation')?.value || '';
    }

    displayResults(properties) {
        const container = document.getElementById('propertiesGrid');
        container.innerHTML = properties
            .map(prop => createPropertyCard(prop))
            .join('');
    }
}
```

### Paginación

```javascript
class Pagination {
    constructor(itemsPerPage = 12) {
        this.currentPage = 0;
        this.itemsPerPage = itemsPerPage;
        this.totalItems = 0;
    }

    get totalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    goToPage(page) {
        if (page < 0 || page >= this.totalPages) return;
        this.currentPage = page;
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <button onclick="pagination.goToPage(${this.currentPage - 1})"
                    ${this.currentPage === 0 ? 'disabled' : ''}>
                Anterior
            </button>
            <span>Página ${this.currentPage + 1} de ${this.totalPages}</span>
            <button onclick="pagination.goToPage(${this.currentPage + 1})"
                    ${this.currentPage >= this.totalPages - 1 ? 'disabled' : ''}>
                Siguiente
            </button>
        `;
    }
}
```

---

## Casos de Uso Comunes

### 1. Búsqueda con Filtros

```javascript
async function searchWithFilters() {
    const filters = {
        tipo_operacion: document.getElementById('operacion').value,
        tipo_inmueble: document.getElementById('tipo').value,
        sellocalidades: document.getElementById('ubicacion').value,
        page: 0,
        rppagina: 12
    };
    
    const response = await xintelAPI.searchProperties(filters);
    displayResults(response.fichas);
}
```

### 2. Obtener Todas las Fotos

```javascript
async function loadPropertyWithPhotos(id) {
    const response = await xintelAPI.getFichaPorNumero(id);
    
    if (response.fichas.length > 0) {
        const property = response.fichas[0];
        const photos = property.fotos || [];
        
        // Mostrar galería
        photos.forEach(url => {
            console.log('Foto:', url);
        });
    }
}
```

### 3. Manejo de Imágenes

```javascript
function getMainImage(property) {
    if (property.img_princ) return property.img_princ;
    if (property.fotos && property.fotos.length > 0) return property.fotos[0];
    return '/img/placeholder.jpg';
}

function getAllImages(property) {
    const images = [];
    
    if (property.fotos && Array.isArray(property.fotos)) {
        images.push(...property.fotos);
    }
    
    if (property.img_princ && !images.includes(property.img_princ)) {
        images.unshift(property.img_princ);
    }
    
    return images.filter(img => img && img.trim() !== '');
}
```

### 4. Formateo de Datos

```javascript
function formatPrice(property) {
    const precio = property.in_ope === 'A' ? property.in_vaa : property.in_val;
    const moneda = property.in_mon === 'U' ? 'US$' : '$';
    
    if (!precio || precio === '0') return 'Consultar';
    return `${moneda} ${formatNumber(precio)}`;
}

function getUbicacion(property) {
    const partes = [];
    if (property.in_bar) partes.push(property.in_bar);
    if (property.in_loc) partes.push(property.in_loc);
    return partes.join(', ') || 'Sin ubicación';
}

function formatAddress(property) {
    const partes = [];
    if (property.in_cal) partes.push(property.in_cal);
    if (property.in_nro) partes.push(property.in_nro);
    if (property.in_pis) partes.push(`Piso ${property.in_pis}`);
    if (property.in_dto) partes.push(`Dto ${property.in_dto}`);
    return partes.join(' ') || 'Sin dirección';
}
```

---

## Integración de Mapa Interactivo

### Librería: Leaflet.js + OpenStreetMap

**Instalación en HTML**:
```html
<!-- CSS de Leaflet -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>

<!-- JS de Leaflet -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
```

### Implementación del Mapa

```javascript
initializeMap() {
    const mapContainer = document.getElementById('propertyMapContainer');
    if (!mapContainer || !this.property) return;

    // Extraer coordenadas de la propiedad
    let lat, lng;

    // XINTEL puede traer las coordenadas en diferentes formatos:
    // 1. in_coo: "-34.60,-58.56" (string)
    // 2. latitud y longitud: campos separados
    if (this.property.in_coo && typeof this.property.in_coo === 'string') {
        const coords = this.property.in_coo.split(',');
        lat = parseFloat(coords[0]);
        lng = parseFloat(coords[1]);
    } else if (this.property.latitud && this.property.longitud) {
        lat = parseFloat(this.property.latitud);
        lng = parseFloat(this.property.longitud);
    }

    // Si no hay coordenadas, mostrar mensaje placeholder
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        mapContainer.innerHTML = `
            <div class="property-map-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <p>Sin ubicación precisa</p>
                <p class="location-text">${this.getUbicacion(this.property)}</p>
            </div>
        `;
        return;
    }

    // Crear contenedor del mapa
    mapContainer.innerHTML = '<div id="propertyMap" class="property-map"></div>';

    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
        const mapElement = document.getElementById('propertyMap');
        if (!mapElement) return;

        // Crear el mapa
        const map = L.map('propertyMap').setView([lat, lng], 15);

        // Agregar tiles de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Crear icono personalizado para el marcador
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div class="marker-pin"></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        // Agregar marcador
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        // Agregar popup con información
        const ubicacion = this.getUbicacion(this.property);
        marker.bindPopup(`
            <div class="map-popup">
                <strong>${this.property.titulo || 'Propiedad'}</strong>
                <p>${ubicacion}</p>
            </div>
        `);

        // Guardar referencia al mapa
        this.propertyMap = map;
    }, 100);
}
```

### CSS para el Mapa

```css
/* Contenedor del mapa */
.property-map {
    width: 100%;
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
}

/* Placeholder sin coordenadas */
.property-map-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    background: #f5f5f5;
    border-radius: 8px;
    color: #666;
}

.property-map-placeholder svg {
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.property-map-placeholder p {
    margin: 0.5rem 0;
}

.location-text {
    font-size: 0.9rem;
    color: #999;
}

/* Marcador personalizado */
.custom-map-marker {
    background: none;
    border: none;
}

.marker-pin {
    width: 30px;
    height: 42px;
    background: var(--primary-color);
    border-radius: 50% 50% 50% 0;
    position: relative;
    transform: rotate(-45deg);
}

.marker-pin::after {
    content: '';
    width: 14px;
    height: 14px;
    background: white;
    position: absolute;
    top: 8px;
    left: 8px;
    border-radius: 50%;
}

/* Popup del mapa */
.map-popup {
    font-family: var(--font-family);
}

.map-popup strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
}

.map-popup p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
}

/* Responsive */
@media (max-width: 768px) {
    .property-map {
        height: 300px;
    }

    .property-map-placeholder {
        height: 300px;
    }
}
```

---

## Modal de Galería de Imágenes

### Implementación del Modal

```javascript
/**
 * Abre el modal de imagen en la posición especificada
 */
openImageModal(index) {
    const images = this.getImages();
    if (!images || images.length === 0) return;

    this.currentImageIndex = Math.max(0, Math.min(index, images.length - 1));

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const counter = document.getElementById('imageCounter');

    if (!modal || !modalImg) return;

    modalImg.src = images[this.currentImageIndex];
    counter.textContent = `${this.currentImageIndex + 1} / ${images.length}`;
    modal.classList.add('active');

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal de imagen
 */
closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Navega entre imágenes del modal
 */
navigateImage(direction) {
    const images = this.getImages();
    if (!images || images.length === 0) return;

    this.currentImageIndex += direction;

    // Loop: si llega al final, vuelve al inicio
    if (this.currentImageIndex >= images.length) {
        this.currentImageIndex = 0;
    } else if (this.currentImageIndex < 0) {
        this.currentImageIndex = images.length - 1;
    }

    const modalImg = document.getElementById('modalImage');
    const counter = document.getElementById('imageCounter');

    if (modalImg) modalImg.src = images[this.currentImageIndex];
    if (counter) counter.textContent = `${this.currentImageIndex + 1} / ${images.length}`;
}
```

### HTML del Modal

```html
<!-- Modal de imagen -->
<div id="imageModal" class="image-modal">
    <button class="modal-close" onclick="propertyDetailManager.closeImageModal()" aria-label="Cerrar">
        ×
    </button>

    <button class="modal-nav modal-prev" onclick="propertyDetailManager.navigateImage(-1)" aria-label="Anterior">
        ‹
    </button>

    <div class="modal-content">
        <img id="modalImage" src="" alt="Imagen de la propiedad">
        <div id="imageCounter" class="image-counter">1 / 10</div>
    </div>

    <button class="modal-nav modal-next" onclick="propertyDetailManager.navigateImage(1)" aria-label="Siguiente">
        ›
    </button>
</div>
```

### CSS del Modal

```css
/* Modal de imagen */
.image-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    align-items: center;
    justify-content: center;
}

.image-modal.active {
    display: flex;
}

.modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 4px;
}

/* Botón cerrar (X) */
.modal-close {
    position: absolute;
    top: 20px;
    right: 30px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 28px;
    line-height: 50px;
    cursor: pointer;
    z-index: 10001;
    color: #333;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-weight: 400;
}

.modal-close:hover {
    background: white;
    transform: scale(1.1);
}

/* Botones de navegación */
.modal-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.9);
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 40px;
    line-height: 1;
    cursor: pointer;
    z-index: 10001;
    color: #333;
    transition: all 0.3s ease;
    font-weight: 300;
}

.modal-nav:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
}

.modal-prev {
    left: 30px;
}

.modal-next {
    right: 30px;
}

/* Contador de imágenes */
.image-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
    .modal-close {
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        font-size: 24px;
        line-height: 40px;
    }

    .modal-nav {
        width: 40px;
        height: 40px;
        font-size: 32px;
    }

    .modal-prev {
        left: 10px;
    }

    .modal-next {
        right: 10px;
    }
}
```

### Soporte de Teclado

```javascript
// Agregar en el constructor o init()
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('imageModal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        this.closeImageModal();
    } else if (e.key === 'ArrowLeft') {
        this.navigateImage(-1);
    } else if (e.key === 'ArrowRight') {
        this.navigateImage(1);
    }
});
```

---

## Configuración Firebase Hosting

### firebase.json Completo

```json
{
  "hosting": {
    "site": "tu-sitio",
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "DATOS/**",
      "README.md"
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp|svg|ico|woff|woff2|ttf|otf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(css|js)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=300"
          }
        ]
      },
      {
        "source": "**/*.@(html)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      },
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false,
    "redirects": [
      {
        "source": "/ficha=:id",
        "destination": "/ficha?ficha=:id",
        "type": 301
      }
    ]
  }
}
```

### Explicación de la Configuración

**Headers de Cache**:
- Imágenes/Fuentes: `max-age=31536000` (1 año) + `immutable`
- CSS/JS: `max-age=300` (5 minutos)
- HTML: `no-cache` (siempre validar)

**Redirects**:
- `/ficha=FFN3` → `/ficha?ficha=FFN3` (301 permanente)
- Permite URLs limpias compartibles

**cleanUrls**: Permite acceder a `/propiedades` en lugar de `/propiedades.html`

**Security Headers**:
- `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- `X-Frame-Options: SAMEORIGIN` - Protección contra clickjacking
- `Referrer-Policy` - Control de información de referencia

### Comandos de Deploy

```bash
# Login
firebase login

# Inicializar proyecto (solo primera vez)
firebase init hosting

# Deploy
firebase deploy

# Ver logs
firebase hosting:channel:list
```

---

# PARTE 4: REFERENCIA

## Limitaciones Conocidas

### 1. Imágenes Múltiples ⚠️ CRÍTICO

**Problema**: `resultados.fichas` solo devuelve 1 imagen por propiedad

**Solución**:
```javascript
// ❌ Solo 1 foto
const response = await xintelAPI.searchProperties({...});

// ✅ Todas las fotos
const response = await xintelAPI.getFichaPorNumero('2');
```

### 2. Títulos Truncados ⚠️ IMPORTANTE

**Problema**: XINTEL trunca el campo `titulo` a ~35 caracteres en `resultados.fichas`

**Ejemplo**:
```javascript
// Respuesta de XINTEL:
{
    titulo: "Departamento en alquiler Caseros 2 " // Truncado a 35 caracteres
}
```

**Solución**: Construir títulos desde los campos componentes

```javascript
construirTitulo(propiedad) {
    const partes = [];

    // 1. Tipo de propiedad
    const tipo = propiedad.tipo || propiedad.in_tip || '';
    if (tipo) partes.push(tipo);

    // 2. Operación (en alquiler / en venta)
    const operacion = propiedad.in_ope === 'A' ? 'en alquiler' : 'en venta';
    partes.push(operacion);

    // 3. Ubicación (barrio o localidad)
    const ubicacion = propiedad.in_bar || propiedad.in_loc || '';
    if (ubicacion) partes.push(ubicacion);

    // 4. Ambientes (si tiene)
    const ambientes = propiedad.cantidad_ambientes || propiedad.ambientes_num || propiedad.in_amb || '';
    if (ambientes) {
        // Si in_amb es "2A", extraer solo el número
        const numAmbientes = String(ambientes).replace(/[^0-9]/g, '');
        if (numAmbientes) partes.push(`${numAmbientes} ambientes`);
    }

    // Si no pudimos construir nada, usar el título de XINTEL (aunque esté truncado)
    if (partes.length === 0) {
        return propiedad.titulo || 'Propiedad disponible';
    }

    return partes.join(' ');
}

// Resultado: "Departamento en alquiler Caseros 2 ambientes" ✅
```

### 3. Filtros de Ubicación ⚠️ IMPORTANTE

**Diferencia entre barrios1 y sellocalidades**:

```javascript
// ❌ INCORRECTO: sellocalidades busca por LOCALIDAD
const filters = {
    sellocalidades: 'Caseros'  // "Caseros" es un BARRIO, no una localidad
};
// Resultado: 0 propiedades

// ✅ CORRECTO: barrios1 busca por BARRIO
const filters = {
    barrios1: 'Caseros'  // "Caseros" es un barrio de "Tres de Febrero"
};
// Resultado: Encuentra las propiedades

// Estructura jerárquica:
// Localidad > Barrio
// Tres de Febrero > Caseros
// Morón > Haedo
```

**Uso correcto**:
```javascript
// Buscar por BARRIO (más común)
const filters = {
    barrios1: 'Caseros',      // o 'Haedo', 'Belgrano', etc.
    tipo_operacion: 'A'
};

// Buscar por LOCALIDAD (menos común)
const filters = {
    sellocalidades: 'Tres de Febrero',  // o 'Morón', 'CABA', etc.
    tipo_operacion: 'A'
};
```

### 4. Endpoint ficha.ver No Existe

**Error**: `{"code":"404","error":"el json: ficha.ver no existe"}`

**Solución**: Usar `fichas.propiedades` en su lugar

### 5. Paginación Empieza en 0

Xintel usa `page: 0` para la primera página

```javascript
// ❌ INCORRECTO
const filters = { page: 1, rppagina: 12 };  // Primera página

// ✅ CORRECTO
const filters = { page: 0, rppagina: 12 };  // Primera página
const filters = { page: 1, rppagina: 12 };  // Segunda página
```

### 6. Propiedades No Publicadas

Las propiedades deben tener `in_pub: "True"` en Xintel

### 7. Descripción con HTML

**Problema**: El campo `in_obs` contiene HTML sin formato o mal formateado

**Solución**:
```javascript
formatDescription(htmlString) {
    if (!htmlString) return '';

    // Crear elemento temporal para parsear HTML
    const temp = document.createElement('div');
    temp.innerHTML = htmlString;

    // Obtener texto limpio (elimina todas las etiquetas HTML)
    let texto = temp.textContent || temp.innerText || '';

    // Limpiar espacios extras y normalizar saltos de línea
    texto = texto
        .replace(/\n{3,}/g, '\n\n')  // Max 2 saltos de línea
        .replace(/^\s+|\s+$/g, '')    // Trim
        .trim();

    return texto;
}
```

### 8. Coordenadas en Diferentes Formatos

**Problema**: XINTEL devuelve coordenadas en múltiples formatos

```javascript
// Formato 1: String con coma
{
    in_coo: "-34.60078603425854,-58.569939136505134"
}

// Formato 2: Campos separados
{
    latitud: "-34.60078603425854",
    longitud: "-58.569939136505134"
}

// Formato 3: Sin coordenadas
{
    in_coo: null
}
```

**Solución**: Manejar todos los formatos
```javascript
function getCoordinates(property) {
    let lat, lng;

    // Intentar extraer de in_coo
    if (property.in_coo && typeof property.in_coo === 'string') {
        const coords = property.in_coo.split(',');
        lat = parseFloat(coords[0]);
        lng = parseFloat(coords[1]);
    }
    // Intentar extraer de campos separados
    else if (property.latitud && property.longitud) {
        lat = parseFloat(property.latitud);
        lng = parseFloat(property.longitud);
    }

    // Validar
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        return null;
    }

    return { lat, lng };
}
```

---

## Troubleshooting

### No se cargan propiedades

**Verificar**:
1. Credenciales correctas en `xintel-config.js`
2. Propiedades marcadas como "Publicar en Internet"
3. Consola del navegador (F12)
4. Orden de carga de scripts

### Error de CORS

**Solución**: Contactar a Xintel para activar dominio

### Imágenes no se muestran

**Verificar**:
1. URL de imagen en respuesta
2. Usar `img_princ` o `fotos[0]`
3. Placeholder para imágenes faltantes

### Precios incorrectos

**Verificar**:
- Alquiler: `in_vaa` (pesos) o `in_vau` (USD)
- Venta: `in_val` (pesos) o `in_vlu` (USD)
- Moneda: `in_mon` (D=pesos, U=USD)

---

## Contacto y Soporte

**Xintel**
- Email: soporte@xintel.com.ar
- Web: https://www.xintel.com.ar

**Documentación**
- Este documento: `XINTEL_DOCUMENTACION_COMPLETA.md`
- Documentación oficial: `DATOS/api-xintel.md`

---

# PARTE 5: GUÍA DE IMPLEMENTACIÓN RÁPIDA

## Checklist de Implementación

### ✅ Fase 1: Configuración Inicial (30 min)

- [ ] Obtener credenciales de XINTEL (empresa + apiKey)
- [ ] Crear `js/xintel-config.js` con credenciales
- [ ] Copiar clase `XintelAPI` a `js/xintel-api.js`
- [ ] Verificar orden de carga de scripts en HTML
- [ ] Probar conexión con `getFichasDestacadas()`

**Test básico**:
```javascript
// En la consola del navegador
xintelAPI.getFichasDestacadas().then(r => console.log(r));
// Debe devolver: { fichas: [...], total: N }
```

---

### ✅ Fase 2: Página Principal (1-2 horas)

- [ ] Crear `js/properties.js` con clase `PropertiesManager`
- [ ] Agregar `<div id="featuredPropertiesGrid"></div>` en HTML
- [ ] Implementar `loadFeaturedProperties()` (máximo 6 propiedades)
- [ ] Implementar `createPropertyCard()` con imagen, precio, ubicación
- [ ] Agregar función `construirTitulo()` para títulos completos
- [ ] Probar que las tarjetas se muestren correctamente

**HTML necesario**:
```html
<section class="featured-properties">
    <h2>Propiedades Destacadas</h2>
    <div id="featuredPropertiesGrid" class="properties-grid"></div>
</section>

<script src="/js/xintel-config.js"></script>
<script src="/js/xintel-api.js"></script>
<script src="/js/properties.js"></script>
```

---

### ✅ Fase 3: Búsqueda y Filtros (2-3 horas)

- [ ] Crear `propiedades.html` para listado
- [ ] Crear `js/properties-list.js` con `PropertiesListManager`
- [ ] Implementar formulario con filtros:
  - [ ] Tipo de operación (Alquiler/Venta)
  - [ ] Tipo de inmueble (Departamento/Casa/etc)
  - [ ] Ubicación con `barrios1` ⚠️ NO sellocalidades
  - [ ] Cantidad de ambientes
- [ ] Implementar paginación (página empieza en 0)
- [ ] Implementar ordenamiento local
- [ ] Agregar contador de resultados

**Filtros importantes**:
```javascript
// ✅ USAR ESTO
const filters = {
    tipo_operacion: 'A',      // A=Alquiler, V=Venta
    tipo_inmueble: 'D',       // D=Depto, C=Casa
    barrios1: 'Caseros',      // Barrio (NO localidad)
    Ambientes: '2',
    page: 0,                  // Primera página es 0
    rppagina: 12
};
```

---

### ✅ Fase 4: Página de Detalle (3-4 horas)

- [ ] Crear `ficha.html` para detalle de propiedad
- [ ] Crear `js/ficha.js` con `PropertyDetailManager`
- [ ] Implementar `getFichaPorNumero()` (endpoint `fichas.propiedades`)
- [ ] Renderizar información completa
- [ ] Implementar galería de fotos (miniatura + principal)
- [ ] Agregar modal de imagen con navegación
- [ ] Implementar mapa con Leaflet.js
- [ ] Manejar propiedades sin coordenadas
- [ ] Formatear descripción HTML

**Estructura HTML básica**:
```html
<!-- Galería -->
<div class="property-gallery">
    <div class="main-image" id="mainImage"></div>
    <div class="gallery-thumbnails" id="galleryThumbnails"></div>
</div>

<!-- Modal -->
<div id="imageModal" class="image-modal">
    <!-- Ver sección "Modal de Galería" -->
</div>

<!-- Mapa -->
<div id="propertyMapContainer"></div>

<!-- Scripts -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="/js/xintel-config.js"></script>
<script src="/js/xintel-api.js"></script>
<script src="/js/ficha.js"></script>
```

---

### ✅ Fase 5: URLs y Hosting (1 hora)

- [ ] Configurar `firebase.json` con redirects
- [ ] Agregar headers de cache
- [ ] Configurar `cleanUrls: true`
- [ ] Agregar redirect `/ficha=:id` → `/ficha?ficha=:id`
- [ ] Probar deploy: `firebase deploy`
- [ ] Verificar URLs limpias funcionan

---

### ✅ Fase 6: Optimizaciones y Ajustes (2-3 horas)

- [ ] Agregar placeholders para imágenes faltantes
- [ ] Implementar loading states
- [ ] Agregar mensajes de error amigables
- [ ] Probar responsive en móvil
- [ ] Verificar que galería no se superpone en móvil
- [ ] Probar navegación de modal con teclado (Escape, flechas)
- [ ] Agregar validación de formularios
- [ ] Optimizar imágenes (lazy loading)

---

## Mejores Prácticas

### 🎯 Manejo de Datos

**1. Siempre normalizar la respuesta**:
```javascript
normalizeResponse(data, endpoint) {
    if (data.error) {
        return { fichas: [], total: 0, error: data.error };
    }
    // Siempre devolver el mismo formato
    return { fichas: [...], total: N };
}
```

**2. Manejar múltiples formatos de campos**:
```javascript
// Precio
const precio = property.in_ope === 'A'
    ? (property.in_vaa || property.alquiler_precio || 0)
    : (property.in_val || property.venta_precio || 0);

// Ubicación
const ubicacion = property.in_bar || property.barrio || 'Sin ubicación';

// Coordenadas
const coords = property.in_coo?.split(',') || [property.latitud, property.longitud];
```

**3. Validar antes de usar**:
```javascript
if (!precio || precio === '0') return 'Consultar';
if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;
```

---

### 🎨 UI/UX

**1. Loading states siempre visibles**:
```javascript
container.innerHTML = '<div class="loading">Cargando...</div>';
await loadData();
container.innerHTML = renderData();
```

**2. Mensajes de error amigables**:
```javascript
try {
    await loadProperties();
} catch (error) {
    console.error('Error:', error);
    showMessage('No pudimos cargar las propiedades. Por favor, inténtalo más tarde.');
}
```

**3. Placeholders para imágenes**:
```javascript
const imagen = property.img_princ || property.fotos?.[0] || '/img/placeholder.jpg';
```

**4. Responsive desde el inicio**:
```css
@media (max-width: 768px) {
    .properties-grid {
        grid-template-columns: 1fr;
    }
    .property-gallery {
        position: relative !important;
    }
}
```

---

### ⚡ Performance

**1. Lazy loading de imágenes**:
```html
<img src="imagen.jpg" loading="lazy" alt="Propiedad">
```

**2. Cache apropiado**:
- Imágenes: 1 año (immutable)
- CSS/JS: 5 minutos
- HTML: no-cache

**3. Minimizar requests**:
```javascript
// ❌ MAL: Múltiples requests
properties.forEach(p => await getDetails(p.id));

// ✅ BIEN: Un solo request con todos los datos necesarios
const response = await searchProperties({ rppagina: 12 });
```

---

### 🔒 Seguridad

**1. Sanitizar HTML de XINTEL**:
```javascript
function formatDescription(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent; // Sin HTML
}
```

**2. Validar entrada de usuario**:
```javascript
const ubicacion = formData.get('barrios1')?.trim() || '';
const ambientes = parseInt(formData.get('Ambientes')) || '';
```

**3. Headers de seguridad (firebase.json)**:
```json
{
  "key": "X-Content-Type-Options",
  "value": "nosniff"
}
```

---

### 🧪 Testing

**Checklist de pruebas**:

- [ ] Cargar página principal sin errores
- [ ] Ver 6 propiedades destacadas
- [ ] Buscar por barrio devuelve resultados
- [ ] Buscar por localidad devuelve resultados
- [ ] Filtrar por tipo de operación funciona
- [ ] Paginación avanza correctamente
- [ ] Abrir detalle de propiedad muestra todas las fotos
- [ ] Modal de imagen se abre y navega
- [ ] Mapa se muestra con coordenadas
- [ ] Placeholder aparece sin coordenadas
- [ ] Responsive funciona en móvil (320px+)
- [ ] Navegación por teclado en modal funciona
- [ ] URLs limpias funcionan después de deploy

---

## Estructura de Archivos Final

```
proyecto/
├── index.html                  # Página principal
├── propiedades.html           # Listado con filtros
├── ficha.html                 # Detalle de propiedad
├── 404.html                   # Página de error
│
├── css/
│   └── styles.css             # Estilos (incluye modal, mapa)
│
├── js/
│   ├── xintel-config.js       # Credenciales ⚠️ NO commitear
│   ├── xintel-api.js          # Cliente API
│   ├── properties.js          # Propiedades destacadas
│   ├── properties-list.js     # Listado con filtros
│   └── ficha.js               # Detalle + mapa + modal
│
├── img/
│   └── placeholder.jpg        # Imagen por defecto
│
├── firebase.json              # Config hosting
└── README.md                  # Documentación del proyecto
```

---

## Scripts de Utilidad

### Verificar Conexión a XINTEL
```javascript
async function testXintelConnection() {
    console.log('🔍 Probando conexión a XINTEL...');

    try {
        const response = await xintelAPI.getFichasDestacadas({ limit: 1 });

        if (response.fichas && response.fichas.length > 0) {
            console.log('✅ Conexión exitosa!');
            console.log('📦 Propiedad de prueba:', response.fichas[0]);
            return true;
        } else {
            console.log('⚠️ Conectado pero sin propiedades');
            return false;
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        return false;
    }
}

// Ejecutar en consola del navegador
testXintelConnection();
```

### Debug de Filtros
```javascript
async function debugFilters(filters) {
    console.log('🔍 Filtros aplicados:', filters);

    const response = await xintelAPI.searchProperties(filters);

    console.log('📊 Resultados:', {
        total: response.total,
        fichas: response.fichas.length,
        primeraFicha: response.fichas[0]
    });

    return response;
}

// Ejemplo
debugFilters({ barrios1: 'Caseros', tipo_operacion: 'A' });
```

---

## Contacto y Soporte

**Xintel**
- Email: soporte@xintel.com.ar
- Web: https://www.xintel.com.ar

**Documentación**
- Este documento: `XINTEL_DOCUMENTACION_COMPLETA.md`
- Documentación oficial: `DATOS/api-xintel.md`

---

**Última actualización**: Enero 2025
**Versión**: 3.0 (Completa y Exhaustiva)
**Proyecto**: Furne Propiedades
**Estado**: ✅ Implementado, probado y documentado

---

## 📝 Notas Finales

Este documento contiene **TODO** lo necesario para implementar una integración completa con XINTEL API:

✅ Todos los endpoints disponibles
✅ Estructura completa de datos
✅ Manejo de limitaciones conocidas
✅ Soluciones a problemas comunes
✅ Implementación de mapa interactivo
✅ Modal de galería de imágenes
✅ Configuración Firebase Hosting
✅ Filtros de búsqueda (barrios vs localidades)
✅ Construcción de títulos completos
✅ Checklist de implementación paso a paso
✅ Mejores prácticas y optimizaciones
✅ Scripts de testing y debugging

**¡Todo listo para copiar a otro proyecto!** 🚀
