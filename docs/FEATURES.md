# Features

Content management for the three public content types. All editing happens in
the admin dashboard at `/admin`; the public site reads the same data live.

## Authentication

- `/admin/login` — email + password sign-in (`login` action).
- `/admin/account` — change password (`changePassword` action); verifies the
  current password and signs out other devices.
- Sidebar **Log out** button (`logout` action).
- Lockout recovery: `pnpm reset-password <email> <newPassword>` (operator/CLI).
- Everything under `/admin` except the login page requires an authenticated
  admin. See [ADMIN_SECURITY.md](./ADMIN_SECURITY.md).

## Projects

Portfolio project cards (the terminal-style cards on `/` and `/projects`).

- **Create** — `/admin/projects/new`
- **Read** — list at `/admin/projects`; public at `/` and `/projects`
- **Update** — `/admin/projects/[id]/edit`
- **Delete** — from the list (confirm dialog)

Fields: name, slug (auto from name if blank), short description, language, stars,
status (`active` / `coming-soon` / `classified`), tags, project URL, GitHub URL,
image (Cloudinary upload or URL), bootlog (JSON array of `{ text, color }` lines
that scroll on the card), display order, featured flag.

Actions: `createProject`, `updateProject`, `deleteProject`
(`src/actions/projects.ts`).

## Blog posts

Markdown posts shown on `/blogs`, with a detail page at `/blogs/[slug]`.

- **Create** — `/admin/blogs/new`
- **Read** — list at `/admin/blogs` (drafts included); public list `/blogs`
  (published only); detail `/blogs/[slug]` (published only, else 404)
- **Update** — `/admin/blogs/[id]/edit`
- **Delete** — from the list

Fields: title, slug (auto from title if blank), category (`LINUX` / `SECURITY` /
`TOOLS`), excerpt, featured image, content (GitHub-flavored Markdown), published
flag, display order. `publishedAt` is stamped the first time a post is published
and preserved on later edits.

Markdown is rendered by `src/components/ui/Markdown.tsx`
(`react-markdown` + `remark-gfm`) with theme-matched element styles.

Actions: `createBlog`, `updateBlog`, `deleteBlog` (`src/actions/blogs.ts`).

## Team members

Profiles in the "The Team" section on the home page.

- **Create** — `/admin/team/new`
- **Read** — list at `/admin/team`; public on `/`
- **Update** — `/admin/team/[id]/edit`
- **Delete** — from the list

Fields: name, handle (GitHub username), role, focus/bio, tags, avatar (Cloudinary
upload or URL; falls back to `github.com/<handle>.png`), GitHub URL, LinkedIn URL,
Twitter URL, display order.

Actions: `createTeamMember`, `updateTeamMember`, `deleteTeamMember`
(`src/actions/team.ts`).

## Image uploads

`uploadImageAction` (`src/actions/upload.ts`) streams a file to Cloudinary and
returns its delivery URL, which is stored on the record. Guarded by
`requireAdmin()`. Validates type (image/\*) and size (≤ 8 MB). The
`ImageField` component (used in every form) supports both upload and pasting a
URL directly. `res.cloudinary.com` is whitelisted in `next.config.ts`.

## Data freshness

Mutations call `revalidatePath` for the affected public routes (`/`,
`/projects`, `/blogs`, `/blogs/[slug]`, `/about`) and the relevant admin list, so
edits appear on the public site without a redeploy.

## Public read APIs (server-only)

There are no REST/GraphQL endpoints. Public pages are React Server Components
that call the query layer directly (`src/lib/queries/*`): `getAllProjects`,
`getFeaturedProjects`, `getPublishedBlogs`, `getPublishedBlogBySlug`,
`getAllTeam`, etc.
