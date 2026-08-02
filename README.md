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

## Current Development Architecture

```
                Client Application
                       |
                       |
                  REST API
                       |
                       |
              Express.js Backend
                       |
                       |
                Prisma ORM
                       |
                       |
          PostgreSQL Docker Container
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

              Kubernetes Cluster

                      |

             PostgreSQL Database
```

---

# 🛠 Technology Stack

## Backend

| Component | Technology |
|---|---|
| Programming Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| API Architecture | REST API |
| Database | PostgreSQL |
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

# Docker PostgreSQL

During development PostgreSQL runs inside a Docker container.

Architecture:

```
Developer Machine

        |

      Docker

        |

 PostgreSQL Container

        |

 Database Storage
```


Benefits:

- Consistent development environment
- Easy setup
- Same database version for all developers
- Easy migration to cloud environments


Instead of manually installing PostgreSQL:

```bash
docker compose up
```

starts the database environment.

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

# Backend Folder Structure

```
backend

│
├── src
│
├── config
│   └── swagger.ts
│
├── controllers
│
│   ├── user.controller.ts
│   ├── product.controller.ts
│   ├── category.controller.ts
│   ├── cart.controller.ts
│   ├── order.controller.ts
│   └── payment.controller.ts
│
├── middleware
│
│   ├── auth.middleware.ts
│   └── role.middleware.ts
│
├── routes
│
│   ├── user.routes.ts
│   ├── product.routes.ts
│   ├── category.routes.ts
│   ├── cart.routes.ts
│   ├── order.routes.ts
│   └── payment.routes.ts
│
├── server.ts
│
├── package.json
│
└── tsconfig.json
```

---

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
http://localhost:PORT/api-docs
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

✅ Payment APIs

✅ Swagger API documentation


---

# Frontend Roadmap

Frontend development will include:

Technology:

- React
- TypeScript
- Modern UI framework


Features:

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

# Docker Deployment Roadmap

Future container architecture:

```
Source Code

      |

Docker Build

      |

Docker Image

      |

Container Registry

      |

Deployment Environment
```

Planned:

- Backend Docker image
- Frontend Docker image
- Database container
- Docker Compose environment


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