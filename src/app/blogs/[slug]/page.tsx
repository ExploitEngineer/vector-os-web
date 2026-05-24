import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/ui/Markdown";
import { getPublishedBlogBySlug, getPublishedBlogs } from "@/lib/queries/blogs";
import { CAT_COLORS } from "@/lib/theme";

export async function generateStaticParams() {
  const posts = await getPublishedBlogs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) notFound();

  const catColor = CAT_COLORS[post.category] || "#00e5ff";

  return (
    <article className="w-full bg-vos-black px-12 py-[120px] max-[900px]:px-8 max-[900px]:py-24 max-[480px]:px-5 max-[480px]:py-20">
      <div className="mx-auto w-full" style={{ maxWidth: 760 }}>
        <Link
          href="/blogs"
          className="mb-8 inline-block font-mono text-[11px] tracking-[0.1em] text-white/40 transition-colors hover:text-vos-cyan"
        >
          ← All posts
        </Link>

        <div className="mb-4 flex items-center gap-3">
          <span
            className="rounded-[3px] px-[9px] py-[3px] font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{
              color: catColor,
              background: `${catColor}12`,
              border: `1px solid ${catColor}30`,
            }}
          >
            {post.category}
          </span>
          <span className="font-mono text-[11px] tracking-[0.06em] text-white/30">
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <h1 className="font-display text-[52px] uppercase leading-[0.95] tracking-[0.01em] text-white max-[900px]:text-[40px] max-[480px]:text-[32px]">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-5 font-mono text-[13px] leading-[1.8] text-white/40">
            {post.excerpt}
          </p>
        ) : null}

        {post.featuredImage ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg border border-white/[0.08] bg-[#050505]">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="760px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-8 border-t border-white/[0.06] pt-8">
          <Markdown>{post.content}</Markdown>
        </div>
      </div>
    </article>
  );
}
