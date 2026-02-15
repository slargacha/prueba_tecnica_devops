# =============================================================================
# Dockerfile - Microservicio de Gestión de Usuarios
# DevOps Evaluation A01
# =============================================================================
# Imagen multi-stage para optimizar tamaño y seguridad
# Stage 1: Dependencias
# Stage 2: Aplicación final
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Instalación de dependencias
# Usa Node.js LTS (Alpine para menor tamaño)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Copiar solo los archivos de dependencias para aprovechar cache de Docker
COPY package.json package-lock.json* ./

# Instalar dependencias de producción
# npm ci si existe package-lock.json, npm install si no
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --ignore-scripts; \
    else npm install --omit=dev; fi

# -----------------------------------------------------------------------------
# Stage 2: Imagen final
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Crear usuario no-root para mayor seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copiar dependencias desde stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Establecer ownership
RUN chown -R appuser:nodejs /app

# Usar usuario no-root
USER appuser

# Puerto expuesto por la aplicación
EXPOSE 3000

# Variables de entorno por defecto (sobrescritas en runtime)
ENV NODE_ENV=production
ENV PORT=3000

# Healthcheck para orquestadores (Docker, Kubernetes)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["node", "src/index.js"]
