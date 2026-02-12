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
│   ├── backend/      # Express + Apollo Server v4 + TypeORM
│   └── frontend/     # Next.js + Apollo Client + Tailwind CSS
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd TestFS
pnpm install
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
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

The database tables are created automatically on first start (TypeORM `synchronize: true`).

### 5. Seed the Database

In a separate terminal:

```bash
pnpm --filter backend seed
```

This inserts 15 sample sports articles into the database.

### 6. Start the Frontend

In a separate terminal:

```bash
pnpm --filter frontend dev
```

The frontend will be available at **http://localhost:3000**.

Articles are fetched via SSR — view the page source to confirm server-side rendering.

## GraphQL API

### Queries

| Query                | Description              |
| -------------------- | ------------------------ |
| `articles`           | List all articles        |
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

| Variable                | Default                          | Description      |
| ----------------------- | -------------------------------- | ---------------- |
| NEXT_PUBLIC_GRAPHQL_URL | http://localhost:4000/graphql    | GraphQL endpoint |

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

# Lint
pnpm lint

# Format code
pnpm format
```
