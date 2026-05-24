import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

const ordered = [asc(projects.displayOrder), desc(projects.createdAt)] as const;

export async function getAllProjects() {
  return db
    .select()
    .from(projects)
    .orderBy(...ordered);
}

export async function getFeaturedProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(...ordered);
}

export async function getProjectById(id: string) {
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return row ?? null;
}

export async function getProjectBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  return row ?? null;
}
