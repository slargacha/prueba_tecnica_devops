variable "bucket_name" {
  description = "Nombre del bucket S3 para Terraform state"
  type        = string
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para state locking"
  type        = string
}

variable "tags" {
  description = "Tags comunes"
  type        = map(string)
  default     = {}
}
