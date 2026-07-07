# Vacations Booking App

A full-stack vacation browsing and likes application built with React, Node.js/Express, MongoDB and TypeScript.

---

## Features

- **Browse vacations** — paginated grid (9 per page) with filter tabs: All, My Likes, Active, Upcoming
- **Like / Unlike** vacations with live counter updates
- **Auth** — register, login with JWT, role-based access (user / admin)
- **Google OAuth** — sign in or register via Google account
- **Admin panel** — add, edit and delete vacations with image upload (stored in MinIO)
- **AI recommendation** — enter a destination, get a GPT-4o-mini travel tip
- **MCP chat** — ask natural-language questions answered from live vacation data
- **Likes report** — admin bar chart (Recharts) with CSV export
- **Dockerized** — one command spins up all 5 services

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Redux Toolkit, React Router v6, Recharts |
| Backend | Node.js, Express, TypeScript, Mongoose, Joi, JWT, bcryptjs, Passport.js |
| Database | MongoDB 7.0 |
| Object Storage | MinIO (S3-compatible, vacation images) |
| AI | OpenAI SDK (gpt-4o-mini) |
| MCP Server | @modelcontextprotocol/sdk, StreamableHTTPServerTransport |
| Infrastructure | Docker, docker compose, nginx |

---

## Quick Start (Docker)

### 1. Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
# Required
VACATIONS_ENCRYPTION_KEY=your_jwt_secret_key_here
VACATIONS_OPENAI_API_KEY=sk-your_openai_key_here

# MinIO object storage credentials
MINIO_ROOT_USER=minio_admin
MINIO_ROOT_PASSWORD=MinioSecure2024

# MongoDB root credentials
MONGO_ROOT_USERNAME=mongo_admin
MONGO_ROOT_PASSWORD=MongoSecure2024

# Optional — enables Google OAuth (leave empty to disable)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
FRONTEND_URL=http://localhost
```

### 3. Run

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:3001/api |
| MinIO Console | http://localhost:9001 (`MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` from `.env`) |

> **Note:** MCP server runs on an internal Docker network only and is not exposed to the host.

The database container seeds vacations, an admin user, and a test user automatically on first start.

> **First run or after credential changes:** run `docker compose down -v` before `docker compose up --build` to allow MongoDB to reinitialise with the credentials in your `.env`.

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

## Local Development (without Docker)

Requires Node.js 20+ and a running MongoDB instance on `localhost:27017`.

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

> **Note:** Image uploads require MinIO running locally. Start it with:
> `docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"`

---

## Running Tests

Integration tests use Jest + Supertest + mongodb-memory-server (no running database needed).

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
│   │   ├── models/           # Mongoose models (User, Vacation, Like)
│   │   ├── controllers/
│   │   │   ├── auth/         # register, login, Google OAuth
│   │   │   ├── vacations/    # CRUD + pagination/filter aggregation
│   │   │   ├── likes/        # like, unlike
│   │   │   ├── report/       # JSON report, CSV export
│   │   │   ├── ai/           # OpenAI recommendation
│   │   │   ├── images/       # MinIO image proxy
│   │   │   └── mcp/          # MCP client proxy
│   │   ├── middlewares/      # authEnforce, bodyValidation, error handling
│   │   └── utils/            # JWT helpers, MinIO image handler
│   └── config/               # node-config (default.json, custom-environment-variables.json)
│
├── database/                 # Custom MongoDB image with embedded TypeScript seeder
│   ├── Dockerfile            # Multi-stage: compiles TS seeder → mongo:7.0 image
│   └── src/seed.ts           # Seeder (runs automatically on first container init)
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
| GET | `/uploads/:imageName` | User | Serve vacation image from MinIO |
| POST | `/api/likes/:vacationId` | User | Like a vacation |
| DELETE | `/api/likes/:vacationId` | User | Unlike a vacation |
| GET | `/api/report` | Admin | Likes report JSON |
| GET | `/api/report/csv` | Admin | Likes report CSV download |
| POST | `/api/ai/recommend` | User | AI travel recommendation |
| POST | `/api/mcp/ask` | User | Ask AI about vacations |
