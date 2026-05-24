"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { type ActionState, zodFieldErrors } from "@/lib/form";
import { requireAdmin } from "@/lib/services/admin";
import { createSession, deleteSession } from "@/lib/session";
import { changePasswordSchema, loginSchema } from "@/lib/validation/auth";

// A valid bcrypt hash compared against when the email is unknown, so login takes
// the same time whether or not the account exists (prevents user enumeration).
const DUMMY_HASH = bcrypt.hashSync("unused-placeholder-password", 10);

/**
 * Credential login. Creates a session for ANY valid user; admin authorization
 * is enforced separately by the /admin layout and every action. There is no
 * signup action by design — see docs/ADMIN_SECURITY.md.
 */
export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  // Always run a compare (against a dummy hash if the user is missing) so the
  // response time doesn't reveal whether the email exists.
  const valid = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_HASH,
  );
  if (!user || !valid) {
    return { ok: false, error: "Invalid email or password." };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}

/**
 * Change the signed-in admin's password. Verifies the current password, then
 * revokes every session for the account (logging out other devices) and issues
 * a fresh one for this browser.
 */
export async function changePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const current = await requireAdmin();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  }

  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, current.id))
    .limit(1);

  if (!row) {
    return { ok: false, error: "Account not found." };
  }

  const ok = await bcrypt.compare(
    parsed.data.currentPassword,
    row.passwordHash,
  );
  if (!ok) {
    return {
      ok: false,
      fieldErrors: { currentPassword: ["Current password is incorrect."] },
    };
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await db
    .update(users)
    .set({ passwordHash: newHash })
    .where(eq(users.id, current.id));

  // Revoke all sessions for this user, then re-issue one for the current browser.
  await db.delete(sessions).where(eq(sessions.userId, current.id));
  await createSession(current.id);

  return { ok: true };
}
