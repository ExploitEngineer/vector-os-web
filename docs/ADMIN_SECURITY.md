# Admin Security

The admin dashboard manages all public content. Its single most important
guarantee: **a user can become an admin only through a direct database edit.**
No signup flow, API endpoint, UI control, or server action can grant
`is_admin`. This document explains how that's enforced.

## Threat model in one line

Server Actions are public POST endpoints. Next.js exposes every used action at a
stable, callable URL — so "the button is hidden" is **not** a security control.
Every mutation re-verifies the caller.

## How admin status is controlled

- The `users.is_admin` column is `NOT NULL DEFAULT false`
  (`src/lib/db/schema.ts`).
- **No code anywhere writes `is_admin`.** Search and confirm:
  ```bash
  grep -rn "is_admin\|isAdmin" src/actions src/app
  ```
  You'll only find *reads* (`user.isAdmin`), never an assignment.
- There is **no signup action**. `src/actions/auth.ts` exposes `login` and
  `logout` only. New users are created out-of-band by `scripts/create-admin.ts`,
  which always inserts `is_admin = false`.
- Promotion is a manual SQL statement an operator runs against the database:
  ```sql
  UPDATE users SET is_admin = true WHERE email = 'you@example.com';
  ```

## Defense layers

### 1. `proxy.ts` — optimistic redirect (UX, not security)

`src/proxy.ts` runs on `/admin/:path*`. It only checks for the **presence** of
the session cookie and redirects to `/admin/login` if it's missing. It does no
database work (it runs on every matched request) and is explicitly *not* relied
on for authorization.

### 2. The Data Access Layer — `src/lib/services/admin.ts`

A `server-only` module is the single place session → user resolution happens:

- `getCurrentUser()` — reads the cookie, verifies the signed session id, looks
  up the session + user in the DB, checks expiry, and returns a **minimal DTO**
  (`id`, `email`, `name`, `isAdmin`) — never the password hash. Memoized per
  request with React `cache`.
- `requireAdminPage()` — for pages/layouts; `redirect('/admin/login')` unless the
  caller is an admin.
- `requireAdmin()` — for server actions/route handlers; **throws** `Unauthorized`
  unless the caller is an admin.

### 3. Layout gate — `src/app/admin/(dashboard)/layout.tsx`

Calls `requireAdminPage()` before rendering any dashboard page. The public login
page lives at `src/app/admin/login` *outside* the `(dashboard)` route group, so
it is reachable while logged out (no redirect loop).

### 4. Per-action authorization (the real boundary)

Every create/update/delete in `src/actions/{projects,blogs,team}.ts` and
`src/actions/upload.ts` calls `await requireAdmin()` **before** touching the
database. This is independent of the layout gate — a page-level check does not
protect an action, because the action is a separate entry point.

```ts
export async function deleteProject(formData: FormData) {
  await requireAdmin();           // throws for non-admins
  const id = str(formData, "id");
  if (id) await db.delete(projects).where(eq(projects.id, id));
}
```

## Sessions

- **Database-backed**: a row in `sessions` (id, user_id, expires_at). The cookie
  stores only the session id, signed as a JWT with `SESSION_SECRET` (via `jose`).
- Cookie flags (`src/lib/session.ts`): `httpOnly`, `sameSite=lax`,
  `secure` in production, 7-day expiry, `path=/`.
- `createSession` inserts the row and sets the cookie; `deleteSession` (logout)
  deletes the row and clears the cookie. Expired sessions are rejected in
  `getCurrentUser`.
- Passwords are hashed with `bcryptjs`. Login returns a generic
  "Invalid email or password" for both unknown email and wrong password, and
  **always** runs a bcrypt compare (against a dummy hash when the email is
  unknown) so response time can't be used to enumerate accounts.

## Password management

- **Change password (signed in):** `/admin/account` → `changePassword` action.
  It verifies the current password, enforces the strength policy
  (`src/lib/validation/auth.ts`: ≥8 chars, a letter and a number, must differ
  from the old one), updates the hash, then **deletes all of the user's sessions**
  (logs out other devices) and re-issues one for the current browser.
- **Forgot password / lockout (operator):** `pnpm reset-password <email>
  <newPassword>` — direct DB reset, requires database access, revokes the user's
  sessions. There is intentionally **no email-based self-serve reset** (no mail
  service and it would be another unauthenticated entry point); recovery is an
  operator action, same trust level as creating/promoting an admin.

## SQL injection & privilege escalation

- **SQL injection:** all queries go through Drizzle's parameterized API
  (placeholders `$1, $2, …`); there is no string-built SQL. The only literal
  `sql\`\`` is a static `ARRAY[]::text[]` default with no user input.
- **No mass-assignment to `is_admin`:** Zod object schemas strip unknown keys
  (no `passthrough`/`catchall`), and the content actions only write to
  `projects` / `blogs` / `team_members` — tables that have no `is_admin` column.
  A forged `is_admin` form field is dropped before it reaches the database.
- **IDOR:** content is global and the only writers are admins, so editing any
  row by id is intended; there is no per-user ownership to bypass.
- **Known gap — login rate limiting:** brute-force throttling is not implemented
  (a robust limit needs a shared store on serverless). Front with a WAF/edge
  rate limit, or add a DB-backed attempt counter, before exposing publicly.

## Input validation

All action input is parsed from `FormData` and validated with Zod
(`src/lib/validation/*`) before any DB write. URL fields must be valid URLs; the
project bootlog JSON is shape-checked. Actions return thin `{ ok, error,
fieldErrors }` objects — never raw DB records.

## Audit checklist

- [ ] No assignment to `isAdmin` / `is_admin` outside a manual SQL statement.
- [ ] No signup action or route.
- [ ] Every mutating action starts with `await requireAdmin()`.
- [ ] The DB client (`src/lib/db`) and `process.env` secrets are only imported by
      `server-only` modules.
- [ ] Logging out deletes the session row, not just the cookie.
- [ ] All DB access is parameterized (Drizzle); no string-built SQL.
- [ ] Validation schemas strip unknown keys (no `passthrough`/`catchall`).
- [ ] Login runs a constant-time-ish compare even for unknown emails.
- [ ] Password change verifies the current password and revokes other sessions.
