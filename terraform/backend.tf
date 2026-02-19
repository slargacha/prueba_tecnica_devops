# Backend configuration for Terraform state
# Backend S3 configurado para persistir el state
# Comentado para uso local, el pipeline de GitHub Actions lo usará descomentado

# terraform {
#   backend "s3" {
#     bucket         = "prueba-devops-terraform-state-965394064480"
#     key            = "terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "prueba-devops-terraform-locks"
#   }
# }
