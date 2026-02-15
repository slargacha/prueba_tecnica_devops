/**
 * Controlador de usuarios
 * 
 * Maneja la lógica de negocio y las respuestas HTTP para las operaciones
 * CRUD de usuarios. Incluye validación de entrada y manejo de errores.
 * 
 * @module controllers/users.controller
 */

const userModel = require('../models/user.model');

/**
 * Validación básica de email (formato RFC 5322 simplificado)
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /users - Crear nuevo usuario
 */
async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'El campo "name" es obligatorio y debe ser una cadena de texto',
      });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'El campo "email" es obligatorio y debe ser una cadena de texto',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'El formato del email no es válido',
      });
    }

    const user = await userModel.createUser({ name: name.trim(), email: email.trim().toLowerCase() });
    return res.status(201).json(user);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || err.code === 1062) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Ya existe un usuario con ese email',
      });
    }
    console.error('Error creating user:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al crear el usuario',
    });
  }
}

/**
 * GET /users - Listar todos los usuarios
 */
async function listUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    return res.json(users);
  } catch (err) {
    console.error('Error listing users:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al listar usuarios',
    });
  }
}

/**
 * GET /users/:id - Obtener usuario por ID
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Usuario con id ${id} no encontrado`,
      });
    }

    return res.json(user);
  } catch (err) {
    console.error('Error getting user:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al obtener el usuario',
    });
  }
}

/**
 * PUT /users/:id - Actualizar usuario (opcional)
 */
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updates = {};
    if (name !== undefined) {
      if (typeof name !== 'string') {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'El campo "name" debe ser una cadena de texto',
        });
      }
      updates.name = name.trim();
    }
    if (email !== undefined) {
      if (typeof email !== 'string' || !isValidEmail(email)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'El campo "email" debe tener un formato válido',
        });
      }
      updates.email = email.trim().toLowerCase();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Debe proporcionar al menos un campo para actualizar (name o email)',
      });
    }

    const user = await userModel.updateUser(id, updates);

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Usuario con id ${id} no encontrado`,
      });
    }

    return res.json(user);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || err.code === 1062) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Ya existe un usuario con ese email',
      });
    }
    console.error('Error updating user:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al actualizar el usuario',
    });
  }
}

/**
 * DELETE /users/:id - Eliminar usuario (opcional)
 */
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deleted = await userModel.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Usuario con id ${id} no encontrado`,
      });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al eliminar el usuario',
    });
  }
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
