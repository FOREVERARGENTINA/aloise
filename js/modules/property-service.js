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
    await this.delay(this.mockDelay);

    let properties = [...MOCK_PROPERTIES];

    // Aplicar filtros
    if (filters.operationType) {
      properties = properties.filter(p => p.operation_type === filters.operationType);
    }

    if (filters.propertyType) {
      properties = properties.filter(p => p.property_type === filters.propertyType);
    }

    if (filters.location) {
      properties = properties.filter(p =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      properties = properties.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      properties = properties.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.minRooms) {
      properties = properties.filter(p => p.bedrooms >= filters.minRooms);
    }

    if (filters.maxRooms) {
      properties = properties.filter(p => p.bedrooms <= filters.maxRooms);
    }

    // Ordenar
    if (filters.sort === 'price_asc') {
      properties.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      properties.sort((a, b) => b.price - a.price);
    } else {
      // Por defecto: fecha descendente (más recientes primero)
      properties.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Paginación
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = properties.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        properties: paginatedProperties,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(properties.length / limit),
          total_items: properties.length,
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
      const featured = MOCK_PROPERTIES.filter(p => p.featured).slice(0, limit);
      return {
        success: true,
        data: { properties: featured },
        mock: true
      };
    }

    if (!this.api) {
      return this.getFeaturedProperties(limit);
    }

    const result = await this.api.getFeaturedProperties(limit);

    if (!result.success) {
      // Fallback a mock
      const featured = MOCK_PROPERTIES.filter(p => p.featured).slice(0, limit);
      return {
        success: true,
        data: { properties: featured },
        mock: true
      };
    }

    return result;
  }

  /**
   * Obtener últimos ingresos
   */
  async getLatestProperties(limit = 3) {
    const result = await this.getProperties({
      page: 1,
      limit: limit,
      sort: 'date_desc'
    });

    if (result.success) {
      return {
        success: true,
        data: { properties: result.data.properties },
        mock: result.mock || false
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
      const property = MOCK_PROPERTIES.find(p => p.id == propertyId);

      if (property) {
        return {
          success: true,
          data: property,
          mock: true
        };
      }

      return {
        success: false,
        error: 'Propiedad no encontrada',
        data: null
      };
    }

    if (!this.api) {
      return this.getPropertyDetail(propertyId);
    }

    const result = await this.api.getPropertyDetail(propertyId);

    if (!result.success) {
      // Fallback a mock
      const property = MOCK_PROPERTIES.find(p => p.id == propertyId);
      if (property) {
        return {
          success: true,
          data: property,
          mock: true
        };
      }
    }

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
