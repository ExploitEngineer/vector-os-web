"use client";

import { useEffect, useRef, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import { useInView } from "@/hooks/useInView";
import { LANG_COLORS } from "@/lib/theme";
import type { Project } from "@/types";
import ProjectCard from "./ProjectCard";

const TYPE_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "active", label: "Active" },
  { value: "coming-soon", label: "In Development" },
  { value: "classified", label: "Classified" },
];
const SORT_OPTIONS = [
  { value: "DEFAULT", label: "Default" },
  { value: "STARS", label: "Most Stars" },
  { value: "AZ", label: "Name (A → Z)" },
  { value: "ZA", label: "Name (Z → A)" },
];
const langOptions = (langs: string[]) => [
  { value: "ALL", label: "All Languages" },
  ...langs.map((l) => ({ value: l, label: l })),
];

export default function ProjectGrid({
  projects,
  columns = 3,
  showFilters = true,
  pageSize = 6,
  showLoadMore = true,
}: {
  projects: Project[];
  columns?: number;
  showFilters?: boolean;
  pageSize?: number;
  showLoadMore?: boolean;
}) {
  const { ref: outerRef, inView: visible } = useInView<HTMLElement>(0.05);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [langFilter, setLangFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT");
  const [openDD, setOpenDD] = useState<string | null>(null);
  const [cols, setCols] = useState(columns);
  const [showAll, setShowAll] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // close any open dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node))
        setOpenDD(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // collapse columns to 2 / 1 as the section narrows
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w <= 480) setCols(1);
      else if (w <= 900) setCols(Math.min(2, columns));
      else setCols(columns);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [columns, outerRef]);

  // reset pagination whenever the active filters change
  // biome-ignore lint/correctness/useExhaustiveDependencies: filters are the triggers; effect only resets state
  useEffect(() => {
    setShowAll(false);
  }, [search, typeFilter, langFilter, sortBy]);

  const allLangs = Array.from(new Set(projects.map((p) => p.lang)));

  const filtered = projects.filter((p) => {
    const q = search.trim().toLowerCase();
    const searchMatch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.short.toLowerCase().includes(q) ||
      p.lang.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return (
      searchMatch &&
      (typeFilter === "ALL" || p.status === typeFilter) &&
      (langFilter === "ALL" || p.lang === langFilter)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "STARS") return b.stars - a.stars;
    if (sortBy === "AZ") return a.name.localeCompare(b.name);
    if (sortBy === "ZA") return b.name.localeCompare(a.name);
    return 0;
  });

  const effectivePageSize =
    !showLoadMore || pageSize <= 0 ? Infinity : pageSize;
  const visibleProjects = showAll ? sorted : sorted.slice(0, effectivePageSize);
  const hasMore = showLoadMore && sorted.length > effectivePageSize && !showAll;

  const toggle = (dd: string) => setOpenDD((v) => (v === dd ? null : dd));

  const reveal = (delay: string) =>
    visible
      ? `animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_${delay}_forwards]`
      : "";

  return (
    <section
      ref={outerRef}
      className="w-full border-t border-white/[0.06] bg-vos-black px-12 py-[100px] max-[900px]:px-8 max-[900px]:py-20 max-[480px]:px-5 max-[480px]:py-[60px]"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <p
          className={`mb-10 flex items-center gap-4 font-mono text-[13px] uppercase tracking-[0.3em] text-white/35 opacity-0 after:h-px after:flex-1 after:bg-white/[0.07] after:content-[''] max-[900px]:mb-8 max-[900px]:text-[11px] max-[480px]:mb-6 max-[480px]:text-[10px] max-[480px]:tracking-[0.2em] ${reveal("0.1s")}`}
        >
          <span className="tracking-normal text-vos-cyan/50">{"//"}</span>Our
          Work
        </p>

        {showFilters && (
          <>
            <div
              ref={barRef}
              className={`relative z-50 mb-8 flex flex-wrap items-center gap-2 opacity-0 max-[900px]:gap-1.5 ${reveal("0.15s")}`}
            >
              <div className="flex h-[34px] min-w-[140px] flex-1 items-center gap-2 rounded-md border border-white/[0.12] bg-[#0d0d0d] px-3 transition-[border-color,box-shadow] focus-within:border-vos-cyan/40 focus-within:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] max-[480px]:w-full max-[480px]:flex-none">
                <span className="flex-shrink-0 text-[13px] text-white/30">
                  ⌕
                </span>
                <input
                  type="text"
                  placeholder="Find a project..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent font-mono text-[11px] tracking-[0.04em] text-white/75 caret-vos-cyan outline-none placeholder:text-white/20"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-[11px] text-white/20 transition-colors hover:text-white/70"
                  >
                    ✕
                  </button>
                )}
              </div>
              <Dropdown
                label="Type"
                value={typeFilter}
                options={TYPE_OPTIONS}
                onSelect={(v) => {
                  setTypeFilter(v);
                  setOpenDD(null);
                }}
                open={openDD === "type"}
                onToggle={() => toggle("type")}
              />
              <Dropdown
                label="Language"
                value={langFilter}
                options={langOptions(allLangs)}
                dotColors={LANG_COLORS}
                onSelect={(v) => {
                  setLangFilter(v);
                  setOpenDD(null);
                }}
                open={openDD === "lang"}
                onToggle={() => toggle("lang")}
              />
              <Dropdown
                label="Sort"
                value={sortBy}
                options={SORT_OPTIONS}
                onSelect={(v) => {
                  setSortBy(v);
                  setOpenDD(null);
                }}
                open={openDD === "sort"}
                onToggle={() => toggle("sort")}
              />
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] tracking-[0.14em] text-white/20">
                {sorted.length === 0
                  ? "// No results"
                  : `// ${sorted.length} of ${projects.length} projects`}
              </span>
              <div className="flex flex-wrap items-center gap-1.5 max-[480px]:hidden">
                {typeFilter !== "ALL" && (
                  <button
                    type="button"
                    onClick={() => setTypeFilter("ALL")}
                    className="inline-flex items-center gap-[5px] rounded-full border border-white/[0.08] bg-white/[0.04] px-[9px] py-[3px] font-mono text-[9px] tracking-[0.08em] text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    {TYPE_OPTIONS.find((o) => o.value === typeFilter)?.label} ✕
                  </button>
                )}
                {langFilter !== "ALL" && (
                  <button
                    type="button"
                    onClick={() => setLangFilter("ALL")}
                    className="inline-flex items-center gap-[5px] rounded-full border border-white/[0.08] bg-white/[0.04] px-[9px] py-[3px] font-mono text-[9px] tracking-[0.08em] text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    {langFilter} ✕
                  </button>
                )}
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-[5px] rounded-full border border-white/[0.08] bg-white/[0.04] px-[9px] py-[3px] font-mono text-[9px] tracking-[0.08em] text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    &quot;{search}&quot; ✕
                  </button>
                )}
              </div>
            </div>
            <div className="mb-7 h-px bg-white/[0.06]" />
          </>
        )}

        {/* grid */}
        <div
          className="relative z-[1] grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {sorted.length === 0 ? (
            <div className="col-span-full py-[60px] text-center font-mono text-[12px] tracking-[0.2em] text-white/20">
              {"// No projects match your filters"}
            </div>
          ) : (
            visibleProjects.map((p, idx) => (
              <ProjectCard
                key={p.slug}
                project={p}
                index={idx}
                visible={visible}
              />
            ))
          )}
        </div>

        {hasMore && (
          <div className="mt-12 flex flex-col items-center gap-3 max-[480px]:mt-8">
            <span className="font-mono text-[10px] tracking-[0.15em] text-white/20">
              {sorted.length - effectivePageSize} more project
              {sorted.length - effectivePageSize !== 1 ? "s" : ""} available
            </span>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-[3px] border border-white/[0.12] px-9 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 transition-[color,border-color,transform] duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-vos-cyan hover:text-black max-[900px]:px-7 max-[900px]:text-[10px] max-[480px]:h-[46px] max-[480px]:w-full max-[480px]:justify-center max-[480px]:px-5"
            >
              <span className="absolute inset-0 -translate-x-[101%] bg-vos-cyan transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
              <span className="relative z-[1]">LOAD MORE PROJECTS ↓</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
