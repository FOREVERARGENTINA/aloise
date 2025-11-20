# Guía Rápida: Verificar Firebase en Aloise Propiedades

## ✅ Estado Actual

Tu sitio **YA TIENE** Firebase configurado y funcionando:

- **Proyecto**: frandoweb-4c2c7
- **Sitio**: aloisepropiedades
- **Analytics ID**: G-1X8T159RTT
- **Servicios activos**: Analytics, Firestore, Storage

## 🔍 Cómo Verificar que Funciona

### Paso 1: Abrir el sitio
1. Abre tu sitio en el navegador (con Live Server o servidor local)
2. Presiona **F12** para abrir la consola del navegador

### Paso 2: Buscar mensajes de Firebase
En la consola deberías ver:
```
✅ Firebase inicializado correctamente
✅ Firebase Analytics configurado para aloisepropiedades
✅ Firestore inicializado
✅ Storage inicializado
✅ Firebase utilities cargadas globalmente
```

Si ves estos mensajes = **TODO FUNCIONA** ✅

### Paso 3: Ver datos en tiempo real

1. Ve a: https://analytics.google.com
2. Busca la propiedad: **G-1X8T159RTT**
3. Ve a: **Informes > Tiempo real**
4. Navega por tu sitio y verás tu actividad en tiempo real

## 📊 Qué se está Trackeando Automáticamente

Firebase ya está registrando:
- ✅ Visitas a páginas (page_view)
- ✅ Identificación del sitio (aloisepropiedades)
- ✅ Título de página
- ✅ URL visitada

## 🎯 Eventos Adicionales que Puedes Agregar

El sitio tiene funciones listas para usar:

### 1. Track click en WhatsApp
```javascript
// En el botón de WhatsApp, agregar:
onclick="trackWhatsAppClick()"
```

### 2. Track ver propiedad
```javascript
// Cuando alguien ve una propiedad:
trackPropertyView({
  id: 123,
  title: 'Departamento en Palermo',
  property_type: 'departamento',
  price: 180000,
  currency: 'USD',
  location: 'Palermo'
});
```

### 3. Track búsqueda
```javascript
// Cuando alguien busca:
trackSearch('departamento', {
  operation_type: 'venta',
  property_type: 'departamento',
  location: 'Caseros'
});
```

### 4. Guardar consulta
```javascript
// Cuando alguien envía formulario:
const resultado = await saveConsulta({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  telefono: '+54 11 1234-5678',
  mensaje: 'Me interesa la propiedad',
  propertyId: '123',
  propertyTitle: 'Departamento en Palermo'
});

if (resultado.success) {
  alert('¡Consulta enviada!');
}
```

## 🔧 Implementación Rápida

### Agregar tracking al botón de WhatsApp

Busca en `index.html` el botón flotante de WhatsApp y actualiza:

```html
<!-- ANTES -->
<a href="https://wa.me/5491112345678..." class="whatsapp-float">

<!-- DESPUÉS -->
<a href="https://wa.me/5491112345678..." 
   class="whatsapp-float"
   onclick="trackWhatsAppClick(null, 'floating_button')">
```

## 📱 Ver Analíticas desde el Celular

1. Descarga la app **"Firebase Console"** (Google Play / App Store)
2. Inicia sesión con tu cuenta de Google
3. Selecciona proyecto: **frandoweb-4c2c7**
4. Ve estadísticas en tiempo real desde tu celular

## 🗄️ Ver Consultas Guardadas

1. Ve a: https://console.firebase.google.com
2. Selecciona proyecto: **frandoweb-4c2c7**
3. Ve a: **Firestore Database**
4. Busca la colección: **consultas**
5. Filtra por: `site == "aloisepropiedades"`

## ❓ Problemas Comunes

### No veo los mensajes de Firebase en consola
- Verifica que estés usando un servidor local (no abrir HTML directamente)
- Revisa que los scripts de Firebase estén cargando (pestaña Network en DevTools)

### No aparecen datos en Analytics
- Los datos pueden tardar 24-48 horas en aparecer en reportes
- Usa "Tiempo real" para ver datos inmediatos
- Verifica que el Measurement ID sea: G-1X8T159RTT

### Error de CORS
- Asegúrate de usar un servidor local (Live Server, Python, etc.)
- No abras el HTML directamente con file://

## 🎓 Documentación Completa

Para más detalles, revisa:
- `FIREBASE_SETUP.md` - Configuración técnica
- `FIREBASE_README.md` - Documentación completa
- `COMO_VER_ANALITICAS.md` - Guía de analíticas

## ✨ Resumen

Tu Firebase está **100% configurado y funcionando**. Solo necesitas:

1. ✅ Verificar en consola que aparezcan los mensajes
2. ✅ Ver tus visitas en Google Analytics > Tiempo real
3. ⏳ (Opcional) Agregar tracking a botones específicos
4. ⏳ (Opcional) Implementar formulario de contacto con Firestore

**¡Todo listo para usar!** 🚀
