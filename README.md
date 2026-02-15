# Microservicio de Gestión de Usuarios

**DevOps Evaluation A01** - Aplicación de gestión de usuarios con **arquitectura de 3 capas**: Frontend (nginx), Backend (Node.js + Express) y Capa de datos (MySQL).

## Tabla de Contenidos

- [Descripción](#descripción)
- [Requisitos](#requisitos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Despliegue Local (Docker Compose)](#despliegue-local-docker-compose)
- [Despliegue en AWS (Terraform)](#despliegue-en-aws-terraform)
- [API Reference](#api-reference)
- [Variables de Entorno](#variables-de-entorno)

---

## Descripción

Microservicio que permite:

- **Crear** un nuevo usuario (nombre y email)
- **Obtener** información de usuario por ID
- **Actualizar** información de usuario existente (opcional)
- **Eliminar** usuario existente (opcional)

### Arquitectura 3 capas

| Capa | Componente | Tecnología |
|------|------------|------------|
| **1. Presentación** | Frontend | HTML, CSS, JS, nginx |
| **2. Lógica de negocio** | Backend | Node.js + Express |
| **3. Datos** | Base de datos | MySQL 8.0 |

### Tecnologías adicionales

| Componente | Tecnología |
|------------|------------|
| Contenedorización | Docker, Docker Compose |
| Infraestructura | Terraform modular (Network, EKS, ECR) |
| Orquestación | Kubernetes (EKS) - MySQL como StatefulSet |

---

## Requisitos

- **Node.js** >= 18 (para desarrollo local)
- **Docker** y **Docker Compose** (para despliegue local)
- **Terraform** >= 1.0 (para infraestructura AWS)
- **AWS CLI** (para despliegue en AWS)
- **Cuenta AWS** con credenciales configuradas

---

## Estructura del Proyecto

```
prueba_tecnica_devops/
├── frontend/                 # Capa 1 - Presentación
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── nginx.conf
│   └── Dockerfile
├── src/                      # Capa 2 - Backend
│   ├── config/
│   │   └── database.js      # Configuración MySQL
│   ├── controllers/
│   │   └── users.controller.js
│   ├── db/
│   │   └── init.sql         # Schema inicial
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   └── users.routes.js
│   └── index.js             # Entrada de la aplicación
├── terraform/               # Infraestructura modular (EKS + ECR)
│   ├── main.tf              # Orquestación de módulos
│   ├── modules/
│   │   ├── network/         # VPC, subnets, NAT
│   │   ├── eks/             # Cluster Kubernetes
│   │   ├── backend/         # ECR para API
│   │   └── frontend/        # ECR para frontend
│   └── terraform.tfvars.example
├── kubernetes/              # Manifiestos K8s
│   ├── mysql/               # StatefulSet + Service
│   └── README.md
├── scripts/
│   ├── build-and-push-ecr.sh
│   └── build-and-push-ecr.ps1
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Despliegue Local (Docker Compose)

### Inicio rápido

```bash
# 1. Construir y levantar las 3 capas
docker-compose up -d

# 2. Acceder a la aplicación (Frontend en puerto 80)
# Navegador: http://localhost

# 3. API directamente (Backend en puerto 3000)
curl http://localhost:3000/health
```

### Pasos detallados

1. **Clonar el repositorio**
   ```bash
   git clone <url-repositorio>
   cd prueba_tecnica_devops
   ```

2. **Configurar variables (opcional)**
   ```bash
   # Por defecto usa: DB_PASSWORD=postgres123
   # Para cambiar: export DB_PASSWORD=mi_password
   ```

3. **Levantar servicios**
   ```bash
   docker-compose up -d
   ```

4. **Verificar**
   - **Frontend (Capa 1):** http://localhost
   - **Backend (Capa 2):** http://localhost:3000
   - **Health:** http://localhost:3000/health
   - **MySQL (Capa 3):** localhost:3306 (usuario: root, BD: users_db)

### Ejemplos de uso (API)

```bash
# Crear usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@ejemplo.com"}'

# Obtener usuario (usar el ID devuelto)
curl http://localhost:3000/users/<UUID>

# Actualizar usuario
curl -X PUT http://localhost:3000/users/<UUID> \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan García"}'

# Eliminar usuario
curl -X DELETE http://localhost:3000/users/<UUID>
```

---

## Despliegue en AWS (Terraform + Kubernetes)

Stack modular: **Network**, **EKS**, **Backend (ECR)**, **Frontend (ECR)**. MySQL se despliega en K8s como StatefulSet.

### Prerrequisitos

- **AWS CLI** configurado (`aws configure`)
- **kubectl** instalado
- **Docker** para build de imágenes

### Pasos de despliegue

1. **Terraform** - Infraestructura:
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   terraform init && terraform apply
   ```

2. **Configurar kubectl**:
   ```bash
   aws eks update-kubeconfig --region eu-west-1 --name user-management-dev-eks
   ```

3. **Desplegar MySQL** en Kubernetes:
   ```bash
   kubectl apply -k kubernetes/mysql/
   ```

4. **Push imágenes** a ECR:
   ```bash
   ./scripts/build-and-push-ecr.sh eu-west-1 backend
   ./scripts/build-and-push-ecr.sh eu-west-1 frontend
   ```

5. **Desplegar backend y frontend** en K8s (Deployments, Services, Ingress).

Ver [terraform/DEPLOYMENT.md](terraform/DEPLOYMENT.md) y [kubernetes/README.md](kubernetes/README.md) para detalles.

---

## API Reference

| Método | Ruta        | Descripción        |
|--------|-------------|--------------------|
| GET    | /           | Info del servicio  |
| GET    | /health     | Health check       |
| POST   | /users      | Crear usuario      |
| GET    | /users      | Listar todos los usuarios |
| GET    | /users/:id  | Obtener usuario    |
| PUT    | /users/:id  | Actualizar usuario |
| DELETE | /users/:id  | Eliminar usuario   |

### Crear usuario

**Request:**
```json
POST /users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "created_at": "2024-02-14T12:00:00.000Z",
  "updated_at": "2024-02-14T12:00:00.000Z"
}
```

---

## Variables de Entorno

| Variable     | Descripción              | Default   |
|-------------|--------------------------|-----------|
| PORT        | Puerto del servidor      | 3000      |
| DB_HOST     | Host MySQL               | localhost |
| DB_PORT     | Puerto MySQL             | 3306      |
| DB_NAME     | Nombre de la BD          | users_db  |
| DB_USER     | Usuario MySQL            | root      |
| DB_PASSWORD | Contraseña MySQL         | root      |

---

## Mejores Prácticas Aplicadas

- **Código documentado**: JSDoc en módulos y funciones
- **Validación de entrada**: nombre, email y formato de UUID
- **Manejo de errores**: respuestas HTTP coherentes y logging
- **Seguridad**: usuario no-root en Docker, variables sensibles en Terraform
- **Docker**: multi-stage build y `.dockerignore`
- **Terraform**: variables, outputs, tags y validaciones
- **Base de datos**: índices, constraint UNIQUE en email, inicialización automática del esquema

---

## Licencia

MIT
