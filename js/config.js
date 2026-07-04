/**
 * CONFIGURACIÓN GLOBAL
 * Gabriela Aloise Propiedades
 */

const CONFIG = {
  // ========== INFORMACIÓN DEL NEGOCIO ==========
  business: {
    name: 'Gabriela Aloise Propiedades',
    matricula: '2987',
    address: 'Tres de Febrero 2958, Caseros',
    city: 'Caseros',
    province: 'Buenos Aires',
    country: 'Argentina',
    coordinates: {
      lat: -34.6081,
      lng: -58.5622
    }
  },

  // ========== COLORES DE MARCA ==========
  brandColors: {
    // Azul Corporativo - Color principal
    primary: '#252b3b',
    primaryDark: '#1a1f2e',
    primaryLight: '#2a3142',

    // Plateado elegante - Color de acento
    accent: '#B0B7BD',
    accentDark: '#8D9398',
    accentLight: '#D8DCE0',
    accentSubtle: '#C4C8CC' 
  },

  // ========== CONTACTO ==========
  contact: {
    phone: '+54 11 1234-5678', // ACTUALIZAR
    whatsapp: '5491112345678', // ACTUALIZAR (sin + ni espacios)
    email: 'info@aloisepropiedades.com.ar', // ACTUALIZAR
    whatsappMessage: 'Hola! Quisiera más información sobre las propiedades'
  },

  // ========== REDES SOCIALES ==========
  social: {
    facebook: 'https://www.facebook.com/gabrielaaloisepropiedades', // ACTUALIZAR
    instagram: 'https://www.instagram.com/gabriela_aloise_propiedades/', // ACTUALIZAR
    linkedin: '', // Opcional
    youtube: '' // Opcional
  },

  // ========== API XINTEL ==========
  xintel: {
    enabled: true,
    empresa: 'GAB', // Código de empresa
    apiKey: '56YOXNKF4VLYBSAPY4HUVJATV', // API Key
    baseURL: 'https://xintelapi.com.ar/', // URL base de la API
    timeout: 10000, // Timeout en milisegundos
    cacheTimeout: 5 * 60 * 1000, // 5 minutos de cache

    // Configuración de listados
    defaultFilters: {
      page: 1,
      limit: 60, // Propiedades por página
      sort: 'date_desc' // Ordenar por fecha, más recientes primero
    },

    // Límites de búsqueda
    searchLimits: {
      featured: 6, // Propiedades destacadas en home
      similar: 3, // Propiedades similares
      latest: 3 // Últimos ingresos en home
    }
  },

  // ========== ALERTAS (EmailJS) ==========
  alerts: {
    enabled: true,
    emailjs: {
      serviceId: 'service_xzwb6d2',
      templateId: 'template_c5r7h8n',
      publicKey: 'IDpccQZwuzY0RHYSQ'
    },
    recipientEmail: 'frandoweb@gmail.com'
  },

  // ========== FORMULARIO DE CONTACTO (EmailJS) ==========
  contactForm: {
    enabled: true,
    emailjs: {
      serviceId: 'service_xzwb6d2',
      templateId: 'template_t7uoflo',
      publicKey: 'IDpccQZwuzY0RHYSQ'
    }
  },

  // ========== MODO DESARROLLO ==========
  development: {
    // Si no tienes API de Xintel, puedes usar datos de prueba
    useMockData: false, // Cambiar a false cuando tengas API real
    mockDataDelay: 1000, // Simular delay de red (ms)
    enableLogs: true // Mostrar logs en consola
  },

  // ========== BREAKPOINTS ==========
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536
  },

  // ========== GOOGLE MAPS ==========
  googleMaps: {
    apiKey: '', // AGREGAR TU API KEY DE GOOGLE MAPS (opcional)
    defaultZoom: 15,
    markerColor: '#0047AB' // Color azul de la marca
  },

  // ========== FIREBASE ==========
  firebase: {
    enabled: true,
    projectId: 'frandoweb-4c2c7',
    // Los servicios de Firebase se inicializan en firebase-config.js
    features: {
      analytics: true,
      firestore: true,
      storage: true,
      auth: false // Cambiar a true si necesitas autenticación
    }
  },

  // ========== ANALYTICS ==========
  analytics: {
    googleAnalyticsId: 'G-1X8T159RTT', // ID de Firebase Analytics
    facebookPixelId: '', // AGREGAR Facebook Pixel (opcional)
    enabled: true // Activado con Firebase Analytics
  },

  // ========== SEO ==========
  seo: {
    siteName: 'Gabriela Aloise Propiedades',
    defaultTitle: 'Gabriela Aloise Propiedades | Inmobiliaria en Caseros',
    defaultDescription: 'Inmobiliaria en Caseros. Martillera Pública Nº 2987. Ventas, alquileres, tasaciones y administraciones.',
    defaultImage: '/images/og-image.jpg',
    siteUrl: 'https://aloisepropiedades.com.ar',
    twitterHandle: '', // Opcional
    // Autor / Atribución en el sitio (para meta author y schema)
    authorName: 'Hernán — Frandoweb',
    authorUrl: 'https://www.frandoweb.com'
  },

  // ========== MONEDAS ==========
  currencies: {
    default: 'USD',
    available: ['USD', 'ARS'],
    // Valor por defecto para desarrollo: ARS por USD (actualizalo con la tasa real en producción)
    exchangeRate: 1500 // Se puede actualizar dinámicamente
  }
};

// Datos de prueba integrados eliminados.
// Si necesitás datos locales para desarrollo, agrega tu propio archivo de datos de prueba o activa la API de Xintel.

// Hacer CONFIG disponible globalmente
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG };
} 
