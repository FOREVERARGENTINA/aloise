#!/usr/bin/env node

/**
 * Script para detectar mojibakes y problemas de codificacion
 * Uso: node scripts/check-encoding.js
 *
 * Compatible con: CommonJS y ESM
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patrones comunes de mojibake (UTF-8 mal interpretado como Latin-1)
const mojibakePatterns = [
  { pattern: /\xC3\xA9/g, correct: 'e', name: 'e con mojibake' },
  { pattern: /\xC3\xA1/g, correct: 'a', name: 'a con mojibake' },
  { pattern: /\xC3\xB3/g, correct: 'o', name: 'o con mojibake' },
  { pattern: /\xC3\xBA/g, correct: 'u', name: 'u con mojibake' },
  { pattern: /\xC3\xAD/g, correct: 'i', name: 'i con mojibake' },
  { pattern: /\xC3\xB1/g, correct: 'n', name: 'n con mojibake' },
  { pattern: /\xC2\xBF/g, correct: 'signo interrogacion', name: 'signo interrogacion con mojibake' },
  { pattern: /\xC2\xA1/g, correct: 'signo exclamacion', name: 'signo exclamacion con mojibake' },
  { pattern: /\xC3\x89/g, correct: 'E', name: 'E con mojibake' },
  { pattern: /\xC3\x81/g, correct: 'A', name: 'A con mojibake' },
  { pattern: /\xC3\x93/g, correct: 'O', name: 'O con mojibake' },
  { pattern: /\xC3\x9A/g, correct: 'U', name: 'U con mojibake' },
  { pattern: /\xC3\x8D/g, correct: 'I', name: 'I con mojibake' },
  { pattern: /\xC3\x91/g, correct: 'N', name: 'N con mojibake' }
];

// Configuracion segun tipo de proyecto
const CONFIG = {
  // Para proyectos Next.js, React, Vue, etc (Tipo C)
  typeC: {
    dirs: ['src', 'app', 'pages', 'components'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.md']
  },
  // Para proyectos SSG, Astro, etc (Tipo B)
  typeB: {
    dirs: ['src', 'public'],
    extensions: ['.js', '.jsx', '.astro', '.css', '.html', '.md']
  },
  // Para sitios estaticos (Tipo A)
  typeA: {
    dirs: ['public', '.'],
    extensions: ['.html', '.css', '.js', '.json', '.md']
  }
};

// Auto-detectar tipo de proyecto
function detectProjectType() {
  if (fs.existsSync('next.config.js') || fs.existsSync('next.config.mjs')) return 'typeC';
  if (fs.existsSync('astro.config.mjs') || fs.existsSync('astro.config.js')) return 'typeB';
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.dependencies?.next || pkg.devDependencies?.next) return 'typeC';
    if (pkg.dependencies?.astro || pkg.devDependencies?.astro) return 'typeB';
  }
  return 'typeA'; // Default: sitio estatico
}

const projectType = detectProjectType();
const config = CONFIG[projectType];

const IGNORE_DIRS = ['node_modules', 'dist', 'build', '.git', 'backups', '.next', '.firebase', '.github', 'out'];

let filesWithIssues = [];
let totalFilesScanned = 0;

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(item)) {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (config.extensions.includes(ext)) {
        checkFile(fullPath);
      }
    }
  });
}

function checkFile(filePath) {
  totalFilesScanned++;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    // Verificar cada patron de mojibake
    mojibakePatterns.forEach(({ pattern, correct, name }) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          pattern: name,
          count: matches.length,
          correct: correct
        });
      }
    });

    if (issues.length > 0) {
      filesWithIssues.push({
        file: filePath,
        issues: issues
      });
    }
  } catch (error) {
    console.error(`Error leyendo ${filePath}:`, error.message);
  }
}

// Ejecutar escaneo
console.log('========================================');
console.log('   DETECTOR DE MOJIBAKES');
console.log('========================================\n');
console.log(`Tipo de proyecto detectado: ${projectType}`);
console.log(`Directorios: ${config.dirs.join(', ')}`);
console.log(`Extensiones: ${config.extensions.join(', ')}\n`);

config.dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    scanDirectory(dir);
  }
});

// Mostrar resultados
console.log('========================================');
console.log(`Archivos escaneados: ${totalFilesScanned}`);

if (filesWithIssues.length === 0) {
  console.log('\n[OK] No se encontraron mojibakes.');
  console.log('[OK] Codificacion UTF-8 correcta.\n');
  process.exit(0);
} else {
  console.log(`[MOJIBAKES] Archivos con problemas: ${filesWithIssues.length}\n`);

  filesWithIssues.forEach(({ file, issues }) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`\n${relativePath}`);
    issues.forEach(({ pattern, count, correct }) => {
      console.log(`  - ${pattern} (${count} ocurrencias) -> deberia ser: ${correct}`);
    });
  });

  const totalIssues = filesWithIssues.reduce((sum, f) => sum + f.issues.reduce((s, i) => s + i.count, 0), 0);
  console.log(`\n[TOTAL] ${totalIssues} mojibakes en ${filesWithIssues.length} archivos`);
  console.log('\n[ACCION] Para corregir automaticamente:');
  console.log('  node scripts/fix-encoding.js          (preview)');
  console.log('  node scripts/fix-encoding.js --apply  (aplicar)\n');

  process.exit(1);
}
