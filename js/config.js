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

  // ========== CONTACTO ==========
  contact: {
    phone: '+54 11 1234-5678', // ACTUALIZAR
    whatsapp: '5491112345678', // ACTUALIZAR (sin + ni espacios)
    email: 'info@gabrielaaloise.com', // ACTUALIZAR
    whatsappMessage: 'Hola! Quisiera más información sobre las propiedades'
  },

  // ========== REDES SOCIALES ==========
  social: {
    facebook: 'https://www.facebook.com/gabrielaaloisepropiedades', // ACTUALIZAR
    instagram: 'https://www.instagram.com/gabrielaaloisepropiedades', // ACTUALIZAR
    linkedin: '', // Opcional
    youtube: '' // Opcional
  },

  // ========== API XINTEL ==========
  xintel: {
    enabled: true, // Cambiar a true cuando tengas la API key
    apiKey: '', // AGREGAR TU API KEY DE XINTEL
    baseURL: 'https://api.xintel.com.ar/v1', // URL base de la API
    timeout: 10000, // Timeout en milisegundos
    cacheTimeout: 5 * 60 * 1000, // 5 minutos de cache

    // Configuración de listados
    defaultFilters: {
      page: 1,
      limit: 12, // Propiedades por página
      sort: 'date_desc' // Ordenar por fecha, más recientes primero
    },

    // Límites de búsqueda
    searchLimits: {
      featured: 6, // Propiedades destacadas en home
      similar: 3, // Propiedades similares
      latest: 3 // Últimos ingresos en home
    }
  },

  // ========== MODO DESARROLLO ==========
  development: {
    // Si no tienes API de Xintel, puedes usar datos de prueba
    useMockData: true, // Cambiar a false cuando tengas API real
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

  // ========== ANALYTICS ==========
  analytics: {
    googleAnalyticsId: '', // AGREGAR GA4 ID (opcional)
    facebookPixelId: '', // AGREGAR Facebook Pixel (opcional)
    enabled: false // Activar cuando configures analytics
  },

  // ========== SEO ==========
  seo: {
    siteName: 'Gabriela Aloise Propiedades',
    defaultTitle: 'Gabriela Aloise Propiedades | Inmobiliaria en Caseros',
    defaultDescription: 'Inmobiliaria en Caseros con matrícula 2987. Ventas, alquileres, tasaciones y administraciones.',
    defaultImage: '/images/og-image.jpg',
    siteUrl: 'https://gabrielaaloise.com', // ACTUALIZAR con tu dominio real
    twitterHandle: '' // Opcional
  },

  // ========== MONEDAS ==========
  currencies: {
    default: 'USD',
    available: ['USD', 'ARS'],
    exchangeRate: 0 // Se puede actualizar dinámicamente
  }
};

// ========== DATOS DE PRUEBA (MOCK) ==========
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'Departamento moderno en Palermo',
    description: 'Hermoso departamento de 2 ambientes con balcón, amenities y excelente ubicación. Cocina integrada, baño completo, dormitorio con placard. Edificio con portero, gimnasio y parrilla.',
    price: 180000,
    currency: 'USD',
    operation_type: 'venta',
    property_type: 'departamento',
    location: 'Palermo, CABA',
    bedrooms: 1,
    bathrooms: 1,
    rooms: 2,
    area: 45,
    covered_area: 45,
    images: ['/images/properties/property-1.jpg'],
    url: '/propiedades/1',
    featured: true,
    created_at: '2025-01-15'
  },
  {
    id: 2,
    title: 'Casa familiar en Belgrano',
    description: 'Amplia casa de 3 dormitorios con jardín y cochera. Ideal para familias. Living comedor, cocina con office, 2 baños completos. Patio con parrilla y espacio verde.',
    price: 350000,
    currency: 'ARS',
    operation_type: 'alquiler',
    property_type: 'casa',
    location: 'Belgrano, CABA',
    bedrooms: 3,
    bathrooms: 2,
    rooms: 5,
    area: 120,
    covered_area: 100,
    images: ['/images/properties/property-2.jpg'],
    url: '/propiedades/2',
    featured: true,
    created_at: '2025-01-14'
  },
  {
    id: 3,
    title: 'PH en Caseros con patio',
    description: 'PH de 2 dormitorios con patio y parrilla. Excelente estado, listo para habitar. Cocina comedor, baño completo, 2 dormitorios con placard. Patio con parrilla.',
    price: 95000,
    currency: 'USD',
    operation_type: 'venta',
    property_type: 'ph',
    location: 'Caseros, Buenos Aires',
    bedrooms: 2,
    bathrooms: 1,
    rooms: 3,
    area: 70,
    covered_area: 60,
    images: ['/images/properties/property-3.jpg'],
    url: '/propiedades/3',
    featured: true,
    created_at: '2025-01-13'
  },
  {
    id: 4,
    title: 'Departamento 3 ambientes Caballito',
    description: 'Excelente departamento en Caballito, 3 ambientes con balcón. Living comedor amplio, cocina separada, 2 dormitorios, baño completo. Edificio con amenities.',
    price: 140000,
    currency: 'USD',
    operation_type: 'venta',
    property_type: 'departamento',
    location: 'Caballito, CABA',
    bedrooms: 2,
    bathrooms: 1,
    rooms: 3,
    area: 65,
    covered_area: 65,
    images: ['/images/properties/property-1.jpg'],
    url: '/propiedades/4',
    featured: false,
    created_at: '2025-01-12'
  },
  {
    id: 5,
    title: 'Local comercial en Caseros',
    description: 'Local comercial sobre avenida principal. Excelente ubicación para comercio. Amplio salón, baño, depósito. Con vidriera y persiana metálica.',
    price: 250000,
    currency: 'ARS',
    operation_type: 'alquiler',
    property_type: 'local',
    location: 'Caseros, Buenos Aires',
    bedrooms: 0,
    bathrooms: 1,
    rooms: 1,
    area: 50,
    covered_area: 50,
    images: ['/images/properties/property-2.jpg'],
    url: '/propiedades/5',
    featured: false,
    created_at: '2025-01-11'
  },
  {
    id: 6,
    title: 'Casa 4 ambientes con cochera',
    description: 'Casa de 4 ambientes en San Martín. Living comedor, cocina, 3 dormitorios, 2 baños. Cochera cubierta, patio con parrilla. Muy buen estado.',
    price: 165000,
    currency: 'USD',
    operation_type: 'venta',
    property_type: 'casa',
    location: 'San Martín, Buenos Aires',
    bedrooms: 3,
    bathrooms: 2,
    rooms: 4,
    area: 140,
    covered_area: 110,
    images: ['/images/properties/property-3.jpg'],
    url: '/propiedades/6',
    featured: false,
    created_at: '2025-01-10'
  }
];

// Hacer CONFIG disponible globalmente
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
  window.MOCK_PROPERTIES = MOCK_PROPERTIES;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, MOCK_PROPERTIES };
}
