# Deployment Guide

Use these steps to deploy the full-stack app with a serverless Neon PostgreSQL database. The same flow works for Render, Railway, Fly.io, or any Node-friendly platform that can run a single server process.

## 1. Provision Neon (serverless Postgres)

1. Create a project at [https://neon.tech](https://neon.tech) and note the connection string (it looks like `postgresql://user:pass@ep-adjective-12345-db.neon.tech/neondb`).
2. In the Neon dashboard enable pooled connections (`?sslmode=require&sslcert=...`) for better cold-start performance.
3. Copy the full connection string into a `.env` entry called `DATABASE_URL`.

## 2. Seed the database

```bash
npm install
DATABASE_URL="postgresql://..." npm run db:push
```

`db:push` runs the Drizzle schema migration and seeds an admin user automatically the first time the API boots.

## 3. Configure environment variables

Create these variables in your deployment provider (names must match exactly):

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon serverless Postgres connection string |
| `SESSION_SECRET` | Random string for encrypting sessions |
| `CONTACT_INBOX_EMAIL` | Destination for contact form notifications |
| `MAIL_FROM` | Friendly "from" name (e.g. `Delowar <portfolio@notifications.delowar.dev>`) |
| `RESEND_API_KEY` | Optional, enables transactional email replies |
| `FIREBASE_*` | Values from your Firebase project (only required if using admin contact dashboard) |
| `PORT` | Most platforms inject this automatically—keep default `5000` locally |

On Vite the client uses `import.meta.env.*`, so mirror your Firebase values inside `client/.env.production` if you need them at build time.

## 4. Build and run

```bash
npm run build   # Vite client + esbuild backend bundle → dist/
npm run start   # Serves API + static assets on $PORT
```

Your deployment platform should execute `npm run build` as the build command and `npm run start` as the start command. The bundled Express server serves both the API routes and the pre-built client from `dist/public`.

## 5. Smoke test

After the service boots:

- Hit `/api/projects` to ensure the API can read from Neon.
- Visit `/` to confirm the static client is being served.
- Log in with the seeded admin (`admin` / `admin123`) and change the password immediately.

That’s it—the app is now running against Neon’s serverless Postgres with zero additional infrastructure.
