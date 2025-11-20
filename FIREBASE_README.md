# Firebase - Aloise Propiedades

## Resumen de la integración

Firebase ha sido completamente integrado en el sitio web de Aloise Propiedades.

### Información del proyecto
- **Proyecto Firebase**: `frandoweb-4c2c7`
- **Sitio específico**: `aloisepropiedades`
- **Measurement ID (Analytics)**: `G-1X8T159RTT`

---

## Archivos creados/modificados

### ✅ Archivos creados:
1. **`js/firebase-init.js`** - Inicialización de Firebase y funciones helper
2. **`js/firebase-config.js`** - Configuración con ES Modules (alternativa)
3. **`js/firebase-examples.js`** - Ejemplos de uso (referencia)
4. **`FIREBASE_SETUP.md`** - Documentación detallada
5. **`FIREBASE_README.md`** - Este archivo

### ✅ Archivos modificados:
1. **`index.html`** - Scripts de Firebase agregados
2. **`propiedades.html`** - Scripts de Firebase agregados
3. **`js/config.js`** - Configuración de Firebase incluida

---

## Funciones disponibles globalmente

Una vez que el sitio cargue, tendrás acceso a estas funciones en cualquier parte del código:

### 1. `trackPropertyView(property)`
Trackea cuando alguien ve una propiedad.

```javascript
trackPropertyView({
  id: '123',
  title: 'Departamento en Palermo',
  property_type: 'departamento',
  price: 180000,
  currency: 'USD',
  location: 'Palermo, CABA'
});
```

### 2. `trackWhatsAppClick(propertyId, source)`
Trackea clicks en el botón de WhatsApp.

```javascript
// Desde una propiedad específica
trackWhatsAppClick('123', 'property_detail');

// Desde el botón flotante
trackWhatsAppClick(null, 'floating_button');
```

### 3. `trackSearch(searchTerm, filters)`
Trackea búsquedas de propiedades.

```javascript
trackSearch('departamento 2 ambientes', {
  operation_type: 'venta',
  property_type: 'departamento',
  location: 'Caseros'
});
```

### 4. `saveConsulta(consultaData)`
Guarda consultas de clientes en Firestore.

```javascript
const result = await saveConsulta({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  telefono: '+54 11 1234-5678',
  mensaje: 'Me interesa este departamento',
  propertyId: '123',
  url: window.location.href
});

if (result.success) {
  console.log('Consulta guardada:', result.id);
}
```

### 5. `trackPropertyEvent(eventName, data)`
Trackea cualquier evento personalizado.

```javascript
trackPropertyEvent('share', {
  content_type: 'property',
  item_id: '123',
  method: 'facebook'
});
```

---

## Servicios de Firebase disponibles

### Firebase Analytics
```javascript
window.firebaseAnalytics.logEvent('custom_event', {
  parameter1: 'value1',
  site: 'aloisepropiedades'
});
```

### Firestore Database
```javascript
// Leer datos
const snapshot = await window.firebaseDb
  .collection('consultas')
  .where('site', '==', 'aloisepropiedades')
  .get();

// Escribir datos
await window.firebaseDb.collection('consultas').add({
  nombre: 'Juan',
  site: 'aloisepropiedades',
  timestamp: firebase.firestore.FieldValue.serverTimestamp()
});
```

### Storage
```javascript
// Subir archivo
const storageRef = window.firebaseStorage.ref();
const fileRef = storageRef.child('aloisepropiedades/images/foto.jpg');
await fileRef.put(file);

// Obtener URL
const url = await fileRef.getDownloadURL();
```

---

## Próximos pasos recomendados

### 1. Agregar tracking a los botones de WhatsApp existentes

Buscar todos los enlaces de WhatsApp en tu sitio y agregar el evento:

```javascript
document.querySelectorAll('a[href*="whatsapp"]').forEach(btn => {
  btn.addEventListener('click', function() {
    const propertyId = this.dataset.propertyId || null;
    trackWhatsAppClick(propertyId, 'whatsapp_link');
  });
});
```

### 2. Crear formulario de contacto con Firestore

Si tienes un formulario de contacto, integrarlo con `saveConsulta()`:

```html
<form id="contactForm">
  <input type="text" name="nombre" required>
  <input type="email" name="email" required>
  <input type="tel" name="telefono" required>
  <textarea name="mensaje" required></textarea>
  <button type="submit">Enviar</button>
</form>

<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const result = await saveConsulta({
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    mensaje: formData.get('mensaje'),
    propertyId: null, // o el ID si es desde una propiedad específica
    url: window.location.href
  });

  if (result.success) {
    alert('¡Gracias! Te contactaremos pronto.');
    e.target.reset();
  }
});
</script>
```

### 3. Ver los datos en Firebase Console

1. Ve a https://console.firebase.google.com
2. Selecciona el proyecto `frandoweb-4c2c7`
3. En **Analytics** verás los eventos y usuarios
4. En **Firestore Database** verás las consultas guardadas
5. En **Storage** verás los archivos subidos

### 4. Configurar reglas de seguridad en Firestore

Ve a Firestore > Rules y configura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que cualquiera escriba consultas
    match /consultas/{document} {
      allow create: if request.resource.data.site == 'aloisepropiedades';
      allow read: if false; // Solo desde el backend
    }
  }
}
```

### 5. Configurar reglas de Storage

Ve a Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /aloisepropiedades/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
  }
}
```

---

## Eventos de Analytics más importantes a trackear

✅ **Ya configurados automáticamente:**
- `page_view` - Cada vez que alguien carga una página

🔨 **Para implementar:**
- `view_item` - Cuando ven una propiedad (usa `trackPropertyView()`)
- `contact_whatsapp` - Click en WhatsApp (usa `trackWhatsAppClick()`)
- `search` - Búsquedas (usa `trackSearch()`)
- `generate_lead` - Consultas (automático con `saveConsulta()`)
- `share` - Compartir propiedades
- `select_content` - Click en una propiedad del listado

---

## Soporte y recursos

- **Documentación completa**: Ver `FIREBASE_SETUP.md`
- **Ejemplos de código**: Ver `js/firebase-examples.js`
- **Firebase Console**: https://console.firebase.google.com
- **Documentación oficial**: https://firebase.google.com/docs/web/setup

---

## Verificar que funciona

1. Abre el sitio en el navegador
2. Abre la consola de desarrollo (F12)
3. Deberías ver estos mensajes:
   - ✅ Firebase inicializado correctamente
   - ✅ Firebase Analytics configurado para aloisepropiedades
   - ✅ Firestore inicializado
   - ✅ Storage inicializado
   - ✅ Firebase utilities cargadas globalmente

4. Verifica que las variables globales existan:
```javascript
console.log(window.firebaseApp); // Debe mostrar el objeto de Firebase
console.log(window.firebaseAnalytics); // Debe mostrar el objeto de Analytics
console.log(window.firebaseDb); // Debe mostrar Firestore
console.log(typeof trackPropertyView); // Debe ser "function"
```

---

**Estado:** ✅ Firebase completamente integrado y listo para usar

**Última actualización:** 2025-01-20
