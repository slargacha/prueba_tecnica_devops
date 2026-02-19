variable "name_prefix" {
  description = "Prefijo para nombres de recursos"
  type        = string
}

variable "cluster_name" {
  description = "Nombre del cluster EKS"
  type        = string
}

variable "subnet_ids" {
  description = "IDs de subnets para el cluster (public + private)"
  type        = list(string)
}

variable "node_subnet_ids" {
  description = "IDs de subnets para el node group (típicamente privadas)"
  type        = list(string)
}

variable "kubernetes_version" {
  description = "Versión de Kubernetes"
  type        = string
  default     = "1.29"
}

variable "instance_types" {
  description = "Tipos de instancia para los nodos"
  type        = list(string)
  default     = ["t3.micro"]
}

variable "node_desired_size" {
  description = "Número deseado de nodos"
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Número mínimo de nodos"
  type        = number
  default     = 2
}

variable "node_max_size" {
  description = "Número máximo de nodos"
  type        = number
  default     = 3
}

variable "tags" {
  description = "Tags para los recursos"
  type        = map(string)
  default     = {}
}
