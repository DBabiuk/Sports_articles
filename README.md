# Sports Articles — Fullstack Monorepo

A fullstack Sports Articles CRUD application built with TypeScript, featuring a GraphQL API and a server-side rendered frontend.

## Tech Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Backend  | Node.js, Express, Apollo Server v4, TypeORM   |
| Frontend | Next.js (Pages Router), Apollo Client, Tailwind CSS |
| Database | PostgreSQL 16                                 |
| Monorepo | pnpm workspaces                               |

## Prerequisites

- **Node.js** >= 20 (tested on v22.15.0)
- **pnpm** >= 9 (`npm install -g pnpm`)
- **Docker & Docker Compose** (for PostgreSQL)

## Project Structure

```
/
├── apps/
│   ├── backend/
│   │   ├── Dockerfile
│   │   └── src/
│   │       ├── entity/         # TypeORM entities
│   │       ├── migrations/     # Database migrations
│   │       ├── schema/         # GraphQL type definitions & resolvers
│   │       ├── data-source.ts  # TypeORM configuration
│   │       ├── index.ts        # Server entry point
│   │       └── seed.ts         # Database seed script
│   └── frontend/
│       ├── Dockerfile
│       └── src/
│           ├── components/     # React components
│           ├── graphql/        # Queries & mutations
│           ├── lib/            # Apollo Client setup
│           ├── pages/          # Next.js pages (SSR)
│           ├── types/          # TypeScript interfaces
│           └── utils/          # Utility functions
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## Quick Start (Docker — One Command)

Run the entire stack with a single command:

```bash
docker compose --profile full up --build
```

This starts:
- **PostgreSQL** on port 5433
- **Backend** on port 4000 (runs database migrations automatically)
- **Seed** (populates 15 sample articles, then exits)
- **Frontend** on port 3000

Open **http://localhost:3000** — articles are rendered via SSR immediately.

To stop everything:

```bash
docker compose --profile full down
```

## Manual Setup (Step by Step)

### 1. Clone & Install

```bash
git clone <repository-url>
cd TestFS
pnpm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This starts a PostgreSQL 16 instance on port `5433` with:
- **User:** postgres
- **Password:** postgres
- **Database:** sports_articles

### 3. Configure Environment

Copy the example `.env` files:

**Linux / macOS / Git Bash:**
```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

**Windows (cmd):**
```cmd
copy apps\backend\.env.example apps\backend\.env
copy apps\frontend\.env.example apps\frontend\.env
```

**Windows (PowerShell):**
```powershell
Copy-Item apps/backend/.env.example apps/backend/.env
Copy-Item apps/frontend/.env.example apps/frontend/.env
```

Default values work out of the box with the Docker Compose setup.

### 4. Start the Backend

```bash
pnpm --filter backend dev
```

The GraphQL API will be available at **http://localhost:4000/graphql**.

Database migrations run automatically on server start (`migrationsRun: true`).

### 5. Seed the Database

In a separate terminal:

```bash
pnpm --filter backend seed
```

This inserts 15 sample sports articles into the database. The seed is idempotent — it skips insertion if articles already exist.

### 6. Start the Frontend

In a separate terminal:

```bash
pnpm --filter frontend dev
```

The frontend will be available at **http://localhost:3000**.

Articles are fetched via SSR — view the page source to confirm server-side rendering.

## Database Migrations

Database schema is managed via TypeORM migrations located in `apps/backend/src/migrations/`.

Migrations run automatically on server start (`migrationsRun: true` in `data-source.ts`).

### Generate a New Migration

After modifying an entity, generate a migration:

```bash
pnpm --filter backend migration:generate
```

### Run Migrations Manually

```bash
pnpm --filter backend migration:run
```

### Revert the Last Migration

```bash
pnpm --filter backend migration:revert
```

## GraphQL API

### Queries

| Query                | Description              |
| -------------------- | ------------------------ |
| `articles(offset, limit)` | List articles (paginated) |
| `article(id: ID!)`   | Get a single article     |

### Mutations

| Mutation                                      | Description          |
| --------------------------------------------- | -------------------- |
| `createArticle(input: ArticleInput!)`          | Create an article    |
| `updateArticle(id: ID!, input: ArticleInput!)` | Update an article    |
| `deleteArticle(id: ID!)`                       | Soft-delete an article |

### ArticleInput

```graphql
input ArticleInput {
  title: String!    # required
  content: String!  # required
  imageUrl: String  # optional
}
```

## Environment Variables

### Backend (`apps/backend/.env`)

| Variable          | Default           | Description          |
| ----------------- | ----------------- | -------------------- |
| DATABASE_HOST     | localhost         | PostgreSQL host      |
| DATABASE_PORT     | 5433              | PostgreSQL port      |
| DATABASE_USER     | postgres          | PostgreSQL user      |
| DATABASE_PASSWORD | postgres          | PostgreSQL password  |
| DATABASE_NAME     | sports_articles   | Database name        |
| BACKEND_PORT      | 4000              | API server port      |

### Frontend (`apps/frontend/.env`)

| Variable                | Default                          | Description                      |
| ----------------------- | -------------------------------- | -------------------------------- |
| NEXT_PUBLIC_GRAPHQL_URL | http://localhost:4000/graphql    | GraphQL endpoint (browser)       |
| GRAPHQL_SSR_URL         | _(falls back to above)_          | GraphQL endpoint (SSR in Docker) |

## Scripts

```bash
# Install all dependencies
pnpm install

# Start backend (dev mode with hot reload)
pnpm --filter backend dev

# Seed the database
pnpm --filter backend seed

# Start frontend (dev mode)
pnpm --filter frontend dev

# Database migrations
pnpm --filter backend migration:generate   # Generate after entity changes
pnpm --filter backend migration:run        # Run pending migrations
pnpm --filter backend migration:revert     # Revert last migration

# Lint
pnpm lint

# Format code
pnpm format

# Docker: full stack
docker compose --profile full up --build
```
