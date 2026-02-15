variable "name_prefix" {
  description = "Prefijo para nombres de recursos"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR de la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "enable_nat_gateway" {
  description = "Crear NAT Gateway para subnets privadas (recomendado para EKS)"
  type        = bool
  default     = true
}

variable "eks_cluster_name" {
  description = "Nombre del cluster EKS para etiquetar subnets (opcional)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags comunes para todos los recursos"
  type        = map(string)
  default     = {}
}
