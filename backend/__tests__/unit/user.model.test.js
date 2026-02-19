// Tests unitarios para el modelo de usuario
const userModel = require('../../src/models/user.model');

// Mock del pool de base de datos
jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const { pool } = require('../../src/config/database');

describe('User Model - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('debería crear un usuario correctamente', async () => {
      const mockUser = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@test.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      pool.query
        .mockResolvedValueOnce([{ insertId: 1 }])
        .mockResolvedValueOnce([[mockUser]]);

      const result = await userModel.createUser({
        name: 'Juan Pérez',
        email: 'juan@test.com',
      });

      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllUsers', () => {
    it('debería retornar lista de usuarios', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@test.com' },
        { id: 2, name: 'User 2', email: 'user2@test.com' },
      ];

      pool.query.mockResolvedValueOnce([mockUsers]);

      const result = await userModel.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT')
      );
    });

    it('debería retornar array vacío si no hay usuarios', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const result = await userModel.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('debería retornar un usuario por ID', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@test.com' };
      pool.query.mockResolvedValueOnce([[mockUser]]);

      const result = await userModel.getUserById(1);

      expect(result).toEqual(mockUser);
    });

    it('debería retornar null si el usuario no existe', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const result = await userModel.getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario correctamente', async () => {
      const mockUser = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@test.com',
      };

      pool.query
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([[mockUser]]);

      const result = await userModel.updateUser(1, {
        name: 'Updated Name',
        email: 'updated@test.com',
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario y retornar true', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await userModel.deleteUser(1);

      expect(result).toBe(true);
    });

    it('debería retornar false si el usuario no existe', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await userModel.deleteUser(999);

      expect(result).toBe(false);
    });
  });
});
