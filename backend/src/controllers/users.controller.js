// Controlador de usuarios
// Valida los datos de entrada y llama al modelo para las operaciones en BD

const userModel = require('../models/user.model');

// Validación simple de formato de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Crear un nuevo usuario
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

// Obtener lista de todos los usuarios
async function listUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    if (!Array.isArray(users)) {
      return res.json([]);
    }
    res.set('Cache-Control', 'no-store');
    return res.json(users);
  } catch (err) {
    console.error('Error listing users:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al listar usuarios',
    });
  }
}

// Obtener un usuario específico por su ID
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

// Actualizar datos de un usuario existente
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

// Eliminar un usuario
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
