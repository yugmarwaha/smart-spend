# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartSpend is a personal finance/expense tracking application with a three-service architecture:

- **client/** — React 19 SPA (Vite 7, JSX, TanStack React Query, Axios, Recharts for charts)
- **server/** — Express 5 REST API (ES modules, PostgreSQL via `pg`, JWT auth, bcryptjs)
- **ml-service/** — Python ML service (empty scaffold, expected to use Python + PostgreSQL)

## Commands

### Client (from `client/`)
- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run lint` — ESLint (flat config, React hooks + React Refresh plugins)
- `npm run preview` — Preview production build

### Server (from `server/`)
- `npm run dev` — Start with nodemon (auto-restart on changes)
- `npm start` — Start with node
- Server defaults to port 5000 (configurable via `PORT` in `.env`)

### ML Service
- Not yet scaffolded; `.gitignore` is set up for Python virtualenvs, pytest, mypy, ruff

## Architecture Notes

- Both client and server use ES modules (`"type": "module"` in package.json)
- Server has empty placeholder directories: `config/`, `middleware/`, `routes/` — intended for db config, auth middleware, and API route modules
- Server `.env` file exists but is empty; expected to hold `PORT`, database connection string, and JWT secret
- Client uses Axios for HTTP requests and TanStack React Query for server state management
- No monorepo tooling — each service has its own `package.json` and `node_modules`; install dependencies separately in each directory
- ESLint rule: unused vars starting with uppercase or underscore are allowed (`varsIgnorePattern: '^[A-Z_]'`)

## Commit Conventions

- Commit incrementally — make a separate commit for each logical change instead of batching unrelated work
- Write commit messages in no more than two lines
