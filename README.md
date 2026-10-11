# 🍽️ Savoria — Restaurant Application (AWS 3-Tier)

A production-ready restaurant ordering platform built on AWS 3-tier architecture.

## Architecture

| Tier | Component | AWS Service |
|------|-----------|-------------|
| **Presentation** | React + Vite + Tailwind | S3 + CloudFront |
| **Application** | Node.js + Express REST API | ECS Fargate + ALB |
| **Data** | PostgreSQL + Redis | RDS Multi-AZ + ElastiCache |

## Features

- 🛒 Full online ordering (dine-in, takeaway, delivery)
- 🗂️ Category & menu management
- 👤 JWT authentication with roles (customer / staff / admin)
- ⭐ Review & rating system
- 🔄 Redis caching for menu & categories
- 📊 Admin dashboard (orders, menu, users)
- 🐳 Docker Compose for local development
- 🚀 GitHub Actions CI/CD pipeline
- 🏗️ Terraform IaC for full AWS provisioning

## Quick Start (Local)

### Prerequisites
- Docker & Docker Compose
- Node.js 20+

### 1. Clone & Configure
```bash
git clone <repo>
cd 3-tier
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

### 2. Start All Services
```bash
docker compose up --build
```

App available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000
- **Health**: http://localhost:5000/health

### 3. Seed Initial Data
```bash
docker exec restaurant_api npm run seed
```

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/profile` | Update profile |

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/menu` | List items (filter, paginate) |
| GET  | `/api/menu/:id` | Item detail |
| POST | `/api/menu` | Create item (admin) |
| PUT  | `/api/menu/:id` | Update item (admin) |
| DELETE | `/api/menu/:id` | Hide item (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET  | `/api/orders` | My orders / all (admin) |
| GET  | `/api/orders/:id` | Order detail |
| PATCH | `/api/orders/:id/status` | Update status (staff/admin) |
| DELETE | `/api/orders/:id` | Cancel order |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/categories` | List all categories |
| POST | `/api/categories` | Create (admin) |
| PUT  | `/api/categories/:id` | Update (admin) |

## AWS Deployment

### Prerequisites
- AWS CLI configured
- Terraform >= 1.5
- ECR repository created

### 1. Create S3 Backend
```bash
aws s3 mb s3://your-terraform-state-bucket
```

### 2. Deploy Infrastructure
```bash
cd infrastructure
terraform init
terraform apply \
  -var="db_password=YourSecurePass123!" \
  -var="jwt_secret=YourJWTSecret" \
  -var="ecr_image_url=<account>.dkr.ecr.us-east-1.amazonaws.com/savoria-api:latest"
```

### 3. Push API Image to ECR
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t savoria-api ./backend
docker tag savoria-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/savoria-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/savoria-api:latest
```

### 4. Deploy Frontend
```bash
cd frontend
VITE_API_URL=https://<cloudfront-url>/api npm run build
aws s3 sync dist/ s3://savoria-production-frontend --delete
```

## Security

- API servers in **private subnets** (no direct internet access)
- RDS & Redis in **private subnets** only
- ALB is the only public-facing API endpoint
- CloudFront with OAC for S3 (no public bucket)
- TLS encryption in transit (RDS, ElastiCache, CloudFront)
- JWT-based stateless authentication
- Helmet, CORS, and Rate Limiting on API

## CI/CD

GitHub Actions pipeline on push to `main`:
1. Run tests
2. Build & push Docker image to ECR
3. Update ECS service with new image
4. Build React app & sync to S3
5. Invalidate CloudFront cache
