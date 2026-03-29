# Lumio

AI-powered learning plan generator for educators and parents supporting children with diverse learning needs. Built with Next.js, Prisma (SQLite), and the Anthropic Claude API.

## Features

- **Child profiles** — track age group, support level, strengths, challenges, sensory preferences, and communication style
- **AI learning plans** — generate personalized IEP-style plans via Claude (claude-sonnet-4-6)
- **Lumen chat** — contextual AI assistant within each learning plan
- **Schedules** — create and manage daily/weekly blocks per child
- **Progress tracking** — log goal ratings and notes over time with charts

---

## Prerequisites

- Node.js 18+
- npm

---

<!-- AUTO-GENERATED -->
## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build with type checking |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed the database with sample data (`prisma/seed.ts`) |
<!-- AUTO-GENERATED -->

---

<!-- AUTO-GENERATED -->
## Environment Variables

Copy `.env` (or create one from the values below) before running the app.

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | **Yes** | Anthropic API key for Claude plan generation and chat | `sk-ant-...` |
| `DATABASE_URL` | **Yes** | SQLite database file path | `file:./dev.db` |
| `NEXTAUTH_SECRET` | **Yes** | Secret used to sign NextAuth JWTs (any random string) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | **Yes** | Canonical URL of the app | `http://localhost:3000` |
<!-- AUTO-GENERATED -->

---

<!-- AUTO-GENERATED -->
## API Routes

All routes require authentication (NextAuth session) unless noted.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/register` | Create a new user account (unauthenticated) |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth authentication handlers |
| `GET` | `/api/dashboard/today` | Fetch today's schedule blocks for the dashboard |
| `GET` | `/api/children` | List all children for the current user |
| `POST` | `/api/children` | Create a new child profile |
| `GET` | `/api/children/[childId]` | Get a single child profile |
| `PUT` | `/api/children/[childId]` | Update a child profile |
| `DELETE` | `/api/children/[childId]` | Delete a child and all related data |
| `GET` | `/api/plans?childId=` | List learning plans for a child |
| `POST` | `/api/plans` | Generate a new AI learning plan via Claude |
| `GET` | `/api/plans/[planId]` | Get a single learning plan |
| `DELETE` | `/api/plans/[planId]` | Delete a learning plan |
| `GET` | `/api/schedules?childId=` | List schedules for a child |
| `POST` | `/api/schedules` | Create a new schedule |
| `GET` | `/api/schedules/[scheduleId]` | Get a single schedule |
| `PUT` | `/api/schedules/[scheduleId]` | Update a schedule |
| `DELETE` | `/api/schedules/[scheduleId]` | Delete a schedule |
| `GET` | `/api/progress?childId=` | List progress entries for a child |
| `POST` | `/api/progress` | Create a progress entry |
| `PUT` | `/api/progress/[entryId]` | Update a progress entry |
| `DELETE` | `/api/progress/[entryId]` | Delete a progress entry |
| `GET` | `/api/settings` | Get current user settings |
| `PUT` | `/api/settings` | Update user settings (e.g. text size preference) |
| `POST` | `/api/chat` | Send a message to Lumen (Claude) within a plan context |
<!-- AUTO-GENERATED -->

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env .env.local   # edit values as needed

# Initialize the database
npx prisma migrate dev

# (Optional) seed sample data
npm run seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database

Uses SQLite via Prisma. Schema lives in `prisma/schema.prisma`.

```bash
# Apply migrations
npx prisma migrate dev

# Open Prisma Studio (GUI)
npx prisma studio

# Reset database
npx prisma migrate reset
```

**Models:** `User` → `Child` → `LearningPlan`, `Schedule`, `ProgressEntry`
