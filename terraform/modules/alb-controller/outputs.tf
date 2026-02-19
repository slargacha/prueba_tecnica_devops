output "iam_role_arn" {
  description = "ARN del IAM role para el AWS Load Balancer Controller"
  value       = aws_iam_role.alb_controller.arn
}

output "oidc_provider_arn" {
  description = "ARN del OIDC provider"
  value       = aws_iam_openid_connect_provider.cluster.arn
}
