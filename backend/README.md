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

```
backend
│
├── src
│   │
│   ├── config
│   │   └── swagger.ts
│   │
│   ├── controllers
│   │   ├── user.controller.ts
│   │   ├── product.controller.ts
│   │   ├── category.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   └── payment.controller.ts
│   │
│   ├── middleware
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   │
│   ├── routes
│   │   ├── user.routes.ts
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   └── payment.routes.ts
│   │
│   └── server.ts
│
├── package.json
├── tsconfig.json
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

Install:

- Node.js
- npm
- Database server


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
PORT=5000
FRONTEND_URL=http://localhost:3000

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/onlineshop?schema=public"

JWT_ACCESS_SECRET=replace-with-a-long-random-secret
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
