# Guía de Deploy - Aloise Propiedades

## 🎯 Información del Deploy

- **Proyecto Firebase**: frandoweb-4c2c7
- **Hosting**: Firebase Hosting
- **Dominio temporal**: frandoweb-4c2c7.web.app
- **Dominio personalizado**: aloisepropiedades.com.ar (por configurar)

## 📋 Requisitos Previos

1. **Node.js instalado** (versión 14 o superior)
   - Verificar: `node --version`
   - Descargar: https://nodejs.org/

2. **Firebase CLI instalado**
   ```bash
   npm install -g firebase-tools
   ```

3. **Cuenta de Google con acceso al proyecto**
   - Proyecto: frandoweb-4c2c7

## 🚀 Pasos para Deploy

### 1. Login en Firebase

```bash
firebase login
```

Esto abrirá el navegador para que inicies sesión con tu cuenta de Google.

### 2. Verificar proyecto

```bash
firebase projects:list
```

Deberías ver: **frandoweb-4c2c7** en la lista.

### 3. Hacer Deploy

Desde la carpeta del proyecto:

```bash
firebase deploy --only hosting
```

### 4. Ver el sitio

Después del deploy, verás una URL como:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/frandoweb-4c2c7/overview
Hosting URL: https://frandoweb-4c2c7.web.app
```

## 🌐 Configurar Dominio Personalizado

### Opción 1: Desde Firebase Console (Recomendado)

1. Ve a: https://console.firebase.google.com/project/frandoweb-4c2c7/hosting
2. Click en **"Agregar dominio personalizado"**
3. Ingresa: `aloisepropiedades.com.ar`
4. Sigue las instrucciones para configurar DNS

### Opción 2: Desde CLI

```bash
firebase hosting:channel:deploy aloisepropiedades
```

## 📝 Configuración DNS

Cuando agregues el dominio personalizado, Firebase te dará registros DNS para configurar:

**Tipo A:**
```
@ → 151.101.1.195
@ → 151.101.65.195
```

**O Tipo CNAME:**
```
www → frandoweb-4c2c7.web.app
```

Configura estos registros en tu proveedor de dominio (donde compraste aloisepropiedades.com.ar).

## 🔄 Deploy Automático (Opcional)

### Usando GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: frandoweb-4c2c7
```

## 📊 Ver Estadísticas del Hosting

```bash
firebase hosting:channel:list
```

O en la consola:
https://console.firebase.google.com/project/frandoweb-4c2c7/hosting

## 🛠️ Comandos Útiles

### Ver versión actual
```bash
firebase hosting:channel:list
```

### Deploy a canal de prueba
```bash
firebase hosting:channel:deploy preview
```

### Rollback a versión anterior
```bash
firebase hosting:rollback
```

### Ver logs
```bash
firebase hosting:channel:list
```

## ⚠️ Antes de Deploy

### Checklist:

- [ ] Actualizar datos de contacto reales (WhatsApp, email, teléfono)
- [ ] Reemplazar logo placeholder con logo real
- [ ] Agregar imágenes reales de propiedades
- [ ] Configurar API de Xintel (si tienes)
- [ ] Cambiar `useMockData: false` en config.js
- [ ] Verificar que todos los links funcionen
- [ ] Probar en móvil y desktop
- [ ] Verificar meta tags y SEO

## 🔐 Seguridad

Los archivos `.md` y de configuración NO se subirán al hosting (están en `.ignore` del firebase.json).

## 📱 URLs del Proyecto

- **Hosting**: https://frandoweb-4c2c7.web.app
- **Console**: https://console.firebase.google.com/project/frandoweb-4c2c7
- **Analytics**: https://analytics.google.com (buscar G-1X8T159RTT)

## 🆘 Problemas Comunes

### Error: "Permission denied"
```bash
firebase login --reauth
```

### Error: "Project not found"
Verifica que estés en la carpeta correcta y que `.firebaserc` exista.

### Deploy lento
Firebase Hosting es global, puede tardar 5-10 minutos en propagarse.

### Dominio no funciona
Espera 24-48 horas para propagación DNS completa.

## 📞 Soporte

- Firebase Support: https://firebase.google.com/support
- Documentación: https://firebase.google.com/docs/hosting

---

**¡Listo para deploy!** 🚀

Ejecuta: `firebase deploy --only hosting`
