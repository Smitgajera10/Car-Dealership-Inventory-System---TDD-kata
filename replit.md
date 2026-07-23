# AutoVault — Car Dealership Inventory System

## Project Overview

A fullstack car dealership inventory management portal with:

- **Backend**: Node.js + Express + TypeScript + Prisma (PostgreSQL)
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + TanStack Query

## Running the App

### Frontend (client)
```bash
cd client && npm run dev
```
Runs on port **5173** by default.

### Backend (server)
```bash
cd server && npm run dev
```
Runs on port **5000** (configurable via `PORT` env var).

## Required Environment Variables

### Backend
- `DATABASE_URL` — PostgreSQL connection string (required for Prisma)
- `JWT_SECRET` — Secret key for JWT token signing
- `PORT` — Server port (default: 5000)

## Architecture

### Routes
- `/` — Public landing page (AutoVault homepage)
- `/login` — Login page (split-panel design)
- `/register` — Register page (split-panel design)
- `/dashboard` — Protected main app (requires auth)

### User Roles
- **USER** — Browse inventory, purchase vehicles, view own purchase history
- **ADMIN** — Everything above + add/edit/delete/restock vehicles, view all sales, view analytics

### Features by Backend Support
- Inventory: browse, search, filter, sort vehicles
- Purchase: one-click vehicle purchase (users)
- My Purchases: personal purchase history (users)
- Sales: all transactions (admin)
- Analytics: computed from real purchase data (admin)
- CRUD: add/edit/delete/restock vehicles (admin)

## User Preferences
- UI should be production-grade, not AI-generated in appearance
- Only show features that have backend support (no mock data views)
- Dark theme: `#060B18` base, `#6D5DFB` indigo accent
- Responsive design required
