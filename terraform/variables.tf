# =============================================================================
# Variables Terraform - Root
# =============================================================================

variable "aws_region" {
  description = "Region AWS"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Entorno (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El entorno debe ser: dev, staging o prod."
  }
}

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "user-management"
}

variable "vpc_cidr" {
  description = "CIDR de la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "enable_nat_gateway" {
  description = "Habilitar NAT Gateway para subnets privadas (requerido para EKS)"
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
  description = "Tipos de instancia para nodos EKS"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "eks_node_desired_size" {
  description = "Numero deseado de nodos EKS"
  type        = number
  default     = 2
}

variable "eks_node_min_size" {
  description = "Numero minimo de nodos EKS"
  type        = number
  default     = 1
}

variable "eks_node_max_size" {
  description = "Numero maximo de nodos EKS"
  type        = number
  default     = 3
}
