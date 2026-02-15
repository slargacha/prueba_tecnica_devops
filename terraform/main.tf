# =============================================================================
# Root - Stack modular para despliegue en Kubernetes
# Microservicio de Gestion de Usuarios - DevOps Evaluation A01
# =============================================================================
# Modulos: network, eks, backend (ECR), frontend (ECR)
# MySQL se despliega en K8s como StatefulSet (ver kubernetes/)
# =============================================================================

locals {
  name_prefix   = "${var.project_name}-${var.environment}"
  cluster_name  = "${local.name_prefix}-eks"
  common_tags = {
    Project     = "user-management-microservice"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# -----------------------------------------------------------------------------
# Modulo Network
# -----------------------------------------------------------------------------
module "network" {
  source = "./modules/network"

  name_prefix       = local.name_prefix
  vpc_cidr          = var.vpc_cidr
  enable_nat_gateway = var.enable_nat_gateway
  eks_cluster_name  = local.cluster_name
  tags              = local.common_tags
}

# -----------------------------------------------------------------------------
# Modulo EKS - Cluster Kubernetes
# -----------------------------------------------------------------------------
module "eks" {
  source = "./modules/eks"

  name_prefix         = local.name_prefix
  cluster_name        = local.cluster_name
  subnet_ids          = concat(module.network.public_subnet_ids, module.network.private_subnet_ids)
  node_subnet_ids     = module.network.private_subnet_ids
  kubernetes_version  = var.kubernetes_version
  instance_types      = var.eks_instance_types
  node_desired_size   = var.eks_node_desired_size
  node_min_size       = var.eks_node_min_size
  node_max_size       = var.eks_node_max_size
  tags                = local.common_tags
}

# -----------------------------------------------------------------------------
# Modulo Backend - ECR para API
# -----------------------------------------------------------------------------
module "backend" {
  source = "./modules/backend"

  repository_name = "${var.project_name}-api"
  tags            = local.common_tags
}

# -----------------------------------------------------------------------------
# Modulo Frontend - ECR para frontend
# -----------------------------------------------------------------------------
module "frontend" {
  source = "./modules/frontend"

  repository_name = "${var.project_name}-frontend"
  tags            = local.common_tags
}
