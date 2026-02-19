# =============================================================================
# Outputs del Módulo Monitoring
# =============================================================================

output "eks_log_group_name" {
  description = "Nombre del log group de EKS"
  value       = aws_cloudwatch_log_group.eks_cluster.name
}

output "eks_log_group_arn" {
  description = "ARN del log group de EKS"
  value       = aws_cloudwatch_log_group.eks_cluster.arn
}

output "alb_log_group_name" {
  description = "Nombre del log group del ALB"
  value       = aws_cloudwatch_log_group.alb.name
}

output "alb_log_group_arn" {
  description = "ARN del log group del ALB"
  value       = aws_cloudwatch_log_group.alb.arn
}

output "nat_log_group_name" {
  description = "Nombre del log group del NAT Gateway"
  value       = aws_cloudwatch_log_group.nat_gateway.name
}

output "nat_log_group_arn" {
  description = "ARN del log group del NAT Gateway"
  value       = aws_cloudwatch_log_group.nat_gateway.arn
}
