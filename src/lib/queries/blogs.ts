import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";

/** Admin: every post, drafts included. */
export async function getAllBlogs() {
  return db
    .select()
    .from(blogs)
    .orderBy(asc(blogs.displayOrder), desc(blogs.publishedAt));
}

/** Public: published posts only, newest first. */
export async function getPublishedBlogs() {
  return db
    .select()
    .from(blogs)
    .where(eq(blogs.published, true))
    .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt));
}

export async function getBlogById(id: string) {
  const [row] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  return row ?? null;
}

/** Public detail: matches a slug only when the post is published. */
export async function getPublishedBlogBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.slug, slug), eq(blogs.published, true)))
    .limit(1);
  return row ?? null;
}
