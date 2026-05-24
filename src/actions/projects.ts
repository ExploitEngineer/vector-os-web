"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import {
  type ActionState,
  bool,
  bootlog,
  str,
  tags,
  zodFieldErrors,
} from "@/lib/form";
import { requireAdmin } from "@/lib/services/admin";
import { slugify } from "@/lib/slug";
import { projectSchema } from "@/lib/validation/projects";

function revalidateProjects() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

function readForm(formData: FormData) {
  return {
    slug: str(formData, "slug"),
    name: str(formData, "name"),
    short: str(formData, "short"),
    lang: str(formData, "lang"),
    stars: str(formData, "stars") || "0",
    status: str(formData, "status") || "active",
    tags: tags(formData, "tags"),
    scrollSpeed: str(formData, "scrollSpeed") || "8s",
    url: str(formData, "url"),
    githubUrl: str(formData, "githubUrl"),
    imageUrl: str(formData, "imageUrl"),
    featured: bool(formData, "featured"),
    displayOrder: str(formData, "displayOrder") || "0",
  };
}

function validate(
  formData: FormData,
):
  | { ok: true; data: ReturnType<typeof projectSchema.parse>; slug: string }
  | { ok: false; state: ActionState } {
  const bl = bootlog(formData, "bootlog");
  if (bl === null) {
    return {
      ok: false,
      state: {
        ok: false,
        fieldErrors: {
          bootlog: ["Invalid JSON — expected an array of { text, color }."],
        },
      },
    };
  }

  const parsed = projectSchema.safeParse({
    ...readForm(formData),
    bootlog: bl,
  });
  if (!parsed.success) {
    return {
      ok: false,
      state: { ok: false, fieldErrors: zodFieldErrors(parsed.error) },
    };
  }

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.name);
  return { ok: true, data: parsed.data, slug };
}

export async function createProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const result = validate(formData);
  if (!result.ok) return result.state;
  const { data, slug } = result;

  try {
    await db.insert(projects).values({
      ...data,
      slug,
      githubUrl: data.githubUrl || null,
      imageUrl: data.imageUrl || null,
    });
  } catch {
    return {
      ok: false,
      error: "Could not create — is the slug already taken?",
    };
  }

  revalidateProjects();
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const result = validate(formData);
  if (!result.ok) return result.state;
  const { data, slug } = result;

  try {
    await db
      .update(projects)
      .set({
        ...data,
        slug,
        githubUrl: data.githubUrl || null,
        imageUrl: data.imageUrl || null,
      })
      .where(eq(projects.id, id));
  } catch {
    return { ok: false, error: "Could not save — is the slug already taken?" };
  }

  revalidateProjects();
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (id) {
    await db.delete(projects).where(eq(projects.id, id));
    revalidateProjects();
  }
}
