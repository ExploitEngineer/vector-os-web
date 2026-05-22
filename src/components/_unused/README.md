# Unused components — pending review

These were exported from Framer but are **not wired into any route** in the
refactored site. They are kept here for review (not deleted) and are **excluded
from type-checking and linting** (see `tsconfig.json` `exclude` and `biome.json`)
because they still contain Framer-only imports (`from "framer"`) that don't
resolve in this project. Don't import them from `src/app` or other components
until they've been migrated (de-Framer, add `'use client'`, Tailwind).

| File | What it is |
|------|------------|
| `VOSWhatWeBuild.tsx` | "WHILE YOU EXPLORE, DIVE DEEP." — a 4-row list + typewriter terminal. Not present in any current page design. |
| `GlitchText.tsx` | Standalone RGB glitch text effect component. Never imported (the hero has its own inline glitch). |
| `BackgroundShader.tsx` | WebGL/canvas background shader. Never imported. |
| `Ticker.tsx` | Older/basic marquee. Superseded by `sections/home/TickerStrip.tsx`. |

To bring one back: migrate it following the patterns in the active components
(theme tokens in `globals.css`, hooks in `src/hooks`, data in `src/data`), then
move it into the appropriate `sections/` or `ui/` folder.
