/**
 * MÓDULO: Property Renderer
 * Renderizado de propiedades desde datos de la API
 *
 * VERSIÓN: 1.4.0 - Incluye tipo de operación en títulos
 * ÚLTIMA ACTUALIZACIÓN: 2026-02-12 16:30
 */

class PropertyRenderer {
  constructor() {
    console.log('PropertyRenderer v1.4.0 - Títulos con operación cargado');
    this.defaultImage = '/images/properties/placeholder.jpg';
  }

  /**
   * Normalizar propiedad de Xintel al formato esperado
   * @param {Object} xintelProp - Propiedad en formato Xintel
   * @returns {Object} - Propiedad en formato normalizado
   */
  normalizeXintelProperty(xintelProp) {
    // Si ya tiene el formato normalizado, devolverla tal cual
    if (xintelProp.operation_type && xintelProp.property_type) {
      return xintelProp;
    }

    // Mapear códigos de operación de Xintel
    const operationMap = {
      'A': 'alquiler',
      'V': 'venta',
      'T': 'alquiler_temporal',
      'M': 'venta_alquiler'
    };

    // Mapear códigos de tipo de Xintel
    const typeMap = {
      'D': 'departamento',
      'C': 'casa',
      'P': 'ph',
      'T': 'terreno',
      'L': 'local',
      'O': 'oficina',
      'G': 'cochera'
    };

    // Determinar operación y precio
    const operation = operationMap[xintelProp.in_ope] || 'venta';
    const isRent = xintelProp.in_ope === 'A' || xintelProp.in_ope === 'T';

    // Precio y moneda según tipo de operación
    let price = 0;
    let currency = 'USD';

    if (isRent) {
      // ALQUILER: siempre en pesos (ARS)
      price = parseInt(xintelProp.in_vaa) || 0;
      currency = 'ARS';
    } else {
      // VENTA: siempre en dólares (USD)
      // Preferir in_vlu (USD), si no existe usar in_val
      price = parseInt(xintelProp.in_vlu) || parseInt(xintelProp.in_val) || 0;
      currency = 'USD';
    }

    // Construcción del título
    const propertyType = typeMap[xintelProp.in_tip] || xintelProp.tipo || 'Propiedad';
    const location = xintelProp.in_bar || xintelProp.in_loc || '';
    const ambientes = xintelProp.in_amb || xintelProp.cantidad_ambientes || '';

    // Mapear tipo de operación a texto
    const operationText = {
      'venta': 'venta',
      'alquiler': 'alquiler',
      'alquiler_temporal': 'alquiler temporal',
      'venta_alquiler': 'venta/alquiler'
    };

    // Construir título completo: "Casa en alquiler 3 ambientes"
    let constructedTitle = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);

    // Agregar tipo de operación
    if (operation) {
      const opText = operationText[operation] || operation;
      constructedTitle += ` en ${opText}`;
    }

    // Agregar ambientes
    if (ambientes) {
      const numAmb = String(ambientes).replace(/[^0-9]/g, '');
      if (numAmb) constructedTitle += ` ${numAmb} ambientes`;
    }

    // Usar título de Xintel solo si está completo
    const xintelTitle = (xintelProp.titulo || '').trim();

    // Detectar títulos incompletos:
    // 1. Termina en "en" (ej: "Casa en")
    // 2. Termina en número solo (ej: "Casa en alquiler 3")
    // 3. Falta el tipo de operación en patrones "Casa en 3 ambientes"
    const normalizedTitle = xintelTitle.toLowerCase();
    const operationKeywords = {
      venta: ['venta', 'vta'],
      alquiler: ['alquiler', 'alq'],
      alquiler_temporal: ['alquiler temporal', 'temporal'],
      venta_alquiler: ['venta', 'alquiler']
    };
    const keywordsForOperation = operationKeywords[operation] || [];
    const hasOperationInTitle = keywordsForOperation.some((keyword) => normalizedTitle.includes(keyword));
    const looksLikeMissingOperation =
      /\ben\s+\d+\s*(amb|amb\.|ambientes?)\b/i.test(xintelTitle) && !hasOperationInTitle;

    const isIncomplete =
      xintelTitle.match(/\sen\s*$/i) || // Termina en "en"
      xintelTitle.match(/\s\d+\s*$/) || // Termina en número
      looksLikeMissingOperation; // "Casa en 3 ambientes"

    let finalTitle = (xintelTitle && !isIncomplete) ? xintelTitle : constructedTitle;

    // Limpiar espacios dobles
    finalTitle = finalTitle.replace(/\s+/g, ' ').trim();

    const parseDateValue = (value) => {
      if (!value) return null;
      const normalized = String(value).trim().replace(/\s+/g, ' ');
      const iso = normalized.replace(/\s/, 'T');
      const timestamp = Date.parse(iso);
      return Number.isFinite(timestamp) ? timestamp : null;
    };

    const dateCandidates = [
      xintelProp.in_fec,
      xintelProp.fechaac,
      xintelProp.created,
      xintelProp.fecha,
      xintelProp.in_fea,
      xintelProp.fecactdata,
      xintelProp.created_at,
      xintelProp.fecha_ingreso,
      xintelProp.fecha_alta
    ];

    const listingDate = dateCandidates.map(parseDateValue).find((value) => value !== null) || null;

    return {
      id: xintelProp.in_fic || xintelProp.in_num,
      title: finalTitle,
      description: xintelProp.in_obs || '',
      price: price,
      currency: currency,
      operation_type: operation,
      property_type: propertyType,
      location: location || 'Sin ubicación',
      rooms: parseInt(xintelProp.in_amb) || 0,
      bedrooms: parseInt(xintelProp.ti_dor || xintelProp.cantidad_dormitorios) || 0,
      bathrooms: parseInt(xintelProp.in_bao) || 0,
      garages: parseInt(xintelProp.in_coc || xintelProp.garage || xintelProp.in_gar) || 0,
      // Mantener decimales para superficies
      area: (xintelProp.in_sto ? parseFloat(String(xintelProp.in_sto).replace(',', '.')) : (xintelProp.in_sto === 0 ? 0 : (xintelProp.in_scu ? parseFloat(String(xintelProp.in_scu).replace(',', '.')) : 0))) || 0,
      covered_area: (xintelProp.in_scu ? parseFloat(String(xintelProp.in_scu).replace(',', '.')) : 0) || 0,
      // Superficie semicubierta (varía el campo según integración)
      semi_covered: (xintelProp.sup_semicubierta ? parseFloat(String(xintelProp.sup_semicubierta).replace(',', '.')) : (xintelProp.in_sut ? parseFloat(String(xintelProp.in_sut).replace(',', '.')) : 0)) || 0,
      expenses: isRent ? (parseInt(xintelProp.in_exp) || 0) : 0,
      images: xintelProp.fotos || (xintelProp.img_princ ? [xintelProp.img_princ] : []),
      url: `/ficha?ficha=GAB${xintelProp.in_num || xintelProp.in_fic}`,
      // Mantener referencia original
      _xintel: xintelProp,
      listingDate
    };
  }

  /**
   * Formatear precio
   */
  formatPrice(price, currency = 'USD') {
    if (!price) return 'Consultar';

    const num = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

    // Símbolos de moneda
    const simbolos = {
      'USD': 'USD',  // Mostrar "USD" en lugar de "US$"
      'ARS': '$',    // Mostrar "$" para pesos
      'EUR': '\u20AC'
    };

    const simbolo = simbolos[currency] || 'USD';
    return `${simbolo} ${num}`;
  }

  /**
   * Formatear tipo de operación
   */
  formatOperationType(type) {
    const types = {
      'venta': 'VENTA',
      'alquiler': 'ALQUILER',
      'alquiler_temporal': 'ALQUILER TEMPORAL',
      'venta_alquiler': 'VENTA/ALQUILER'
    };
    return types[type] || type.toUpperCase();
  }

  /**
   * Formatear tipo de propiedad
   */
  formatPropertyType(type) {
    const types = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'ph': 'PH',
      'local': 'Local Comercial',
      'oficina': 'Oficina',
      'terreno': 'Terreno',
      'galpon': 'Galpón',
      'cochera': 'Cochera'
    };
    return types[type] || type;
  }

  /**
   * Renderizar tarjeta de propiedad (card)
   */
  renderPropertyCard(property) {
    const {
      id,
      title,
      description,
      price,
      currency = 'USD',
      operation_type,
      property_type,
      location,
      rooms,
      bedrooms,
      bathrooms,
      area,
      covered_area,
      images = [],
      url,
      _xintel // Referencia original para acceder a campos de estado
    } = property;

    // Imagen principal
    const mainImage = images.length > 0 ? images[0] : this.defaultImage;
    const estado = _xintel ? (_xintel.estado || _xintel.in_est || '') : '';
    const estadoLower = String(estado || '').toLowerCase();
    const showEstado = estadoLower && estadoLower !== 'disponible';
    const operationBadgeClass = `property-badge--${(operation_type || 'venta').toLowerCase()}`;
    let statusBadgeClass = 'property-badge--status';
    if (estadoLower.includes('reserv')) statusBadgeClass += ' property-badge--reserved';
    if (estadoLower.includes('vend')) statusBadgeClass += ' property-badge--sold';

    // Datos de ubicación
    const city = (_xintel?.in_loc || _xintel?.localidad || location || '').trim();
    const barrio = (_xintel?.in_bar || _xintel?.barrio || '').trim();
    const street = (_xintel?.in_cal || _xintel?.calle || '').trim();

    // El título ya viene normalizado y completo desde normalizeXintelProperty
    // NO limpiar ambientes porque el título ya está bien formado
    const cleanedTitle = title || `${this.formatPropertyType(property_type)}${barrio ? ` en ${barrio}` : ''}`;

    // Feature builder
    const formatArea = (n) => {
      if (n === null || n === undefined) return null;
      const num = Number(n);
      if (!Number.isFinite(num) || num <= 0) return null;
      const rounded = Math.round(num * 100) / 100;
      return Number.isInteger(rounded)
        ? String(rounded)
        : String(rounded).replace(/\.0+$/, '').replace(/0+$/, '').replace(/\.$/, '');
    };

    const areaFormatted = formatArea(area || covered_area);
    const garagesValue = property.garages || parseInt(_xintel?.in_coc) || parseInt(_xintel?.garage) || parseInt(_xintel?.in_gar) || 0;
    const features = [];

    if (areaFormatted) {
      features.push(`
        <span class="property-feature" title="${areaFormatted} m\u00B2">
          <img src="/DATOS/metros2.png" alt="" role="presentation" class="property-feature__icon-img">
          ${areaFormatted} m\u00B2
        </span>
      `);
    }

    if (bedrooms) {
      features.push(`
        <span class="property-feature" title="${bedrooms} dormitorio${bedrooms > 1 ? 's' : ''}">
          <img src="/DATOS/dormitorios2.png" alt="" role="presentation" class="property-feature__icon-img">
          ${bedrooms}
        </span>
      `);
    }

    if (bathrooms) {
      features.push(`
        <span class="property-feature" title="${bathrooms} baño${bathrooms > 1 ? 's' : ''}">
          <img src="/DATOS/wc2.png" alt="" role="presentation" class="property-feature__icon-img">
          ${bathrooms}
        </span>
      `);
    }

    if (garagesValue > 0) {
      features.push(`
        <span class="property-feature" title="${garagesValue} cochera${garagesValue > 1 ? 's' : ''}">
          <span class="material-symbols-outlined property-feature__icon" aria-hidden="true">directions_car</span>
          ${garagesValue}
        </span>
      `);
    }

    const featuresHtml = features.join('<span class="property-feature__divider">-</span>');

    // Expensas (solo para alquileres)
    const isRentCard = operation_type === 'alquiler' || operation_type === 'alquiler_temporal';
    const expenses = property.expenses || 0;
    const expensesHtml = isRentCard
      ? `<div class="property-expenses-overlay">${expenses > 0 ? `Expensas: ${this.formatPrice(expenses, 'ARS')}` : 'Sin expensas'}</div>`
      : '';

    return `
      <article class="property-card property-card--featured" data-property-id="${id}">
        <a href="${url || `/propiedades/${id}`}" class="property-image-link">
          <div class="property-image">
            <img
              src="${mainImage}"
              alt="${cleanedTitle || `${this.formatPropertyType(property_type)} en ${location}`}"
              class="card__image"
              loading="lazy"
            >
            <span class="property-badge property-badge--operation ${operationBadgeClass}">${this.formatOperationType(operation_type)}</span>
            ${showEstado ? `<span class="property-badge ${statusBadgeClass}">${estado}</span>` : ''}
            <div class="property-price-overlay">${this.formatPrice(price, currency)}${expensesHtml}</div>
          </div>
        </a>
        <div class="card__body">
          <p class="property-card__city">${city || location || 'Ubicación a confirmar'}</p>
          <h3 class="property-card__title property-card__title--featured">${cleanedTitle}</h3>
          ${street ? `<p class="property-card__street">${street}</p>` : (barrio ? `<p class="property-card__street">${barrio}</p>` : '')}

          <div class="property-card__details property-card__details--featured">
            ${featuresHtml || '<span class="property-feature">Características a confirmar</span>'}
          </div>

          <div class="property-card__cta">
            <a href="${url || `/propiedades/${id}`}" class="property-card__link">Ver propiedad</a>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Renderizar grid de propiedades
   */
  renderPropertiesGrid(properties, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error(`Container ${containerSelector} no encontrado`);
      return;
    }

    if (!properties || properties.length === 0) {
      container.innerHTML = this.renderEmptyState();
      return;
    }

    // Normalizar propiedades de Xintel antes de renderizar
    const normalizedProperties = properties.map(prop => this.normalizeXintelProperty(prop));
    const html = normalizedProperties.map(property => this.renderPropertyCard(property)).join('');
    container.innerHTML = html;
  }

  /**
   * Estado vacío cuando no hay propiedades
   */
  renderEmptyState() {
    return `
      <div class="empty-state" style="text-align: center; padding: var(--space-4xl) var(--space-xl); grid-column: 1 / -1;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin: 0 auto var(--space-lg); color: var(--color-gray-400);">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <h3 style="color: var(--color-gray-700); margin-bottom: var(--space-sm);">No se encontraron propiedades</h3>
        <p style="color: var(--color-gray-600);">Intentá ajustar los filtros de búsqueda</p>
      </div>
    `;
  }

  /**
   * Estado de carga (loading)
   */
  renderLoadingState(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `
      <div class="loading-state" style="text-align: center; padding: var(--space-4xl) var(--space-xl); grid-column: 1 / -1;">
        <div class="loading" style="margin: 0 auto var(--space-lg);"></div>
        <p style="color: var(--color-gray-600);">Cargando propiedades...</p>
      </div>
    `;
  }

  /**
   * Estado de error
   */
  renderErrorState(containerSelector, message = 'Ocurrió un error al cargar las propiedades') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `
      <div class="error-state" style="text-align: center; padding: var(--space-4xl) var(--space-xl); grid-column: 1 / -1;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin: 0 auto var(--space-lg); color: var(--color-error);">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 style="color: var(--color-gray-700); margin-bottom: var(--space-sm);">Error</h3>
        <p style="color: var(--color-gray-600); margin-bottom: var(--space-lg);">${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Reintentar</button>
      </div>
    `;
  }

  /**
   * Paginación
   */
  renderPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';

    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    let html = '<div class="pagination" style="display: flex; justify-content: center; gap: var(--space-sm); margin-top: var(--space-2xl);">';

    // Botón anterior
    if (currentPage > 1) {
      html += `<button class="btn btn-outline btn-sm" onclick="${onPageChange}(${currentPage - 1})" aria-label="Página anterior">\u2039</button>`;
    }

    // Primera página
    if (startPage > 1) {
      html += `<button class="btn btn-outline btn-sm" onclick="${onPageChange}(1)">1</button>`;
      if (startPage > 2) {
        html += '<span style="padding: var(--space-sm);">...</span>';
      }
    }

    // Páginas numeradas
    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage;
      html += `<button class="btn ${isActive ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="${onPageChange}(${i})" ${isActive ? 'aria-current="page"' : ''}>${i}</button>`;
    }

    // Última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += '<span style="padding: var(--space-sm);">...</span>';
      }
      html += `<button class="btn btn-outline btn-sm" onclick="${onPageChange}(${totalPages})">${totalPages}</button>`;
    }

    // Botón siguiente
    if (currentPage < totalPages) {
      html += `<button class="btn btn-outline btn-sm" onclick="${onPageChange}(${currentPage + 1})" aria-label="Página siguiente">\u203A</button>`;
    }

    html += '</div>';
    return html;
  }

  /**
   * Truncar texto
   */
  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Renderizar detalle completo de propiedad
   */
  renderPropertyDetail(property) {
    // Este método se implementaría en una página de detalle separada
    // Por ahora retornamos un placeholder
    return `
      <div class="property-detail">
        <h1>${property.title}</h1>
        <!-- Implementar galería, mapa, características completas, etc. -->
      </div>
    `;
  }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PropertyRenderer;
}

if (typeof window !== 'undefined') {
  window.PropertyRenderer = PropertyRenderer;
}

