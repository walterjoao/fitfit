# FitPro (fitfit)

A multi-role fitness platform built with Next.js. One app serves athletes, gyms, trainers, nutritionists, shops and platform admins, each with their own dashboard. The UI is in Portuguese.

## Features

- **Athlete**: workouts, goals and achievements, progress tracking (body, photos, nutrition, charts), nutrition log/plans/meals, class and PT bookings, nearby gyms map, shop, messaging, leaderboard, membership, billing and finance.
- **Gym**: members, trainers, classes, subscriptions, payments, analytics, messaging, leaderboard, billing and settings.
- **Nutritionist**: clients, meal plans, appointments, tracking, reports, finance and messaging.
- **Shop**: products, orders, payments, finance and messaging.
- **Admin**: users, finance, billing, shop applications (approve), leaderboard, integrations and API credentials, settings.
- **Public**: marketplace, events, programs, affiliate page, shop-owner application form (`/apply-shop`), profiles and stores.
- **AI assistant**: chat widget with pluggable providers (OpenAI, Gemini, Claude) and an offline mock fallback.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router), React 19, TypeScript 5 |
| Database | MySQL via `mysql2` (connection pool in `src/lib/db.ts`) |
| Auth | `bcryptjs` password hashes; the session (`name`, `email`, `role`) is kept client-side in `localStorage` (`fitpro_session`) |
| Maps | Leaflet |
| Lint | ESLint 9 with `eslint-config-next` |

> Next.js 16 has breaking changes versus older versions. See `AGENTS.md` and `node_modules/next/dist/docs/` before changing framework-level code.

## Project structure

```
src/
  app/
    api/
      ai/chat/                  POST: AI assistant
      auth/login/               POST: email + password login
      shop-applications/        GET/POST: list and submit shop applications
      shop-applications/approve POST: approve an application
    dashboard/{athlete,gym,nutritionist,shop,admin}/...  role dashboards
    login, marketplace, events, programs, affiliate, apply-shop, ...
  components/                   Header, Sidebar, AIAssistant, messaging, nearby map, leaderboard, ...
  lib/
    db.ts                       MySQL pool
    session.ts                  client-side session helpers
    ai/                         provider manager + openai / gemini / claude / mock
    *Data.ts                    per-feature data modules
public/                         static assets
```

## Getting started

Requirements: Node.js 20+ and a MySQL database.

```bash
npm install
# create .env.local with the variables listed below
npm run dev                  # http://localhost:3001
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` | Production build |
| `npm start` | Production server on `$PORT` (default 3000) |
| `npm run lint` | ESLint |

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DB_HOST` | yes | MySQL host |
| `DB_PORT` | no | MySQL port (default `3306`) |
| `DB_USER` | yes | MySQL user |
| `DB_PASSWORD` | yes | MySQL password |
| `DB_NAME` | yes | MySQL database name |
| `AI_PROVIDER` | no | Preferred provider: `openai`, `gemini` or `claude`. If unset or unavailable, the first provider with a key is used, then the mock |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | no | OpenAI provider |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | no | Gemini provider |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | no | Claude provider |

Never commit real keys or passwords.

## Database

The API routes expect these tables (schema is not yet in the repo):

- `users`: `id`, `name`, `email`, `password_hash` (bcrypt), `role`
- `shop_applications`: `id`, `applicant_name`, `applicant_email`, `applicant_role`, `business_name`, `description`, `status`, `created_at`

Most dashboard pages currently run on the local data modules in `src/lib/*Data.ts` rather than the database.

## Deployment

The app uses server routes and MySQL, so it needs a Node.js host (a static export will not work).

```bash
npm ci
npm run build
npm start
```

On Hostinger, use a plan with Node.js support: set the app root to the project folder, build command `npm run build`, start command `npm start`, and add the environment variables above.
