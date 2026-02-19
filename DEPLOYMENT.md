# Despliegue Automatizado con GitHub Actions

Este proyecto utiliza GitHub Actions para automatizar completamente el proceso de despliegue, eliminando la necesidad de scripts manuales.

## Pipeline de Despliegue

El pipeline se ejecuta automáticamente en los siguientes casos:
- Push a las ramas `main` o `develop`
- Pull requests hacia `main`
- Ejecución manual desde GitHub Actions

### Etapas del Pipeline

1. **Build and Push Docker Images**
   - Construye las imágenes Docker del backend y frontend
   - Las sube a AWS ECR con el tag del commit SHA
   - Genera outputs con las URIs de las imágenes

2. **Deploy Terraform Infrastructure**
   - Despliega toda la infraestructura base usando Terraform
   - Incluye VPC, EKS cluster, ECR repositories, y ALB controller
   - Genera outputs con información del cluster

3. **Deploy Kubernetes Manifests**
   - Actualiza las imágenes en los manifiestos con las URIs generadas
   - Despliega todos los recursos de Kubernetes en orden
   - Verifica que los deployments estén disponibles

## Configuración Requerida

### Secrets de GitHub

Configura los siguientes secrets en tu repositorio de GitHub:

```
AWS_ACCESS_KEY_ID: Tu AWS Access Key ID
AWS_SECRET_ACCESS_KEY: Tu AWS Secret Access Key
```

### Variables de Entorno

Las siguientes variables están configuradas en el pipeline:

- `AWS_REGION`: us-east-1 (modificable en el archivo de workflow)
- `ECR_REPOSITORY_BACKEND`: prueba-tecnica-backend
- `ECR_REPOSITORY_FRONTEND`: prueba-tecnica-frontend

## Uso

1. **Despliegue Automático**: Simplemente haz push a `main` o `develop`
2. **Despliegue Manual**: Ve a Actions → Deploy Infrastructure and Applications → Run workflow

## Monitoreo

El pipeline incluye verificaciones automáticas:
- Espera a que los deployments estén disponibles
- Muestra el estado de pods, services e ingress
- Falla si algún componente no se despliega correctamente

## Estructura de Archivos

```
.github/
└── workflows/
    └── deploy.yml          # Pipeline principal de despliegue

k8s/
├── *.yaml                  # Manifiestos con placeholders actualizados

terraform/
├── main.tf                 # Configuración principal de infraestructura
└── modules/                # Módulos de Terraform
```

## Troubleshooting

- Verifica que los secrets de AWS estén configurados correctamente
- Asegúrate de que el usuario de AWS tenga permisos para ECR, EKS, y EC2
- Revisa los logs del pipeline en GitHub Actions para errores específicos