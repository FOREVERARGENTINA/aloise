/**
 * EJEMPLOS DE USO DE FIREBASE
 * Gabriela Aloise Propiedades
 *
 * Este archivo contiene ejemplos de cómo usar Firebase en tu sitio.
 * NO lo incluyas en producción, solo es para referencia.
 */

// ========== EJEMPLO 1: Trackear visualización de propiedad ==========
// Usar en la página de detalle de propiedad

function ejemploTrackPropertyView() {
  const property = {
    id: '123',
    title: 'Departamento moderno en Palermo',
    property_type: 'departamento',
    price: 180000,
    currency: 'USD',
    location: 'Palermo, CABA'
  };

  // Trackear con la función helper
  trackPropertyView(property);
}


// ========== EJEMPLO 2: Trackear click en WhatsApp ==========
// Agregar esto al evento click del botón de WhatsApp

function ejemploWhatsAppTracking() {
  // Ejemplo 1: Click desde una propiedad específica
  document.querySelector('.whatsapp-button').addEventListener('click', function() {
    const propertyId = this.dataset.propertyId; // Asume que el botón tiene data-property-id
    trackWhatsAppClick(propertyId, 'property_detail');
  });

  // Ejemplo 2: Click desde el botón flotante (sin propiedad específica)
  document.querySelector('.whatsapp-float').addEventListener('click', function() {
    trackWhatsAppClick(null, 'floating_button');
  });
}


// ========== EJEMPLO 3: Trackear búsqueda ==========
// Usar cuando el usuario realiza una búsqueda

function ejemploSearchTracking() {
  document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const searchTerm = document.getElementById('searchInput').value;
    const filters = {
      operation_type: document.getElementById('operationType').value,
      property_type: document.getElementById('propertyType').value,
      location: document.getElementById('location').value
    };

    // Trackear la búsqueda
    trackSearch(searchTerm, filters);

    // ... resto de tu código de búsqueda
  });
}


// ========== EJEMPLO 4: Guardar consulta en Firestore ==========
// Usar en el formulario de contacto

async function ejemploSaveConsulta() {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const consultaData = {
      nombre: document.getElementById('nombre').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      mensaje: document.getElementById('mensaje').value,
      propertyId: document.getElementById('propertyId')?.value || null,
      url: window.location.href
    };

    // Guardar en Firestore
    const result = await saveConsulta(consultaData);

    if (result.success) {
      alert('¡Gracias por tu consulta! Te contactaremos pronto.');
      form.reset();
    } else {
      alert('Hubo un error al enviar tu consulta. Por favor, intenta nuevamente.');
      console.error('Error:', result.error);
    }
  });
}


// ========== EJEMPLO 5: Trackear evento personalizado ==========
// Para trackear cualquier acción específica

function ejemploCustomEvent() {
  // Trackear cuando alguien comparte una propiedad
  document.querySelector('.share-button').addEventListener('click', function() {
    const propertyId = this.dataset.propertyId;

    trackPropertyEvent('share', {
      content_type: 'property',
      item_id: propertyId,
      method: 'copy_link' // o 'facebook', 'twitter', etc.
    });
  });

  // Trackear cuando alguien descarga un PDF
  document.querySelector('.download-pdf').addEventListener('click', function() {
    trackPropertyEvent('file_download', {
      file_name: 'propiedad_123.pdf',
      property_id: '123'
    });
  });

  // Trackear cuando alguien ve el mapa
  document.querySelector('.view-map-button').addEventListener('click', function() {
    trackPropertyEvent('view_map', {
      property_id: '123',
      location: 'Caseros, Buenos Aires'
    });
  });
}


// ========== EJEMPLO 6: Leer datos de Firestore ==========
// Para mostrar propiedades guardadas en Firebase

async function ejemploReadFromFirestore() {
  if (!window.firebaseDb) {
    console.error('Firestore no disponible');
    return;
  }

  try {
    // Obtener todas las consultas del sitio
    const snapshot = await window.firebaseDb
      .collection('consultas')
      .where('site', '==', 'aloisepropiedades')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const consultas = [];
    snapshot.forEach(doc => {
      consultas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log('Consultas recientes:', consultas);
    return consultas;

  } catch (error) {
    console.error('Error al leer Firestore:', error);
  }
}


// ========== EJEMPLO 7: Subir imagen a Storage ==========
// Para subir fotos de propiedades

async function ejemploUploadImage(file, propertyId) {
  if (!window.firebaseStorage) {
    console.error('Storage no disponible');
    return;
  }

  try {
    // Crear referencia al archivo
    const storageRef = window.firebaseStorage.ref();
    const imageRef = storageRef.child(`aloisepropiedades/properties/${propertyId}/${file.name}`);

    // Subir archivo
    const snapshot = await imageRef.put(file);

    // Obtener URL de descarga
    const downloadURL = await snapshot.ref.getDownloadURL();

    console.log('Imagen subida:', downloadURL);

    // Trackear evento
    trackPropertyEvent('upload_image', {
      property_id: propertyId,
      file_size: file.size,
      file_type: file.type
    });

    return downloadURL;

  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
}


// ========== EJEMPLO 8: Escuchar cambios en tiempo real ==========
// Para recibir notificaciones de nuevas consultas

function ejemploRealtimeListener() {
  if (!window.firebaseDb) {
    console.error('Firestore no disponible');
    return;
  }

  // Escuchar nuevas consultas en tiempo real
  const unsubscribe = window.firebaseDb
    .collection('consultas')
    .where('site', '==', 'aloisepropiedades')
    .orderBy('timestamp', 'desc')
    .limit(1)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          console.log('Nueva consulta:', change.doc.data());
          // Aquí puedes mostrar una notificación, reproducir un sonido, etc.
        }
      });
    });

  // Para dejar de escuchar:
  // unsubscribe();
}


// ========== EJEMPLO 9: Integración completa en página de propiedad ==========

function integrarFirebaseEnPaginaPropiedad() {
  document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos de la propiedad (ejemplo)
    const property = {
      id: document.querySelector('[data-property-id]').dataset.propertyId,
      title: document.querySelector('h1').textContent,
      property_type: document.querySelector('[data-property-type]').dataset.propertyType,
      price: parseFloat(document.querySelector('[data-price]').dataset.price),
      currency: document.querySelector('[data-currency]').dataset.currency,
      location: document.querySelector('[data-location]').dataset.location
    };

    // 1. Trackear visualización de la propiedad
    trackPropertyView(property);

    // 2. Trackear clicks en WhatsApp
    document.querySelectorAll('.whatsapp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        trackWhatsAppClick(property.id, 'property_detail');
      });
    });

    // 3. Guardar consultas
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const consultaData = {
          nombre: this.querySelector('[name="nombre"]').value,
          email: this.querySelector('[name="email"]').value,
          telefono: this.querySelector('[name="telefono"]').value,
          mensaje: this.querySelector('[name="mensaje"]').value,
          propertyId: property.id,
          propertyTitle: property.title,
          propertyPrice: property.price,
          url: window.location.href
        };

        const result = await saveConsulta(consultaData);

        if (result.success) {
          alert('¡Gracias por tu consulta! Te contactaremos pronto.');
          this.reset();
        }
      });
    }

    // 4. Trackear compartir
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const method = this.dataset.shareMethod || 'unknown';
        trackPropertyEvent('share', {
          content_type: 'property',
          item_id: property.id,
          method: method
        });
      });
    });
  });
}


// ========== EJEMPLO 10: Analytics avanzados ==========

function ejemplosAnalyticsAvanzados() {
  // Trackear tiempo en la página
  let startTime = Date.now();

  window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    trackPropertyEvent('time_on_page', {
      duration_seconds: timeSpent,
      page_path: window.location.pathname
    });
  });

  // Trackear scroll depth
  let maxScroll = 0;

  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;

      if (scrollPercent >= 25 && scrollPercent < 50) {
        trackPropertyEvent('scroll', { percent: 25 });
      } else if (scrollPercent >= 50 && scrollPercent < 75) {
        trackPropertyEvent('scroll', { percent: 50 });
      } else if (scrollPercent >= 75 && scrollPercent < 90) {
        trackPropertyEvent('scroll', { percent: 75 });
      } else if (scrollPercent >= 90) {
        trackPropertyEvent('scroll', { percent: 100 });
      }
    }
  });
}


console.log('📚 Archivo de ejemplos de Firebase cargado. Ver código para ejemplos de uso.');
