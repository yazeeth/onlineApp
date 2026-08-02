# 🛒 OnlineShop - Full Stack E-Commerce Platform

![Project Status](https://img.shields.io/badge/status-in%20development-blue)
![Backend](https://img.shields.io/badge/backend-Node.js-green)
![Language](https://img.shields.io/badge/language-TypeScript-blue)

A production-oriented full-stack e-commerce platform built using modern software engineering principles.

This project demonstrates practical implementation of:

- Backend API development
- REST architecture
- Authentication and authorization
- Database-driven application design
- Secure coding practices
- API documentation
- Containerization
- Cloud deployment
- DevOps automation

The goal is to build a complete scalable online shopping system following real-world industry practices.

---

# 📌 Project Overview

OnlineShop is an e-commerce application that provides a complete shopping workflow.

Users can:

- Register accounts
- Authenticate securely
- Browse products
- Manage shopping carts
- Create orders
- Track payments


Administrators can:

- Manage users
- Manage products
- Manage categories
- Control application data


---

# 🏗 High Level Architecture

Current development architecture:

```
                 Client
                   |
                   |
             REST API Calls
                   |
                   |
          Express.js Backend
                   |
                   |
            Database Layer
```


Future production architecture:

```
                         Users
                           |
                           |
                         HTTPS
                           |
                           |
                    Cloud Load Balancer
                           |
                           |
                  Frontend Application
                           |
                           |
                    Backend API Service
                           |
                           |
                 Container Platform
                           |
                           |
                    Database Service
```

---

# 🛠 Technology Stack

## Backend Stack

| Component | Technology | Purpose |
|-|-|-|
| Language | TypeScript | Application development |
| Runtime | Node.js | Server execution |
| Framework | Express.js | REST API framework |
| API Style | REST | Client-server communication |
| Authentication | JWT | User authentication |
| Password Security | bcrypt | Password hashing |
| Documentation | Swagger/OpenAPI | API documentation |
| Package Manager | npm | Dependency management |
| Version Control | Git | Source management |


---

# Why TypeScript?

TypeScript is used instead of plain JavaScript because it provides:

- Static typing
- Better code quality
- Compile-time validation
- Improved maintainability
- Better IDE support


Example:

```typescript
const price:number = 100;
```

The compiler prevents invalid data types before runtime.

---

# Why Node.js?

Node.js provides the runtime environment for executing backend code.

Advantages:

- Event-driven architecture
- Non-blocking I/O
- Large ecosystem
- Excellent API development support


Node.js allows JavaScript/TypeScript to run on servers instead of only browsers.

---

# Why Express.js?

Express.js provides:

- Routing
- Middleware support
- HTTP request handling
- REST API development


Example:

```
GET /api/products

POST /api/users/register

PATCH /api/users/:id/role
```

---

# Backend Architecture

The backend follows a layered architecture:

```
                 HTTP Request

                       |

                     Routes

                       |

                  Middleware

                       |

                  Controller

                       |

                Business Logic

                       |

                  Database

                       |

                 HTTP Response
```

---

# Backend Folder Structure

```
backend

│
├── src
│
├── config
│   |
│   └── swagger.ts
│
├── controllers
│   |
│   ├── user.controller.ts
│   ├── product.controller.ts
│   ├── category.controller.ts
│   ├── cart.controller.ts
│   ├── order.controller.ts
│   └── payment.controller.ts
│
├── middleware
│   |
│   ├── auth.middleware.ts
│   └── role.middleware.ts
│
├── routes
│   |
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

# Backend Components Explanation

# server.ts

Application entry point.

Responsibilities:

- Initialize Express
- Configure middleware
- Register routes
- Start HTTP server


Flow:

```
server.ts

      |

Express Application

      |

Routes

      |

Controllers
```

---

# Routes

Routes define API endpoints.

Example:

```typescript
router.get("/profile",
authMiddleware,
getProfile
)
```


Responsibilities:

- Define URL paths
- Connect requests to controllers
- Apply middleware


---

# Controllers

Controllers handle application operations.

Responsibilities:

- Receive requests
- Validate data
- Execute logic
- Return responses


Example:

```
Request

 |

User Controller

 |

Database Query

 |

Response
```

---

# Middleware

Middleware executes between request and controller.

Used for:

- Authentication
- Authorization
- Logging
- Validation


Example:

```
Request

 |

JWT Middleware

 |

Role Middleware

 |

Controller
```

---

# Authentication System

Authentication uses JWT.

## Login Flow

```
User enters credentials

        |

Backend validates password

        |

JWT token generated

        |

Token returned

        |

Client sends token with requests
```

---

# JWT Request Example

```
Authorization:

Bearer <token>
```

Backend validates:

```
Token valid?

YES → Continue

NO → Reject request
```

---

# Password Security

Passwords are never stored directly.

Incorrect:

```
password123
```

Correct:

```
$2b$10$xxxxxxxxxxxx
```


bcrypt provides:

- Salt generation
- Slow hashing
- Protection against brute force attacks


---

# API Documentation

Swagger/OpenAPI is used.

Swagger provides:

- Endpoint documentation
- Request schema
- Required fields
- Authentication testing
- Response examples


Example:

```
POST /api/users/register
```

Request:

```json
{
"name":"John",
"email":"john@test.com",
"password":"password"
}
```

---

# Docker Deployment Plan

The backend will be containerized.

Future Docker architecture:

```
Developer

 |

Docker Build

 |

Docker Image

 |

Container Registry

 |

Production Server
```

---

# Example Docker Flow

Dockerfile:

```
Node Base Image

        |

Install Dependencies

        |

Copy Source Code

        |

Build Application

        |

Start API
```

---

# Kubernetes Deployment Plan

Production deployment target:

```
                Kubernetes Cluster

                       |

                  Ingress Controller

                       |

                  Backend Service

                       |

                    Pods

                       |

               Node.js Containers

                       |

                   Database
```

---

# Kubernetes Components

## Deployment

Manages application replicas.

Example:

```
backend-deployment

replicas: 3
```

Provides:

- Scaling
- Rolling updates
- Self healing


---

## Service

Provides stable networking.

Example:

```
Backend Pods

      |

 Kubernetes Service

      |

 Internal Network
```


---

## Ingress

Handles external HTTPS traffic.

Example:

```
User

 |

HTTPS

 |

Ingress

 |

Backend Service
```

---

# CI/CD Pipeline

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

Deploy Kubernetes

```

---

# Cloud Deployment

Target cloud platforms:

## AWS

Possible services:

- EC2
- ECS
- EKS
- RDS
- Application Load Balancer
- CloudWatch
- Secrets Manager


Architecture:

```
Route53

 |

Load Balancer

 |

ECS/EKS

 |

RDS Database

```

---

## Azure

Possible services:

- Azure App Service
- AKS
- Azure Database
- Application Gateway
- Key Vault
- Monitor


Architecture:

```
Azure Front Door

 |

Application Gateway

 |

AKS

 |

Database

```

---

# Security Roadmap

Implemented:

✅ JWT Authentication  
✅ Password hashing  
✅ Role authorization  
✅ Protected routes  


Future:

- HTTPS/TLS
- Rate limiting
- OWASP Top 10 protection
- Security headers
- Vulnerability scanning
- Dependency scanning
- Audit logging


---

# Monitoring Plan

Production monitoring:

Application:

- API response time
- Error rate
- Request count


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

# Current Development Status

Completed:

✅ Backend API foundation  
✅ Authentication  
✅ User management  
✅ Product APIs  
✅ Category APIs  
✅ Cart APIs  
✅ Order APIs  
✅ Payment APIs  
✅ Swagger Documentation  


Next:

⬜ React Frontend  
⬜ Docker  
⬜ Kubernetes  
⬜ CI/CD  
⬜ Cloud Deployment  


---

# Author

Yazeeth

DevOps Engineer | Cloud Engineer | Network Engineer | Software Engineering