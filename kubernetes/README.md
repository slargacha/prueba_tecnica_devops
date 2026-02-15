# Kubernetes - Despliegue en cluster

MySQL corre como contenedor (StatefulSet). El backend crea el esquema automaticamente al iniciar.

**Nota EKS:** Si usas EKS, asegurate de tener el add-on EBS CSI Driver habilitado para los PVC (storageClassName: gp2). Si no existe, crea una StorageClass o cambia a la que tenga tu cluster.

## Orden de despliegue

1. **Terraform** (crea EKS, ECR, network)
2. **Push imagenes** a ECR (backend, frontend)
3. **Desplegar MySQL** en K8s
4. **Desplegar backend** (conectar a mysql.user-management.svc.cluster.local)
5. **Desplegar frontend**
6. **Ingress** para acceso externo

## MySQL (StatefulSet + Service)

```bash
kubectl apply -f mysql/
# o con kustomize:
kubectl apply -k mysql/
```

Servicio interno: `mysql.user-management.svc.cluster.local:3306`

## Variables para Backend

- DB_HOST=mysql.user-management.svc.cluster.local
- DB_PORT=3306
- DB_NAME=users_db
- DB_USER=app (o root)
- DB_PASSWORD=app123 (segun secret)
