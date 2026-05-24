"use client";

import { LANG_COLORS, STATUS_CFG } from "@/lib/theme";
import type { Project } from "@/types";

export default function ProjectCard({
  project: p,
  index,
  visible,
}: {
  project: Project;
  index: number;
  visible: boolean;
}) {
  const st = STATUS_CFG[p.status];
  const isLocked = p.status === "classified";
  const isInDev = p.status === "coming-soon";
  const langDot = LANG_COLORS[p.lang] || "rgba(255,255,255,0.3)";

  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative z-[1] flex flex-col overflow-hidden rounded-md border border-white/[0.07] bg-vos-surface no-underline opacity-0 transition-[border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-[2] hover:-translate-y-1 hover:border-vos-cyan/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,229,255,0.1),0_0_40px_rgba(0,229,255,0.05)] ${
        visible
          ? "animate-[fade-up_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          : ""
      }`}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <span className="absolute inset-x-0 top-0 z-[2] h-0.5 bg-gradient-to-r from-transparent via-vos-cyan to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* terminal chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.05] bg-[#050505] px-3.5 py-2.5">
        <span className="flex-shrink-0 font-mono text-[10px] text-vos-green">
          &gt;_
        </span>
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[10px] text-white/[0.15]">
          {p.slug}.sh
        </span>
        <span
          className="flex flex-shrink-0 items-center gap-[5px] font-mono text-[9px] tracking-[0.1em]"
          style={{ color: st.color }}
        >
          <span
            className="h-[5px] w-[5px] flex-shrink-0 rounded-full"
            style={{ background: st.color, boxShadow: `0 0 5px ${st.color}` }}
          />
          {st.label}
        </span>
      </div>

      {/* scrolling bootlog */}
      <div className="relative h-40 overflow-hidden bg-[#030303]">
        <div
          className="flex flex-col px-4 py-3 group-hover:[animation:scroll-logs_var(--speed)_linear_infinite]"
          style={{ ["--speed" as string]: p.scrollSpeed }}
        >
          {p.bootlog.map((line, i) => (
            <span
              key={i}
              className="min-h-[1em] whitespace-nowrap font-mono text-[10px] leading-[1.85]"
              style={{ color: line.color }}
            >
              {line.text || " "}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#030303]" />
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2.5 border-t border-white/[0.05] p-4">
        <span className="font-display text-[18px] uppercase leading-none tracking-[0.02em] text-white transition-colors duration-[250ms] group-hover:text-vos-cyan">
          {p.name}
        </span>
        <p className="font-mono text-[10px] leading-[1.7] text-white/30">
          {p.short}
        </p>
        <div className="mt-auto flex flex-wrap gap-[5px] pt-1">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-[3px] border border-vos-cyan/[0.12] bg-vos-cyan/[0.04] px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.1em] text-vos-cyan/70"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-between border-t border-white/[0.05] pt-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-[5px] font-mono text-[9px] text-white/30">
              <span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ background: langDot }}
              />
              {p.lang}
            </span>
            {p.stars > 0 && (
              <span className="font-mono text-[10px] text-white/25">
                ★ {p.stars}
              </span>
            )}
          </div>
          <span
            className={`font-mono text-[10px] tracking-[0.12em] opacity-70 transition-[letter-spacing,opacity] duration-[250ms] group-hover:tracking-[0.2em] group-hover:opacity-100 ${
              isLocked
                ? "text-vos-red"
                : isInDev
                  ? "text-vos-cyan"
                  : "text-vos-green"
            }`}
          >
            {isLocked
              ? "[ CLASSIFIED ]"
              : isInDev
                ? "IN DEVELOPMENT →"
                : "VIEW REPO →"}
          </span>
        </div>
      </div>
    </a>
  );
}
