# =============================================================================
# Variables del Módulo Monitoring
# =============================================================================

variable "name_prefix" {
  description = "Prefijo para nombrar recursos"
  type        = string
}

variable "cluster_name" {
  description = "Nombre del cluster EKS"
  type        = string
}

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

variable "tags" {
  description = "Tags comunes para todos los recursos"
  type        = map(string)
  default     = {}
}
