# Informe de Integración Xintel para Proyecto Inmobiliario

## 1. ¿Qué es Xintel?
Xintel es una plataforma que gestiona propiedades inmobiliarias y expone una API para consultar, mostrar y filtrar propiedades en tu web.

---

## 2. Requisitos previos
- Tener usuario y acceso a Xintel.
- Solicitar la API Key a Xintel (contacto soporte).
- Obtener la URL base de la API (ejemplo: `https://xintelapi.com.ar/`).

---

## 3. Estructura básica de integración

### a) Configuración
```js
const XINTEL_CONFIG = {
    apiUrl: 'https://xintelapi.com.ar/',
    empresa: 'TU_CODIGO_EMPRESA',
    apiKey: 'TU_API_KEY',
    imageBaseUrl: 'https://xintelapi.com.ar/',
    defaults: {
        resultadosPerPage: 10,
        atributos: '' // campos específicos si querés filtrar
    }
};
```

### b) Función para hacer llamadas a la API
```js
async function xintelRequest(endpoint, params = {}) {
    const url = XINTEL_CONFIG.apiUrl;
    const body = {
        json: endpoint,
        apiK: XINTEL_CONFIG.apiKey,
        inm: XINTEL_CONFIG.empresa,
        ...params
    };
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}
```

---

## 4. Llamadas principales a la API

### a) Propiedades destacadas
```js
// Devuelve propiedades marcadas como destacadas en Xintel
const destacadas = await xintelRequest('fichas.destacadas', { limit: 6 });
```

### b) Últimas propiedades
```js
const ultimas = await xintelRequest('fichas.ultimas', { limit: 10 });
```

### c) Buscar propiedades con filtros
```js
const filtros = {
    tipo_operacion: 'Venta', // o 'Alquiler'
    tipo_inmueble: 'Casa',   // o 'Departamento', etc.
    barrios1: 'Caseros',
    valor_minimo: 50000,
    valor_maximo: 200000
};
const resultados = await xintelRequest('resultados.fichas', filtros);
```

### d) Detalle de una propiedad
```js
const detalle = await xintelRequest('fichas.propiedades', { id: 'FFN123' });
```

---

## 5. Campos útiles que devuelve la API
- `in_cal`: Calle
- `in_nro`: Número
- `in_bar`: Barrio
- `in_loc`: Localidad
- `in_vaa` / `in_val`: Precio
- `in_amb`: Ambientes
- `img_princ` / `fotos`: Imágenes
- `titulo`: Título
- `in_obs`: Descripción

---

## 6. Ejemplo de renderizado de propiedades
```js
function renderPropiedad(prop) {
    return `
        <div>
            <img src="${prop.img_princ}" alt="${prop.titulo}">
            <h3>${prop.titulo}</h3>
            <p>${prop.in_cal} ${prop.in_nro}, ${prop.in_bar}, ${prop.in_loc}</p>
            <p>Precio: ${prop.in_val || prop.in_vaa}</p>
            <p>Ambientes: ${prop.in_amb}</p>
        </div>
    `;
}
```

---

## 7. Fórmulas y helpers útiles

### a) Redondear número de dirección
```js
function roundDownAddressNumber(nro, step = 100) {
    const parsed = parseInt(String(nro).replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsed)) return String(nro);
    if (parsed < step) return String(parsed);
    return String(Math.floor(parsed / step) * step);
}
```

### b) Formatear precio
```js
function formatPrice(num, moneda = 'ARS') {
    return (moneda === 'ARS' ? '$' : 'U$S') + ' ' + new Intl.NumberFormat('es-AR').format(num);
}
```

---

## 8. Consideraciones
- Las propiedades destacadas se marcan desde el panel de Xintel, no desde el código.
- La API puede devolver imágenes, pero a veces hay que validar el campo (`img_princ`, `fotos`).
- Los filtros dependen de los campos que Xintel expone.
- El endpoint y los parámetros pueden variar según la versión de la API.

---

## 9. Seguridad y buenas prácticas
- No exponer la API Key en el frontend si el proyecto es público.
- Usar HTTPS siempre.
- Validar los datos antes de mostrarlos (por ejemplo, imágenes y precios).

---

## 10. Documentación y soporte
- Consultar la documentación oficial de Xintel para endpoints y parámetros actualizados.
- Contactar soporte Xintel para dudas sobre campos o configuración.

---

¿Necesitás ejemplos para backend (Node.js, PHP) o solo frontend? ¿Querés que te arme un archivo base para tu nuevo proyecto?