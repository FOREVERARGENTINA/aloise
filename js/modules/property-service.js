/**
 * MÓDULO: Property Service
 * Servicio que abstrae la obtención de propiedades (API real o mock data)
 */

class PropertyService {
  constructor(config) {
    this.config = config;
    this.useMockData = config.development?.useMockData || false;
    this.mockDelay = config.development?.mockDataDelay || 1000;

    // Inicializar API de Xintel si está habilitada
    if (config.xintel?.enabled && !this.useMockData && typeof XintelAPI !== 'undefined') {
      this.api = new XintelAPI({
        empresa: config.xintel.empresa,
        apiKey: config.xintel.apiKey,
        baseURL: config.xintel.baseURL,
        timeout: config.xintel.timeout,
        cacheTimeout: config.xintel.cacheTimeout
      });
    }
  }

  /**
   * Simular delay de red para datos mock
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtener propiedades con filtros
   */
  async getProperties(filters = {}) {
    if (this.useMockData) {
      return this.getMockProperties(filters);
    }

    if (!this.api) {
      console.error('❌ Xintel API no configurada. Usando datos mock.');
      return this.getMockProperties(filters);
    }

    const result = await this.api.getProperties(filters);

    if (!result.success) {
      console.error('Error al obtener propiedades de Xintel:', result.error);
      // Fallback a mock data
      return this.getMockProperties(filters);
    }

    return result;
  }

  /**
   * Obtener datos mock (para desarrollo sin API)
   */
  async getMockProperties(filters = {}) {
    // Mock data removed: return empty result so that the app doesn't show test data
    await this.delay(this.mockDelay);

    const page = filters.page || 1;
    const limit = filters.limit || 12;

    return {
      success: true,
      data: {
        properties: [],
        pagination: {
          current_page: page,
          total_pages: 0,
          total_items: 0,
          items_per_page: limit
        }
      },
      cached: false,
      mock: true
    };
  }

  /**
   * Obtener propiedades destacadas
   */
  async getFeaturedProperties(limit = 6) {
    if (this.useMockData) {
      await this.delay(this.mockDelay);
      // Mocks eliminados: devolver lista vacía
      return {
        success: true,
        data: { properties: [] },
        mock: true
      };
    }

    if (!this.api) {
      console.error('❌ Xintel API no configurada y no hay datos mock disponibles.');
      return {
        success: true,
        data: { properties: [] }
      };
    }

    const result = await this.api.getFeaturedProperties(limit);

    if (!result.success) {
      console.error('Error al obtener propiedades destacadas:', result.error);
      return {
        success: true,
        data: { properties: [] }
      };
    }

    return result;
  }

  /**
   * Obtener últimos ingresos
   */
  async getLatestProperties(limit = 3) {
    if (this.useMockData) {
      await this.delay(this.mockDelay);
      // Mocks eliminados: devolver lista vacía
      return {
        success: true,
        data: { properties: [] },
        mock: true
      };
    }

    if (!this.api) {
      console.error('❌ Xintel API no configurada y no hay datos mock disponibles.');
      return {
        success: true,
        data: { properties: [] }
      };
    }

    const result = await this.api.getLatestProperties(limit);

    if (!result.success) {
      console.error('Error al obtener últimas propiedades:', result.error);
      return {
        success: true,
        data: { properties: [] }
      };
    }

    return result;
  }

  /**
   * Obtener detalle de propiedad
   */
  async getPropertyDetail(propertyId) {
    if (this.useMockData) {
      await this.delay(this.mockDelay);
      return {
        success: false,
        error: 'Datos mock integrados eliminados. Agregá datos de prueba o configurá la API de Xintel.',
        data: null,
        mock: true
      };
    }

    if (!this.api) {
      return {
        success: false,
        error: 'Xintel API no configurada',
        data: null
      };
    }

    const result = await this.api.getPropertyDetail(propertyId);

    return result;
  }

  /**
   * Crear consulta sobre propiedad
   */
  async createInquiry(data) {
    if (this.useMockData) {
      await this.delay(this.mockDelay);
      console.log('📧 Mock: Consulta enviada', data);
      return {
        success: true,
        data: { message: 'Consulta enviada exitosamente' },
        mock: true
      };
    }

    if (!this.api) {
      console.log('📧 Consulta (sin API):', data);
      return {
        success: true,
        data: { message: 'Consulta recibida' },
        mock: true
      };
    }

    return await this.api.createInquiry(data);
  }

  /**
   * Verificar estado de la API
   */
  getAPIStatus() {
    return {
      useMockData: this.useMockData,
      apiConfigured: !!this.api,
      xintelEnabled: this.config.xintel?.enabled || false
    };
  }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PropertyService;
}

if (typeof window !== 'undefined') {
  window.PropertyService = PropertyService;
}
