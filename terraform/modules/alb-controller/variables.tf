variable "name_prefix" {
  description = "Prefijo para nombres de recursos"
  type        = string
}

variable "cluster_name" {
  description = "Nombre del cluster EKS"
  type        = string
}

variable "cluster_oidc_issuer_url" {
  description = "URL del OIDC provider del cluster EKS"
  type        = string
}

variable "tags" {
  description = "Tags comunes"
  type        = map(string)
  default     = {}
}
