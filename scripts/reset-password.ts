import { config } from "dotenv";

// Load .env.local first (takes precedence), then fall back to .env.
config({ path: ".env.local" });
config();

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

/**
 * Lockout recovery: reset a user's password directly (operator-only, needs DB
 * access). Revokes all their sessions. Usage:
 *   pnpm reset-password <email> <newPassword>
 */
async function main() {
  const email = (process.env.ADMIN_EMAIL ?? process.argv[2] ?? "")
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_PASSWORD ?? process.argv[3] ?? "";

  if (!email || !password) {
    console.error("Usage: pnpm reset-password <email> <newPassword>");
    process.exit(1);
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const db = drizzle(neon(url), { schema });
  const passwordHash = await bcrypt.hash(password, 10);

  const updated = await db
    .update(schema.users)
    .set({ passwordHash })
    .where(eq(schema.users.email, email))
    .returning({ id: schema.users.id });

  if (updated.length === 0) {
    console.error(`No user found with email ${email}.`);
    process.exit(1);
  }

  await db
    .delete(schema.sessions)
    .where(eq(schema.sessions.userId, updated[0].id));

  console.log(`Password reset for ${email}. All sessions revoked.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
