/**
 * MÓDULO: Xintel API
 * Manejo de llamadas a la API de Xintel
 *
 * Documentación Xintel: https://www.xintel.com.ar/
 */

class XintelAPI {
  constructor(config = {}) {
    // Configuración de la API
    this.apiKey = config.apiKey || '';
    this.baseURL = config.baseURL || 'https://api.xintel.com.ar/v1';
    this.timeout = config.timeout || 10000;

    // Cache de propiedades (opcional, para mejorar performance)
    this.cache = new Map();
    this.cacheTimeout = config.cacheTimeout || 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Realizar petición HTTP genérica
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    const config = {
      method: options.method || 'GET',
      headers: { ...defaultHeaders, ...options.headers },
      ...options
    };

    // Si hay body y es objeto, convertir a JSON
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };

    } catch (error) {
      console.error('Xintel API Error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Obtener listado de propiedades
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise}
   */
  async getProperties(filters = {}) {
    const cacheKey = `properties_${JSON.stringify(filters)}`;

    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('📦 Usando datos en cache');
        return { success: true, data: cached.data, cached: true };
      }
    }

    // Construir query string
    const queryParams = new URLSearchParams();

    if (filters.operationType) queryParams.append('operation_type', filters.operationType); // 'venta', 'alquiler'
    if (filters.propertyType) queryParams.append('property_type', filters.propertyType); // 'casa', 'departamento', 'ph'
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.minPrice) queryParams.append('min_price', filters.minPrice);
    if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice);
    if (filters.minRooms) queryParams.append('min_rooms', filters.minRooms);
    if (filters.maxRooms) queryParams.append('max_rooms', filters.maxRooms);
    if (filters.minArea) queryParams.append('min_area', filters.minArea);
    if (filters.maxArea) queryParams.append('max_area', filters.maxArea);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.sort) queryParams.append('sort', filters.sort); // 'price_asc', 'price_desc', 'date_desc'

    const endpoint = `/properties?${queryParams.toString()}`;
    const result = await this.request(endpoint);

    // Guardar en cache si fue exitoso
    if (result.success) {
      this.cache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now()
      });
    }

    return result;
  }

  /**
   * Obtener detalle de una propiedad específica
   * @param {string|number} propertyId - ID de la propiedad
   * @returns {Promise}
   */
  async getPropertyDetail(propertyId) {
    const cacheKey = `property_${propertyId}`;

    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return { success: true, data: cached.data, cached: true };
      }
    }

    const endpoint = `/properties/${propertyId}`;
    const result = await this.request(endpoint);

    // Guardar en cache
    if (result.success) {
      this.cache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now()
      });
    }

    return result;
  }

  /**
   * Buscar propiedades destacadas/recomendadas
   * @param {number} limit - Cantidad de propiedades
   * @returns {Promise}
   */
  async getFeaturedProperties(limit = 6) {
    const endpoint = `/properties/featured?limit=${limit}`;
    return await this.request(endpoint);
  }

  /**
   * Obtener propiedades similares a una dada
   * @param {string|number} propertyId
   * @param {number} limit
   * @returns {Promise}
   */
  async getSimilarProperties(propertyId, limit = 3) {
    const endpoint = `/properties/${propertyId}/similar?limit=${limit}`;
    return await this.request(endpoint);
  }

  /**
   * Crear consulta sobre una propiedad
   * @param {Object} data - Datos de la consulta
   * @returns {Promise}
   */
  async createInquiry(data) {
    const endpoint = '/inquiries';
    return await this.request(endpoint, {
      method: 'POST',
      body: data
    });
  }

  /**
   * Obtener tasación de propiedad
   * @param {Object} propertyData - Datos de la propiedad a tasar
   * @returns {Promise}
   */
  async getValuation(propertyData) {
    const endpoint = '/valuations';
    return await this.request(endpoint, {
      method: 'POST',
      body: propertyData
    });
  }

  /**
   * Obtener estadísticas de mercado
   * @param {Object} filters - Filtros para estadísticas
   * @returns {Promise}
   */
  async getMarketStats(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const endpoint = `/market/stats?${queryParams.toString()}`;
    return await this.request(endpoint);
  }

  /**
   * Limpiar cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache limpiado');
  }

  /**
   * Obtener items del cache
   */
  getCacheSize() {
    return this.cache.size;
  }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XintelAPI;
}

// Hacer disponible globalmente en el navegador
if (typeof window !== 'undefined') {
  window.XintelAPI = XintelAPI;
}
