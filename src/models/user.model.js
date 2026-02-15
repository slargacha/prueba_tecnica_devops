/**
 * Modelo de datos para la entidad Usuario
 * Capa de datos - Arquitectura 3 niveles
 *
 * @module models/user.model
 */

const crypto = require('crypto');
const { pool } = require('../config/database');

async function createUser({ name, email }) {
  const id = crypto.randomUUID();
  await pool.query(
    'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
    [id, name, email]
  );
  const user = await getUserById(id);
  return user;
}

async function getAllUsers() {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
  );
  return rows;
}

async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function updateUser(id, { name, email }) {
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (email !== undefined) {
    updates.push('email = ?');
    values.push(email);
  }

  if (updates.length === 0) return getUserById(id);

  values.push(id);
  await pool.query(
    `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  return getUserById(id);
}

async function deleteUser(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
