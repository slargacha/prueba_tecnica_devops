# =============================================================================
# Módulo Monitoring - CloudWatch Log Groups
# =============================================================================

resource "aws_cloudwatch_log_group" "eks_cluster" {
  name              = "/aws/eks/${var.cluster_name}/cluster"
  retention_in_days = var.log_retention_days
  tags = merge(var.tags, {
    Name        = "${var.name_prefix}-eks-logs"
    Component   = "EKS"
    Description = "Logs del control plane de EKS"
  })
}

resource "aws_cloudwatch_log_group" "alb" {
  name              = "/aws/elasticloadbalancing/app/${var.name_prefix}"
  retention_in_days = var.log_retention_days
  tags = merge(var.tags, {
    Name        = "${var.name_prefix}-alb-logs"
    Component   = "ALB"
    Description = "Logs del Application Load Balancer"
  })
}

resource "aws_cloudwatch_log_group" "nat_gateway" {
  name              = "/aws/vpc/natgateway/${var.name_prefix}"
  retention_in_days = var.log_retention_days
  tags = merge(var.tags, {
    Name        = "${var.name_prefix}-nat-logs"
    Component   = "NAT Gateway"
    Description = "Logs del NAT Gateway"
  })
}
