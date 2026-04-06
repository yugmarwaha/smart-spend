# SmartSpend

A personal finance and expense tracking application built on a three-service architecture: a React SPA, an Express REST API, and a Python ML service for future spending insights.

> Status: early scaffold. The client is the default Vite + React starter, the server exposes a single health-check route, and the ML service is an empty placeholder.

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
- PostgreSQL via `pg`
- Auth via `jsonwebtoken` and `bcryptjs`
- `cors` and `dotenv` configured in `index.js`
- Placeholder directories: `config/`, `middleware/`, `routes/` (to hold db config, auth middleware, and route modules)

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
# client
cd client && npm install

# server
cd ../server && npm install
```

Create and fill in `server/.env`:

```
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/smartspend
JWT_SECRET=replace-me
```

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
```

The server listens on `PORT` from `.env`, defaulting to `5000`. A `GET /` request returns `{ "message": "SmartSpend API is running" }`.

## Project conventions

- Both client and server use ES modules
- ESLint allows unused vars that start with an uppercase letter or underscore (`varsIgnorePattern: '^[A-Z_]'`)
- See `CLAUDE.md` for guidance used when working in this repo with Claude Code
