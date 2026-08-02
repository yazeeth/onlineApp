# OnlineShop Backend API

A production-style e-commerce backend API built using **Node.js, Express.js, and TypeScript**.

This project demonstrates backend software engineering concepts including REST API development, authentication, authorization, database integration, API documentation, and scalable project structure.

The goal of this project is to build a complete online shopping platform following real-world software development practices.

---

# 🚀 Project Overview

OnlineShop is an e-commerce backend system that provides APIs for:

- User management
- Authentication and authorization
- Product management
- Category management
- Shopping cart
- Order processing
- Payment handling
- API documentation

The backend follows a layered architecture approach:

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
Controllers
        |
        |
Database Layer
```

---

# 🛠 Technology Stack

## Programming Language

### TypeScript

Used as the primary development language.

Benefits:

- Static typing
- Better maintainability
- Improved developer experience
- Compile-time error detection


---

## Runtime Environment

### Node.js

Node.js provides the runtime environment to execute the backend application.

Responsibilities:

- Running the Express server
- Managing packages
- Handling server-side JavaScript execution


---

## Backend Framework

### Express.js

Express is used to build REST APIs.

Used for:

- Routing
- Middleware handling
- HTTP request/response management

---

## Database

### PostgreSQL

PostgreSQL is used as the primary relational database.

The database stores structured application data including:

- Users
- Products
- Categories
- Cart data
- Orders
- Payments

### Docker PostgreSQL Container

During development PostgreSQL runs inside a Docker container.

Benefits:

- Consistent development environment
- Easy database setup
- Same database version across environments
- Easier migration to cloud databases later

Architecture:

```
Backend Application
        |
        |
Prisma ORM
        |
        |
PostgreSQL Docker Container
```

---

## Prisma ORM

Prisma is used as the database access layer between the Node.js application and PostgreSQL.

Responsibilities:

- Type-safe database queries
- Database schema management
- Migration management
- Simplified database operations

Example flow:

```
Controller
    |
    |
Prisma Client
    |
    |
PostgreSQL Database
```

---

## API Documentation

### Swagger / OpenAPI

Swagger provides interactive API documentation.

Features:

- API endpoint documentation
- Request body schemas
- Response examples
- Authentication testing


Access:

```
http://localhost:PORT/api-docs
```

---

## Authentication

### JWT (JSON Web Token)

Used for secure user authentication.

Authentication flow:

```
User Login

    |

Validate Credentials

    |

Generate JWT Token

    |

Client Sends Token With Requests

    |

Backend Validates Token
```

---

## Password Security

### bcrypt

Passwords are never stored as plain text.

Password flow:

```
Plain Password

      |

bcrypt Hashing

      |

Encrypted Password Hash

      |

Database Storage
```

---

# 📂 Project Structure

```text
backend
│
├── prisma
│   ├── migrations
│   │   ├── migration folders
│   │   └── migration_lock.toml
│   └── schema.prisma
│
├── src
│   │
│   ├── config
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── swagger.ts
│   │
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── category.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── product.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── middleware
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   │
│   ├── routes
│   │   ├── auth.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── category.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── product.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── cart.service.ts
│   │   ├── category.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── product.service.ts
│   │   └── user.service.ts
│   │
│   ├── types
│   │   └── express.d.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── package.json
├── package-lock.json
├── prisma.config.ts
├── tsconfig.json
├── .env.example
├── .env
└── README.md
```

---

# 🏗 Architecture

The application follows a layered backend architecture.

## Request Flow

Example:

```
Frontend

    |

HTTP Request

    |

Route

    |

Middleware

    |

Controller

    |

Database

    |

Response
```

---

# 🔐 Authentication & Authorization

## Authentication

Implemented using JWT.

Users can:

- Register
- Login
- Access protected APIs


---

## Authorization

Role-based access control implemented.

Roles:

```
CUSTOMER
ADMIN
```

Example:

Customer:

- Browse products
- Manage cart
- Place orders


Admin:

- Manage products
- Manage users
- Update roles


---

# 📌 API Modules

## User APIs

Features:

- Register user
- Login user
- View profile
- View all users (Admin)
- Update user roles (Admin)


---

## Product APIs

Features:

- Create product
- View products
- View single product
- Update product
- Delete product


---

## Category APIs

Features:

- Create categories
- View categories
- Update categories
- Delete categories


---

## Cart APIs

Features:

- Add products to cart
- View cart
- Update cart quantity
- Remove cart items


---

## Order APIs

Features:

- Create order
- View orders
- Manage order status


---

## Payment APIs

Features:

- Create payment records
- Track payment status


---

# 📖 API Documentation

Swagger documentation provides complete API details.

Includes:

- Endpoint descriptions
- Required parameters
- Request body schemas
- Authentication requirements
- Response examples


---

# ⚙️ Local Development Setup

## Requirements

Before running the backend application, install the following prerequisites.

### Node.js

Required runtime environment.

Recommended version:

- Node.js 20.x LTS or higher
- npm 10.x or higher

Verify installation:

```bash
node -v
npm -v
```

---

### Git

Required for cloning and managing the source code.

Verify installation:

```bash
git --version
```

---

### Docker

Docker is used to run PostgreSQL locally using containers.

Required:

- Docker Engine
- Docker Compose

Verify installation:

```bash
docker --version
docker compose version
```

---

### PostgreSQL

PostgreSQL is the application database.

Development uses PostgreSQL through a Docker container using the official PostgreSQL Docker Hub image.

Recommended image:

```
postgres:16
```

Docker Hub image:

```
postgres:16-alpine
```

The database runs inside Docker, so PostgreSQL does not need to be installed locally.

Verify Docker is running:

```bash
 docker ps
```

Example PostgreSQL container:

```bash
docker run --name onlineshop-postgres \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=onlineshop \
-p 5432:5432 \
-d postgres:16-alpine
```

Check running container:

```bash
docker ps
```

---

### npm Package Installation

After cloning the repository, install all backend dependencies from `package.json`:

```bash
npm install
```

The project packages are installed automatically from `package.json`.

Main npm packages used:

Runtime dependencies:

- express - REST API framework
- typescript - TypeScript language support
- prisma - Database ORM
- @prisma/client - Prisma database client
- pg - PostgreSQL database driver
- jsonwebtoken - JWT authentication
- bcrypt / bcryptjs - Password hashing
- cors - Cross origin resource sharing
- dotenv - Environment variable management
- swagger-jsdoc - Swagger API specification generation
- swagger-ui-express - Swagger API documentation UI

Development dependencies:

- ts-node - Execute TypeScript directly
- nodemon - Automatic development server restart
- @types/node - Node.js TypeScript definitions
- @types/express - Express TypeScript definitions
- @types/jsonwebtoken - JWT TypeScript definitions
- @types/bcrypt / @types/bcryptjs - bcrypt TypeScript definitions
- @types/cors - CORS TypeScript definitions
- @types/swagger-jsdoc - Swagger TypeScript definitions
- @types/swagger-ui-express - Swagger UI TypeScript definitions

Install packages:

```bash
npm install
```

---

### Prisma Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```


---

## Clone Repository

```bash
git clone https://github.com/yourusername/OnlineShop.git
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Copy the example configuration:

```bash
cp .env.example .env
```

Then update the database credentials and JWT secret in `.env`:

```env
PORT=5050
FRONTEND_URL=http://localhost:3000

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/onlineshop?schema=public"

JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-secret
```

---

## Start Development Server

```bash
npm run dev
```

Application runs:

```
http://localhost:5050
```

---

# 🧪 Testing

API testing can be performed using:

- Swagger UI
- Postman
- curl


Example:

```
GET /api/products
```

---

# 🔄 Development Workflow

Git workflow:

```
Code Change

     |

Git Add

     |

Git Commit

     |

Git Push

     |

Remote Repository
```

---

# 🔒 Security Practices Implemented

Implemented:

✅ Password hashing using bcrypt  
✅ JWT authentication  
✅ Role-based authorization  
✅ Environment variables for secrets  
✅ Protected admin routes  
✅ API documentation  


---

# 🚀 Future Improvements

## Frontend

Planned:

- React + TypeScript frontend
- User interface
- Product browsing
- Cart UI
- Checkout page
- Admin dashboard


---

## DevOps Improvements

Planned:

- Docker containerization
- CI/CD pipeline
- GitHub Actions
- Cloud deployment
- Monitoring


---

## Cloud Deployment

Future architecture:

```
User

 |

HTTPS

 |

Load Balancer

 |

Docker Container

 |

Node.js API

 |

Database
```

Possible platforms:

- AWS
- Azure
- Kubernetes


---

# 🎯 Learning Objectives

This project demonstrates practical knowledge of:

- Backend development
- REST API design
- Authentication systems
- Database-driven applications
- Software architecture
- API documentation
- Secure coding practices
- Production deployment concepts


---

# 👨‍💻 Author

Yazeeth

DevOps Engineer | Cloud Engineer

---

# 📄 License

This project is for learning and portfolio purposes.

