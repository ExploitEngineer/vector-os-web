"use client";

import Link from "next/link";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { useInView } from "@/hooks/useInView";
import { CAT_COLORS } from "@/lib/theme";
import type { Blog } from "@/types";

const POST_FILTERS = ["ALL", "LINUX", "SECURITY", "TOOLS"] as const;
const POSTS_PAGE_SIZE = 6;

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function filterButtonClass(active: boolean, filter: string) {
  const base =
    "rounded-[3px] border px-3 py-[5px] font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 max-[480px]:flex-1 max-[480px]:px-[11px] max-[480px]:text-[9px]";
  if (!active)
    return `${base} border-white/[0.08] bg-transparent text-white/35 hover:border-white/20 hover:bg-white/[0.04] hover:text-white/80`;
  if (filter === "LINUX")
    return `${base} border-vos-green bg-vos-green text-black shadow-[0_0_14px_rgb(var(--glow-green)/0.3)]`;
  if (filter === "SECURITY")
    return `${base} border-vos-red bg-vos-red text-white shadow-[0_0_14px_rgb(255_45_85_/_0.3)]`;
  return `${base} border-vos-cyan bg-vos-cyan text-black shadow-[0_0_14px_rgb(var(--glow-cyan)/0.3)]`;
}

export default function BlogGrid({ posts }: { posts: Blog[] }) {
  const { ref, inView: gridVisible } = useInView<HTMLDivElement>(0.05);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = posts.filter((p) => {
    const catMatch = activeFilter === "ALL" || p.category === activeFilter;
    const q = search.trim().toLowerCase();
    const searchMatch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return catMatch && searchMatch;
  });

  const visiblePosts = showAll ? filtered : filtered.slice(0, POSTS_PAGE_SIZE);
  const hasMore = filtered.length > POSTS_PAGE_SIZE && !showAll;

  return (
    <Section as="div">
      <div ref={ref} className="mx-auto w-full max-w-[1200px]">
        {/* controls */}
        <div
          className={`mb-4 flex flex-wrap items-center justify-between gap-3 opacity-0 max-[480px]:flex-col max-[480px]:items-stretch max-[480px]:gap-2.5 ${gridVisible ? "animate-[fade-up_0.7s_var(--ease-settle)_0.1s_forwards]" : ""}`}
        >
          <div className="flex h-9 min-w-[140px] flex-1 items-center gap-2 rounded border border-white/[0.08] bg-vos-surface px-3 transition-colors focus-within:border-vos-cyan/30 max-[480px]:w-full">
            <span className="flex-shrink-0 text-[12px] text-white/25">⌕</span>
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowAll(false);
              }}
              className="w-full bg-transparent font-mono text-[11px] tracking-[0.06em] text-white/70 caret-vos-cyan outline-none placeholder:text-white/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-[11px] text-white/25 hover:text-white/70"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/20 max-[480px]:hidden">
              Filter:
            </span>
            {POST_FILTERS.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  setShowAll(false);
                }}
                className={filterButtonClass(activeFilter === f, f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <span
            key={`${filtered.length}-${activeFilter}-${search}`}
            className="font-mono text-[10px] tracking-[0.15em] text-white/20 animate-[flicker-in_0.42s_steps(6,end)_both]"
          >
            {filtered.length === 0
              ? "// No results"
              : `// Showing ${visiblePosts.length} of ${filtered.length} post${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>
        <div className="mb-8 h-px bg-white/[0.06]" />

        {/* grid — switches channel (CRT flicker) when the category changes */}
        <div
          key={activeFilter}
          className="grid grid-cols-3 gap-4 animate-[flicker-in_0.4s_steps(5,end)_both] max-[900px]:grid-cols-2 max-[900px]:gap-3.5 max-[480px]:grid-cols-1 max-[480px]:gap-3"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full py-[60px] text-center font-mono text-[12px] uppercase tracking-[0.2em] text-white/20">
              {"// No posts match your search"}
            </div>
          ) : (
            visiblePosts.map((post, i) => {
              const catColor = CAT_COLORS[post.category] || "#00e5ff";
              return (
                <Link
                  href={`/blogs/${post.slug}`}
                  key={post.id}
                  className="group relative flex flex-col gap-3.5 overflow-hidden rounded-md border border-white/[0.07] bg-vos-surface p-6 no-underline transition-[border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-[card-in_0.5s_var(--ease-settle)_both] hover:-translate-y-1 hover:border-vos-cyan/[0.28] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_40px_rgb(var(--glow-cyan)/0.05)] max-[480px]:p-[18px]"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <span className="absolute inset-x-0 top-0 z-[2] h-0.5 bg-gradient-to-r from-transparent via-vos-cyan to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex items-center justify-between">
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
                    <span className="font-mono text-[10px] tracking-[0.1em] text-white/[0.12]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="font-display text-[20px] uppercase leading-[1.05] tracking-[0.01em] text-white transition-colors duration-[250ms] group-hover:text-vos-cyan max-[480px]:text-[18px]">
                    {post.title}
                  </h2>
                  <p className="flex-1 font-mono text-[10px] leading-[1.75] text-white/30">
                    {post.excerpt}
                  </p>
                  <div className="mt-1 flex items-center justify-between border-t border-white/[0.05] pt-3.5">
                    <span className="font-mono text-[10px] tracking-[0.06em] text-white/25">
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-vos-cyan/60 opacity-70 transition-[letter-spacing,opacity] duration-[250ms] group-hover:tracking-[0.2em] group-hover:opacity-100">
                      READ MORE{" "}
                      <span className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {hasMore && (
          <div className="mt-12 flex flex-col items-center gap-3 max-[480px]:mt-8">
            <span className="font-mono text-[10px] tracking-[0.15em] text-white/20">
              {filtered.length - POSTS_PAGE_SIZE} more post
              {filtered.length - POSTS_PAGE_SIZE !== 1 ? "s" : ""} available
            </span>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-[3px] border border-white/[0.12] px-9 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 transition-[color,border-color,transform] duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-vos-cyan hover:text-black max-[480px]:h-[46px] max-[480px]:w-full max-[480px]:justify-center max-[480px]:px-5"
            >
              <span className="absolute inset-0 -translate-x-[101%] bg-vos-cyan transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
              <span className="relative z-[1]">LOAD MORE POSTS ↓</span>
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
