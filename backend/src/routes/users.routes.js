// Definición de rutas de la API
// Todas las rutas están bajo el prefijo /users

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.post('/', usersController.createUser);
router.get('/', usersController.listUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
