variable "repository_name" {
  description = "Nombre del repositorio ECR"
  type        = string
}

variable "tags" {
  description = "Tags para los recursos"
  type        = map(string)
  default     = {}
}
