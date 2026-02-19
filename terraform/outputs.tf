# =============================================================================
# Outputs Terraform - Root
# =============================================================================

output "vpc_id" {
  description = "ID de la VPC"
  value       = module.network.vpc_id
}

output "vpc_name" {
  description = "Nombre de la VPC"
  value       = local.vpc_name
}

output "public_subnet_ids" {
  description = "IDs de subnets publicas"
  value       = module.network.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs de subnets privadas"
  value       = module.network.private_subnet_ids
}

output "cluster_name" {
  description = "Nombre del cluster EKS"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint del cluster EKS"
  value       = module.eks.cluster_endpoint
}

output "configure_kubectl" {
  description = "Comando para configurar kubectl"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

output "alb_controller_role_arn" {
  description = "ARN del IAM role para AWS Load Balancer Controller"
  value       = module.alb_controller.iam_role_arn
}

output "eks_log_group_name" {
  description = "Nombre del log group de EKS en CloudWatch"
  value       = module.monitoring.eks_log_group_name
}

output "alb_log_group_name" {
  description = "Nombre del log group del ALB en CloudWatch"
  value       = module.monitoring.alb_log_group_name
}

output "nat_log_group_name" {
  description = "Nombre del log group del NAT Gateway en CloudWatch"
  value       = module.monitoring.nat_log_group_name
}
