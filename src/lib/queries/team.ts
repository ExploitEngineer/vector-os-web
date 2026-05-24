import "server-only";

import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

export async function getAllTeam() {
  return db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.createdAt));
}

export async function getTeamMemberById(id: string) {
  const [row] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1);
  return row ?? null;
}
