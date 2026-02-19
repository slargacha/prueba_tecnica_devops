-- =============================================================================
-- Script de inicialización - MySQL (Capa 3 - Datos)
-- Se ejecuta una sola vez al crear el contenedor (docker-entrypoint-initdb.d).
-- Crea la base users_db (si MYSQL_DATABASE=users_db), tabla users e índices.
-- =============================================================================

USE users_db;

-- Tabla principal de usuarios (id numérico auto-increment, nombre, email único, timestamps)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para búsquedas por email y orden por fecha
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
