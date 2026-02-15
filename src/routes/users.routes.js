/**
 * Rutas de la API de usuarios
 * 
 * Define los endpoints REST para las operaciones CRUD del microservicio.
 * Sigue convenciones RESTful estándar.
 * 
 * @module routes/users.routes
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

/**
 * @route   POST /users
 * @desc    Crear un nuevo usuario
 * @body    { name: string, email: string }
 * @access  Public
 */
router.post('/', usersController.createUser);

/**
 * @route   GET /users
 * @desc    Listar todos los usuarios
 * @access  Public
 */
router.get('/', usersController.listUsers);

/**
 * @route   GET /users/:id
 * @desc    Obtener usuario por ID (UUID)
 * @param   id - UUID del usuario
 * @access  Public
 */
router.get('/:id', usersController.getUserById);

/**
 * @route   PUT /users/:id
 * @desc    Actualizar usuario existente (opcional)
 * @param   id - UUID del usuario
 * @body    { name?: string, email?: string }
 * @access  Public
 */
router.put('/:id', usersController.updateUser);

/**
 * @route   DELETE /users/:id
 * @desc    Eliminar usuario (opcional)
 * @param   id - UUID del usuario
 * @access  Public
 */
router.delete('/:id', usersController.deleteUser);

module.exports = router;
