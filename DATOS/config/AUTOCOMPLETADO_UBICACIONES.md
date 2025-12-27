# Autocompletado de Ubicaciones - Código Completo

## Descripción
Sistema de autocompletado para campos de ubicación en formularios de búsqueda de propiedades. Filtra localidades del GBA Oeste y permite navegación con teclado.

## HTML Requerido
```html
<div class="autocomplete-wrapper">
    <input
        type="text"
        id="locationComprar"
        name="location"
        placeholder="¿Dónde querés mudarte?"
        class="search-input location-input"
        autocomplete="off"
    >
    <div class="autocomplete-list" id="locationAutocompleteComprar"></div>
</div>
```

## CSS Requerido (ejemplo básico)
```css
.autocomplete-wrapper {
    position: relative;
}

.autocomplete-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
}

.autocomplete-list.active {
    display: block;
}

.autocomplete-item {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
}

.autocomplete-item:hover,
.autocomplete-item.active {
    background-color: #f8f9fa;
}

.autocomplete-no-results {
    padding: 8px 12px;
    color: #666;
    font-style: italic;
}
```

## JavaScript Completo

```javascript
// ========================================
// Lista de Localidades del GBA Oeste
// ========================================
const localidades = [
    // San Miguel
    'San Miguel',
    'Bella Vista',
    'Muñiz',

    // San Martín
    'San Martín',
    'Villa Ballester',
    'Billinghurst',
    'Chilavert',
    'Villa Maipú',
    'Villa Lynch',
    'Villa Zagala',

    // Morón
    'Morón',
    'Castelar',
    'Haedo',
    'El Palomar',
    'Villa Sarmiento',
    'Morón Sur',

    // Tres de Febrero
    'Caseros',
    'Santos Lugares',
    'Ciudad Jardín Lomas del Palomar',
    'El Libertador',
    'Martín Coronado',
    'Pablo Podestá',
    'Remedios de Escalada de San Martín',
    'Sáenz Peña',
    'Villa Bosch',
    'Villa Raffo',
    'Loma Hermosa',
    'Ciudadela',

    // Hurlingham
    'Hurlingham',
    'Villa Tesei',
    'William Morris'
];

// ========================================
// Inicializar Autocompletado
// ========================================
function initLocationAutocomplete() {
    // Configurar para diferentes campos
    setupAutocomplete('locationComprar', 'locationAutocompleteComprar');
    setupAutocomplete('locationAlquilar', 'locationAutocompleteAlquilar');
    setupAutocomplete('filterLocation', 'locationAutocomplete');
}

// ========================================
// Configurar Autocompletado para un Campo
// ========================================
function setupAutocomplete(inputId, autocompleteId) {
    const input = document.getElementById(inputId);
    const autocompleteList = document.getElementById(autocompleteId);

    if (!input || !autocompleteList) return;

    let currentFocus = -1;

    // Evento input: filtrar localidades
    input.addEventListener('input', function() {
        const value = this.value.trim();

        // Limpiar lista
        autocompleteList.innerHTML = '';
        autocompleteList.classList.remove('active');
        currentFocus = -1;

        if (!value) return;

        // Filtrar localidades que coinciden
        const matches = localidades.filter(localidad =>
            localidad.toLowerCase().includes(value.toLowerCase())
        );

        if (matches.length === 0) {
            autocompleteList.innerHTML = '<div class="autocomplete-no-results">No se encontraron localidades</div>';
            autocompleteList.classList.add('active');
            return;
        }

        // Crear items
        matches.forEach(localidad => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';

            // Destacar texto coincidente
            const index = localidad.toLowerCase().indexOf(value.toLowerCase());
            const before = localidad.substring(0, index);
            const match = localidad.substring(index, index + value.length);
            const after = localidad.substring(index + value.length);

            item.innerHTML = `${before}<strong>${match}</strong>${after}`;

            // Click en item
            item.addEventListener('click', function() {
                input.value = localidad;
                autocompleteList.innerHTML = '';
                autocompleteList.classList.remove('active');
            });

            autocompleteList.appendChild(item);
        });

        autocompleteList.classList.add('active');
    });

    // Navegación con teclado
    input.addEventListener('keydown', function(e) {
        const items = autocompleteList.querySelectorAll('.autocomplete-item');

        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentFocus++;
            if (currentFocus >= items.length) currentFocus = 0;
            setActive(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentFocus--;
            if (currentFocus < 0) currentFocus = items.length - 1;
            setActive(items);
        } else if (e.key === 'Enter') {
            if (currentFocus > -1 && items[currentFocus]) {
                e.preventDefault();
                items[currentFocus].click();
            }
        } else if (e.key === 'Escape') {
            autocompleteList.innerHTML = '';
            autocompleteList.classList.remove('active');
            currentFocus = -1;
        }
    });

    function setActive(items) {
        items.forEach(item => item.classList.remove('active'));
        if (currentFocus >= 0 && currentFocus < items.length) {
            items[currentFocus].classList.add('active');
            items[currentFocus].scrollIntoView({ block: 'nearest' });
        }
    }

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (e.target !== input && !autocompleteList.contains(e.target)) {
            autocompleteList.innerHTML = '';
            autocompleteList.classList.remove('active');
            currentFocus = -1;
        }
    });
}

// ========================================
// Inicialización
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initLocationAutocomplete();
});
```

## Cómo Usar

1. **Incluye el HTML** con las clases e IDs correctos
2. **Agrega el CSS** para el estilo de la lista
3. **Copia el JavaScript** y modifícalo según necesites:
   - Cambia la lista `localidades` por tus ubicaciones
   - Ajusta los IDs de los campos según tu HTML
4. **Llama a `initLocationAutocomplete()`** cuando el DOM esté listo

## Características

- ✅ Filtrado en tiempo real
- ✅ Navegación con teclado (↑↓ Enter Esc)
- ✅ Destacado de texto coincidente
- ✅ Cierre automático al hacer clic fuera
- ✅ Soporte para múltiples campos
- ✅ Responsive y accesible

## Personalización

- **Lista de localidades**: Modifica el array `localidades` con tus ubicaciones
- **Estilos**: Ajusta el CSS según tu diseño
- **Límite de resultados**: Agrega `.slice(0, 10)` para limitar sugerencias
- **API externa**: Reemplaza el filtrado local por una llamada a API si tienes muchas ubicaciones