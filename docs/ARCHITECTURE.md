# Architecture

## Stack

- **Next.js 16** (App Router, React 19 + React Compiler), TypeScript strict.
- **PostgreSQL (Neon)** via the `@neondatabase/serverless` HTTP driver.
- **Drizzle ORM** for schema, queries, and migrations (`drizzle-kit`).
- **Tailwind CSS v4** (CSS `@theme` tokens) + **Biome** (lint/format).
- **jose** (session JWT), **bcryptjs** (password hashing), **zod** (validation),
  **cloudinary** (image storage), **react-markdown** + **remark-gfm** (blog
  rendering).

## Folder layout

```
src/
  proxy.ts                       # Next 16 middleware: optimistic /admin redirect
  app/
    (public)                     # /, /projects, /blogs, /blogs/[slug], /about
    admin/
      login/                     # public login page (outside the guarded group)
      (dashboard)/               # route group: guarded layout + sidebar
        page.tsx                 # dashboard
        projects|blogs|team/     # list + new + [id]/edit per entity
  actions/                       # "use server" mutations (auth, projects, blogs,
                                 #   team, upload) — each re-checks requireAdmin()
  lib/
    db/{schema.ts,index.ts}      # Drizzle schema + Neon client (server-only)
    queries/{projects,blogs,team}.ts   # read functions (server-only)
    services/admin.ts            # Data Access Layer: getCurrentUser/requireAdmin
    session.ts                   # jose sign/verify + cookie management
    cloudinary.ts                # configured Cloudinary client + uploadImage
    validation/{...}.ts          # zod schemas (shared by actions)
    form.ts, slug.ts             # FormData helpers, slugify
  components/admin/              # Sidebar, forms, FormField, ImageField, etc.
  types/index.ts                 # row types inferred from the Drizzle schema
scripts/{create-admin.ts,seed.ts}
drizzle.config.ts
docs/
```

## Data model

`src/lib/db/schema.ts`. UUID primary keys (`defaultRandom`), timestamptz
created/updated columns (`updatedAt` auto-bumped), `text[]` for tags, `jsonb` for
the project bootlog, and `pgEnum`s for project status and blog category.

| Table | Purpose | Notable columns |
|-------|---------|-----------------|
| `users` | Admins | `email` (unique), `password_hash`, **`is_admin` NOT NULL DEFAULT false** |
| `sessions` | DB-backed sessions | `user_id` → users (cascade), `expires_at` |
| `projects` | Project cards | `slug` (unique), `status` enum, `tags[]`, `bootlog` jsonb, `featured`, `display_order` |
| `blogs` | Blog posts | `slug` (unique), `category` enum, `content` (markdown), `published`, `published_at` |
| `team_members` | Team profiles | `handle`, `focus` (bio), `tags[]`, social URLs, `display_order` |

Public component shapes are derived directly from the schema
(`typeof table.$inferSelect` in `src/types/index.ts`) — no duplicated type
definitions. The original `src/data/*` files remain only as seed input.

## Data flow

```
Public page (RSC)  ──►  src/lib/queries/*  ──►  Drizzle  ──►  Neon
   (e.g. /projects fetches getAllProjects and passes rows to <ProjectGrid>)

Admin form (client) ──► "use server" action ──► requireAdmin()
                                              ──► zod validate
                                              ──► Drizzle write
                                              ──► revalidatePath(public + admin)
```

Client components (`ProjectGrid`, `BlogGrid`, `TeamSection`) receive data as
**props** from server components and keep only presentational state
(filter/search/pagination). They no longer import the static data files.

## Key decisions

- **Neon HTTP driver** — works in the default Node runtime, no connection pool to
  manage; fine for the single-statement reads/writes here.
- **Database sessions over stateless JWT** — lets logout truly revoke a session
  and keeps the cookie payload to an opaque id.
- **DAL + per-action authorization** — follows the Next.js 16 data-security
  guidance: secrets and DB access live in `server-only` modules, and every
  mutation re-verifies the caller rather than trusting the UI gate.
- **`(dashboard)` route group** — separates the guarded admin shell from the
  public login page so the layout guard can't loop on `/admin/login`.
- **`HideOnAdmin`** — keeps the marketing chrome (loader/navbar/footer) off the
  admin routes without duplicating the root layout.
- **Markdown for posts** — stored as plain text, rendered server-side; lightweight
  and fits the terminal aesthetic. Slugs auto-generate from the title.
- **Admin promotion is manual SQL only** — see
  [ADMIN_SECURITY.md](./ADMIN_SECURITY.md).
