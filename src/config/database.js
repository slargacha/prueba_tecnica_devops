/**
 * Configuración de conexión a la base de datos MySQL
 *
 * Capa de datos - Arquitectura 3 niveles
 * Utiliza variables de entorno para diferentes entornos.
 *
 * @module config/database
 */

const mysql = require('mysql2/promise');

/**
 * Pool de conexiones a MySQL
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  database: process.env.DB_NAME || 'users_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

/**
 * Verifica la conexión con la base de datos
 */
async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.query('SELECT 1');
    return true;
  } finally {
    conn.release();
  }
}

/**
 * Inicializa el esquema de la base de datos
 */
async function ensureSchema() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
