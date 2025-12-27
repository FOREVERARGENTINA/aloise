# INFORME COMPLETO: INTEGRACIÓN XINTEL API
## Guía de Replicación para Proyectos Inmobiliarios

---

## 📋 TABLA DE CONTENIDOS

1. [Credenciales y Configuración](#credenciales-y-configuración)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Configuración Inicial](#configuración-inicial)
4. [Cliente API (XintelAPI)](#cliente-api-xintelapi)
5. [Endpoints y Métodos](#endpoints-y-métodos)
6. [Estructura de Datos](#estructura-de-datos)
7. [Implementación en Vistas](#implementación-en-vistas)
8. [Funciones Auxiliares](#funciones-auxiliares)
9. [Casos de Uso Completos](#casos-de-uso-completos)
10. [Troubleshooting](#troubleshooting)

---

## CREDENCIALES Y CONFIGURACIÓN

### Paso 1: Obtener Credenciales de Xintel

**Contactar a Xintel**:
- Email: soporte@xintel.com.ar
- Solicitar: Código de empresa, API Key, activación de dominio

**Ejemplo de credenciales** (Furne Propiedades):
```
Empresa: FFN
API Key: NEDJKTI9B0MGJPANBD124IUUG
URL API: https://xintelapi.com.ar/
```

### Paso 2: Crear archivo xintel-config.js

```javascript
/**
 * Configuración de la API de Xintel
 * Archivo: js/xintel-config.js
 */

const XINTEL_CONFIG = {
    // URL base de la API
    apiUrl: 'https://xintelapi.com.ar/',

    // Credenciales (REEMPLAZAR CON TUS DATOS)
    empresa: 'TU_CODIGO_EMPRESA',
    apiKey: 'TU_API_KEY',

    // Configuración de imágenes
    imageBaseUrl: 'https://xintelapi.com.ar/',

    // Parámetros por defecto
    defaults: {
        resultadosPerPage: 10,
        atributos: ''
    }
};
```

---

## ESTRUCTURA DE ARCHIVOS

### Estructura Mínima Requerida

```
proyecto-inmobiliario/
├── index.html                    # Página principal
├── propiedades.html             # Listado de propiedades
├── ficha.html                   # Detalle de propiedad
├── css/
│   └── styles.css               # Estilos
├── js/
│   ├── xintel-config.js         # Configuración (CRÍTICO)
│   ├── xintel-api.js            # Cliente API (CRÍTICO)
│   ├── properties.js            # Lógica de propiedades
│   ├── properties-list.js       # Lógica de listado
│   ├── ficha.js                 # Lógica de detalle
│   └── main.js                  # Script principal
└── img/
    └── placeholder-property.jpg # Imagen por defecto
```

### Orden de Carga en HTML

**IMPORTANTE**: Cargar en este orden exacto:

```html
<!-- 1. Configuración (PRIMERO) -->
<script src="/js/xintel-config.js"></script>

<!-- 2. Cliente API (SEGUNDO) -->
<script src="/js/xintel-api.js"></script>

<!-- 3. Lógica de propiedades (TERCERO) -->
<script src="/js/properties.js"></script>
<script src="/js/properties-list.js"></script>
<script src="/js/ficha.js"></script>

<!-- 4. Script principal (ÚLTIMO) -->
<script src="/js/main.js"></script>
```

---

## CONFIGURACIÓN INICIAL

### Paso 1: Crear xintel-config.js

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

### Paso 2: Verificar Credenciales

```javascript
// En consola del navegador (F12)
console.log(XINTEL_CONFIG);
// Debe mostrar tu configuración sin errores
```

---

## CLIENTE API (XintelAPI)

### Clase Completa: xintel-api.js

```javascript
/**
 * Cliente de API de Xintel
 * Archivo: js/xintel-api.js
 * 
 * Maneja todas las comunicaciones con la API de Xintel
 * Método: POST con FormData
 * Autenticación: Parámetros 'inm' (empresa) y 'apiK' (API Key)
 */

class XintelAPI {
    constructor() {
        this.config = XINTEL_CONFIG;
    }

    /**
     * Realiza una petición a la API de Xintel
     * @param {string} json - Nombre del endpoint JSON
     * @param {Object} params - Parámetros adicionales
     * @returns {Promise} - Respuesta normalizada
     */
    async request(json, params = {}) {
        try {
            // Preparar FormData
            const formData = new FormData();
            formData.append('json', json);
            formData.append('inm', this.config.empresa);
            formData.append('apiK', this.config.apiKey);

            // Agregar parámetros
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                    formData.append(key, params[key]);
                }
            });

            // Realizar petición
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.normalizeResponse(data, json);

        } catch (error) {
            console.error('Error en petición a Xintel:', error);
            throw error;
        }
    }

    /**
     * Normaliza respuestas de Xintel para estructura consistente
     * @param {Object} data - Respuesta de la API
     * @param {string} endpoint - Endpoint solicitado
     * @returns {Object} - Respuesta normalizada
     */
    normalizeResponse(data, endpoint) {
        // Si hay error explícito
        if (data.error) {
            return { fichas: [], total: 0, error: data.error };
        }

        // Si hay fichas en resultado.fichas
        if (data.resultado && Array.isArray(data.resultado.fichas)) {
            const fichas = data.resultado.fichas.map((ficha, index) => {
                // Mapear imágenes de resultado.img
                if (data.resultado.img && data.resultado.img[index]) {
                    const imagenesArray = data.resultado.img[index];
                    ficha.fotos = Array.isArray(imagenesArray) ? imagenesArray : [imagenesArray];
                    ficha.img_princ = ficha.fotos[0];
                }
                return ficha;
            });
            
            return { fichas, total: fichas.length, resultado: data.resultado };
        }

        // Si hay fichas como array
        if (Array.isArray(data.fichas)) {
            return data;
        }

        return data;
    }

    /**
     * Obtiene propiedades destacadas
     * @returns {Promise} - Propiedades destacadas
     */
    async getFichasDestacadas(options = {}) {
        return await this.request('fichas.destacadas', options);
    }

    /**
     * Obtiene últimas propiedades
     * @returns {Promise} - Últimas propiedades
     */
    async getFichasUltimas(options = {}) {
        return await this.request('fichas.ultimas', options);
    }

    /**
     * Busca propiedades con filtros
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise} - Resultados de búsqueda
     */
    async searchProperties(filters = {}) {
        const params = {
            tipo_operacion: filters.tipo_operacion || '',
            tipo_inmueble: filters.tipo_inmueble || '',
            sellocalidades: filters.sellocalidades || '',
            barrios1: filters.barrios1 || '',
            Ambientes: filters.Ambientes || '',
            moneda: filters.moneda || '',
            valor_minimo: filters.valor_minimo || '',
            valor_maximo: filters.valor_maximo || '',
            page: filters.page !== undefined ? filters.page : 0,
            rppagina: filters.rppagina || this.config.defaults.resultadosPerPage
        };

        return await this.request('resultados.fichas', params);
    }

    /**
     * Obtiene una propiedad individual con todas las fotos
     * @param {string} fichaNumero - Número de ficha
     * @returns {Promise} - Datos de la propiedad
     */
    async getFichaPorNumero(fichaNumero) {
        const numero = String(fichaNumero).replace(/^FFN/i, '');

        try {
            // Intentar con fichas.propiedades (devuelve todas las fotos)
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

        // Fallback: buscar en resultados.fichas
        const response = await this.searchProperties({ rppagina: 100 });

        if (!response || !response.fichas) {
            return { fichas: [], total: 0 };
        }

        const ficha = response.fichas.find(f =>
            String(f?.in_num) === numero ||
            String(f?.in_fic) === numero
        );

        return ficha ? { fichas: [ficha], total: 1 } : { fichas: [], total: 0 };
    }

    /**
     * Formatea precio con símbolo de moneda
     * @param {number} precio - Precio
     * @param {string} moneda - Código de moneda
     * @returns {string} - Precio formateado
     */
    formatPrice(precio, moneda = 'ARS') {
        if (!precio || precio === '0') return 'Consultar';

        const simbolos = { 'USD': 'US$', 'ARS': '$', 'EUR': '€' };
        const simbolo = simbolos[moneda] || '$';
        const precioFormateado = new Intl.NumberFormat('es-AR').format(precio);

        return `${simbolo} ${precioFormateado}`;
    }
}

// Crear instancia global
const xintelAPI = new XintelAPI();
```

---

## ENDPOINTS Y MÉTODOS

### Tabla de Endpoints Disponibles

| Endpoint | Método | Parámetros | Devuelve | Uso |
|----------|--------|-----------|----------|-----|
| `fichas.destacadas` | GET | atributos, codsuc, order | Propiedades destacadas | Home |
| `fichas.ultimas` | GET | atributos, limit | Últimas propiedades | Home |
| `resultados.fichas` | GET | tipo_operacion, tipo_inmueble, barrios1, Ambientes, page, rppagina | Búsqueda con filtros | Listado |
| `fichas.propiedades` | GET | id | Propiedad individual + TODAS las fotos | Detalle |
| `datos.select.buscador` | GET | - | Localidades, barrios, tipos | Filtros |

### Llamadas a la API

#### 1. Propiedades Destacadas

```javascript
// Obtener propiedades destacadas
const response = await xintelAPI.getFichasDestacadas();

// Resultado
{
    fichas: [
        {
            in_num: "1",
            titulo: "Departamento en alquiler",
            in_vaa: "500000",
            in_bar: "Caseros",
            img_princ: "https://...",
            fotos: ["https://...", "https://..."]
        },
        // ... más propiedades
    ],
    total: 6
}
```

#### 2. Búsqueda con Filtros

```javascript
// Buscar propiedades
const response = await xintelAPI.searchProperties({
    tipo_operacion: 'A',        // A=Alquiler, V=Venta
    tipo_inmueble: 'D',         // D=Depto, C=Casa, P=PH
    barrios1: 'Caseros',
    Ambientes: '2',
    page: 0,                    // Página (empieza en 0)
    rppagina: 12                // Resultados por página
});

// Resultado
{
    fichas: [...],
    total: 150
}
```

#### 3. Propiedad Individual (CON TODAS LAS FOTOS)

```javascript
// Obtener propiedad con todas las fotos
const response = await xintelAPI.getFichaPorNumero('2');

// Resultado
{
    fichas: [
        {
            in_num: "2",
            titulo: "Departamento 2 ambientes",
            fotos: [
                "https://cdn-images.xintelweb.com/upload/a5a7a25bf2823f7912d6450d2dd2be29.jpg",
                "https://cdn-images.xintelweb.com/upload/50d8e7eb4eade745710bdf1f13621544.jpg",
                "https://cdn-images.xintelweb.com/upload/c073b1cf08019902e4c8007644468546.jpg"
            ],
            img_princ: "https://cdn-images.xintelweb.com/upload/a5a7a25bf2823f7912d6450d2dd2be29.jpg"
        }
    ],
    total: 1
}
```

---

## ESTRUCTURA DE DATOS

### Campos Principales de una Ficha

```javascript
{
    // Identificación
    "in_num": "2",              // Número de ficha
    "in_fic": "2",              // ID de ficha
    "in_suc": "FFN",            // Sucursal
    
    // Operación y Tipo
    "in_ope": "A",              // A=Alquiler, V=Venta, T=Temporal
    "in_tip": "D",              // D=Depto, C=Casa, P=PH, T=Terreno, L=Local, O=Oficina
    
    // Precios
    "in_vaa": "500000",         // Valor alquiler (pesos)
    "in_val": "0",              // Valor venta (pesos)
    "in_vau": "0",              // Valor alquiler (USD)
    "in_vlu": "0",              // Valor venta (USD)
    "in_mon": "D",              // D=Pesos, U=USD
    
    // Ubicación
    "in_loc": "Tres de Febrero",// Localidad
    "in_bar": "Caseros",        // Barrio
    "in_cal": "Wenceslao de tata", // Calle
    "in_nro": "5181",           // Número
    "in_pis": "2",              // Piso
    "in_dto": "D",              // Departamento
    "in_coo": "-34.60,-58.56",  // Coordenadas (lat,lng)
    
    // Características
    "in_amb": "2",              // Ambientes
    "ti_dor": "1",              // Dormitorios
    "in_bao": "1",              // Baños
    "in_gar": "0",              // Cocheras
    
    // Superficies
    "in_scu": "41",             // Superficie cubierta (m2)
    "in_sto": "45",             // Superficie total (m2)
    
    // Imágenes
    "img_princ": "https://...", // Imagen principal
    "fotos": ["url1", "url2"],  // Array de todas las fotos
    
    // Textos
    "titulo": "Departamento...",
    "in_obs": "Descripción..."
}
```

### Mapeo de Códigos

**Operación (in_ope)**:
- `A` = Alquiler
- `V` = Venta
- `T` = Alquiler Temporal

**Tipo (in_tip)**:
- `D` = Departamento
- `C` = Casa
- `P` = PH
- `T` = Terreno
- `L` = Local
- `O` = Oficina
- `G` = Cochera

**Moneda (in_mon)**:
- `D` = Pesos (ARS)
- `U` = Dólares (USD)

---

## IMPLEMENTACIÓN EN VISTAS

### Vista: Listado de Propiedades

```javascript
/**
 * Archivo: js/properties-list.js
 * Maneja el listado de propiedades con filtros y paginación
 */

class PropertiesListManager {
    constructor() {
        this.api = xintelAPI;
        this.currentPage = 0;
        this.currentFilters = {};
    }

    async loadProperties() {
        try {
            const filters = {
                ...this.currentFilters,
                page: this.currentPage,
                rppagina: 12
            };

            const response = await this.api.searchProperties(filters);

            if (!response || !response.fichas || response.fichas.length === 0) {
                document.getElementById('propertiesGrid').innerHTML = 
                    '<p>No se encontraron propiedades</p>';
                return;
            }

            this.renderProperties(response.fichas);
            this.updatePagination(response.total);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    renderProperties(properties) {
        const container = document.getElementById('propertiesGrid');
        container.innerHTML = properties.map(prop => this.createCard(prop)).join('');
    }

    createCard(property) {
        const imagen = property.img_princ || '/img/placeholder-property.jpg';
        const precio = property.in_ope === 'A' ? property.in_vaa : property.in_val;
        const moneda = property.in_mon === 'U' ? 'US$' : '$';
        const num = String(property.in_amb).match(/^(\d+)/)?.[1] || '';

        return `
            <article class="property-card">
                <a href="/ficha?ficha=FFN${property.in_num}">
                    <img src="${imagen}" alt="${property.titulo}" loading="lazy">
                    <h3>${property.titulo}</h3>
                    <p>${property.in_bar}, ${property.in_loc}</p>
                    <p class="price">${moneda} ${new Intl.NumberFormat('es-AR').format(precio)}</p>
                    <div class="features">
                        <span>${num} amb.</span>
                        <span>${property.in_sto} m²</span>
                    </div>
                </a>
            </article>
        `;
    }

    async goToPage(page) {
        this.currentPage = page;
        await this.loadProperties();
    }
}

const propertiesListManager = new PropertiesListManager();

document.addEventListener('DOMContentLoaded', () => {
    propertiesListManager.loadProperties();
});
```

### Vista: Detalle de Propiedad

```javascript
/**
 * Archivo: js/ficha.js
 * Maneja la página de detalle de propiedad
 */

class PropertyDetailManager {
    constructor() {
        this.api = xintelAPI;
        this.property = null;
    }

    async init() {
        const id = this.getIdFromUrl();
        if (!id) return;

        const response = await this.api.getFichaPorNumero(id);
        if (!response.fichas || response.fichas.length === 0) return;

        this.property = response.fichas[0];
        this.render();
    }

    getIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('ficha')?.replace(/^FFN/i, '');
    }

    render() {
        const container = document.getElementById('propertyDetail');
        const images = this.property.fotos || [];
        const num_amb = String(this.property.in_amb).match(/^(\d+)/)?.[1] || '';
        const num_dor = String(this.property.ti_dor).match(/^(\d+)/)?.[1] || '';

        container.innerHTML = `
            <div class="gallery">
                <img src="${images[0] || '/img/placeholder-property.jpg'}" id="mainImage">
                ${images.length > 1 ? `
                    <div class="thumbnails">
                        ${images.map((img, i) => `
                            <img src="${img}" onclick="propertyDetail.changeImage('${img}', ${i})">
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <div class="info">
                <h1>${this.property.titulo}</h1>
                <p class="location">${this.property.in_bar}, ${this.property.in_loc}</p>
                <p class="price">${this.api.formatPrice(
                    this.property.in_ope === 'A' ? this.property.in_vaa : this.property.in_val,
                    this.property.in_mon === 'U' ? 'USD' : 'ARS'
                )}</p>

                <div class="features">
                    ${num_amb ? `<span>${num_amb} ambiente${num_amb === '1' ? '' : 's'}</span>` : ''}
                    ${num_dor ? `<span>${num_dor} dormitorio${num_dor === '1' ? '' : 's'}</span>` : ''}
                    ${this.property.in_sto ? `<span>${this.property.in_sto} m²</span>` : ''}
                </div>

                <p class="description">${this.property.in_obs || ''}</p>
            </div>
        `;
    }

    changeImage(url, index) {
        document.getElementById('mainImage').src = url;
    }
}

const propertyDetail = new PropertyDetailManager();
document.addEventListener('DOMContentLoaded', () => propertyDetail.init());
```

---

## FUNCIONES AUXILIARES

### Funciones de Formateo

```javascript
/**
 * Archivo: js/utils.js
 * Funciones auxiliares reutilizables
 */

// Extraer número de campo con formato (ej: "2A" → "2")
function extractNumber(value) {
    const str = String(value);
    const match = str.match(/^(\d+)/);
    return match ? match[1] : str.replace(/[^0-9]/g, '');
}

// Singular/Plural
function pluralize(num, singular, plural) {
    return num === '1' ? singular : plural;
}

// Formatear precio
function formatPrice(price, currency = 'ARS') {
    if (!price || price === '0') return 'Consultar';
    const symbols = { 'USD': 'US$', 'ARS': '$' };
    return `${symbols[currency]} ${new Intl.NumberFormat('es-AR').format(price)}`;
}

// Obtener tipo de propiedad
function getPropertyType(code) {
    const types = {
        'D': 'Departamento',
        'C': 'Casa',
        'P': 'PH',
        'T': 'Terreno',
        'L': 'Local',
        'O': 'Oficina',
        'G': 'Cochera'
    };
    return types[code] || 'Propiedad';
}

// Obtener operación
function getOperation(code) {
    const ops = { 'A': 'Alquiler', 'V': 'Venta', 'T': 'Temporal' };
    return ops[code] || '';
}
```

---

## CASOS DE USO COMPLETOS

### Caso 1: Mostrar Propiedades Destacadas en Home

```javascript
async function loadHome() {
    const response = await xintelAPI.getFichasDestacadas();
    
    const html = response.fichas.slice(0, 6).map(prop => `
        <div class="property">
            <img src="${prop.img_princ}">
            <h3>${prop.titulo}</h3>
            <p>${formatPrice(prop.in_ope === 'A' ? prop.in_vaa : prop.in_val)}</p>
            <a href="/ficha?ficha=FFN${prop.in_num}">Ver detalles</a>
        </div>
    `).join('');
    
    document.getElementById('featured').innerHTML = html;
}
```

### Caso 2: Búsqueda Avanzada

```javascript
async function searchProperties() {
    const filters = {
        tipo_operacion: document.getElementById('operation').value,
        tipo_inmueble: document.getElementById('type').value,
        barrios1: document.getElementById('location').value,
        Ambientes: document.getElementById('rooms').value,
        page: 0,
        rppagina: 12
    };

    const response = await xintelAPI.searchProperties(filters);
    displayResults(response.fichas);
}
```

### Caso 3: Galería de Fotos en Detalle

```javascript
async function showPropertyDetail(id) {
    const response = await xintelAPI.getFichaPorNumero(id);
    const property = response.fichas[0];
    
    // Mostrar todas las fotos
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = property.fotos.map((img, i) => `
        <img src="${img}" onclick="showImage(${i})">
    `).join('');
}
```

---

## TROUBLESHOOTING

### Problema: No se cargan propiedades

**Verificar**:
1. Credenciales correctas en `xintel-config.js`
2. Orden de carga de scripts en HTML
3. Consola del navegador (F12) para errores
4. Propiedades publicadas en Xintel

### Problema: Solo 1 foto en listado

**Solución**: Usar `getFichaPorNumero()` en detalle (devuelve todas las fotos)

### Problema: Cache del navegador

**Solución**: 
- Hard refresh: `Ctrl+Shift+R`
- Modo incógnito
- Limpiar cache de Cloudflare

### Problema: Paginación incorrecta

**Recordar**: Xintel usa `page: 0` para primera página (0-based)

---

## CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear `xintel-config.js` con credenciales
- [ ] Crear `xintel-api.js` con clase XintelAPI
- [ ] Crear `properties.js` para lógica de propiedades
- [ ] Crear `properties-list.js` para listado
- [ ] Crear `ficha.js` para detalle
- [ ] Cargar scripts en orden correcto en HTML
- [ ] Probar en navegador (F12 para errores)
- [ ] Verificar propiedades publicadas en Xintel
- [ ] Implementar filtros
- [ ] Implementar paginación
- [ ] Implementar galería de fotos
- [ ] Probar en móvil
- [ ] Deploy a producción

---

**Última actualización**: Enero 2025  
**Versión**: 1.0  
**Basado en**: Proyecto Furne Propiedades
