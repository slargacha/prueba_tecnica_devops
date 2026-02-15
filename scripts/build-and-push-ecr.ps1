# =============================================================================
# Build y Push de imagenes Docker a AWS ECR
# Uso: .\scripts\build-and-push-ecr.ps1 [-Region "eu-west-1"] [-Target "all"]
# Target: backend, frontend, all
# =============================================================================

param(
    [string]$Region = "eu-west-1",
    [ValidateSet("backend", "frontend", "all")]
    [string]$Target = "all"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

function Build-Push {
    param([string]$Name, [string]$Context, [string]$Dockerfile)
    
    $ECR_URI = aws ecr describe-repositories --region $Region `
        --query "repositories[?repositoryName=='$Name'].repositoryUri" --output text 2>$null
    $ECR_URI = ($ECR_URI -split "`n")[0].Trim()
    
    if (-not $ECR_URI) {
        Write-Host "Error: Repositorio ECR '$Name' no encontrado." -ForegroundColor Red
        exit 1
    }
    
    $Base = $ECR_URI.Substring(0, $ECR_URI.IndexOf("/"))
    aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $Base
    
    docker build -t "${Name}:latest" -f $Dockerfile $Context
    docker tag "${Name}:latest" "${ECR_URI}:latest"
    docker push "${ECR_URI}:latest"
    Write-Host "OK: ${ECR_URI}:latest" -ForegroundColor Green
}

switch ($Target) {
    "backend"  { Build-Push "user-management-api" "." "Dockerfile" }
    "frontend" { Build-Push "user-management-frontend" "./frontend" "frontend/Dockerfile" }
    "all"      {
        Build-Push "user-management-api" "." "Dockerfile"
        Build-Push "user-management-frontend" "./frontend" "frontend/Dockerfile"
    }
}
