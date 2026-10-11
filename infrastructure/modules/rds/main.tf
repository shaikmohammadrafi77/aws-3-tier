variable "app_name" {}
variable "env" {}
variable "vpc_id" {}
variable "private_subnet_ids" { type = list(string) }
variable "db_password" { sensitive = true }

resource "aws_security_group" "rds" {
  name   = "${var.app_name}-rds-sg"
  vpc_id = var.vpc_id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.app_name}-db-subnet-group"
  subnet_ids = var.private_subnet_ids
}

resource "aws_db_instance" "postgres" {
  identifier             = "${var.app_name}-${var.env}-postgres"
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t3.medium"
  allocated_storage      = 20
  max_allocated_storage  = 100
  db_name                = "restaurant_db"
  username               = "postgres"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  multi_az               = true
  skip_final_snapshot    = false
  final_snapshot_identifier = "${var.app_name}-final"
  backup_retention_period = 7
  storage_encrypted      = true
  tags = { Name = "${var.app_name}-postgres" }
}

output "db_endpoint" { value = aws_db_instance.postgres.address }
output "db_name"     { value = aws_db_instance.postgres.db_name }
