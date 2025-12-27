Resumen técnico de la implementación del badge de estado:

Se agregó un badge visual (cinta diagonal) para mostrar el estado de la propiedad (ej: "RESERVADA", "VENDIDA", etc.) en el listado de propiedades y como badge inline en la ficha de detalle.
El texto del badge se toma dinámicamente del campo de estado que retorna la API de Xintel (por ejemplo: propiedad.estado o propiedad.in_est).
El badge solo aparece si el estado es distinto de "disponible".
En el listado, el badge es una cinta diagonal roja en la esquina superior derecha de la imagen de la propiedad (.property-status-badge con CSS transform y posición absoluta).
En la ficha de detalle, el badge aparece como un badge inline junto al tipo de operación, sin rotación.
El sistema es dinámico: cualquier estado nuevo que envíe Xintel se mostrará automáticamente, sin cambios de código.
Los cambios se implementaron en los archivos:
properties.js (listado)
ficha.js (detalle)
styles.css (estilos de los badges)

/* Badge diagonal para el listado */
.property-status-badge {
    position: absolute;
    top: 20px;
    right: -35px;
    background-color: #dc3545;
    color: var(--color-white);
    padding: 6px 40px;
    text-align: center;
    transform: rotate(45deg);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    letter-spacing: 0.5px;
}

/* Contexto de posicionamiento para la imagen */
.property-card .property-image {
    position: relative;
    overflow: hidden;
}

/* Badge inline para la ficha de detalle */
.property-header .property-status-badge {
    position: static;
    display: inline-block;
    transform: none;
    width: auto;
    background-color: #dc3545;
    color: var(--color-white);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    text-transform: uppercase;
    margin-left: var(--spacing-sm);
    box-shadow: none;
}// ...existing code...
// Estado de la propiedad (ej: Reservado, Vendido, etc.)
const estado = this.property.estado || this.property.in_est || '';
// ...existing code...
container.innerHTML = `
    <div class="property-detail">
        <!-- Gallery ... -->
        <div class="property-info-section">
            <div class="property-header">
                <div>
                    <span class="property-badge">${tipoOperacion}</span>
                    ${tipoInmueble ? `<span class="property-type">${tipoInmueble}</span>` : ''}
                    ${estado && estado.toLowerCase() !== 'disponible' ? `<span class="property-status-badge">${estado}</span>` : ''}
                </div>
                // ...existing code...
            </div>
        </div>
    </div>
`;
// ...existing code...// ...existing code...
// Estado de la propiedad (ej: Reservado, Vendido, etc.)
const estado = propiedad.estado || propiedad.in_est || '';
// ...existing code...
card.innerHTML = `
    <div class="property-image">
        <img src="${imagenPrincipal}" alt="${titulo}" loading="lazy">
        ${tipoOperacion ? `<span class="property-badge">${tipoOperacion}</span>` : ''}
        ${estado && estado.toLowerCase() !== 'disponible' ? `<span class="property-status-badge">${estado}</span>` : ''}
    </div>
    // ...existing code...
`;
// ...existing code...