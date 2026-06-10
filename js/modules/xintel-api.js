/**
 * MÓDULO: Xintel API
 * Manejo de llamadas a la API de Xintel
 *
 * Documentación Xintel: https://www.xintel.com.ar/
 *
 * VERSIÓN: 2.2.0 - Corregido loop infinito + detección de duplicados
 * ÚLTIMA ACTUALIZACIÓN: 2026-02-12 16:00
 */

class XintelAPI {
  constructor(config = {}) {
    console.log('🚀 XintelAPI v2.2.0 - Loop infinito CORREGIDO');

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
   * IMPORTANTE: Xintel tiene un límite de ~20 propiedades por consulta.
   * Este método implementa paginación automática para obtener todas las propiedades.
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

    // Construir parámetros base según formato de Xintel
    const baseParams = {};

    // Mapear filtros al formato de Xintel
    if (filters.operationType && operationMap[filters.operationType]) {
      baseParams.tipo_operacion = operationMap[filters.operationType];
    }
    if (filters.propertyType && typeMap[filters.propertyType]) {
      baseParams.tipo_inmueble = typeMap[filters.propertyType];
    }
    if (filters.location) baseParams.barrios1 = filters.location;
    if (filters.minPrice) baseParams.valor_minimo = filters.minPrice;
    if (filters.maxPrice) baseParams.valor_maximo = filters.maxPrice;
    // No enviamos dormitorios a Xintel desde aca porque en este proyecto
    // el dato confiable llega en la ficha (`ti_dor` / `cantidad_dormitorios`)
    // y el filtro anterior estaba impactando Ambientes por error.

    // PAGINACIÓN AUTOMÁTICA
    // Xintel limita a ~20 resultados por consulta, así que necesitamos múltiples llamadas
    const requestedLimit = filters.limit || 60;
    const XINTEL_MAX_PER_PAGE = 20; // Límite real de Xintel
    const allProperties = [];
    let currentPage = 0;
    let totalFromAPI = 0;
    let shouldContinue = true;

    console.log(`🔍 Solicitando hasta ${requestedLimit} propiedades de Xintel...`);

    const maxPages = Math.max(6, Math.ceil(requestedLimit / XINTEL_MAX_PER_PAGE) + 1);

    while (shouldContinue && allProperties.length < requestedLimit) {
      const params = {
        ...baseParams,
        page: currentPage,
        rppagina: Math.min(XINTEL_MAX_PER_PAGE, requestedLimit - allProperties.length)
      };

      console.log(`📄 Página ${currentPage + 1}: solicitando ${params.rppagina} propiedades...`);

      const result = await this.request('resultados.fichas', params);

      if (!result.success || !result.data.resultado) {
        // Si falla alguna página, devolver lo que tenemos hasta ahora
        console.warn(`⚠️ Error en página ${currentPage + 1}, usando ${allProperties.length} propiedades obtenidas`);
        break;
      }

      const normalizedData = this.normalizeResponse(result.data);
      const receivedProperties = normalizedData.properties || [];

      // Actualizar total si es mayor (Xintel a veces reporta mal en la primera página)
      const apiTotal = normalizedData.total || 0;
      if (apiTotal > totalFromAPI) {
        totalFromAPI = apiTotal;
      }

      console.log(`✅ Página ${currentPage + 1}: recibidas ${receivedProperties.length} propiedades (total API: ${apiTotal})`);

      if (receivedProperties.length === 0) {
        // No hay más propiedades
        console.log('🛑 No hay más propiedades, deteniendo paginación');
        shouldContinue = false;
        break;
      }

      // Contar cuántas propiedades nuevas agregamos
      let newPropertiesCount = 0;

      // Agregar propiedades (evitar duplicados)
      receivedProperties.forEach(prop => {
        const id = prop.in_fic || prop.in_num;
        const isDuplicate = allProperties.some(p => (p.in_fic || p.in_num) === id);
        if (!isDuplicate) {
          allProperties.push(prop);
          newPropertiesCount++;
        }
      });

      console.log(`➕ ${newPropertiesCount} propiedades nuevas agregadas (${receivedProperties.length - newPropertiesCount} duplicadas)`);

      // CONDICIONES DE PARADA:

      // 1. Si NO agregamos ninguna propiedad nueva, es porque todas eran duplicadas
      if (newPropertiesCount === 0) {
        console.log('🛑 Todas las propiedades recibidas eran duplicadas, deteniendo paginación');
        shouldContinue = false;
        break;
      }

      // 2. Si recibimos menos de lo que pedimos, es la última página
      if (receivedProperties.length < params.rppagina) {
        console.log(`🛑 Última página detectada (recibidas ${receivedProperties.length} < solicitadas ${params.rppagina})`);
        shouldContinue = false;
      }

      currentPage++;

      // Límite de seguridad para evitar loops infinitos
      if (currentPage >= maxPages) {
        console.warn(`⚠️ Límite de seguridad alcanzado (${maxPages} páginas)`);
        shouldContinue = false;
      }
    }

    console.log(`🎯 Total obtenido: ${allProperties.length} de ${totalFromAPI} propiedades disponibles`);

    // Construir respuesta final
    const page = filters.page || 1;
    const limit = requestedLimit;
    const totalItems = Math.max(totalFromAPI, allProperties.length);
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;

    const responseData = {
      properties: allProperties,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: totalItems,
        items_per_page: limit,
        fetched_items: allProperties.length
      }
    };

    // Guardar en cache
    this.cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    return { success: true, data: responseData };
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
    const cacheKey = `featured_${limit}`;

    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return { success: true, data: cached.data, cached: true };
      }
    }

    const result = await this.request('fichas.destacadas', { limit });

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
    const resultado = data?.resultado;
    if (!resultado || !Array.isArray(resultado.fichas)) {
      return { properties: [], total: 0, resultado };
    }

    const fichas = resultado.fichas;
    const images = Array.isArray(resultado.img) ? resultado.img : [];

    const parseDateValue = (value) => {
      if (!value) return null;
      const normalized = String(value).trim().replace(/\s+/g, ' ');
      const iso = normalized.replace(' ', 'T');
      const timestamp = Date.parse(iso);
      return Number.isFinite(timestamp) ? timestamp : null;
    };

    const dateCandidatesForProperty = (property) => {
      return [
        property?.fechaac_inmueble,
        property?.created,
        property?.created_at,
        property?.fecha_ingreso,
        property?.fecha_alta,
        property?.in_fea,
        property?.fechaac,
        property?.fecactdata,
        property?.fecha,
        property?.in_fec
      ]
        .map(parseDateValue)
        .find((value) => value !== null) || null;
    };

    const properties = fichas.map((ficha, index) => {
      if (images[index]) {
        ficha.fotos = Array.isArray(images[index]) ? images[index] : [images[index]];
        ficha.img_princ = ficha.fotos[0];
      }
      // Try known date fields first, then scan all fields for date-like values
      let listingDate = dateCandidatesForProperty(ficha);
      if (!listingDate) {
        for (const key of Object.keys(ficha)) {
          const kl = key.toLowerCase();
          if (kl.includes('fec') || kl.includes('date') || kl.includes('alta') || kl.includes('creat') || kl.includes('ingres')) {
            const parsed = parseDateValue(ficha[key]);
            if (parsed) { listingDate = parsed; break; }
          }
        }
      }
      // Fallback: use API order (inverted index) so items without date stay in API order
      ficha.listingDate = listingDate;
      ficha._apiOrder = index;
      return ficha;
    });

    const toNumber = (value) => {
      if (value === null || value === undefined || value === '') return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const totalCandidates = [
      data?.total,
      data?.total_items,
      data?.totalitems,
      resultado?.total,
      resultado?.total_items,
      resultado?.totalitems,
      resultado?.totalfichas,
      resultado?.total_fichas,
      resultado?.cantfichas
    ];

    const totalFromApi = totalCandidates.reduce((acc, value) => acc ?? toNumber(value), null);
    const total = totalFromApi ?? properties.length;

    return { properties, total, resultado };
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
