/**
 * MÓDULO: Xintel API
 * Manejo de llamadas a la API de Xintel
 *
 * Documentación Xintel: https://www.xintel.com.ar/
 */

class XintelAPI {
  constructor(config = {}) {
    // Configuración de la API
    this.empresa = config.empresa || '';
    this.apiKey = config.apiKey || '';
    this.baseURL = config.baseURL || 'https://xintelapi.com.ar/';
    this.timeout = config.timeout || 10000;

    // Cache de propiedades (opcional, para mejorar performance)
    this.cache = new Map();
    this.cacheTimeout = config.cacheTimeout || 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Realizar petición HTTP a Xintel API (formato POST con json, inm, apiK)
   * @param {string} endpoint - El endpoint de Xintel (ej: 'fichas.destacadas')
   * @param {Object} params - Parámetros adicionales
   */
  async request(endpoint, params = {}) {
    const url = this.baseURL;

    // Formato específico de Xintel - Usar FormData (multipart/form-data)
    const formData = new FormData();
    formData.append('json', endpoint);
    formData.append('inm', this.empresa);
    formData.append('apiK', this.apiKey);

    // Agregar parámetros adicionales
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        formData.append(key, params[key]);
      }
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      // IMPORTANTE: No agregar Content-Type header, FormData lo hace automáticamente
      const response = await fetch(url, {
        method: 'POST',
        body: formData,  // FormData sin header Content-Type
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Xintel API Error Response:', errorText.substring(0, 500));
        throw new Error(`HTTP error! status: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      // Leer la respuesta como texto primero
      const responseText = await response.text();

      // Intentar parsear como JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Error parsing JSON:', parseError);
        console.error('Raw response:', responseText);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }

      // Verificar si hay error en la respuesta de Xintel
      if (data.error) {
        throw new Error(data.error);
      }

      return { success: true, data };

    } catch (error) {
      console.error('❌ Xintel API Error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Obtener listado de propiedades con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise}
   */
  async getProperties(filters = {}) {
    const cacheKey = `properties_${JSON.stringify(filters)}`;

    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return { success: true, data: cached.data, cached: true };
      }
    }

    // Mapeo de códigos de Xintel
    const operationMap = {
      'venta': 'V',
      'alquiler': 'A',
      'alquiler_temporal': 'T'
    };

    const typeMap = {
      'departamento': 'D',
      'casa': 'C',
      'ph': 'P',
      'terreno': 'T',
      'local': 'L',
      'oficina': 'O',
      'cochera': 'G'
    };

    // Construir parámetros según formato de Xintel
    const params = {
      page: (filters.page || 1) - 1, // Xintel empieza en 0
      rppagina: filters.limit || 12
    };

    // Mapear filtros al formato de Xintel
    if (filters.operationType && operationMap[filters.operationType]) {
      params.tipo_operacion = operationMap[filters.operationType];
    }
    if (filters.propertyType && typeMap[filters.propertyType]) {
      params.tipo_inmueble = typeMap[filters.propertyType];
    }
    if (filters.location) params.barrios1 = filters.location;
    if (filters.minPrice) params.valor_minimo = filters.minPrice;
    if (filters.maxPrice) params.valor_maximo = filters.maxPrice;
    if (filters.minRooms) params.Ambientes = filters.minRooms;

    const result = await this.request('resultados.fichas', params);

    // Normalizar respuesta
    if (result.success && result.data.resultado) {
      const normalizedData = this.normalizeResponse(result.data);
      const page = (filters.page || 1);
      const limit = filters.limit || 12;
      const totalItems = normalizedData.properties.length;

      const responseData = {
        properties: normalizedData.properties,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(totalItems / limit),
          total_items: totalItems,
          items_per_page: limit
        }
      };

      // Guardar en cache
      this.cache.set(cacheKey, {
        data: responseData,
        timestamp: Date.now()
      });

      return { success: true, data: responseData };
    }

    return result;
  }

  /**
   * Obtener detalle de una propiedad específica
   * IMPORTANTE: Este endpoint devuelve TODAS las fotos (único que lo hace)
   * @param {string|number} propertyId - ID de la propiedad (número de ficha)
   * @returns {Promise}
   */
  async getPropertyDetail(propertyId) {
    const rawId = String(propertyId ?? '').trim();
    const numericId = rawId.replace(/\D/g, '');

    // Xintel suele esperar solo número. Aceptamos IDs con prefijos y probamos variantes.
    const candidateIds = [];
    if (rawId) candidateIds.push(rawId);
    if (numericId && numericId !== rawId) candidateIds.push(numericId);

    const cacheKey = `property_${candidateIds[0] || rawId || propertyId}`;

    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return { success: true, data: cached.data, cached: true };
      }
    }

    // Probar candidatos y preferir la respuesta más completa
    let bestProperty = null;
    let bestScore = -1;
    let lastResult = null;

    for (const id of candidateIds.length ? candidateIds : [rawId]) {
      if (!id) continue;

      const result = await this.request('fichas.propiedades', { id });
      lastResult = result;

      // Normalizar respuesta (fichas.propiedades usa "ficha" singular, no "fichas" plural)
      if (result.success && result.data && result.data.resultado) {
        const fichas = result.data.resultado.ficha; // Singular!
        const images = result.data.resultado.img;

        if (fichas && fichas.length > 0) {
          const property = fichas[0];

          // Mapear TODAS las imágenes (este endpoint devuelve todas)
          if (images && Array.isArray(images)) {
            property.fotos = images;
            property.img_princ = images[0];
          }

          // Scoring: priorizar superficies (in_scu / in_sto) y luego otras claves
          const hasScu = property.in_scu && String(property.in_scu).trim() !== '0';
          const hasSto = property.in_sto && String(property.in_sto).trim() !== '0';
          const hasObs = property.in_obs && String(property.in_obs).trim() !== '';
          const hasTitle = property.titulo && String(property.titulo).trim() !== '';
          const hasImages = Array.isArray(property.fotos) && property.fotos.length > 0;

          const score =
            (hasScu ? 4 : 0) +
            (hasSto ? 3 : 0) +
            (hasImages ? 2 : 0) +
            (hasTitle ? 1 : 0) +
            (hasObs ? 1 : 0);

          if (score > bestScore) {
            bestScore = score;
            bestProperty = property;
          }

          // Si ya tenemos superficies, no hace falta seguir probando
          if (hasScu || hasSto) {
            bestProperty = property;
            break;
          }
        }
      }
    }

    if (bestProperty) {
      // Log temporal para debug de cocheras
      console.log('🚗 Debug cocheras - Campo in_coc (CORRECTO):', bestProperty.in_coc);
      console.log('🚗 Debug cocheras - Campo garage:', bestProperty.garage);
      console.log('🚗 Debug cocheras - Campo in_gar:', bestProperty.in_gar);
      console.log('🔍 Todos los campos relacionados:', Object.keys(bestProperty).filter(k => k.toLowerCase().includes('gar') || k.toLowerCase().includes('coch') || k.toLowerCase().includes('park') || k === 'in_coc'));

      this.cache.set(cacheKey, {
        data: bestProperty,
        timestamp: Date.now()
      });
      return { success: true, data: bestProperty };
    }

    return lastResult || { success: false, error: 'No se pudo obtener la propiedad', data: null };
  }

  /**
   * Buscar propiedades destacadas/recomendadas
   * @param {number} limit - Cantidad de propiedades
   * @returns {Promise}
   */
  async getFeaturedProperties(limit = 6) {
    return await this.request('fichas.destacadas', { limit });
  }

  /**
   * Obtener últimas propiedades ingresadas
   * Usa resultados.fichas en lugar de fichas.ultimas porque es más confiable
   * @param {number} limit - Cantidad de propiedades
   * @returns {Promise}
   */
  async getLatestProperties(limit = 10) {
    const cacheKey = `latest_${limit}`;

    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return { success: true, data: cached.data, cached: true };
      }
    }

    // Usar resultados.fichas con límite (más confiable que fichas.ultimas)
    const result = await this.request('resultados.fichas', {
      rppagina: limit,
      page: 0
    });

    // Normalizar respuesta
    if (result.success && result.data.resultado) {
      const normalizedData = this.normalizeResponse(result.data);

      // Guardar en cache
      this.cache.set(cacheKey, {
        data: normalizedData,
        timestamp: Date.now()
      });

      return { success: true, data: normalizedData };
    }

    return result;
  }

  /**
   * Normalizar respuesta de Xintel (mapear imágenes a fichas)
   * @param {Object} data - Respuesta cruda de Xintel
   * @returns {Object} - Datos normalizados
   */
  normalizeResponse(data) {
    if (!data.resultado || !data.resultado.fichas) {
      return { properties: [] };
    }

    const fichas = data.resultado.fichas;
    const images = data.resultado.img || [];

    // Mapear imágenes a cada ficha
    const properties = fichas.map((ficha, index) => {
      if (images[index]) {
        ficha.fotos = Array.isArray(images[index]) ? images[index] : [images[index]];
        ficha.img_princ = ficha.fotos[0];
      }
      return ficha;
    });

    return { properties };
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
