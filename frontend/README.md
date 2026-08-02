# OnlineShop Frontend

Frontend application for the OnlineShop e-commerce platform.

This frontend communicates with the backend REST API built using Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL.

---

# Frontend Technology Stack

## Core Technologies

| Technology | Purpose |
|---|---|
| React | Frontend UI library |
| TypeScript | Type-safe JavaScript development |
| Vite | Frontend build tool and development server |
| ESLint | Code quality and linting |

## Styling and UI

| Technology | Purpose |
|---|---|
| Tailwind CSS | Utility-first CSS framework |
| shadcn/ui | Reusable UI components |

## Application Libraries

| Library | Purpose |
|---|---|
| React Router | Client-side application routing |
| Axios | Frontend to backend HTTP communication |
| TanStack Query | API data fetching, caching, and server state management |
| Zustand | Global client-side state management |
| React Hook Form | Form handling |
| Zod | Schema validation |

---

# Current Development Status

## Completed

- [x] React + TypeScript + Vite project initialized
- [x] ESLint configured
- [x] Frontend dependencies installed
- [x] Axios installed
- [x] React Router installed
- [x] TanStack Query installed
- [x] Zustand installed
- [x] React Hook Form installed
- [x] Zod installed
- [x] Tailwind CSS configured
- [x] Vite starter template removed
- [x] Tailwind CSS rendering tested successfully

---

# Frontend Architecture

Planned structure:

```text
src
│
├── api          # Backend API communication
├── components  # Reusable UI components
├── pages       # Application screens
├── routes      # React Router configuration
├── hooks       # Custom React hooks
├── store       # Zustand global state
├── context     # React contexts
├── types       # TypeScript interfaces and models
└── utils       # Helper functions
```

---

# Application Communication Flow

```text
User Browser
      |
      |
React Frontend
      |
      |
Axios HTTP Requests
      |
      |
Express Backend API
      |
      |
Prisma ORM
      |
      |
PostgreSQL Database
```

---

# Planned Features

## Authentication

- User registration
- User login
- JWT authentication integration
- Protected routes
- Role-based UI access

## Customer Features

- Product browsing
- Product details
- Shopping cart
- Order management
- Checkout flow

## Admin Features

- Product management
- Category management
- User management
- Order dashboard

---

# Development Roadmap

## Phase 1 - Frontend Foundation

- [x] React project creation
- [x] Dependency setup
- [x] Tailwind CSS setup
- [ ] Folder architecture
- [ ] Axios API client setup

## Phase 2 - Authentication UI

- [ ] Login page
- [ ] Registration page
- [ ] JWT integration
- [ ] Protected routes

## Phase 3 - E-commerce Interface

- [ ] Product listing
- [ ] Product details
- [ ] Cart interface
- [ ] Order pages

## Phase 4 - Admin Dashboard

- [ ] Admin routes
- [ ] Product management UI
- [ ] Order management UI

## Phase 5 - Production Deployment

- [ ] Frontend testing
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Cloud deployment

---

# Deployment Future Plan

Possible deployment architecture:

```text
React Production Build
        |
        |
Nginx / Cloud CDN
        |
        |
Backend API Container
        |
        |
PostgreSQL Database
```

Potential deployment platforms:

- AWS S3 + CloudFront
- Azure Static Web Apps
- Docker + Nginx
- Kubernetes

---

# Backend Integration

The frontend consumes backend APIs for:

- Authentication
- Users
- Products
- Categories
- Cart
- Orders
- Payments

The frontend and backend are maintained separately but communicate through REST APIs.
