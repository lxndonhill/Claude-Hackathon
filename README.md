# Lumio

AI-powered learning plan generator for educators and parents supporting children with diverse learning needs. Built with Next.js, Prisma (SQLite), and the Anthropic Claude API.

## Features

- **Child profiles** — track age group, support level, strengths, challenges, sensory preferences, and communication style
- **AI learning plans** — generate personalized IEP-style plans via Claude (claude-sonnet-4-6)
- **Lumen chat** — contextual AI assistant within each learning plan
- **Schedules** — create and manage daily/weekly blocks per child
- **Progress tracking** — log goal ratings and notes over time with charts

---

## Running Lumio Locally

Follow these steps to get the app running on your own computer. No prior experience required — just take it one step at a time!

### Step 1 — Check your prerequisites

You'll need two things installed before you start:

- **Node.js** (version 18 or newer) — download from [nodejs.org](https://nodejs.org). Choose the "LTS" version.
- **npm** — this comes bundled with Node.js automatically.

To check if you already have them, open your terminal (on Mac: search for "Terminal", on Windows: search for "Command Prompt") and run:

```bash
node --version
npm --version
```

If both print a version number, you're good to go.

---

### Step 2 — Clone the repository

In your terminal, navigate to the folder where you want to keep the project, then run:

```bash
git clone https://github.com/your-username/lumio.git
cd lumio
```

(Replace the URL with the actual repo URL if different.)

---

### Step 3 — Install dependencies

This downloads all the libraries the app needs:

```bash
npm install
```

It may take a minute or two. You'll see a progress bar.

---

### Step 4 — Set up your environment file

The app needs a few secret values to work. Copy the example file to get started:

```bash
cp .env.example .env.local
```

Then open `.env.local` in any text editor and fill in the values:

```
ANTHROPIC_API_KEY=sk-ant-...       ← your API key (see Step 5)
DATABASE_URL="file:./dev.db"       ← leave this as-is for local use
NEXTAUTH_SECRET=any-random-string  ← make up any long random string
NEXTAUTH_URL=http://localhost:3000 ← leave this as-is
```

---

### Step 5 — Get an Anthropic API key

Lumio uses Claude AI to generate learning plans and power the Lumen chat assistant. You'll need a free API key:

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Click **API Keys** in the left sidebar
4. Click **Create Key**, give it a name (e.g. "Lumio"), and copy the key
5. Paste it into `.env.local` as the value for `ANTHROPIC_API_KEY`

> Keep this key private — don't share it or commit it to git.

---

### Step 6 — Run database migrations

This creates the local database file and sets up all the tables:

```bash
npx prisma migrate dev
```

When prompted for a migration name, you can just press Enter.

---

### Step 7 — Seed demo data

This populates the app with three sample child profiles (Alex, Maya, and Jordan), each with a pre-built learning plan, schedule, and progress history so you can explore the app right away:

```bash
npm run seed
```

---

### Step 8 — Start the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Step 9 — Log in with the demo account

Use these credentials to explore the pre-loaded demo data:

| Field | Value |
|-------|-------|
| Email | `demo@lumio.app` |
| Password | `demo1234` |

You'll find three children already set up — Alex (social skills), Maya (communication), and Jordan (life skills) — each with a full learning plan, weekly schedule, and progress tracking history.

---

## Other Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run seed` | Re-seed demo data (resets the demo account) |
| `npx prisma studio` | Open a visual browser for your database |
| `npx prisma migrate reset` | Wipe and rebuild the database from scratch |

---

<!-- AUTO-GENERATED -->
## Environment Variables

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

## Database

Uses SQLite via Prisma. Schema lives in `prisma/schema.prisma`.

**Models:** `User` → `Child` → `LearningPlan`, `Schedule`, `ProgressEntry`
