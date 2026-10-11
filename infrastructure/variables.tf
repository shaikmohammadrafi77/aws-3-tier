variable "aws_region"  { default = "us-east-1" }
variable "app_name"    { default = "savoria" }
variable "env"         { default = "production" }
variable "db_password" { sensitive = true }
variable "jwt_secret"  { sensitive = true }
variable "ecr_image_url" {}
