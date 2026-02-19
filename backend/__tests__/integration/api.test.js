// Tests de integración para la API de usuarios
// Estos tests requieren una base de datos de prueba

const request = require('supertest');
const express = require('express');
const usersRoutes = require('../../src/routes/users.routes');

// Mock de la base de datos
jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
  testConnection: jest.fn().mockResolvedValue(true),
  ensureSchema: jest.fn().mockResolvedValue(true),
}));

const { pool } = require('../../src/config/database');

// Crear app de Express para testing
const app = express();
app.use(express.json());
app.use('/users', usersRoutes);

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('debería crear un usuario y retornar 201', async () => {
      const newUser = {
        name: 'Integration Test User',
        email: 'integration@test.com',
      };

      const mockCreatedUser = {
        id: 1,
        ...newUser,
        created_at: new Date(),
        updated_at: new Date(),
      };

      pool.query
        .mockResolvedValueOnce([{ insertId: 1 }])
        .mockResolvedValueOnce([[mockCreatedUser]]);

      const response = await request(app)
        .post('/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email.toLowerCase());
    });

    it('debería retornar 400 con datos inválidos', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('debería retornar 409 si el email ya existe', async () => {
      pool.query.mockRejectedValueOnce({ code: 'ER_DUP_ENTRY' });

      const response = await request(app)
        .post('/users')
        .send({ name: 'Test', email: 'duplicate@test.com' })
        .expect(409);

      expect(response.body.error).toBe('Conflict');
    });
  });

  describe('GET /users', () => {
    it('debería retornar lista de usuarios', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'User 1',
          email: 'user1@test.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'User 2',
          email: 'user2@test.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      pool.query.mockResolvedValueOnce([mockUsers]);

      const response = await request(app).get('/users').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /users/:id', () => {
    it('debería retornar un usuario específico', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      pool.query.mockResolvedValueOnce([[mockUser]]);

      const response = await request(app).get('/users/1').expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Test User');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const response = await request(app).get('/users/999').expect(404);

      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('PUT /users/:id', () => {
    it('debería actualizar un usuario correctamente', async () => {
      const updatedData = { name: 'Updated Name' };
      const mockUser = {
        id: 1,
        name: 'Updated Name',
        email: 'test@test.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      pool.query
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([[mockUser]]);

      const response = await request(app)
        .put('/users/1')
        .send(updatedData)
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      pool.query
        .mockResolvedValueOnce([{ affectedRows: 0 }])
        .mockResolvedValueOnce([[]]);

      await request(app)
        .put('/users/999')
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('debería eliminar un usuario correctamente', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await request(app).delete('/users/1').expect(204);
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      await request(app).delete('/users/999').expect(404);
    });
  });
});
