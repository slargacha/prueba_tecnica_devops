# Guía de Despliegue - Stack Modular + Kubernetes

## Arquitectura

- **Terraform**: Network, EKS, ECR (backend + frontend)
- **MySQL**: StatefulSet en Kubernetes (no RDS)
- **Backend/Frontend**: Contenedores desplegados en EKS

## Orden de Despliegue

### 1. Infraestructura con Terraform

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Editar terraform.tfvars

terraform init
terraform plan
terraform apply
```

### 2. Configurar kubectl

```bash
aws eks update-kubeconfig --region eu-west-1 --name user-management-dev-eks
```

### 3. Desplegar MySQL en Kubernetes

```bash
kubectl apply -k kubernetes/mysql/
```

El backend crea el esquema al iniciar (ensureSchema).

### 4. Push imágenes a ECR

```bash
# Backend
./scripts/build-and-push-ecr.sh eu-west-1 backend

# Frontend
./scripts/build-and-push-ecr.sh eu-west-1 frontend
```

### 5. Desplegar Backend y Frontend en K8s

Crear Deployments y Services (ver kubernetes/README.md para ejemplos).
Configurar backend con:
- DB_HOST=mysql.user-management.svc.cluster.local
- DB_USER=app, DB_PASSWORD=app123 (según secret)

## Módulos Terraform

| Módulo | Contenido |
|--------|-----------|
| network | VPC, subnets, IGW, NAT, route tables |
| eks | Cluster EKS + Node Group |
| backend | ECR para imagen API |
| frontend | ECR para imagen frontend |

## Costos Estimados

- **EKS**: ~$73/mes (cluster)
- **Nodos t3.medium x2**: ~$60/mes
- **NAT Gateway**: ~$32/mes
- **ECR**: Primeros 500MB gratuitos

## Destrucción

```bash
kubectl delete -k kubernetes/mysql/
terraform destroy
```
