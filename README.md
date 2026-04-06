# SmartSpend

A personal finance and expense tracking application built on a three-service architecture: a React SPA, an Express REST API, and a Python ML service for future spending insights.

> Status: client UI is built (modern dark fintech dashboard), server exposes a working `/expenses` CRUD API backed by PostgreSQL. Auth and the ML service are not yet implemented.

## Architecture

```
smart-spend/
├── client/      # React 19 SPA (Vite 7, TanStack Query, Axios, Recharts)
├── server/      # Express 5 REST API (PostgreSQL, JWT auth, bcryptjs)
└── ml-service/  # Python ML service (not yet scaffolded)
```

Each service is independent — no monorepo tooling — so dependencies must be installed separately in each directory.

### client/

- React 19 with Vite 7 for dev server and builds
- TanStack React Query for server state
- Axios for HTTP
- Recharts for charting
- ESLint flat config with React Hooks + React Refresh plugins

### server/

- Express 5 on Node.js with ES modules (`"type": "module"`)
- PostgreSQL via `pg` (shared pool in `config/db.js`)
- `routes/expenses.js` — CRUD endpoints for expenses
- `middleware/errorHandler.js` — centralized JSON error responses
- `db/schema.sql`, `db/migrate.js`, `db/seed.js` — schema, migration runner, and sample data seeder
- `cors` locked to `CLIENT_ORIGIN`
- `jsonwebtoken` and `bcryptjs` are installed but not yet wired (auth is the next milestone)

### ml-service/

- Empty directory reserved for a Python service
- `.gitignore` is already set up for virtualenvs (`.venv`, `venv`, `env`), `pytest`, `mypy`, and `ruff`

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL
- Python 3 (for the ML service, once scaffolded)

## Setup

Install dependencies for each service:

```bash
cd client && npm install
cd ../server && npm install
```

Create the database and copy the env templates:

```bash
createdb smartspend
cp server/.env.example server/.env
cp client/.env.example client/.env   # optional; defaults work
```

Run migrations and seed sample data:

```bash
cd server
npm run migrate
npm run seed
```

`server/.env` is preconfigured for a local Postgres install. Adjust `DATABASE_URL` if your username, host, or port differ.

## Running locally

Run the client and server in separate terminals.

**Client** (from `client/`):

```bash
npm run dev       # start Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # run ESLint
```

**Server** (from `server/`):

```bash
npm run dev       # start with nodemon (auto-restart)
npm start         # start with node
npm run migrate   # apply db/schema.sql
npm run seed      # insert sample expenses for default-user
```

The server listens on `PORT` from `.env`, defaulting to `5050` (port 5000 conflicts with macOS AirPlay Receiver).

### Endpoints

| Method | Path             | Description                       |
|--------|------------------|-----------------------------------|
| GET    | `/`              | API banner                        |
| GET    | `/health`        | Health check (`{ ok, uptime }`)   |
| GET    | `/expenses`      | List all expenses                 |
| POST   | `/expenses`      | Create an expense                 |
| PATCH  | `/expenses/:id`  | Update an expense                 |
| DELETE | `/expenses/:id`  | Delete an expense                 |

All `/expenses` routes currently operate on a hardcoded `default-user`. Multi-user support arrives with the auth milestone.

## Project conventions

- Both client and server use ES modules
- ESLint allows unused vars that start with an uppercase letter or underscore (`varsIgnorePattern: '^[A-Z_]'`)
- See `CLAUDE.md` for guidance used when working in this repo with Claude Code
