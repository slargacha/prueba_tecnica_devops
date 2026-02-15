# =============================================================================
# Outputs Terraform - Root
# =============================================================================

output "vpc_id" {
  description = "ID de la VPC"
  value       = module.network.vpc_id
}

output "cluster_name" {
  description = "Nombre del cluster EKS"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint del cluster EKS"
  value       = module.eks.cluster_endpoint
}

output "ecr_backend_url" {
  description = "URL del repositorio ECR del backend (API)"
  value       = module.backend.repository_url
}

output "ecr_frontend_url" {
  description = "URL del repositorio ECR del frontend"
  value       = module.frontend.repository_url
}

output "configure_kubectl" {
  description = "Comando para configurar kubectl"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}
