import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { decrypt, getSessionToken } from "@/lib/session";
import type { CurrentUser } from "@/types";

/**
 * The Data Access Layer entry point. Reads the cookie, validates the session
 * against the database, and returns a minimal user DTO (never the password
 * hash). Memoized per-request via React `cache`.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const payload = await decrypt(await getSessionToken());
  if (!payload?.sessionId) return null;

  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      isAdmin: users.isAdmin,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, payload.sessionId))
    .limit(1);

  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    isAdmin: row.isAdmin,
  };
});

/**
 * For pages/layouts: redirect to the login page when the visitor is not an
 * authenticated admin. (UI gate only — actions must guard themselves too.)
 */
export async function requireAdminPage(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect("/admin/login");
  return user;
}

/**
 * For Server Actions and Route Handlers: throw when the caller is not an
 * authenticated admin. Server Actions are independent POST entry points, so a
 * page-level guard does NOT protect them — every mutation calls this first.
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user?.isAdmin) throw new Error("Unauthorized");
  return user;
}
