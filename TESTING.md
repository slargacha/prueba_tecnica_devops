# Testing y Calidad de Código

Este proyecto implementa una estrategia completa de testing y análisis de calidad de código.

## 🧪 Tipos de Tests

### 1. Tests Unitarios
Prueban funciones individuales de forma aislada usando mocks.

**Ubicación:** `backend/__tests__/unit/`

**Archivos:**
- `user.model.test.js` - Tests del modelo de datos
- `users.controller.test.js` - Tests del controlador

**Ejecutar:**
```bash
cd backend
npm run test:unit
```

### 2. Tests de Integración
Prueban la API completa con todos sus componentes.

**Ubicación:** `backend/__tests__/integration/`

**Archivos:**
- `api.test.js` - Tests de endpoints completos

**Ejecutar:**
```bash
cd backend
npm run test:integration
```

### 3. Todos los Tests
```bash
cd backend
npm test
```

## 📊 Cobertura de Código

Los tests generan un reporte de cobertura automáticamente:

```bash
cd backend
npm test
```

El reporte se genera en:
- `backend/coverage/lcov-report/index.html` - Reporte HTML visual
- `backend/coverage/lcov.info` - Formato LCOV para SonarQube

**Ver reporte:**
```bash
cd backend/coverage/lcov-report
# Abrir index.html en el navegador
```

## 🔍 Linting (ESLint)

Análisis estático de código para mantener estándares de calidad.

**Ejecutar linting:**
```bash
cd backend
npm run lint
```

**Corregir automáticamente:**
```bash
cd backend
npm run lint:fix
```

## 🛡️ Análisis de Seguridad

Detecta vulnerabilidades en dependencias:

```bash
cd backend
npm audit
```

## ☁️ SonarQube Cloud

Análisis continuo de calidad de código en la nube.

### Configuración

1. **Crear cuenta en SonarCloud:**
   - Ir a https://sonarcloud.io
   - Conectar con GitHub
   - Crear organización

2. **Configurar proyecto:**
   - Editar `sonar-project.properties`
   - Reemplazar `YOUR_SONARCLOUD_ORG` con tu organización

3. **Agregar token a GitHub:**
   - Settings → Secrets → New repository secret
   - Nombre: `SONAR_TOKEN`
   - Valor: Token generado en SonarCloud

### Métricas analizadas

- ✅ **Bugs** - Errores potenciales en el código
- ✅ **Vulnerabilidades** - Problemas de seguridad
- ✅ **Code Smells** - Código que debería mejorarse
- ✅ **Cobertura** - Porcentaje de código cubierto por tests
- ✅ **Duplicación** - Código duplicado
- ✅ **Complejidad** - Complejidad ciclomática

### Ver resultados

Los resultados se publican automáticamente en:
- Dashboard de SonarCloud
- Pull Requests de GitHub (como comentario)

## 🚀 Pipeline CI/CD

### Workflow de CI (`.github/workflows/ci.yml`)

Se ejecuta en cada push y PR:

1. ✅ **Lint** - Verifica estándares de código
2. ✅ **Tests** - Ejecuta todos los tests con cobertura
3. ✅ **Security Audit** - Analiza vulnerabilidades
4. ✅ **SonarQube** - Análisis de calidad de código

### Workflow de CD (`.github/workflows/deploy.yml`)

Solo se ejecuta si el CI pasa:

1. ✅ **Check CI** - Verifica que los tests pasaron
2. ✅ **Build** - Construye imágenes Docker
3. ✅ **Deploy** - Despliega en AWS EKS

## 📝 Comandos Rápidos

```bash
# Instalar dependencias
cd backend && npm install

# Ejecutar todos los tests
npm test

# Tests en modo watch (desarrollo)
npm run test:watch

# Linting
npm run lint

# Linting con corrección automática
npm run lint:fix

# Análisis de seguridad
npm audit

# Ver cobertura
npm test && open coverage/lcov-report/index.html
```

## 🎯 Objetivos de Calidad

- **Cobertura de código:** > 80%
- **Bugs:** 0
- **Vulnerabilidades:** 0
- **Code Smells:** < 10
- **Duplicación:** < 3%

## 📚 Tecnologías Utilizadas

- **Jest** - Framework de testing
- **Supertest** - Testing de APIs HTTP
- **ESLint** - Linting de JavaScript
- **SonarQube Cloud** - Análisis de calidad de código
- **GitHub Actions** - CI/CD
