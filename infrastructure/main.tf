terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "restaurant/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source   = "./modules/vpc"
  app_name = var.app_name
  env      = var.env
}

module "rds" {
  source            = "./modules/rds"
  app_name          = var.app_name
  env               = var.env
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  db_password       = var.db_password
}

module "elasticache" {
  source             = "./modules/elasticache"
  app_name           = var.app_name
  env                = var.env
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}

module "ecs" {
  source              = "./modules/ecs"
  app_name            = var.app_name
  env                 = var.env
  vpc_id              = module.vpc.vpc_id
  public_subnet_ids   = module.vpc.public_subnet_ids
  private_subnet_ids  = module.vpc.private_subnet_ids
  db_host             = module.rds.db_endpoint
  redis_host          = module.elasticache.redis_endpoint
  db_password         = var.db_password
  jwt_secret          = var.jwt_secret
  ecr_image_url       = var.ecr_image_url
}

module "cloudfront" {
  source        = "./modules/cloudfront"
  app_name      = var.app_name
  env           = var.env
  alb_dns_name  = module.ecs.alb_dns_name
}

output "frontend_url"  { value = module.cloudfront.cloudfront_url }
output "api_url"       { value = module.ecs.alb_dns_name }
output "db_endpoint"   { value = module.rds.db_endpoint }
