// Modelo de datos para usuarios
// Maneja todas las operaciones de base de datos relacionadas con usuarios

const { pool } = require('../config/database');

// Crea un nuevo usuario y devuelve los datos insertados
async function createUser({ name, email }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  const user = await getUserById(result.insertId);
  return user;
}

// Obtiene todos los usuarios ordenados por fecha de creación
async function getAllUsers() {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
  );
  return rows;
}

// Busca un usuario por ID, devuelve null si no existe
async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

// Actualiza los datos de un usuario
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

// Elimina un usuario de la base de datos
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
