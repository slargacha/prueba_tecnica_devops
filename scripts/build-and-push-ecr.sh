#!/bin/bash
# =============================================================================
# Build y Push de imagenes Docker a AWS ECR
# Uso: ./scripts/build-and-push-ecr.sh [region] [backend|frontend|all]
# =============================================================================

set -e

AWS_REGION="${1:-eu-west-1}"
TARGET="${2:-all}"
IMAGE_TAG="latest"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

build_push() {
  local name=$1
  local context=$2
  local dockerfile=$3

  echo "=== Build y Push: $name ==="
  ECR_URI=$(aws ecr describe-repositories --region "$AWS_REGION" \
    --query "repositories[?repositoryName=='${name}'].repositoryUri" --output text 2>/dev/null | head -1)

  if [ -z "$ECR_URI" ]; then
    echo "Error: Repositorio ECR '${name}' no encontrado. Ejecute 'terraform apply' primero."
    exit 1
  fi

  aws ecr get-login-password --region "$AWS_REGION" | \
    docker login --username AWS --password-stdin "${ECR_URI%%/*}"

  docker build -t "${name}:${IMAGE_TAG}" -f "$dockerfile" "$context"
  docker tag "${name}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
  docker push "${ECR_URI}:${IMAGE_TAG}"
  echo "OK: ${ECR_URI}:${IMAGE_TAG}"
}

cd "$PROJECT_ROOT"

case "$TARGET" in
  backend)
    build_push "user-management-api" "." "Dockerfile"
    ;;
  frontend)
    build_push "user-management-frontend" "./frontend" "frontend/Dockerfile"
    ;;
  all)
    build_push "user-management-api" "." "Dockerfile"
    build_push "user-management-frontend" "./frontend" "frontend/Dockerfile"
    ;;
  *)
    echo "Uso: $0 [region] [backend|frontend|all]"
    exit 1
    ;;
esac
