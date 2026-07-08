import { config } from "dotenv";

// Load .env.local first (takes precedence), then fall back to .env.
config({ path: ".env.local" });
config();

import { neon } from "@neondatabase/serverless";
import { sql as dsql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { loadPosts } from "@/lib/content/posts";
import { PROJECTS } from "@/data/projects";
import { MEMBERS } from "@/data/team";
import * as schema from "@/lib/db/schema";

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

  // Upsert by slug so real Markdown bodies refresh existing placeholder rows.
  // Safe to re-run: the loader is the source of truth for content.
  const posts = loadPosts();
  await db
    .insert(schema.blogs)
    .values(
      posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        published: true,
        publishedAt: new Date(p.date),
        displayOrder: p.displayOrder,
      })),
    )
    .onConflictDoUpdate({
      target: schema.blogs.slug,
      set: {
        title: dsql`excluded.title`,
        excerpt: dsql`excluded.excerpt`,
        content: dsql`excluded.content`,
        category: dsql`excluded.category`,
        published: dsql`excluded.published`,
        publishedAt: dsql`excluded.published_at`,
        displayOrder: dsql`excluded.display_order`,
      },
    });
  console.log(`Upserted ${posts.length} posts.`);

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
