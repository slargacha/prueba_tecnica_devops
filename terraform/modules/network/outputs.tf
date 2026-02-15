output "vpc_id" {
  description = "ID de la VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "CIDR de la VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "IDs de las subnets públicas"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs de las subnets privadas"
  value       = aws_subnet.private[*].id
}

output "private_subnet_ids_for_eks" {
  description = "IDs de subnets privadas (para EKS node group)"
  value       = aws_subnet.private[*].id
}

output "public_subnet_ids_for_eks" {
  description = "IDs de subnets públicas (para EKS node group)"
  value       = aws_subnet.public[*].id
}
