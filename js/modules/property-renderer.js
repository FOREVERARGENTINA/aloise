/**
 * MÓDULO: Property Renderer
 * Renderizado de propiedades desde datos de la API
 */

class PropertyRenderer {
  constructor() {
    this.defaultImage = '/images/properties/placeholder.jpg';
  }

  /**
   * Formatear precio
   */
  formatPrice(price, currency = 'USD') {
    if (!price) return 'Consultar';

    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return formatter.format(price);
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
      url
    } = property;

    // Imagen principal
    const mainImage = images.length > 0 ? images[0] : this.defaultImage;

    // Badge color según operación
    const badgeColor = operation_type === 'venta'
      ? 'var(--color-accent)'
      : 'var(--color-primary)';

    const badgeTextColor = operation_type === 'venta'
      ? 'var(--color-gray-900)'
      : 'white';

    return `
      <article class="card property-card" data-property-id="${id}">
        <div style="position: relative;">
          <img
            src="${mainImage}"
            alt="${title || `${this.formatPropertyType(property_type)} en ${location}`}"
            class="card__image"
            loading="lazy"
          >
          <span class="card__badge" style="background-color: ${badgeColor}; color: ${badgeTextColor};">
            ${this.formatOperationType(operation_type)}
          </span>
        </div>
        <div class="card__body">
          <p class="property-card__price">${this.formatPrice(price, currency)}</p>
          <h3 class="card__title">${title || `${this.formatPropertyType(property_type)} en ${location}`}</h3>
          <p class="card__description">${this.truncateText(description, 120)}</p>

          <div class="property-card__details">
            ${bedrooms ? `
              <span class="property-card__detail" title="${bedrooms} dormitorio${bedrooms > 1 ? 's' : ''}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                ${bedrooms} ${bedrooms > 1 ? 'dorms' : 'dorm'}
              </span>
            ` : ''}

            ${bathrooms ? `
              <span class="property-card__detail" title="${bathrooms} baño${bathrooms > 1 ? 's' : ''}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                </svg>
                ${bathrooms} ${bathrooms > 1 ? 'baños' : 'baño'}
              </span>
            ` : ''}

            ${area || covered_area ? `
              <span class="property-card__detail" title="${area || covered_area} m²">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m-4 12h2a2 2 0 002-2v-2" />
                </svg>
                ${area || covered_area} m²
              </span>
            ` : ''}
          </div>
        </div>
        <div class="card__footer">
          <a href="${url || `/propiedades/${id}`}" class="btn btn-primary btn-sm">Ver detalles</a>
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

    const html = properties.map(property => this.renderPropertyCard(property)).join('');
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
      html += `<button class="btn btn-outline btn-sm" onclick="${onPageChange}(${currentPage - 1})" aria-label="Página anterior">‹</button>`;
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
      html += `<button class="btn btn-outline btn-sm" onclick="${onPageChange}(${currentPage + 1})" aria-label="Página siguiente">›</button>`;
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
