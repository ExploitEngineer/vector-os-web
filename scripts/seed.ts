import { config } from "dotenv";

// Load .env.local first (takes precedence), then fall back to .env.
config({ path: ".env.local" });
config();

import { neon } from "@neondatabase/serverless";
import { sql as dsql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { POSTS } from "@/data/posts";
import { PROJECTS } from "@/data/projects";
import { MEMBERS } from "@/data/team";
import * as schema from "@/lib/db/schema";
import { slugify } from "@/lib/slug";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set in .env.local.");
    process.exit(1);
  }

  const db = drizzle(neon(url), { schema });
  const countAll = dsql<number>`count(*)::int`;

  const [{ c: projectCount }] = await db
    .select({ c: countAll })
    .from(schema.projects);
  if (projectCount === 0) {
    await db.insert(schema.projects).values(
      PROJECTS.map((p, i) => ({
        slug: p.slug,
        name: p.name,
        short: p.short,
        lang: p.lang,
        stars: p.stars,
        status: p.status,
        tags: p.tags,
        scrollSpeed: p.scrollSpeed,
        bootlog: p.bootlog,
        url: p.url,
        featured: i < 3,
        displayOrder: i,
      })),
    );
    console.log(`Seeded ${PROJECTS.length} projects.`);
  } else {
    console.log("Projects already present — skipping.");
  }

  const [{ c: blogCount }] = await db
    .select({ c: countAll })
    .from(schema.blogs);
  if (blogCount === 0) {
    await db.insert(schema.blogs).values(
      POSTS.map((p, i) => ({
        slug: slugify(p.title),
        title: p.title,
        excerpt: p.excerpt,
        content: `${p.excerpt}\n\n_Full write-up coming soon._`,
        category: p.category,
        published: true,
        publishedAt: new Date(p.date),
        displayOrder: i,
      })),
    );
    console.log(`Seeded ${POSTS.length} posts.`);
  } else {
    console.log("Blogs already present — skipping.");
  }

  const [{ c: teamCount }] = await db
    .select({ c: countAll })
    .from(schema.teamMembers);
  if (teamCount === 0) {
    await db.insert(schema.teamMembers).values(
      MEMBERS.map((m, i) => ({
        name: m.name,
        handle: m.handle,
        role: m.role,
        focus: m.focus,
        tags: m.tags,
        avatar: m.avatar,
        github: m.github,
        displayOrder: i,
      })),
    );
    console.log(`Seeded ${MEMBERS.length} team members.`);
  } else {
    console.log("Team already present — skipping.");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
