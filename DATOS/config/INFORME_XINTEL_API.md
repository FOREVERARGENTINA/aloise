### **Informe Técnico de Integración con API Xintel**

Este documento describe la arquitectura y el funcionamiento de la integración con la API de Xintel para la obtención y visualización de propiedades inmobiliarias.

#### **1. Resumen General de la Arquitectura**

La integración se basa en tres componentes principales:

1.  **Configuración Centralizada:** Un único archivo (`xintel-config.js`) almacena todas las credenciales y parámetros de la API.
2.  **Módulo de API Abstraído (`xintel-api.js`):** Una clase de JavaScript (`XintelAPI`) que encapsula toda la lógica para comunicarse con la API de Xintel. Se encarga de construir las peticiones, enviarlas, recibir y, muy importante, **normalizar las respuestas**, ya que la API de Xintel puede devolver datos en formatos inconsistentes.
3.  **Scripts de Vista (`properties-list.js`, `ficha.js`):** Scripts dedicados a cada página (`propiedades.html`, `ficha.html`) que utilizan el módulo de la API para obtener los datos y manipular el DOM para mostrarlos al usuario.

---

#### **2. Archivos Clave del Proyecto**

Para replicar la funcionalidad, necesitarás principalmente estos archivos:

*   `js/xintel-config.js`: **El más importante para empezar.** Contiene tus credenciales.
*   `js/xintel-api.js`: El corazón de la comunicación con Xintel.
*   `js/properties-list.js`: Controla la lógica de la página de listado de propiedades (filtros, paginación).
*   `js/ficha.js`: Controla la lógica de la página de detalle de una propiedad.
*   `propiedades.html`: La página que muestra el listado de propiedades.
*   `ficha.html`: La página que muestra el detalle de una propiedad individual.

---

#### **3. Paso a Paso: Fórmulas, Funciones y Llamadas**

##### **Paso 1: La Configuración (`js/xintel-config.js`)**

Este es el primer archivo que debes crear y modificar en tu nuevo proyecto.

```javascript
const XINTEL_CONFIG = {
    // URL base de la API
    apiUrl: 'https://xintelapi.com.ar/',

    // Credenciales (DEBES CAMBIAR ESTO)
    empresa: 'FFN', // El código de tu empresa proporcionado por Xintel
    apiKey: 'NEDJKTI9B0MGJPANBD124IUUG', // Tu API Key proporcionada por Xintel

    // URL base para las imágenes
    imageBaseUrl: 'https://xintelapi.com.ar/',

    // Parámetros por defecto para las búsquedas
    defaults: {
        resultadosPerPage: 12, // Cuántas propiedades mostrar por página
    },
    
    // Opcional: Redondeo de direcciones para privacidad
    roundAddressNumbers: true,
    roundStep: 100
};
```

**Acción Requerida:**
Crea este archivo en tu nuevo proyecto y **reemplaza los valores de `empresa` y `apiKey`** con las credenciales que Xintel te haya proporcionado para tu nueva inmobiliaria.

##### **Paso 2: El Módulo de API (`js/xintel-api.js`)**

Este archivo define la clase `XintelAPI`, que hace todo el trabajo pesado. No deberías necesitar modificarlo mucho, pero es crucial entender cómo funciona.

**Funciones Principales y Cómo se Usan:**

1.  **`request(json, params)`:**
    *   **Propósito:** Es la función interna principal que realiza TODAS las llamadas a la API.
    *   **Modo de uso:** Se le pasa el `json` (el "endpoint" de Xintel, ej: `resultados.fichas`) y un objeto `params` con los filtros.
    *   **Llamada (Ejemplo interno):**
        ```javascript
        // Dentro de la clase, así se hace una petición
        const formData = new FormData();
        formData.append('json', 'resultados.fichas');
        formData.append('inm', this.config.empresa); // Tu ID de empresa
        formData.append('apiK', this.config.apiKey); // Tu API Key
        // ...agrega más parámetros
        fetch(this.config.apiUrl, { method: 'POST', body: formData });
        ```

2.  **`normalizeResponse(data, endpoint)`:**
    *   **Propósito:** ¡Función CRÍTICA! La API de Xintel es inconsistente. A veces, las propiedades están en `data.resultado.fichas`, otras en `data.resultado.ficha`, y a veces las imágenes vienen en un array separado `data.resultado.img`. Esta función arregla todo eso y devuelve siempre un objeto con una estructura predecible: `{ fichas: [], total: 0 }`.
    *   **Gracias a esta función, el resto del código no tiene que preocuparse por las inconsistencias de la API.**

3.  **`searchProperties(filters)`:**
    *   **Propósito:** Busca propiedades aplicando filtros. Es la función que se usa en la página de listado.
    *   **Endpoint Xintel:** `resultados.fichas`
    *   **Parámetros (`filters`):** Acepta un objeto con claves como `tipo_operacion`, `tipo_inmueble`, `barrios1` (para la ubicación), `page` (para paginación), etc.
    *   **Llamada (Ejemplo desde `properties-list.js`):**
        ```javascript
        // Llama a la API para buscar propiedades en la página 0 con un filtro
        const response = await xintelAPI.searchProperties({
            tipo_operacion: 'Venta',
            page: 0,
            rppagina: 12
        });
        // response.fichas contendrá las propiedades
        ```

4.  **`getFichaPorNumero(fichaNumero)`:**
    *   **Propósito:** Obtiene todos los detalles de UNA SOLA propiedad por su ID (ej: "FFN123"). Se usa en la página `ficha.html`.
    *   **Endpoint Xintel:** Intenta primero con `fichas.propiedades` (que trae más datos y todas las fotos) y si falla, tiene un *fallback* que busca en la lista general.
    *   **Parámetros:** El ID de la propiedad.
    *   **Llamada (Ejemplo desde `ficha.js`):**
        ```javascript
        const propertyId = "FFN123";
        const response = await xintelAPI.getFichaPorNumero(propertyId);
        // response.fichas[0] contendrá los datos de la propiedad
        ```

##### **Paso 3: Implementación en el Frontend**

**A. Listado de Propiedades (`propiedades.html` y `js/properties-list.js`)**

1.  **HTML (`propiedades.html`):**
    *   Debe contener un formulario con los `select` e `input` para los filtros. Los `name` de estos inputs deben coincidir con los parámetros de la API de Xintel (ej: `name="tipo_operacion"`).
    *   Debe tener un contenedor vacío donde se inyectarán las propiedades, ej: `<div id="propertiesGrid"></div>`.
    *   Debe tener un contenedor para la paginación, ej: `<div id="pagination"></div>`.

2.  **JavaScript (`js/properties-list.js`):**
    *   **Inicialización:** Cuando la página carga, `propertiesListManager.init()` se ejecuta.
    *   **Carga de Propiedades:** Llama a `loadProperties()`, que a su vez ejecuta `xintelAPI.searchProperties(filters)`.
    *   **Renderizado:** Una vez que recibe los datos, itera sobre `response.fichas` y por cada propiedad, crea una "tarjeta" de propiedad (con su foto, precio, título) y la añade al `propertiesGrid`.
    *   **Paginación:** Calcula el total de páginas y genera los botones de paginación. Cada botón llama a `goToPage(numeroDePagina)`.
    *   **Filtros:** Cuando el usuario envía el formulario de filtros, se recolectan los valores, se actualizan los filtros y se vuelve a llamar a `loadProperties()`.

**B. Detalle de Propiedad (`ficha.html` y `js/ficha.js`)**

1.  **HTML (`ficha.html`):**
    *   Debe tener contenedores vacíos para los detalles: título, precio, galería de fotos, descripción, características, mapa, etc. Por ejemplo: `<h1 id="propertyTitle"></h1>`.

2.  **JavaScript (`js/ficha.js`):**
    *   **Obtener ID:** Lo primero que hace es leer el ID de la propiedad de la URL (ej: `ficha.html?id=123`).
    *   **Llamada a la API:** Llama a `xintelAPI.getFichaPorNumero(id)`.
    *   **Renderizado:** Cuando recibe los datos de la propiedad, rellena todos los elementos del HTML (`propertyTitle`, `propertyPrice`, etc.) con la información obtenida. La galería de fotos, las características y otros detalles se construyen dinámicamente.
    *   **Mapa:** Extrae las coordenadas (`in_coo`) de los datos de la propiedad y, si existen, inicializa un mapa de Leaflet en la ubicación.

---

#### **4. Guía Rápida de Replicación (Checklist)**

Para implementar esto en tu nuevo proyecto, sigue estos pasos:

1.  **Copiar Archivos:** Copia los siguientes archivos a tu nuevo proyecto, manteniendo la misma estructura de carpetas (`js/`):
    *   `js/xintel-config.js`
    *   `js/xintel-api.js`
    *   `js/properties-list.js`
    *   `js/ficha.js`
    *   `propiedades.html`
    *   `ficha.html`

2.  **Configurar Credenciales:** Abre `js/xintel-config.js` y **actualiza `empresa` y `apiKey`** con las credenciales de tu nueva inmobiliaria.

3.  **Incluir Scripts en HTML:** Asegúrate de que tus archivos HTML (`propiedades.html` y `ficha.html`) incluyan los scripts en el orden correcto, justo antes de cerrar la etiqueta `</body>`:

    *   **En `propiedades.html`:**
        ```html
        <script src="/js/xintel-config.js"></script>
        <script src="/js/xintel-api.js"></script>
        <script src="/js/properties.js"></script> <!-- Probablemente contiene la lógica para crear una tarjeta de propiedad -->
        <script src="/js/properties-list.js"></script>
        ```
    *   **En `ficha.html`:**
        ```html
        <script src="/js/xintel-config.js"></script>
        <script src="/js/xintel-api.js"></script>
        <script src="/js/ficha.js"></script>
        ```

4.  **Adaptar HTML y CSS:** Es posible que necesites ajustar las clases de CSS o los IDs de los elementos en los archivos HTML y en los scripts de JavaScript para que coincidan con el diseño de tu nuevo sitio, pero la lógica de la API no debería cambiar.

5.  **Revisar Dependencias:** El archivo `ficha.html` usa la librería de mapas **Leaflet**. Asegúrate de incluir su CSS y JS si quieres que el mapa de ubicación funcione.
    ```html
    <!-- En el <head> -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <!-- Antes de tus scripts, en el <body> -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    ```

Siguiendo estos pasos, tendrás una réplica funcional de la integración con Xintel en tu nuevo proyecto. La clave está en la correcta configuración inicial y en la reutilización del módulo `xintel-api.js`, que ya soluciona los problemas más comunes de la API.
