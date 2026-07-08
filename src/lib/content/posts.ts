import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

/**
 * Build-time loader for blog posts authored as Markdown under
 * `src/content/blog/*.md`. Each file carries YAML frontmatter plus the post
 * body. This is a plain Node module (no "server-only"): it reads the
 * filesystem and is consumed only by `scripts/seed.ts`, which upserts the
 * result into the DB. It is never imported into the client or Next bundle.
 */

const BLOG_DIR = join(process.cwd(), "src", "content", "blog");

export type BlogCategory = "LINUX" | "SECURITY" | "TOOLS";

export type LoadedPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  /** Human date from frontmatter, e.g. "May 2026". */
  date: string;
  displayOrder: number;
};

function requireString(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Blog "${file}" is missing frontmatter field "${field}".`);
  }
  return value;
}

/** Read and parse every `*.md` post, sorted by `displayOrder`. */
export function loadPosts(): LoadedPost[] {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file): LoadedPost => {
    const raw = readFileSync(join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);

    return {
      slug: requireString(data.slug, "slug", file),
      title: requireString(data.title, "title", file),
      excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
      content: content.trim(),
      category: requireString(data.category, "category", file) as BlogCategory,
      date: requireString(data.date, "date", file),
      displayOrder:
        typeof data.displayOrder === "number" ? data.displayOrder : 0,
    };
  });

  return posts.sort((a, b) => a.displayOrder - b.displayOrder);
}
