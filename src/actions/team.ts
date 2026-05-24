"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { type ActionState, str, tags, zodFieldErrors } from "@/lib/form";
import { requireAdmin } from "@/lib/services/admin";
import { teamMemberSchema } from "@/lib/validation/team";

function revalidateTeam() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/team");
}

function readForm(formData: FormData) {
  return {
    name: str(formData, "name"),
    handle: str(formData, "handle"),
    role: str(formData, "role"),
    focus: str(formData, "focus"),
    tags: tags(formData, "tags"),
    avatar: str(formData, "avatar"),
    github: str(formData, "github"),
    linkedin: str(formData, "linkedin"),
    twitter: str(formData, "twitter"),
    displayOrder: str(formData, "displayOrder") || "0",
  };
}

function validate(
  formData: FormData,
):
  | { ok: true; data: ReturnType<typeof teamMemberSchema.parse> }
  | { ok: false; state: ActionState } {
  const parsed = teamMemberSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      state: { ok: false, fieldErrors: zodFieldErrors(parsed.error) },
    };
  }
  return { ok: true, data: parsed.data };
}

function nullify(data: ReturnType<typeof teamMemberSchema.parse>) {
  return {
    ...data,
    linkedin: data.linkedin || null,
    twitter: data.twitter || null,
  };
}

export async function createTeamMember(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const result = validate(formData);
  if (!result.ok) return result.state;

  try {
    await db.insert(teamMembers).values(nullify(result.data));
  } catch {
    return { ok: false, error: "Could not create team member." };
  }

  revalidateTeam();
  redirect("/admin/team");
}

export async function updateTeamMember(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const result = validate(formData);
  if (!result.ok) return result.state;

  try {
    await db
      .update(teamMembers)
      .set(nullify(result.data))
      .where(eq(teamMembers.id, id));
  } catch {
    return { ok: false, error: "Could not save team member." };
  }

  revalidateTeam();
  redirect("/admin/team");
}

export async function deleteTeamMember(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (id) {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    revalidateTeam();
  }
}
