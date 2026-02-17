#!/usr/bin/env node

/**
 * Universal mojibake fixer for mixed JS/TS repos.
 *
 * Usage:
 *   node scripts/fix-encoding.js          (dry-run preview)
 *   node scripts/fix-encoding.js --apply  (apply changes)
 *   node scripts/fix-encoding.js --all    (scan entire repo root)
 */

import fs from 'fs';
import path from 'path';

const APPLY_CHANGES = process.argv.includes('--apply');
const SCAN_ALL = process.argv.includes('--all');

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  '.svelte-kit',
  '.turbo',
  '.cache',
  '.firebase',
  '.vercel',
  'out',
  'tmp',
  'temp',
  'backups',
]);

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const TEXT_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts',
  '.json', '.jsonc',
  '.md', '.mdx', '.txt',
  '.html', '.css', '.scss', '.sass', '.less',
  '.xml', '.svg',
  '.yml', '.yaml', '.toml', '.ini',
  '.env',
  '.graphql', '.gql',
  '.astro', '.vue', '.svelte',
  '.sh', '.ps1', '.bat', '.cmd',
]);

const TEXT_BASENAMES = new Set([
  'Dockerfile',
  'Makefile',
  'README',
  'README.md',
  'LICENSE',
  'AGENTS.md',
  'GUIDE.md',
  'GUIA.md',
]);

const CANDIDATE_DIRS = [
  'src',
  'functions',
  'scripts',
  'public',
  'docs',
  'app',
  'pages',
  'components',
  'lib',
  'server',
  'client',
];

const MOJIBAKE_MAP = {
  // UTF-8 bytes shown as Latin-1 / CP1252 (Spanish + common)
  '\u00C3\u00A1': '\u00E1', // a acute
  '\u00C3\u00A9': '\u00E9', // e acute
  '\u00C3\u00AD': '\u00ED', // i acute
  '\u00C3\u00B3': '\u00F3', // o acute
  '\u00C3\u00BA': '\u00FA', // u acute
  '\u00C3\u00BC': '\u00FC', // u umlaut
  '\u00C3\u00B1': '\u00F1', // n tilde
  '\u00C3\u00A7': '\u00E7', // c cedilla

  '\u00C3\u0081': '\u00C1', // A acute
  '\u00C3\u0089': '\u00C9', // E acute
  '\u00C3\u008D': '\u00CD', // I acute
  '\u00C3\u0093': '\u00D3', // O acute
  '\u00C3\u009A': '\u00DA', // U acute
  '\u00C3\u009C': '\u00DC', // U umlaut
  '\u00C3\u0091': '\u00D1', // N tilde
  '\u00C3\u0087': '\u00C7', // C cedilla
  '\u00C3\u2030': '\u00C9', // E acute (CP1252 glyph form)
  '\u00C3\u2014': '\u00D7', // multiplication sign (×) CP1252 glyph form
  '\u00C3\u0097': '\u00D7', // multiplication sign (×)

  '\u00C2\u00BF': '\u00BF', // inverted question mark
  '\u00C2\u00A1': '\u00A1', // inverted exclamation mark
  '\u00C2\u00BA': '\u00BA', // masculine ordinal
  '\u00C2\u00AA': '\u00AA', // feminine ordinal
  '\u00C2\u00B0': '\u00B0', // degree
  '\u00C2\u00B7': '\u00B7', // middle dot
  '\u00C2\u00A0': ' ',      // non-breaking space

  // Curly quotes/dashes/etc. (Latin-1 control-byte interpretation)
  '\u00E2\u0080\u0098': '\u2018',
  '\u00E2\u0080\u0099': '\u2019',
  '\u00E2\u0080\u009C': '\u201C',
  '\u00E2\u0080\u009D': '\u201D',
  '\u00E2\u0080\u0093': '\u2013',
  '\u00E2\u0080\u0094': '\u2014',
  '\u00E2\u0080\u00A6': '\u2026',
  '\u00E2\u0080\u00A2': '\u2022',

  // Same artifacts rendered with Euro-sign-like glyphs in CP1252 views
  '\u00E2\u20AC\u02DC': '\u2018',
  '\u00E2\u20AC\u2122': '\u2019',
  '\u00E2\u20AC\u0153': '\u201C',
  '\u00E2\u20AC\u009D': '\u201D',
  '\u00E2\u20AC\u201C': '\u2013',
  '\u00E2\u20AC\u201D': '\u2014',
  '\u00E2\u20AC\u00A6': '\u2026',
  '\u00E2\u20AC\u00A2': '\u2022',
  '\u00E2\u20AC\u2039': '\u2039', // single left angle quote
  '\u00E2\u20AC\u203A': '\u203A', // single right angle quote
  '\u00E2\u20AC\u00B9': '\u2039', // single left angle quote (ordinal artifact)
  '\u00E2\u20AC\u00BA': '\u203A', // single right angle quote (ordinal artifact)
};

const SUSPECT_PATTERNS = [
  /\u00C3[\u0080-\u00BF]/g,
  /\u00C2[\u0080-\u00BF]/g,
  /\u00E2[\u0080-\u00BF]/g,
  /\uFFFD/g, // replacement char
];

const stats = {
  filesScanned: 0,
  filesWithChanges: 0,
  totalReplacements: 0,
  unresolvedFiles: [],
  changedFiles: [],
};

function countSuspicious(content) {
  let count = 0;
  for (const pattern of SUSPECT_PATTERNS) {
    count += (content.match(pattern) || []).length;
  }
  return count;
}

function isTextFile(filePath) {
  const base = path.basename(filePath);
  const ext = path.extname(base).toLowerCase();
  if (TEXT_EXTENSIONS.has(ext)) return true;
  if (TEXT_BASENAMES.has(base)) return true;
  if (base.startsWith('.env')) return true;
  return false;
}

function fixMojibakes(content) {
  let fixed = content;
  let replacements = 0;

  const sortedKeys = Object.keys(MOJIBAKE_MAP).sort((a, b) => b.length - a.length);
  for (const bad of sortedKeys) {
    const good = MOJIBAKE_MAP[bad];
    const regex = new RegExp(escapeRegex(bad), 'g');
    const matches = fixed.match(regex);
    if (!matches) continue;
    fixed = fixed.replace(regex, good);
    replacements += matches.length;
  }

  // Final cleanup for isolated C2 artifacts.
  const strayA2 = fixed.match(/\u00C2/g);
  if (strayA2) {
    fixed = fixed.replace(/\u00C2/g, '');
    replacements += strayA2.length;
  }

  return { fixed, replacements };
}

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function processFile(filePath) {
  stats.filesScanned++;

  try {
    const fileStat = fs.statSync(filePath);
    if (fileStat.size > MAX_FILE_SIZE_BYTES) return;

    const original = fs.readFileSync(filePath, 'utf8');
    const beforeSuspicious = countSuspicious(original);
    const { fixed, replacements } = fixMojibakes(original);
    const afterSuspicious = countSuspicious(fixed);

    if (replacements > 0) {
      stats.filesWithChanges++;
      stats.totalReplacements += replacements;
      stats.changedFiles.push({ path: filePath, replacements });

      if (APPLY_CHANGES) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        console.log(`[APLICADO] ${filePath} (${replacements} reemplazos)`);
      } else {
        console.log(`[PREVIEW] ${filePath} (${replacements} reemplazos pendientes)`);
      }
    }

    if (beforeSuspicious > 0 && afterSuspicious > 0 && replacements === 0) {
      stats.unresolvedFiles.push({ path: filePath, suspicious: afterSuspicious });
      console.log(`[WARN] ${filePath} (anomalias detectadas no mapeadas: ${afterSuspicious})`);
    }
  } catch (error) {
    console.error(`[ERROR] ${filePath}: ${error.message}`);
  }
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) scanDirectory(fullPath);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!isTextFile(fullPath)) continue;
    processFile(fullPath);
  }
}

function resolveScanDirs() {
  if (SCAN_ALL) return ['.'];
  const existing = CANDIDATE_DIRS.filter((d) => fs.existsSync(d));
  return existing.length > 0 ? existing : ['.'];
}

const scanDirs = resolveScanDirs();

console.log('========================================');
console.log(APPLY_CHANGES ? '   MODO: APLICAR CAMBIOS' : '   MODO: DRY RUN (preview)');
console.log('========================================');
console.log(`Directorios a escanear: ${scanDirs.join(', ')}\n`);

for (const dir of scanDirs) {
  scanDirectory(dir);
}

console.log('\n========================================');
console.log('--- RESUMEN ---');
console.log(`Archivos escaneados: ${stats.filesScanned}`);
console.log(`Archivos con cambios: ${stats.filesWithChanges}`);
console.log(`Total de reemplazos: ${stats.totalReplacements}`);
console.log(`Archivos con anomalias no resueltas: ${stats.unresolvedFiles.length}`);

if (stats.filesWithChanges > 0) {
  console.log('\nArchivos afectados:');
  for (const { path: p, replacements } of stats.changedFiles) {
    console.log(`  - ${path.relative(process.cwd(), p)} (${replacements})`);
  }
}

if (stats.unresolvedFiles.length > 0) {
  console.log('\n[WARN] Anomalias no resueltas automaticamente:');
  for (const { path: p, suspicious } of stats.unresolvedFiles) {
    console.log(`  - ${path.relative(process.cwd(), p)} (${suspicious})`);
  }
}

if (stats.filesWithChanges === 0 && stats.unresolvedFiles.length === 0) {
  console.log('\n[OK] No se encontraron mojibakes.');
}

if (!APPLY_CHANGES && stats.filesWithChanges > 0) {
  console.log('\n[INFO] Preview finalizado. Para aplicar:');
  console.log('  node scripts/fix-encoding.js --apply');
}

process.exit(!APPLY_CHANGES && stats.filesWithChanges > 0 ? 1 : 0);
