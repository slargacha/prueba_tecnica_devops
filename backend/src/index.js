// Servidor principal del backend
// Inicializa Express, conecta con MySQL y expone las rutas de la API

require('dotenv').config();
const express = require('express');
const usersRoutes = require('./routes/users.routes');
const { testConnection, ensureSchema } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON y registrar peticiones
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Endpoint para verificar que el servicio está funcionando
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas principales para operaciones CRUD de usuarios bajo /api
app.use('/api/users', usersRoutes);

// Información básica de la API
app.get('/', (req, res) => {
  res.json({
    service: 'User Management Microservice',
    version: '1.0.0',
    endpoints: {
      'POST /api/users': 'Crear nuevo usuario',
      'GET /api/users': 'Listar usuarios',
      'GET /api/users/:id': 'Obtener usuario por ID',
      'PUT /api/users/:id': 'Actualizar usuario',
      'DELETE /api/users/:id': 'Eliminar usuario',
    },
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Ruta ${req.method} ${req.path} no existe` });
});

// Captura errores no manejados
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ha ocurrido un error inesperado',
  });
});

// Proceso de arranque del servidor

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Intenta conectar con MySQL varias veces antes de fallar
// Útil cuando el contenedor arranca antes que la base de datos
async function waitForDb(maxAttempts = 90, intervalMs = 2000) {
  const { testConnection } = require('./config/database');
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '3306';
  console.log(`Intentando conectar a MySQL en ${dbHost}:${dbPort}`);
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      await testConnection();
      return true;
    } catch (err) {
      if (i % 10 === 0 || i <= 5) {
        console.log(`Esperando MySQL... (${i}/${maxAttempts}) - ${err.code || err.message}`);
      }
      if (i === maxAttempts) throw err;
      await sleep(intervalMs);
    }
  }
}

// Inicia el servidor: primero conecta con la BD, luego verifica el esquema y finalmente escucha peticiones
async function startServer() {
  try {
    await waitForDb();
    console.log('Conexion a base de datos establecida');
    await ensureSchema();
    console.log('Esquema de base de datos verificado');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor en http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar:', err.message);
    process.exit(1);
  }
}

startServer();
