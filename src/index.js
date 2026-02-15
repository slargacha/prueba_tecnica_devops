/**
 * Microservicio de Gestión de Usuarios
 * DevOps Evaluation A01 - Arquitectura 3 capas
 *
 * Capa 2 (Backend): API REST para operaciones CRUD de usuarios.
 * Base de datos: MySQL (capa 3)
 *
 * Endpoints:
 *   POST   /users     - Crear usuario
 *   GET    /users     - Listar usuarios
 *   GET    /users/:id - Obtener usuario por ID
 *   PUT    /users/:id - Actualizar usuario
 *   DELETE /users/:id - Eliminar usuario
 *
 * @module index
 */

require('dotenv').config();
const express = require('express');
const usersRoutes = require('./routes/users.routes');
const { testConnection, ensureSchema } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware de request logging (útil para debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Ruta de health check para orquestadores y load balancers
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de la API de usuarios
app.use('/users', usersRoutes);

// Ruta raíz con información del servicio
app.get('/', (req, res) => {
  res.json({
    service: 'User Management Microservice',
    version: '1.0.0',
    endpoints: {
      'POST /users': 'Crear nuevo usuario',
      'GET /users/:id': 'Obtener usuario por ID',
      'PUT /users/:id': 'Actualizar usuario',
      'DELETE /users/:id': 'Eliminar usuario',
    },
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Ruta ${req.method} ${req.path} no existe` });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ha ocurrido un error inesperado',
  });
});

/**
 * Inicia el servidor tras verificar la conexión a la base de datos
 */
async function startServer() {
  try {
    await testConnection();
    console.log('✓ Conexión a base de datos establecida');

    await ensureSchema();
    console.log('✓ Esquema de base de datos verificado');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Servidor escuchando en http://0.0.0.0:${PORT}`);
      console.log(`  - Health check: http://localhost:${PORT}/health`);
      console.log(`  - API usuarios: http://localhost:${PORT}/users`);
    });
  } catch (err) {
    console.error('✗ Error al iniciar el servidor:', err.message);
    console.error('  Verifique que MySQL esté ejecutándose y las variables de entorno DB_*');
    process.exit(1);
  }
}

startServer();
