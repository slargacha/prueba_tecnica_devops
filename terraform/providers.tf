# =============================================================================
# Proveedores Terraform
# Microservicio de Gestión de Usuarios - DevOps Evaluation A01
# =============================================================================
# Configuración de proveedores: AWS para infraestructura
# =============================================================================

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend S3 opcional para state remoto (descomentar para producción)
  # backend "s3" {
  #   bucket         = "mi-bucket-terraform-state"
  #   key            = "user-management/terraform.tfstate"
  #   region         = "eu-west-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "user-management-microservice"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
