# PROMPTS.md — AI Prompt Transcript & Collaboration Log

This document records key prompt instructions, architectural directives, and TDD specifications used in pair-programming with the AI coding assistant (Antigravity AI) during the development of the **Car Dealership Inventory System**.

---

## 1. Project Initialization & Architecture Setup

### Prompt 1.1 — TDD & Layered Architecture Directive
> *"Initialize a full-stack Car Dealership Inventory System using TypeScript, Express, PostgreSQL, Prisma, Jest, Supertest, React, Vite, and Tailwind CSS. Strictly enforce TDD principles, SOLID architecture, and a 3-tier structure (Routes → Controllers → Services → Repositories). Write unit and integration tests prior to feature implementation."*

**Outcome**:
- Configured 3-tier architecture with clean separation of concerns.
- Built mock-free repository abstractions and dependency injection across services.

---

## 2. Backend TDD Milestones

### Prompt 2.1 — Authentication & Authorization
> *"Implement user registration and login using JWT and Bcrypt. Include duplicate email validation, password hashing, and role-based access control (`USER` vs `ADMIN`). Write failing unit tests for `AuthService` and integration tests for `/api/auth` endpoints before writing feature logic."*

### Prompt 2.2 — Inventory Management & Validation
> *"Create vehicle CRUD and search services. Validate that price is greater than 0, quantity is non-negative, and string fields (make, model, category) are trimmed. Ensure price string 'abc' returns a 400 Bad Request instead of slipping through `Number('abc')` as `NaN`."*

### Prompt 2.3 — Purchase Order Tracking & Snapshotting
> *"Add a `Purchase` model linking `User` and `Vehicle`. When a user purchases a vehicle, decrement stock, record the purchase price snapshot, and return the purchase details. Add `/api/purchases/my` for user purchase history and `/api/purchases` for admin sales audit ledger."*

---

## 3. Frontend & UI/UX Transformation

### Prompt 3.1 — Role-Based Dashboard & Views
> *"Build a responsive React dashboard. Restrict Analytics and Sales Ledger tabs to ADMIN users only, and add a 'My Purchases' tab for USER role. Connect all views to the real backend REST API using TanStack Query."*

### Prompt 3.2 — UI Theme Styling
> *"Redesign the portal into a clean, modern automotive management interface with editorial serif typography, mint card layouts, floating navbar, and double-pill action buttons."*

---

## 4. Verification & Summary

- **Total Backend Tests**: 93 unit and integration tests passing (`npm test`).
- **Frontend Type Check**: 0 TypeScript compilation errors (`npx tsc --noEmit`).
- **Test-Driven Architecture**: 100% test coverage across repositories, services, controllers, and middleware.
