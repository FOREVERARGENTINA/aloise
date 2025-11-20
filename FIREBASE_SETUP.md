# Configuración de Firebase para Aloise Propiedades

## Información del Proyecto
- **Proyecto Firebase**: frandoweb-4c2c7
- **Sitio específico**: aloisepropiedades
- **Measurement ID**: G-1X8T159RTT

## Servicios Configurados
1. **Firebase Analytics** - Para tracking de usuarios y eventos
2. **Firestore** - Base de datos para almacenar propiedades y consultas
3. **Storage** - Para almacenar imágenes de propiedades
4. **Auth** - Autenticación (deshabilitada por defecto)

## Integración en HTML

Para integrar Firebase en tu sitio, tienes **2 opciones**:

### Opción 1: Usando CDN (Recomendado para este proyecto)
Agrega estos scripts ANTES de tus scripts locales en `index.html`:

```html
<!-- Firebase App (Core) -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>

<!-- Firebase Analytics -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js"></script>

<!-- Firebase Firestore (si lo necesitas) -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<!-- Firebase Storage (si lo necesitas) -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>

<!-- Configuración de Firebase -->
<script>
  // Inicializar Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCuQXi0LS6TJ1UN2-sprZWbYliX72grg-Y",
    authDomain: "frandoweb-4c2c7.firebaseapp.com",
    projectId: "frandoweb-4c2c7",
    storageBucket: "frandoweb-4c2c7.firebasestorage.app",
    messagingSenderId: "227831202965",
    appId: "1:227831202965:web:10f9ca4f2a4f5080f7c79c",
    measurementId: "G-1X8T159RTT"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const analytics = firebase.analytics();

  // Opcional: Identificar este sitio específico
  analytics.setUserProperties({ site: 'aloisepropiedades' });
</script>

<!-- Tus scripts locales -->
<script src="/js/config.js"></script>
...
```

### Opción 2: Usando ES Modules (Más moderno)
Si prefieres usar módulos ES6, necesitarás un bundler como Vite o Webpack.

## Uso en tu código

### Tracking de eventos
```javascript
// Ejemplo: Track cuando alguien ve una propiedad
firebase.analytics().logEvent('view_property', {
  property_id: '123',
  property_type: 'departamento',
  price: 180000,
  currency: 'USD'
});

// Ejemplo: Track cuando alguien hace click en WhatsApp
firebase.analytics().logEvent('contact_whatsapp', {
  property_id: '123',
  source: 'property_detail'
});
```

### Guardar consultas en Firestore
```javascript
// Ejemplo: Guardar consulta de cliente
const db = firebase.firestore();

await db.collection('consultas').add({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  telefono: '+54 11 1234-5678',
  mensaje: 'Consulta sobre departamento en Palermo',
  propertyId: '123',
  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  site: 'aloisepropiedades'
});
```

### Subir imágenes a Storage
```javascript
// Ejemplo: Subir imagen de propiedad
const storage = firebase.storage();
const storageRef = storage.ref();
const imageRef = storageRef.child(`aloisepropiedades/properties/${propertyId}/image.jpg`);

await imageRef.put(file);
const downloadURL = await imageRef.getDownloadURL();
```

## Eventos Recomendados para Tracking

```javascript
// Home page view
analytics.logEvent('page_view', { page_title: 'Home', site: 'aloisepropiedades' });

// Búsqueda de propiedades
analytics.logEvent('search', {
  search_term: 'departamento 2 ambientes',
  filters: { operation: 'venta', location: 'Caseros' }
});

// Click en propiedad
analytics.logEvent('select_content', {
  content_type: 'property',
  item_id: '123'
});

// Compartir propiedad
analytics.logEvent('share', {
  content_type: 'property',
  item_id: '123',
  method: 'whatsapp'
});

// Contacto
analytics.logEvent('generate_lead', {
  currency: 'USD',
  value: 180000,
  property_id: '123'
});
```

## Próximos Pasos

1. ✅ Configuración de Firebase creada en `js/firebase-config.js`
2. ✅ Configuración integrada en `js/config.js`
3. ⏳ Agregar scripts de Firebase en `index.html` y `propiedades.html`
4. ⏳ Implementar tracking de eventos
5. ⏳ Configurar Firestore para guardar consultas
6. ⏳ (Opcional) Configurar Storage para imágenes

## Notas Importantes

- El archivo `js/firebase-config.js` usa ES Modules, que requiere `type="module"` en el script tag
- Para simplicidad, recomiendo usar la **Opción 1 (CDN)** que funciona sin bundler
- Todos los eventos deben incluir `site: 'aloisepropiedades'` para identificar este sitio en Analytics
- La API Key es segura para uso en cliente (está diseñada para eso)
