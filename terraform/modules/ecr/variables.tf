variable "backend_repository_name" {
  description = "Nombre del repositorio ECR para backend (API)"
  type        = string
}

variable "frontend_repository_name" {
  description = "Nombre del repositorio ECR para frontend"
  type        = string
}

variable "tags" {
  description = "Tags para los recursos"
  type        = map(string)
  default     = {}
}
