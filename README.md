# 🛒 OnlineShop - Full Stack E-Commerce Platform

A modern e-commerce application built using industry-standard software engineering practices.

The project is designed to demonstrate real-world application development including:

- Backend API development
- Database design
- Authentication and authorization
- Secure coding practices
- API documentation
- Containerized development
- Cloud-native deployment concepts
- DevOps automation

---

# 📌 Project Overview

OnlineShop is a full-stack e-commerce platform.

The application allows users to:

- Create an account
- Login securely
- Browse products
- Manage shopping cart
- Place orders
- Complete payments

Administrators can:

- Manage users
- Manage products
- Manage categories
- Manage application data

The project is being developed following scalable backend architecture and production deployment practices.

---

# 🏗 System Architecture

## Current Full-Stack Docker Architecture

```
Browser
    |
    v
Frontend Container
React + TypeScript + Vite
Port 5173
    |
    v
Backend Container
Node.js + Express + TypeScript
Port 5050
    |
    v
Prisma ORM
    |
    v
PostgreSQL Container
PostgreSQL 17
Port 5432
    |
    v
Named Docker Volume
docker_onlineshop-postgres-data
```

## Local Development Architecture

```
Browser
    |
    v
Frontend - local
    |
    v
Backend - local
    |
    v
PostgreSQL - Docker
```

## Future Production Architecture

```
Users
    |
  HTTPS
    |
Load Balancer / Gateway
    |
Frontend Application
    |
Backend API
    |
Kubernetes / Cloud Platform
    |
Managed PostgreSQL
```

---

# 🚀 Getting Started

This project supports both local application development and a complete Docker development environment.

## Prerequisites

- Git
- Docker Desktop
- Node.js 22+ for local development
- npm

## Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd OnlineShop
```

## Environment Files

Environment-specific files containing secrets are not committed to Git. The repository provides safe templates:

```text
backend/.env.example
frontend/.env.example
docker/.env.example
```

Create the local environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp docker/.env.example docker/.env
```

Update the copied files with the values required for your environment. Never commit the real `.env` files or secret values.

### Environment file responsibilities

| File | Purpose |
|---|---|
| `backend/.env` | Backend server, database connection, frontend URL, and JWT configuration |
| `frontend/.env` | Vite frontend API URL |
| `docker/.env` | Secrets and environment values supplied to Docker Compose |

The committed `.env.example` files contain placeholders only and are intended to be copied for each environment.

## Development Modes

### Mode 1 — Local Application + Docker PostgreSQL

Frontend and backend run directly on the development machine. PostgreSQL runs in Docker.

```
Frontend (local) --> Backend (local) --> PostgreSQL (Docker)
```

### Mode 2 — Complete Docker Setup

Frontend, backend, and PostgreSQL all run as Docker services.

```
Browser --> Frontend container --> Backend container --> PostgreSQL container
```

---

# 💻 Local Development

## Start PostgreSQL in Docker

Run this from the project root:

```bash
docker compose \
  --env-file docker/.env \
  -f docker/docker-compose.yml \
  up -d postgres
```

Check the database container:

```bash
docker compose \
  --env-file docker/.env \
  -f docker/docker-compose.yml \
  ps
```

PostgreSQL should eventually show `healthy`.

## Start the Backend Locally

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

The backend runs on:

```text
http://localhost:5050
```

Health check:

```bash
curl http://localhost:5050/health
```

Swagger/OpenAPI:

```text
http://localhost:5050/api-docs
```

## Start the Frontend Locally

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Prisma Studio with Docker PostgreSQL

Prisma Studio runs on the development machine while connecting to the PostgreSQL database exposed by Docker.

```bash
cd backend
npx prisma studio
```

Open:

```text
http://localhost:5555
```

Prisma Studio is not required to run as a Docker container for this development workflow.

---

# 🐳 Complete Docker Setup

All application services can be run through Docker Compose.

## 1. Validate the Compose Configuration

From the project root:

```bash
docker compose \
  --env-file docker/.env \
  -f docker/docker-compose.yml \
  config
```

## 2. Build the Images

```bash
docker compose \
  --env-file docker/.env \
  -f docker/docker-compose.yml \
  build
```

This builds:

- `onlineshop-frontend:dev`
- `onlineshop-backend:dev`

PostgreSQL uses the official `postgres:17` image.

## 3. Start All Services

```bash
docker compose \
  --env-file docker/.env \
  -f docker/docker-compose.yml \
  up -d
```

## 4. Verify Containers

```bash
docker compose \
  --env-file docker/.env \
  -f docker/docker-compose.yml \
  ps
```

Expected services:

| Service | Container | Host Port |
|---|---|---:|
| Frontend | `onlineshop-frontend` | `5173` |
| Backend | `onlineshop-backend` | `5050` |
| PostgreSQL | `onlineshop-postgres` | `5432` |

PostgreSQL should report `healthy`.

## 5. Verify the Backend

```bash
curl http://localhost:5050/health
```

Expected response:

```json
{"message":"Online Shop API is running"}
```

## 6. Open the Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5050
```

Swagger:

```text
http://localhost:5050/api-docs
```

---

# 🧱 Docker Architecture

```
Host Machine
     |
     +-----------------------------+
     |                             |
     v                             v
Frontend :5173                 Backend :5050
React/Vite                  Node/Express
     |                             |
     +-------------+---------------+
                   |
                   v
            PostgreSQL :5432
                   |
                   v
     docker_onlineshop-postgres-data
```

Docker Compose provides the service network, container configuration, healthcheck, port mappings, and PostgreSQL persistent volume.

### Container networking

Inside the Docker Compose network, the backend connects to PostgreSQL using the service name:

```text
postgres
```

It must not use `localhost` for the PostgreSQL connection from inside the backend container.

From the host machine, PostgreSQL is available through:

```text
localhost:5432
```

---

# 📁 Docker Files

```text
docker/
├── docker-compose.yml
└── .env.example

backend/
├── Dockerfile
└── .env.example

frontend/
├── Dockerfile
└── .env.example
```

### `docker/docker-compose.yml`

Defines the application services, networking, environment configuration, healthchecks, port mappings, and PostgreSQL persistent volume.

### `backend/Dockerfile`

Builds the TypeScript backend application and prepares the Prisma client and production runtime.

### `frontend/Dockerfile`

Builds the React/Vite frontend container.

---

# 🔄 Docker Lifecycle Commands

Start all services:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml up -d
```

Stop containers and remove the Compose network:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml down
```

`down` removes containers and the network but does **not** remove the PostgreSQL named volume.

Rebuild images:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml build
```

Force recreate containers:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml up -d --force-recreate
```

View all logs:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml logs -f
```

View backend logs:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml logs -f backend
```

View frontend logs:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml logs -f frontend
```

View PostgreSQL logs:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml logs -f postgres
```

Check service status:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml ps
```

List the PostgreSQL volume:

```bash
docker volume ls | grep onlineshop
```

### Delete the development database volume

Only do this intentionally when you want to destroy the PostgreSQL data:

```bash
docker volume rm docker_onlineshop-postgres-data
```

**Warning:** deleting the volume permanently removes the database data stored in it.

---

# 🗄 PostgreSQL Persistence

PostgreSQL data is stored in the named Docker volume:

```text
docker_onlineshop-postgres-data
```

Therefore:

```text
docker compose down
        |
        +--> containers removed
        +--> network removed
        +--> database volume retained
```

A new machine does not contain the old database volume. Cloning the Git repository only provides the application source code and migration history, not the database data.

If an existing database must be moved to another machine, use a database backup/restore process rather than Git.

---

# 🔷 Prisma and Database Migrations

Prisma schema and migration history are stored under:

```text
backend/prisma/
├── schema.prisma
└── migrations/
    └── <migration_timestamp>_<migration_name>/
        └── migration.sql
```

## Development

When the Prisma schema changes, create and apply a migration:

```bash
cd backend
npx prisma migrate dev --name <migration_name>
```

Check migration status:

```bash
npx prisma migrate status
```

`prisma migrate dev` is intended for development environments.

## Staging / Production

Apply committed migrations with:

```bash
npx prisma migrate deploy
```

`migrate deploy` is intended for non-development environments and should normally be part of the deployment/CI/CD process.

## Migration History

Migration files are part of the project's source-controlled database history and should be committed to Git. Do **not** delete or rewrite previously committed migrations simply because a newer migration supersedes them.

## Prisma Studio

For database inspection during development:

```bash
cd backend
npx prisma studio
```

---

# 🆕 New Machine — Full Setup

Follow these steps after cloning the repository onto a new computer:

1. Install Git and Docker Desktop.
2. Install Node.js 22+ if local development will be used.
3. Clone the repository.
4. Enter the project directory.
5. Create `backend/.env`, `frontend/.env`, and `docker/.env` from their `.env.example` files.
6. Add environment-specific values and secrets locally.
7. Start Docker Desktop.
8. Validate the Compose configuration.
9. Build the Docker images.
10. Start all Docker services.
11. Check the containers with `docker compose ps`.
12. Confirm PostgreSQL is `healthy`.
13. Run the backend health check.
14. Open `http://localhost:5173`.
15. Optionally start Prisma Studio.

Example:

```bash
git clone <YOUR_REPOSITORY_URL>
cd OnlineShop

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp docker/.env.example docker/.env

docker compose --env-file docker/.env -f docker/docker-compose.yml config
docker compose --env-file docker/.env -f docker/docker-compose.yml build
docker compose --env-file docker/.env -f docker/docker-compose.yml up -d
docker compose --env-file docker/.env -f docker/docker-compose.yml ps

curl http://localhost:5050/health
```

The repository does not contain production secrets or database data. A fresh machine therefore creates a new PostgreSQL volume and database environment.

---

# 🔐 Git and Secrets

Real `.env` files must remain untracked:

```text
backend/.env
frontend/.env
docker/.env
```

The following template files are intended to be committed:

```text
backend/.env.example
frontend/.env.example
docker/.env.example
```

Never replace placeholder values in `.env.example` files with real credentials.

Docker Compose is explicitly invoked with `--env-file docker/.env` so the project uses the intended environment-specific configuration. Docker Compose supports supplying an alternative environment file through `--env-file`.

---

# 🛠 Technology Stack

## Backend

| Component | Technology |
|---|---|
| Programming Language | TypeScript |
| Runtime | Node.js 22 |
| Framework | Express.js |
| API Architecture | REST API |
| Database | PostgreSQL 17 |
| Database ORM | Prisma |
| Authentication | JWT |
| Password Security | bcrypt |
| Documentation | Swagger/OpenAPI |
| Package Manager | npm |
| Version Control | Git |

---

# 💻 Backend Technology Explanation

## TypeScript

TypeScript is used as the primary backend language.

Benefits:

- Static typing
- Better maintainability
- Early error detection
- Improved developer experience

Example:

```typescript
const price:number = 100;
```

TypeScript prevents invalid values before runtime.

---

# Node.js

Node.js provides the server runtime environment.

Responsibilities:

- Execute backend application
- Handle HTTP requests
- Manage asynchronous operations
- Run Express server

---

# Express.js

Express.js is the backend framework used to create REST APIs.

Responsibilities:

- Route management
- Middleware handling
- Request/response processing
- API development

Example API:

```
GET    /api/products
POST   /api/users/register
PATCH  /api/users/:id/role
```

---

# Database Layer

## PostgreSQL

PostgreSQL is the relational database used by the application.

The application contains relational data such as:

```
Users
Products
Categories
Cart
Orders
Payments
```

A relational database is suitable because:

- Data relationships are important
- Transactions are required
- Data consistency is critical
- E-commerce systems require structured data

---

# Prisma ORM

Prisma is the database access layer between the backend and PostgreSQL.

Architecture:

```
Express Controller

        |

    Prisma Client

        |

    PostgreSQL
```

Prisma provides:

- Type-safe database queries
- Database schema management
- Migration support
- Easier database operations

Example:

Without ORM:

```sql
SELECT *
FROM users
WHERE email='user@test.com';
```

With Prisma:

```typescript
prisma.user.findUnique({
 where:{
   email:"user@test.com"
 }
})
```

Prisma converts application queries into SQL.

---

# Backend Request Flow

A request follows this lifecycle:

```
Client Request

       |

Express Route

       |

Middleware

       |

Controller

       |

Prisma ORM

       |

PostgreSQL

       |

Response
```

---

# 📁 Project Structure

The repository is organized into separate backend, frontend, Docker, database, documentation, and future Kubernetes areas.

```text
OnlineShop/
├── backend/                 # Node.js / Express backend
│   ├── prisma/              # Prisma schema and database migrations
│   └── src/                 # Backend application source
│       ├── config/          # Environment, database and Swagger configuration
│       ├── controllers/     # HTTP request handlers
│       ├── middleware/      # Authentication, authorization and upload middleware
│       ├── routes/          # REST API routes
│       ├── services/        # Application and business logic
│       └── types/           # TypeScript type declarations
│
├── frontend/                # React / TypeScript / Vite frontend
│   ├── public/              # Static frontend assets
│   └── src/                 # Frontend application source
│       ├── api/             # Backend API clients
│       ├── components/      # Reusable UI components
│       ├── context/         # React application context
│       ├── hooks/           # Custom React hooks
│       ├── layouts/         # Customer and admin layouts
│       ├── pages/           # Customer and admin pages
│       ├── routes/          # Frontend routing and route protection
│       ├── store/           # Client-side application state
│       ├── types/           # TypeScript models and types
│       └── utils/           # Shared frontend utilities
│
├── docker/                  # Docker Compose configuration
│   ├── docker-compose.yml
│   └── .env.example
│
├── kubernetes/              # Future Kubernetes manifests
├── docs/                    # Project documentation
├── database/                # Database-related resources
├── README.md
└── .gitignore
```

## Backend Folder Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   │   ├── 20260817184228_initial_schema/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
│
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    │   ├── database.ts
    │   ├── env.ts
    │   └── swagger.ts
    ├── controllers/
    │   ├── address.controller.ts
    │   ├── auth.controller.ts
    │   ├── cart.controller.ts
    │   ├── category.controller.ts
    │   ├── order.controller.ts
    │   ├── payment.controller.ts
    │   ├── product.controller.ts
    │   └── user.controller.ts
    ├── middleware/
    │   ├── auth.middleware.ts
    │   ├── role.middleware.ts
    │   └── upload.middleware.ts
    ├── routes/
    │   ├── address.routes.ts
    │   ├── auth.routes.ts
    │   ├── cart.routes.ts
    │   ├── category.routes.ts
    │   ├── order.routes.ts
    │   ├── payment.routes.ts
    │   ├── product.routes.ts
    │   └── user.routes.ts
    ├── services/
    │   ├── address.service.ts
    │   ├── auth.service.ts
    │   ├── cart.service.ts
    │   ├── category.service.ts
    │   ├── order.service.ts
    │   ├── payment.service.ts
    │   ├── product.service.ts
    │   └── user.service.ts
    └── types/
        └── express.d.ts
```

### Backend request flow

```text
HTTP Request
     ↓
Route
     ↓
Middleware
     ↓
Controller
     ↓
Service
     ↓
Prisma Client
     ↓
PostgreSQL
     ↓
HTTP Response
```

### Backend directory responsibilities

| Directory | Responsibility |
|---|---|
| `src/config` | Application configuration, environment validation, database setup and Swagger configuration |
| `src/routes` | Defines REST API endpoints and connects routes to middleware/controllers |
| `src/controllers` | Handles HTTP requests, input handling and HTTP responses |
| `src/services` | Contains application and business logic and database operations through Prisma |
| `src/middleware` | Authentication, authorization and file-upload processing |
| `src/types` | TypeScript type declarations used by the backend |
| `prisma` | Database schema, Prisma configuration and migration history |
| `uploads` | Application-uploaded product images during development |

# Frontend Folder Structure

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    ├── api/
    │   ├── addressApi.ts
    │   ├── authApi.ts
    │   ├── axios.ts
    │   ├── cartApi.ts
    │   ├── categoryApi.ts
    │   ├── orderApi.ts
    │   ├── paymentApi.ts
    │   ├── productApi.ts
    │   └── userApi.ts
    │
    ├── components/
    │   ├── CartItem.tsx
    │   ├── ErrorMessage.tsx
    │   ├── Footer.tsx
    │   ├── Header.tsx
    │   ├── Loading.tsx
    │   ├── ProductCard.tsx
    │   ├── ProductGrid.tsx
    │   └── common/
    │
    ├── context/
    │
    ├── hooks/
    │   ├── useAddresses.ts
    │   ├── useAuth.ts
    │   ├── useCart.ts
    │   ├── useCategories.ts
    │   ├── useOrders.ts
    │   ├── usePayments.ts
    │   └── useProducts.ts
    │
    ├── layouts/
    │   ├── AdminLayout.tsx
    │   └── MainLayout.tsx
    │
    ├── pages/
    │   ├── Cart.tsx
    │   ├── Categories.tsx
    │   ├── Checkout.tsx
    │   ├── Home.tsx
    │   ├── Login.tsx
    │   ├── OrderDetails.tsx
    │   ├── Orders.tsx
    │   ├── ProductDetails.tsx
    │   ├── Products.tsx
    │   ├── Profile.tsx
    │   ├── Register.tsx
    │   └── admin/
    │       ├── Dashboard.tsx
    │       ├── OrdersManagement.tsx
    │       ├── PaymentsManagement.tsx
    │       ├── ProductsManagement.tsx
    │       └── UsersManagement.tsx
    │
    ├── routes/
    │   ├── ProtectedRoute.tsx
    │   └── index.tsx
    │
    ├── store/
    │   └── authStore.ts
    │
    ├── types/
    │   ├── auth.types.ts
    │   ├── cart.types.ts
    │   ├── category.types.ts
    │   ├── order.types.ts
    │   ├── payment.types.ts
    │   ├── product.types.ts
    │   └── user.types.ts
    │
    ├── utils/
    ├── App.tsx
    ├── index.css
    └── main.tsx
```

### Frontend directory responsibilities

| Directory | Responsibility |
|---|---|
| `src/api` | Axios configuration and API modules used to communicate with the backend |
| `src/components` | Reusable UI components shared across pages |
| `src/context` | React context providers and shared contextual state |
| `src/hooks` | Reusable React hooks for application features |
| `src/layouts` | Shared customer and administrator page layouts |
| `src/pages` | Customer-facing application pages and admin portal pages |
| `src/routes` | Frontend routes and protected-route handling |
| `src/store` | Client-side application state such as authentication state |
| `src/types` | TypeScript interfaces and application data models |
| `src/utils` | Shared frontend utility functions |
| `public` | Static assets served by the Vite frontend |

# Backend Components

## server.ts

Application entry point.

Responsibilities:

- Initialize Express
- Load middleware
- Register routes
- Start server

---

## Routes

Routes define API endpoints.

Example:

```
POST /api/users/register
```

Routes decide:

- Which endpoint exists
- Which middleware executes
- Which controller handles request

---

## Controllers

Controllers contain application logic.

Responsibilities:

- Receive request
- Validate input
- Call database layer
- Return response

---

## Middleware

Middleware runs before controllers.

Used for:

- Authentication
- Authorization
- Validation

Example:

```
Request

 |

JWT Authentication

 |

Role Verification

 |

Controller
```

---

# Authentication System

## JWT Authentication

JWT is used for user authentication.

Flow:

```
User Login

     |

Validate Email + Password

     |

Generate JWT Token

     |

Client Stores Token

     |

Send Token With Requests

     |

Backend Verifies Token
```

Protected requests:

```
Authorization:

Bearer <JWT_TOKEN>
```

---

# Password Security

Passwords are never stored directly.

Incorrect:

```
password123
```

Database stores:

```
bcrypt hash
```

Example:

```
$2b$10$xxxxxxxxxxxxx
```

bcrypt provides:

- One-way hashing
- Salt generation
- Protection against password leaks

---

# API Documentation

Swagger/OpenAPI is implemented.

Swagger provides:

- Available endpoints
- Request body details
- Required fields
- Authentication testing
- Response documentation

Access:

```
http://localhost:5050/api-docs
```

---

# Current Backend Features

Completed:

✅ Express backend setup

✅ TypeScript configuration

✅ PostgreSQL database container

✅ Prisma database integration

✅ User authentication

✅ JWT authorization

✅ Role-based access control

✅ User management APIs

✅ Product APIs

✅ Category APIs

✅ Cart APIs

✅ Order APIs

✅ Payment API structure

✅ Swagger API documentation

---

# Example API Endpoints

Authentication:

```
POST /api/users/register
POST /api/auth/login
```

Products:

```
GET  /api/products
POST /api/products
```

Categories:

```
GET  /api/categories
POST /api/categories
```

---

# Frontend

The frontend is implemented using:

- React
- TypeScript
- Vite

Current features include:

- User interface
- Product browsing
- Authentication pages
- Shopping cart UI
- Checkout flow
- Order history
- Admin dashboard

Frontend documentation:

```
frontend/README.md
```

---

# Kubernetes Deployment Roadmap

Future Kubernetes architecture:

```
                 Kubernetes Cluster


                       |

                Ingress Controller


                       |

                Backend Service


                       |

                  Backend Pods


                       |

              Node.js Containers


                       |

                 PostgreSQL
```

Kubernetes components:

## Deployment

Provides:

- Replica management
- Scaling
- Rolling updates


## Service

Provides:

- Internal communication
- Stable networking


## Ingress

Provides:

- External HTTPS access
- Routing


---

# CI/CD Pipeline Roadmap

Future GitHub Actions pipeline:

```
Developer Push

       |

GitHub Actions

       |

Run Tests

       |

Build Application

       |

Build Docker Image

       |

Push Image

       |

Deploy
```

---

# Cloud Deployment Roadmap

## AWS

Possible services:

- ECS
- EKS
- EC2
- RDS PostgreSQL
- Application Load Balancer
- CloudWatch
- Secrets Manager


## Azure

Possible services:

- AKS
- App Service
- Azure Database for PostgreSQL
- Application Gateway
- Key Vault
- Azure Monitor


---

# Security Roadmap

Implemented:

✅ JWT Authentication

✅ Password hashing

✅ Role authorization

✅ Environment variables


Future:

- HTTPS/TLS
- Rate limiting
- OWASP protection
- Security headers
- Vulnerability scanning
- Audit logging
- Secret management


---

# Monitoring Roadmap

Production monitoring:

Application:

- API latency
- Error rate
- Request metrics


Infrastructure:

- CPU
- Memory
- Network
- Database performance


Tools:

- Datadog
- Prometheus
- Grafana
- CloudWatch
- Azure Monitor


---

# Development Goals

This project is created to gain practical experience in:

- Backend engineering
- Software architecture
- Database design
- Cloud engineering
- DevOps practices
- Application security
- Production deployment


---

# Author

Yazeeth

DevOps Engineer | Cloud Engineer | Software Engineering Learner

---

# License

Educational and portfolio project.
