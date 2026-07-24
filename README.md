# Vacations Booking App

A full-stack vacation browsing and likes application built with React, Node.js/Express, MySQL and TypeScript.

---

## Features

- **Browse vacations** — paginated grid (9 per page) with filter tabs: All, My Likes, Active, Upcoming
- **Like / Unlike** vacations with live counter updates
- **Auth** — register, login with JWT, role-based access (user / admin)
- **Google OAuth** — sign in or register via Google account
- **Admin panel** — add, edit and delete vacations with image upload (stored in a remote S3-compatible bucket, e.g. Cloudflare R2)
- **AI recommendation** — enter a destination, get a GPT-4o-mini travel tip
- **MCP chat** — ask natural-language questions answered from live vacation data
- **Likes report** — admin bar chart (Recharts) with CSV export
- **Dockerized** — one command spins up all 5 services

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Redux Toolkit, React Router v6, Recharts |
| Backend | Node.js, Express, TypeScript, Sequelize (mysql2 driver), Joi, JWT, bcryptjs, Passport.js |
| Database | MySQL 8.0 |
| Object Storage | S3-compatible remote bucket (Cloudflare R2 / AWS S3 / Backblaze B2 / ...) via the MinIO JS client |
| AI | OpenAI SDK (gpt-4o-mini) |
| MCP Server | @modelcontextprotocol/sdk, StreamableHTTPServerTransport |
| Infrastructure | Docker, docker compose, nginx |

---

## Quick Start (Docker)

### 1. Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Configure image storage (required)

Vacation images are stored in a real remote S3-compatible bucket (e.g. Cloudflare R2) — there is no local MinIO container and no image files in this repo. Copy `.env.example` to `.env` and fill in the `MINIO_*` variables with your bucket's credentials (see `.env.example` for exact Cloudflare R2 setup steps):

```bash
cp .env.example .env
```

### 3. Run

MySQL credentials and the JWT signing key already have safe defaults baked into `docker-compose.yml`:

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:3001/api |

> **Note:** MCP server runs on an internal Docker network only and is not exposed to the host.

The database container seeds vacations, an admin user, and a test user automatically on first start.

### 4. Optional features

Two more features are disabled until you provide your own secrets, in the same `.env`:

```env
# Enables the AI travel recommendation feature (leave unset to disable it)
VACATIONS_OPENAI_API_KEY=sk-your_openai_key_here

# Enables "Sign in with Google" (leave unset to disable it)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Then restart the stack: `docker compose up -d --build backend`.

> **Changing MYSQL_ROOT_PASSWORD / MYSQL_APP_* / VACATIONS_ENCRYPTION_KEY after the first run?** These are only applied the first time the MySQL volume is created. Run `docker compose down -v` before `docker compose up --build` so MySQL reinitialises with the new values — otherwise you'll get `Access denied` errors.

---

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@vacations.com | Admin1234 |
| User | user@vacations.com | User1234 |

---

## Google OAuth Setup (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:3001/api/auth/google/callback` as an authorized redirect URI
4. Copy the Client ID and Client Secret into your `.env`
5. Restart the backend: `docker compose up -d backend`

If `GOOGLE_CLIENT_ID` is empty the feature is silently disabled — all other functionality works normally.

---

## Troubleshooting

### `Error response ... failed to resolve reference "docker.io/minio/minio:latest": ... 403 Forbidden`

This is a Docker Hub registry issue on the local machine, not a project bug — it happens when the anonymous pull rate limit has been hit or Docker Desktop isn't authenticated with Docker Hub. Fix by logging in, then retrying:

```bash
docker login
docker compose up --build
```

If it still fails, check for a proxy/VPN/firewall blocking `registry-1.docker.io`.

### Backend gets `Access denied for user` (MySQL)

MySQL only applies `MYSQL_ROOT_PASSWORD`/`MYSQL_USER`/`MYSQL_PASSWORD` the very first time it initializes an **empty** data volume. If you add/change these in `.env` after the volume already exists, the running container keeps the old credentials, so the backend fails to authenticate with the new ones.

Fix by wiping the volume and reinitializing with the current credentials:

```bash
docker compose down -v
docker compose up --build
```

> ⚠️ `down -v` deletes all data in `mysql-data` (vacations, users). Only do this on a fresh/dev setup, not on a machine with real data you want to keep. Vacation images are unaffected since they live in your remote bucket, not in a local volume.

### Images don't load / backend fails to start with a MinIO/S3 connection error

Check that `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, and `MINIO_BUCKET` are set correctly in `.env` (see `.env.example`) and that the API token has Object Read & Write permission on that bucket.

---

## Local Development (without Docker)

Requires Node.js 20+ and a running MySQL instance on `localhost:3306` (database `vacations`).

```bash
# 1. Install dependencies
cd backend  && npm install
cd ../mcp   && npm install
cd ../frontend && npm install

# 2. Start services (each in a separate terminal)
cd backend  && npm run dev     # port 3001
cd mcp      && npm run dev     # port 3002
cd frontend && npm run dev     # port 3000
```

> **Note:** Image uploads/views require the `MINIO_*` env vars (pointing at your remote S3-compatible bucket) to be set — see `.env.example`. There is no local MinIO to run.

---

## Running Tests

Integration tests use Jest + Supertest + an ephemeral MySQL container (via `testcontainers`) — requires Docker to be running, no manually-managed test database needed.

```bash
cd backend && npm test
```

---

## Project Structure

```
jb-45800-5-project-3/
├── backend/                  # Express REST API (port 3001)
│   ├── src/
│   │   ├── app.ts            # Express app & middleware setup
│   │   ├── server.ts         # HTTP server entry point
│   │   ├── models/           # Sequelize models (User, Vacation, Like)
│   │   ├── controllers/
│   │   │   ├── auth/         # register, login, Google OAuth
│   │   │   ├── vacations/    # CRUD + pagination/filter (Sequelize + raw SQL for aggregation)
│   │   │   ├── likes/        # like, unlike
│   │   │   ├── report/       # JSON report, CSV export
│   │   │   ├── ai/           # OpenAI recommendation
│   │   │   ├── images/       # S3-compatible bucket image proxy
│   │   │   └── mcp/          # MCP client proxy
│   │   ├── middlewares/      # authEnforce, bodyValidation, error handling
│   │   └── utils/            # JWT helpers, S3-compatible image handler (MinIO JS client)
│   └── config/               # node-config (default.json, custom-environment-variables.json)
│
├── database/                 # MySQL image with schema + seed data baked in
│   ├── Dockerfile            # FROM mysql:8.0, copies init/*.sql into docker-entrypoint-initdb.d
│   └── init/                 # 01-schema.sql (tables), 02-seed.sql (vacations + admin/test users)
│
├── mcp/                      # MCP server (port 3002)
│   └── src/server.ts         # Tools: list_vacations, search_vacations
│
├── frontend/                 # React SPA (port 3000 dev / 80 Docker)
│   └── src/
│       ├── components/
│       │   ├── auth/         # Register, Login, OAuthCallback
│       │   ├── vacations/    # VacationList, VacationCard
│       │   ├── admin/        # VacationForm, AddVacation, EditVacation
│       │   ├── ai/           # AiRecommend
│       │   ├── mcp/          # McpChat
│       │   ├── report/       # Report (Recharts bar chart)
│       │   ├── layout/       # NavBar, Layout
│       │   └── routing/      # AuthGuard, AdminGuard, GuestGuard
│       ├── services/         # axios API clients (auth, vacation, ai, mcp, report)
│       ├── models/           # TypeScript interfaces
│       └── redux/            # auth-slice, store
│
├── postman/                  # Postman collection for API testing
└── docker-compose.yml
```

---

## API Reference

All routes except `/api/auth/*` require `Authorization: Bearer <token>`.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/google` | Public | Redirect to Google OAuth consent screen |
| GET | `/api/auth/google/callback` | Public | Google OAuth callback |
| GET | `/api/vacations` | User | List vacations (`?page=&filter=`) |
| GET | `/api/vacations/:id` | User | Get single vacation |
| POST | `/api/vacations` | Admin | Add vacation (multipart) |
| PUT | `/api/vacations/:id` | Admin | Update vacation (multipart) |
| DELETE | `/api/vacations/:id` | Admin | Delete vacation |
| GET | `/uploads/:imageName` | User | Proxy a vacation image from the remote bucket (unused when `VITE_IMAGES_BASE_URL` is set and the bucket is public) |
| POST | `/api/likes/:vacationId` | User | Like a vacation |
| DELETE | `/api/likes/:vacationId` | User | Unlike a vacation |
| GET | `/api/report` | Admin | Likes report JSON |
| GET | `/api/report/csv` | Admin | Likes report CSV download |
| POST | `/api/ai/recommend` | User | AI travel recommendation |
| POST | `/api/mcp/ask` | User | Ask AI about vacations |
