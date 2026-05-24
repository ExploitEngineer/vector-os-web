# Setup

Backend setup for the Vector OS site: PostgreSQL (Neon) + Drizzle ORM, session
auth, and Cloudinary image uploads.

## 1. Prerequisites

- Node.js 20+
- pnpm (this repo's package manager)
- A [Neon](https://neon.tech) Postgres database
- A [Cloudinary](https://cloudinary.com) account

## 2. Install dependencies

```bash
pnpm install
```

## 3. Environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|----------|-----------------|
| `DATABASE_URL` | Neon → Project → **Connection Details** (use the pooled string, keep `?sslmode=require`). |
| `SESSION_SECRET` | Generate: `openssl rand -base64 32`. Signs the session cookie. |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary → **Dashboard** credentials. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Only used once by `scripts/create-admin.ts`. |

`.env.local` is gitignored — never commit real secrets.

## 4. Create the database schema

Generate the SQL migration from the Drizzle schema and apply it:

```bash
pnpm db:generate   # writes SQL to ./drizzle
pnpm db:migrate    # applies it to your Neon database
```

For quick local iteration you can instead push the schema directly:

```bash
pnpm db:push
```

Inspect data any time with Drizzle Studio:

```bash
pnpm db:studio
```

## 5. Create an admin user

Admin access is granted **only** via the database (see
[ADMIN_SECURITY.md](./ADMIN_SECURITY.md)). First create the user, then promote it:

```bash
pnpm create-admin
```

The script prints the exact SQL to run, e.g.:

```sql
UPDATE users SET is_admin = true WHERE email = 'you@example.com';
```

Run that against your Neon DB (Neon SQL Editor or `psql`). There is no UI or API
that can set `is_admin` — this manual step is by design.

## 6. Seed content (optional)

Populate the database with the original hardcoded projects, posts, and team
members:

```bash
pnpm seed
```

The seed is idempotent — it skips any table that already has rows.

## 7. Run

```bash
pnpm dev      # http://localhost:3000  (public site)
              # http://localhost:3000/admin  (dashboard)
```

## Commands reference

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` |
| Production build | `pnpm build` |
| Lint | `pnpm lint` |
| Format | `pnpm format` |
| Generate migration | `pnpm db:generate` |
| Apply migrations | `pnpm db:migrate` |
| Push schema (no migration files) | `pnpm db:push` |
| Drizzle Studio | `pnpm db:studio` |
| Create admin user | `pnpm create-admin` |
| Reset a password (lockout) | `pnpm reset-password <email> <newPassword>` |
| Seed content | `pnpm seed` |
