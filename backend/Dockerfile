# Dockerfile para el backend de la API
# Usa Node.js 20 Alpine con build multi-etapa para optimizar el tamaño

# Etapa 1: instalación de dependencias de producción
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --ignore-scripts; \
    else npm install --omit=dev; fi

# Etapa 2: imagen final optimizada con usuario sin privilegios
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN chown -R appuser:nodejs /app
USER appuser
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
# Healthcheck por defecto (puede ser sobreescrito por docker-compose)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "src/index.js"]
