# AutoVault — Car Dealership Inventory System (TDD)

A full-stack, production-grade **Car Dealership Inventory & Purchase Management System** built with **Test-Driven Development (TDD)** principles, robust Role-Based Access Control (RBAC), and clean 3-tier layered architecture.

---

## 🚗 Project Overview

**AutoVault** provides automotive dealerships and customers with a unified portal for vehicle catalog management, purchase order processing, sales audit ledgers, and inventory analytics.

### Key Features

- **Live Inventory Catalog**: Real-time vehicle browsing, global search (Make, Model, Category, VIN), multi-parameter filtering (Make, Stock Status, Price bounds), and dynamic sorting (Price, Stock, Horsepower, Date).
- **User Purchase Order Tracking**: One-click vehicle purchase workflow. Decrements inventory stock, creates an immutable `Purchase` record with price snapshotting, and links purchases to customer accounts.
- **Role-Based Access Control (RBAC)**:
  - **Customer (`USER`)**: Browse inventory, purchase available vehicles, view personal order history in the **My Purchases** dashboard.
  - **Dealership Manager (`ADMIN`)**: Full inventory CRUD (Add, Edit, Restock, Delete), view full **Sales Audit Ledger** (buyer emails, invoice IDs, real-time transaction logs), and access **Executive Analytics** (portfolio valuation, total revenue, average order value, top-selling models).
- **Test-Driven Development (TDD)**: Comprehensive unit and integration test suite covering Repositories, Services, Controllers, Routes, and Middleware.

---

## 🛠️ Technology Stack

### Backend (`/server`)
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL (Neon Database) & Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **Testing**: Jest & Supertest (93 passing unit & integration tests)

### Frontend (`/client`)
- **Framework**: React 18 & Vite (TypeScript)
- **Styling**: Tailwind CSS & Custom Design Tokens
- **State & Data Fetching**: TanStack Query (React Query) & Axios
- **Icons & Typography**: Heroicons & Google Fonts (Plus Jakarta Sans, DM Serif Display)

---

## 🚀 Setup & Local Execution Guide

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **PostgreSQL Database** (or Neon Postgres connection URL)

---

### 1. Backend Setup (`/server`)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure Environment Variables
# Create a .env file in server/ directory with the following variables:
DATABASE_URL="postgresql://user:password@ep-example.postgres.database.azure.com/neondb?sslmode=require"
JWT_SECRET="super-secret-jwt-key-for-assessment"
PORT=3000

# Run Prisma Database Migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Run Full Test Suite (TDD Verification)
npm test

# Start Development Backend Server
npm run dev
```
The backend server will run at `http://localhost:3000`.

---

### 2. Frontend Setup (`/client`)

```bash
# Navigate to client directory (in a new terminal window)
cd client

# Install dependencies
npm install

# Run TypeScript Type Check
npx tsc --noEmit

# Start Frontend Development Server
npm run dev
```
The frontend application will be accessible at `http://localhost:5173`.

---

## 📊 Comprehensive Test Suite Report

The backend was developed following strict TDD cycles (Red → Green → Refactor).

### Test Suite Execution Output

```text
> car-dealership-inventory-system@1.0.0 test
> jest --runInBand

PASS src/tests/api/auth.routes.spec.ts
PASS src/tests/api/vehicle.routes.spec.ts
PASS src/tests/api/purchase.routes.spec.ts
PASS src/tests/services/auth.service.spec.ts
PASS src/tests/services/vehicle.service.spec.ts
PASS src/tests/middleware/auth.middleware.spec.ts
PASS src/tests/utils/jwt.spec.ts
PASS src/tests/middleware/admin.middleware.spec.ts
PASS src/tests/repositories/user.repository.spec.ts
PASS src/tests/repositories/vehicle.repository.spec.ts
PASS src/tests/sanity.spec.ts

Test Suites: 11 passed, 11 total
Tests:       93 passed, 93 total
Snapshots:   0 total
Time:        3.14 s
Ran all test suites.
```

### Detailed Test Coverage Matrix

| Test Suite | Test File | Passed Tests | Key Tested Scenarios & Boundary Checks |
| :--- | :--- | :---: | :--- |
| **Purchase Routes API** | `purchase.routes.spec.ts` | 6 | `/api/purchases/my` returns current user orders; `/api/purchases` restricts access to `ADMIN` (403 for `USER`, 401 unauthenticated). |
| **Vehicle Routes API** | `vehicle.routes.spec.ts` | 18 | Admin vehicle creation/update/deletion, `NaN` price rejection (400), non-admin protection (403), purchase stock decrement, restock operations. |
| **Auth Routes API** | `auth.routes.spec.ts` | 8 | User registration, login with JWT token generation, invalid credentials handling, duplicate email prevention. |
| **Vehicle Service** | `vehicle.service.spec.ts` | 28 | Whitespace trimming for `make`/`model`/`category`/`imageUrl`, price > 0 validation, quantity >= 0 check, stock decrement, price snapshot creation, restock calculation. |
| **Auth Service** | `auth.service.spec.ts` | 8 | Email normalization (lowercase), bcrypt password hashing, token signature verification, invalid password rejection. |
| **Auth Middleware** | `auth.middleware.spec.ts` | 5 | Bearer token extraction, valid JWT payload attachment to `req.user`, missing header rejection (401), expired token rejection. |
| **Admin Middleware** | `admin.middleware.spec.ts` | 4 | Role verification (`ADMIN` allowed, `USER` rejected with 403 Forbidden). |
| **Vehicle Repository** | `vehicle.repository.spec.ts` | 8 | Prisma CRUD operations, case-insensitive substring search (`contains`), price range filtering (`gte`/`lte`). |
| **User Repository** | `user.repository.spec.ts` | 5 | Prisma user creation, lookup by unique email, lookup by primary key ID. |
| **JWT Utilities** | `jwt.spec.ts` | 2 | Token signing, expiration payload verification. |
| **Sanity Baseline** | `sanity.spec.ts` | 1 | Test runner environment sanity check. |

---

## 📷 Application Screenshots & Feature Showcase

### 1. Landing Page (`/`)
Featuring a hero section with badge chips (`Spec-driven development`, `Test-driven development`, `Continuous delivery`), CTA buttons, and feature highlight cards.
![Landing Page](<client/public/Screenshot 2026-07-23 164607.png>)

### 2. Vehicle Catalog & Search Dashboard (`/dashboard` — Inventory View)
Displays real-time vehicle cards with stock badges, horsepower ratings, category pills (`Sedan`, `SUV`, `Supercar`), global search, price range filtering, and one-click purchase controls.
![Dashboard](<client/public/Screenshot 2026-07-23 164650.png>)
![Login Page](<client/public/Screenshot 2026-07-23 164619.png>)

### 3. Customer "My Purchases" Portal (`USER` Role View)
Allows customers to view their personal vehicle acquisition history, total capital spent, purchase price snapshots, and vehicle specs.
![My Purchases](<client/public/Screenshot 2026-07-23 164710.png>)


### 4. Admin Sales Audit Ledger (`ADMIN` Role View)
Real-time sales audit log displaying buyer emails, snapshot purchase prices, invoice IDs, and transaction timestamps.
![Sales Ledger](<client/public/Screenshot 2026-07-23 164736.png>)


### 5. Executive Analytics Dashboard (`ADMIN` Role View)
Includes metrics for portfolio valuation, total realized revenue, average order value, brand stock breakdown progress bars, and top-selling models.
![Analytics](<client/public/Screenshot 2026-07-23 164806.png>)
---

## 🤖 My AI Usage Section

### Overview
Throughout the development of AutoVault, AI assistance (Antigravity AI Pair Programmer) was used extensively across all software development phases to maintain high TDD rigor, write clean code, and accelerate full-stack delivery.

### Key Areas of AI Collaboration

1. **Test-Driven Development (TDD) Workflow**:
   - Designed failing unit and integration tests (Jest + Supertest) *prior* to writing service and route implementations.
   - Identified and handled subtle edge cases such as `NaN` inputs, empty string trimming, negative price/quantity validations, and stock boundary checks.
   - Designed the `Purchase` model relation in Prisma to decouple transaction records from vehicle inventory updates.
   - Implemented historical price snapshotting (`purchasePrice`) to preserve historical transaction accuracy regardless of future vehicle price changes.

2. **Layered Architecture & Separation of Concerns**:
   - Maintained a clean 3-tier architecture: Routes → Controllers → Services → Repositories.
   - Enforced Dependency Injection (DI) across services and controllers for testability.

3. **Frontend Architecture & UX Refinement**:
   - Built modular, reusable React components with TanStack Query for server state caching.
   - Implemented role-aware tab navigation and designed custom UI tokens.

4. **Code Review & Verification**:
   - Used automated terminal tools (`npm test`, `npx tsc --noEmit`) to continuously verify that changes produced zero side effects and maintained 100% test pass rates.
