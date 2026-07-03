# Vacations Booking App

A full-stack vacation browsing and likes application built with React, Node.js/Express, MongoDB and TypeScript.

---

## Features

- **Browse vacations** — paginated grid (9 per page) with filter tabs: All, My Likes, Active, Upcoming
- **Like / Unlike** vacations with live counter updates
- **Auth** — register, login with JWT, role-based access (user / admin)
- **Admin panel** — add, edit and delete vacations with image upload
- **AI recommendation** — enter a destination, get a GPT-4o-mini travel tip
- **MCP chat** — ask natural-language questions answered from live vacation data
- **Likes report** — admin bar chart (Recharts) with CSV export
- **Dockerized** — one command spins up all 4 services

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Redux Toolkit, React Router v6, Recharts |
| Backend | Node.js, Express, TypeScript, Mongoose, Joi, JWT, bcryptjs |
| Database | MongoDB 7.0 |
| AI | OpenAI SDK (gpt-4o-mini) |
| MCP Server | @modelcontextprotocol/sdk, StreamableHTTPServerTransport |
| Infrastructure | Docker, docker-compose, nginx |

---

## Quick Start (Docker)

### 1. Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Environment variables

Create a `.env` file in the project root:

```env
VACATIONS_ENCRYPTION_KEY=your_jwt_secret_key_here
VACATIONS_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:3001/api |
| MCP Server | http://localhost:3002/mcp |

The backend automatically seeds the database on first run (vacations + admin + test user).

---

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@vacations.com | Admin1234 |
| User | user@vacations.com | User1234 |

---

## Local Development (without Docker)

Requires Node.js 20+ and a running MongoDB instance on `localhost:27017`.

```bash
# 1. Install dependencies
cd backend  && npm install
cd ../mcp   && npm install
cd ../frontend && npm install

# 2. Seed the database
cd ../backend && npx ts-node src/db/seed.ts

# 3. Start services (each in a separate terminal)
cd backend  && npm run dev     # port 3001
cd mcp      && npm run dev     # port 3002
cd frontend && npm run dev     # port 3000
```

---

## Project Structure

```
jb-45800-5-project-3/
├── backend/                  # Express REST API (port 3001)
│   ├── src/
│   │   ├── app.ts            # Express app & middleware
│   │   ├── server.ts         # HTTP server entry point
│   │   ├── models/           # Mongoose models (User, Vacation, Like)
│   │   ├── controllers/
│   │   │   ├── auth/         # register, login
│   │   │   ├── vacations/    # CRUD + pagination/filter aggregation
│   │   │   ├── likes/        # like, unlike
│   │   │   ├── report/       # JSON report, CSV export
│   │   │   ├── ai/           # OpenAI recommendation
│   │   │   └── mcp/          # MCP client proxy
│   │   ├── middleware/       # authEnforce, bodyValidation
│   │   ├── db/seed.ts        # Database seeder
│   │   └── utils/            # JWT helpers, image utils
│   └── config/               # node-config (default.json, custom-environment-variables.json)
│
├── mcp/                      # MCP server (port 3002)
│   └── src/server.ts         # Tools: list_vacations, search_vacations
│
├── frontend/                 # React SPA (port 3000 dev / 80 Docker)
│   └── src/
│       ├── components/
│       │   ├── auth/         # Register, Login
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
| GET | `/api/vacations` | User | List vacations (`?page=&filter=`) |
| GET | `/api/vacations/:id` | User | Get single vacation |
| POST | `/api/vacations` | Admin | Add vacation (multipart) |
| PUT | `/api/vacations/:id` | Admin | Update vacation (multipart) |
| DELETE | `/api/vacations/:id` | Admin | Delete vacation |
| POST | `/api/likes/:vacationId` | User | Like a vacation |
| DELETE | `/api/likes/:vacationId` | User | Unlike a vacation |
| GET | `/api/report` | Admin | Likes report JSON |
| GET | `/api/report/csv` | Admin | Likes report CSV download |
| POST | `/api/ai/recommend` | User | AI travel recommendation |
| POST | `/api/mcp/ask` | User | Ask AI about vacations |
