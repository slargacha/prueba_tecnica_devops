# =============================================================================
# Frontend - Capa de presentación
# Arquitectura 3 capas - Servido por nginx
# =============================================================================

FROM nginx:alpine

# Copiar configuración de nginx con proxy al backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos
COPY index.html styles.css app.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
