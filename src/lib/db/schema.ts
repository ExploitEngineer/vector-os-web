import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/** A single colored line in a project card's scrolling bootlog. */
export type BootLine = { text: string; color: string };

export const projectStatus = pgEnum("project_status", [
  "active",
  "coming-soon",
  "classified",
]);

export const blogCategory = pgEnum("blog_category", [
  "LINUX",
  "SECURITY",
  "TOOLS",
]);

const ts = (name?: string) =>
  name
    ? timestamp(name, { withTimezone: true, mode: "date" })
    : timestamp({ withTimezone: true, mode: "date" });

/**
 * Admin users. `isAdmin` is the ONLY gate to the dashboard and is deliberately
 * never written by any code path — promotion is a manual DB action (see
 * docs/ADMIN_SECURITY.md). The column defaults to false and is NOT NULL.
 */
export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: ts().notNull().defaultNow(),
});

/** Database-backed sessions; the (encrypted) id is what lives in the cookie. */
export const sessions = pgTable("sessions", {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: ts("expires_at").notNull(),
  createdAt: ts().notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid().defaultRandom().primaryKey(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  short: text().notNull().default(""),
  lang: text().notNull().default(""),
  stars: integer().notNull().default(0),
  status: projectStatus().notNull().default("active"),
  tags: text().array().notNull().default(sql`ARRAY[]::text[]`),
  scrollSpeed: text("scroll_speed").notNull().default("8s"),
  bootlog: jsonb().$type<BootLine[]>().notNull().default([]),
  url: text().notNull().default(""),
  githubUrl: text("github_url"),
  imageUrl: text("image_url"),
  featured: boolean().notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: ts().notNull().defaultNow(),
  updatedAt: ts()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const blogs = pgTable("blogs", {
  id: uuid().defaultRandom().primaryKey(),
  slug: text().notNull().unique(),
  title: text().notNull(),
  excerpt: text().notNull().default(""),
  content: text().notNull().default(""),
  category: blogCategory().notNull().default("TOOLS"),
  featuredImage: text("featured_image"),
  published: boolean().notNull().default(false),
  publishedAt: ts("published_at"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: ts().notNull().defaultNow(),
  updatedAt: ts()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const teamMembers = pgTable("team_members", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  handle: text().notNull(),
  role: text().notNull().default(""),
  focus: text().notNull().default(""),
  tags: text().array().notNull().default(sql`ARRAY[]::text[]`),
  avatar: text().notNull().default(""),
  github: text().notNull().default(""),
  linkedin: text(),
  twitter: text(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: ts().notNull().defaultNow(),
  updatedAt: ts()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
