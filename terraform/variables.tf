# =============================================================================
# Variables Terraform - Root
# =============================================================================

variable "aws_region" {
  description = "Region AWS"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR de la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "enable_nat_gateway" {
  description = "Habilitar NAT Gateway para subnets privadas"
  type        = bool
  default     = true
}

# EKS
variable "kubernetes_version" {
  description = "Version de Kubernetes para EKS"
  type        = string
  default     = "1.29"
}

variable "eks_instance_types" {
  description = "Tipos de instancia para nodos EKS (t3.small tiene más capacidad que t3.micro)"
  type        = list(string)
  default     = ["t3.small"]
}

variable "eks_node_desired_size" {
  description = "Numero deseado de nodos EKS"
  type        = number
  default     = 2
}

variable "eks_node_min_size" {
  description = "Numero minimo de nodos EKS"
  type        = number
  default     = 2
}

variable "eks_node_max_size" {
  description = "Numero maximo de nodos EKS"
  type        = number
  default     = 3
}

# Monitoring
variable "log_retention_days" {
  description = "Días de retención para logs en CloudWatch"
  type        = number
  default     = 7
}

variable "enable_eks_logging" {
  description = "Habilitar logging del control plane de EKS"
  type        = bool
  default     = true
}
