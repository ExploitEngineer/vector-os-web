import { config } from "dotenv";

// Load .env.local first (takes precedence), then fall back to .env.
config({ path: ".env.local" });
config();

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? process.argv[2] ?? "")
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_PASSWORD ?? process.argv[3] ?? "";
  const name = process.env.ADMIN_NAME ?? process.argv[4] ?? null;

  if (!email || !password) {
    console.error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local (or pass them as args).",
    );
    process.exit(1);
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set in .env.local.");
    process.exit(1);
  }

  const db = drizzle(neon(url), { schema });

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`User ${email} already exists — leaving it unchanged.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(schema.users).values({ email, passwordHash, name });
    console.log(`Created user ${email} (is_admin = false).`);
  }

  console.log(
    "\nAdmin access is granted ONLY via the database. Run this SQL to promote:",
  );
  console.log(`  UPDATE users SET is_admin = true WHERE email = '${email}';`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
