"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { type ActionState, bool, str, zodFieldErrors } from "@/lib/form";
import { requireAdmin } from "@/lib/services/admin";
import { slugify } from "@/lib/slug";
import { blogSchema } from "@/lib/validation/blogs";

function revalidateBlogs(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blogs");
  if (slug) revalidatePath(`/blogs/${slug}`);
  revalidatePath("/admin/blogs");
}

function readForm(formData: FormData) {
  return {
    slug: str(formData, "slug"),
    title: str(formData, "title"),
    excerpt: str(formData, "excerpt"),
    content: str(formData, "content"),
    category: str(formData, "category") || "TOOLS",
    featuredImage: str(formData, "featuredImage"),
    published: bool(formData, "published"),
    displayOrder: str(formData, "displayOrder") || "0",
  };
}

function validate(
  formData: FormData,
):
  | { ok: true; data: ReturnType<typeof blogSchema.parse>; slug: string }
  | { ok: false; state: ActionState } {
  const parsed = blogSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      state: { ok: false, fieldErrors: zodFieldErrors(parsed.error) },
    };
  }
  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.title);
  return { ok: true, data: parsed.data, slug };
}

export async function createBlog(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const result = validate(formData);
  if (!result.ok) return result.state;
  const { data, slug } = result;

  try {
    await db.insert(blogs).values({
      ...data,
      slug,
      featuredImage: data.featuredImage || null,
      publishedAt: data.published ? new Date() : null,
    });
  } catch {
    return {
      ok: false,
      error: "Could not create — is the slug already taken?",
    };
  }

  revalidateBlogs(slug);
  redirect("/admin/blogs");
}

export async function updateBlog(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const result = validate(formData);
  if (!result.ok) return result.state;
  const { data, slug } = result;

  // Preserve the original publish date; only stamp it the first time a post
  // goes live.
  const [existing] = await db
    .select({ publishedAt: blogs.publishedAt })
    .from(blogs)
    .where(eq(blogs.id, id))
    .limit(1);

  const publishedAt = data.published
    ? (existing?.publishedAt ?? new Date())
    : null;

  try {
    await db
      .update(blogs)
      .set({
        ...data,
        slug,
        featuredImage: data.featuredImage || null,
        publishedAt,
      })
      .where(eq(blogs.id, id));
  } catch {
    return { ok: false, error: "Could not save — is the slug already taken?" };
  }

  revalidateBlogs(slug);
  redirect("/admin/blogs");
}

export async function deleteBlog(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (id) {
    await db.delete(blogs).where(eq(blogs.id, id));
    revalidateBlogs();
  }
}
