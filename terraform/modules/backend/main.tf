# =============================================================================
# Modulo Backend - ECR para imagen de la API
# =============================================================================

resource "aws_ecr_repository" "api" {
  name                 = var.repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(var.tags, {
    Name = var.repository_name
  })
}
