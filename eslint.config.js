export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        URL: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
        HTMLImageElement: 'readonly',
        MutationObserver: 'readonly',
        IntersectionObserver: 'readonly',
        PerformanceObserver: 'readonly',
        // Firebase
        firebase: 'readonly',
        // Project globals
        CONFIG: 'readonly',
        PropertyService: 'readonly',
        PropertyRenderer: 'readonly',
        Components: 'readonly',
        XintelAPI: 'readonly',
        trackPropertyView: 'readonly',
        trackWhatsAppClick: 'readonly',
        trackSearch: 'readonly',
        trackPropertyEvent: 'readonly',
        saveConsulta: 'readonly',
        // Node.js (for modules)
        module: 'writable'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single', { 'avoidEscape': true }],
      'no-console': 'off'
    }
  },
  {
    files: ['js/firebase-examples.js'],
    rules: {
      'no-unused-vars': 'off'
    }
  },
  {
    ignores: [
      'node_modules/**',
      '.firebase/**',
      'firebase-debug.log',
      '*.min.js'
    ]
  }
];
