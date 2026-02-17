# Scripts de Validación de Encoding

Este directorio contiene herramientas para asegurar que todos los archivos del proyecto mantengan una codificación **UTF-8** correcta y libre de "mojibakes" (caracteres corruptos como `é` en lugar de `é`).

## Scripts disponibles

### 1. `check-encoding.js`
Escanea los archivos del proyecto buscando patrones comunes de codificación corrupta.

**Uso:**
```bash
node scripts/check-encoding.js
```

### 2. `fix-encoding.js`
Muestra una previsualización de las correcciones necesarias o las aplica directamente.

**Uso (Preview):**
```bash
node scripts/fix-encoding.js
```

**Uso (Aplicar correcciones):**
```bash
node scripts/fix-encoding.js --apply
```

## Integración
Estos scripts están diseñados para ejecutarse antes de cada build o commit para asegurar la integridad del texto en español.
