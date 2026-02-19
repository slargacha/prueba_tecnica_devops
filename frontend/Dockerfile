# Dockerfile para el frontend
# Usa nginx alpine para servir archivos estáticos y hacer proxy al backend

FROM nginx:alpine

# Configuración de nginx: proxy inverso para /api y servir archivos estáticos
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Archivos de la aplicación web
COPY index.html styles.css app.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
