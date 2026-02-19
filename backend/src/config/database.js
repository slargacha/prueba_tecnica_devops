// Configuración de la conexión a MySQL
// Usa pool de conexiones para mejor rendimiento

const mysql = require('mysql2/promise');

// Pool de conexiones reutilizable para evitar abrir/cerrar en cada petición
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  database: process.env.DB_NAME || 'users_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Verifica que la base de datos responde correctamente
async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('Error en testConnection:', err.code, err.message);
    throw err;
  } finally {
    conn.release();
  }
}

// Crea la tabla users si no existe (por si acaso no se ejecutó init.sql)
// También crea los índices necesarios, ignorando errores si ya existen
async function ensureSchema() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    try {
      await conn.query('CREATE INDEX idx_users_email ON users(email)');
    } catch (e) {
      if (e.code !== 'ER_DUP_KEYNAME') throw e;
    }
    try {
      await conn.query('CREATE INDEX idx_users_created_at ON users(created_at)');
    } catch (e) {
      if (e.code !== 'ER_DUP_KEYNAME') throw e;
    }
  } finally {
    conn.release();
  }
}

module.exports = {
  pool,
  testConnection,
  ensureSchema,
};
