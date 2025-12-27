/**
 * INICIALIZACIÓN DE FIREBASE - CDN VERSION
 * Gabriela Aloise Propiedades
 *
 * Este archivo debe cargarse DESPUÉS de los scripts de Firebase CDN
 * y ANTES de los scripts de tu aplicación
 */

(function() {
  'use strict';

  // Verificar que Firebase esté disponible
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK no está cargado. Asegúrate de incluir los scripts de Firebase CDN.');
    return;
  }

  // Configuración de Firebase
  const firebaseConfig = {
    apiKey: 'AIzaSyCuQXi0LS6TJ1UN2-sprZWbYliX72grg-Y',
    authDomain: 'frandoweb-4c2c7.firebaseapp.com',
    projectId: 'frandoweb-4c2c7',
    storageBucket: 'frandoweb-4c2c7.firebasestorage.app',
    messagingSenderId: '227831202965',
    appId: '1:227831202965:web:10f9ca4f2a4f5080f7c79c',
    measurementId: 'G-1X8T159RTT'
  };

  // Inicializar Firebase
  try {
    const app = firebase.initializeApp(firebaseConfig);

    // Inicializar Analytics
    const analytics = firebase.analytics();

    // Identificar este sitio específico
    analytics.setUserProperties({ site: 'aloisepropiedades' });

    // Log de página inicial
    analytics.logEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      site: 'aloisepropiedades'
    });

    // Hacer Firebase disponible globalmente para facilitar el uso
    window.firebaseApp = app;
    window.firebaseAnalytics = analytics;

    // Inicializar Firestore si está disponible
    if (firebase.firestore) {
      window.firebaseDb = firebase.firestore();
    }

    // Inicializar Storage si está disponible
    if (firebase.storage) {
      window.firebaseStorage = firebase.storage();
    }

  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
  }

  // ========== UTILIDADES DE TRACKING ==========

  /**
   * Helper para trackear eventos de propiedades
   */
  window.trackPropertyEvent = function(eventName, propertyData) {
    if (!window.firebaseAnalytics) return;

    const eventData = {
      site: 'aloisepropiedades',
      ...propertyData
    };

    window.firebaseAnalytics.logEvent(eventName, eventData);

    if (CONFIG.development.enableLogs) {
      console.log('📊 Analytics Event:', eventName, eventData);
    }
  };

  /**
   * Helper para guardar consultas en Firestore
   */
  window.saveConsulta = async function(consultaData) {
    if (!window.firebaseDb) {
      console.error('Firestore no está disponible');
      return { success: false, error: 'Firestore no disponible' };
    }

    try {
      const docRef = await window.firebaseDb.collection('consultas').add({
        ...consultaData,
        site: 'aloisepropiedades',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Track evento de lead generado
      window.trackPropertyEvent('generate_lead', {
        lead_id: docRef.id,
        property_id: consultaData.propertyId || null
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Error al guardar consulta:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Helper para trackear clicks en WhatsApp
   */
  window.trackWhatsAppClick = function(propertyId = null, source = 'general') {
    window.trackPropertyEvent('contact_whatsapp', {
      property_id: propertyId,
      source: source
    });
  };

  /**
   * Helper para trackear visualizaciones de propiedades
   */
  window.trackPropertyView = function(property) {
    window.trackPropertyEvent('view_item', {
      item_id: property.id,
      item_name: property.title,
      item_category: property.property_type,
      price: property.price,
      currency: property.currency,
      location: property.location
    });
  };

  /**
   * Helper para trackear búsquedas
   */
  window.trackSearch = function(searchTerm, filters = {}) {
    window.trackPropertyEvent('search', {
      search_term: searchTerm,
      operation_type: filters.operation_type || null,
      property_type: filters.property_type || null,
      location: filters.location || null
    });
  };

})();
