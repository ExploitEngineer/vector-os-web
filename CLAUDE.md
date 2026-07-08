# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> **Read the rule above first.** This repo runs a Next.js version with breaking changes vs. most
> training data. Confirm any uncertain API against `node_modules/next/dist/docs/` and the
> `next-best-practices` skill before writing code.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`).

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` (http://localhost:3000) |
| Production build | `pnpm build` |
| Serve prod build | `pnpm start` |
| Lint | `pnpm lint` (`biome check`) |
| Format | `pnpm format` (`biome format --write`) |

No test runner is configured — there is no test command or test files. Do not invent one.

## Stack

- **Next.js 16.2.6**, App Router, source under `src/` (`src/app`). Path alias `@/*` → `src/*`.
- **React 19.2** with the **React Compiler** enabled (`next.config.ts: reactCompiler: true`) —
  do not hand-add `useMemo`/`useCallback` for perf the compiler already handles.
- **Tailwind CSS v4** via PostCSS (`@tailwindcss/postcss`). There is no `tailwind.config`;
  configuration lives in CSS — `src/app/globals.css` uses `@import "tailwindcss"` and an
  `@theme` block. Centralize colors/fonts/animations as `@theme` tokens; do not hardcode hex
  values in components.
- **Biome** is the linter + formatter (2-space indent, `organizeImports` on, `next` + `react`
  lint domains). Run `pnpm lint` before considering work done.
- TypeScript strict mode.

## Architecture

This is the marketing site for **Vector OS**. The page-section components in `src/components/`
were exported from a **Framer** build and are being restructured into a conventional Next.js
app. When touching these components, watch for three Framer-export hazards:

1. **`import … from "framer"`** (`addPropertyControls`, `ControlType`, `RenderTarget`) — `framer`
   is *not* a dependency; these imports break the build. Strip them and the
   `@framerSupportedLayout*` JSDoc.
2. **Missing `'use client'`** — most components use `useState`/`useEffect`/`IntersectionObserver`/
   canvas but were copied without the directive. Interactive components must declare it; see the
   `directives.md` / `rsc-boundaries.md` refs in the `next-best-practices` skill.
3. **Inline `<style>` + Google-Font `@import`** — being migrated to Tailwind utilities and
   `next/font` (loaded in `src/app/layout.tsx`). Don't add new inline `<style>` blocks or font
   `@import`s.

### Intended structure

Routes: `/` (home), `/projects`, `/blogs`, `/about`. Navbar, footer, and a session-gated loader
are **shared in `src/app/layout.tsx`**, not per page. Supporting code is separated into
`src/hooks/` (shared `useInView`/`useScramble`/`useCountUp`/`useReducedMotion`/`useMagnetic`/`useSequence`), `src/data/` (typed content:
projects, posts, team, navigation, ticker, mission), and `src/lib/` (constants + dynamic color
maps). Section components live under `src/components/{layout,sections,ui}/`; unwired leftovers
sit in `src/components/_unused/` and must not be imported by any route.

## Next.js 16 specifics

- `params` and `searchParams` in pages/layouts are **Promises** — `await` them (or `use()` in a
  client component). See `next-best-practices/async-patterns.md`.
- Middleware was renamed to **proxy** in v16. See `next-best-practices/file-conventions.md`.
- Node.js runtime is the default; keep it unless there's a reason. See `runtime-selection.md`.
- Root layout owns `<html>`/`<body>`; set head via the Metadata API, never manual `<head>` tags.

## Skills

Two project skills are installed under `.claude/skills/`:

- **`next-best-practices`** — auto-applied reference for file conventions, RSC boundaries, async
  APIs, metadata, fonts, images, bundling. Consult its topic files when unsure about a Next API.
- **`frontend-design`** — invoke when building or restyling UI; the site is a dark,
  terminal/hacker aesthetic (mono type, cyan/green/red accents on black) — keep new UI cohesive
  with it.
