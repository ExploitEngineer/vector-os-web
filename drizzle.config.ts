import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js, so load .env.local manually.
// Load .env.local first (takes precedence), then fall back to .env.
config({ path: ".env.local" });
config();

// `generate` only needs the schema; `migrate`/`push`/`studio` need a real URL.
const url = process.env.DATABASE_URL ?? "";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
