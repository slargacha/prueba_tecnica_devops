# =============================================================================
# Root - Stack modular EKS (variante habitual)
# VPC prueba_devops | 3 subnets publicas + 3 privadas en 3 AZs | us-east-1
# =============================================================================

locals {
  name_prefix  = "prueba_devops"
  vpc_name     = "prueba_devops"
  cluster_name = "prueba_devops-eks"
  common_tags = {
    Project   = "prueba_devops"
    ManagedBy = "Terraform"
  }
}

data "aws_caller_identity" "current" {}

module "network" {
  source = "./modules/network"

  name_prefix        = local.name_prefix
  vpc_name           = local.vpc_name
  region             = var.aws_region
  vpc_cidr           = var.vpc_cidr
  enable_nat_gateway = var.enable_nat_gateway
  eks_cluster_name   = local.cluster_name
  tags               = local.common_tags
}

module "eks" {
  source = "./modules/eks"

  name_prefix        = local.name_prefix
  cluster_name       = local.cluster_name
  subnet_ids         = concat(module.network.public_subnet_ids, module.network.private_subnet_ids)
  node_subnet_ids    = module.network.private_subnet_ids
  kubernetes_version = var.kubernetes_version
  instance_types     = var.eks_instance_types
  node_desired_size  = var.eks_node_desired_size
  node_min_size      = var.eks_node_min_size
  node_max_size      = var.eks_node_max_size
  tags               = local.common_tags
}

module "alb_controller" {
  source = "./modules/alb-controller"

  name_prefix             = local.name_prefix
  cluster_name            = local.cluster_name
  cluster_oidc_issuer_url = module.eks.cluster_oidc_issuer_url
  tags                    = local.common_tags

  depends_on = [module.eks]
}

module "monitoring" {
  source = "./modules/monitoring"

  name_prefix        = local.name_prefix
  cluster_name       = local.cluster_name
  log_retention_days = var.log_retention_days
  enable_eks_logging = var.enable_eks_logging
  tags               = local.common_tags

  depends_on = [module.eks]
}
