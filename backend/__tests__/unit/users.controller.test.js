// Tests unitarios para el controlador de usuarios
const usersController = require('../../src/controllers/users.controller');
const userModel = require('../../src/models/user.model');

jest.mock('../../src/models/user.model');

describe('Users Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('debería crear un usuario con datos válidos', async () => {
      req.body = { name: 'Test User', email: 'test@example.com' };
      const mockUser = { id: 1, ...req.body };
      userModel.createUser.mockResolvedValue(mockUser);

      await usersController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('debería retornar error 400 si falta el nombre', async () => {
      req.body = { email: 'test@example.com' };

      await usersController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Validation Error' })
      );
    });

    it('debería retornar error 400 si falta el email', async () => {
      req.body = { name: 'Test User' };

      await usersController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('debería retornar error 400 si el email es inválido', async () => {
      req.body = { name: 'Test User', email: 'invalid-email' };

      await usersController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('debería retornar error 409 si el email ya existe', async () => {
      req.body = { name: 'Test User', email: 'test@example.com' };
      userModel.createUser.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      await usersController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('listUsers', () => {
    it('debería retornar lista de usuarios', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@test.com' },
        { id: 2, name: 'User 2', email: 'user2@test.com' },
      ];
      userModel.getAllUsers.mockResolvedValue(mockUsers);

      await usersController.listUsers(req, res);

      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'no-store');
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('debería retornar array vacío si no hay usuarios', async () => {
      userModel.getAllUsers.mockResolvedValue([]);

      await usersController.listUsers(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getUserById', () => {
    it('debería retornar un usuario por ID', async () => {
      req.params = { id: '1' };
      const mockUser = { id: 1, name: 'Test', email: 'test@test.com' };
      userModel.getUserById.mockResolvedValue(mockUser);

      await usersController.getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      req.params = { id: '999' };
      userModel.getUserById.mockResolvedValue(null);

      await usersController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario correctamente', async () => {
      req.params = { id: '1' };
      req.body = { name: 'Updated Name' };
      const mockUser = { id: 1, name: 'Updated Name', email: 'test@test.com' };
      userModel.updateUser.mockResolvedValue(mockUser);

      await usersController.updateUser(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('debería retornar 400 si no hay campos para actualizar', async () => {
      req.params = { id: '1' };
      req.body = {};

      await usersController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      req.params = { id: '999' };
      req.body = { name: 'Test' };
      userModel.updateUser.mockResolvedValue(null);

      await usersController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario correctamente', async () => {
      req.params = { id: '1' };
      userModel.deleteUser.mockResolvedValue(true);

      await usersController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      req.params = { id: '999' };
      userModel.deleteUser.mockResolvedValue(false);

      await usersController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
