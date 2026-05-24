import type {
  blogs,
  projects,
  sessions,
  teamMembers,
  users,
} from "@/lib/db/schema";

export type { BootLine } from "@/lib/db/schema";

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

export type ProjectStatus = Project["status"];
export type PostCategory = Blog["category"];

/** The minimal authenticated-user shape exposed by the Data Access Layer. */
export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
};
