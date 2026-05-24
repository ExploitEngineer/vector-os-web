"use client";

import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { TeamMember } from "@/types";

/** Tags rendered with the cyan "special" accent in the team cards. */
const SPECIAL_TAGS = ["C", "KERNEL", "LINUX", "LOW-LEVEL"];

export default function TeamSection({ members }: { members: TeamMember[] }) {
  const { ref, inView } = useInView<HTMLElement>(0.1);

  return (
    <section
      ref={ref}
      className="w-full border-t border-white/[0.06] bg-vos-black px-12 py-[100px] max-[900px]:px-8 max-[900px]:py-20 max-[480px]:px-5 max-[480px]:py-[60px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <p
          className={`mb-16 flex items-center gap-4 font-mono text-[13px] uppercase tracking-[0.3em] text-white/35 opacity-0 after:h-px after:flex-1 after:bg-white/[0.07] after:content-[''] max-[900px]:mb-10 max-[900px]:text-[11px] max-[480px]:mb-7 max-[480px]:text-[10px] max-[480px]:tracking-[0.18em] ${
            inView
              ? "animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_0.1s_forwards]"
              : ""
          }`}
        >
          <span className="tracking-normal text-vos-cyan/50">{"//"}</span>The
          Team
        </p>

        <div className="grid grid-cols-2 gap-5 max-[900px]:gap-4 max-[480px]:grid-cols-1 max-[480px]:gap-4">
          {members.map((m, i) => {
            const index = String(i + 1).padStart(2, "0");
            const avatar = m.avatar || `https://github.com/${m.handle}.png`;
            const github = m.github || `https://github.com/${m.handle}`;
            return (
              <div
                key={m.id}
                className={`group relative cursor-default overflow-hidden rounded-lg border border-white/[0.07] bg-vos-surface opacity-0 transition-[border-color,box-shadow,transform] duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[3px] hover:border-vos-cyan/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_0_1px_rgba(0,229,255,0.08),0_0_50px_rgba(0,229,255,0.04)] ${
                  inView
                    ? "animate-[fade-up_0.65s_cubic-bezier(0.22,1,0.36,1)_forwards]"
                    : ""
                }`}
                style={{ animationDelay: `${0.15 + i * 0.15}s` }}
              >
                {/* top accent bar */}
                <span className="absolute inset-x-0 top-0 z-[3] h-0.5 bg-gradient-to-r from-transparent via-vos-cyan to-transparent opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100" />

                {/* avatar */}
                <div className="relative h-[260px] overflow-hidden bg-[#050505] max-[900px]:h-[200px] max-[480px]:h-[240px]">
                  <Image
                    src={avatar}
                    alt={m.name}
                    fill
                    sizes="(max-width: 480px) 100vw, 600px"
                    className="object-cover object-top grayscale-[30%] transition-[filter,transform] duration-[400ms] group-hover:scale-[1.03] group-hover:brightness-105 group-hover:grayscale-0"
                  />
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)]" />
                  <div className="absolute left-4 top-4 z-[2] rounded-[3px] border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-white/40 backdrop-blur-md">
                    {`// ${index}`}
                  </div>
                  <div className="absolute right-4 top-4 z-[2] flex items-center gap-1.5 rounded-[3px] border border-vos-green/20 bg-black/[0.65] px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-vos-green backdrop-blur-md">
                    <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-vos-green shadow-[0_0_5px_rgba(34,255,110,0.8)] animate-[pulse-soft_2s_ease-in-out_infinite]" />
                    ACTIVE
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-[2] h-20 bg-gradient-to-b from-transparent to-vos-surface" />
                </div>

                {/* body */}
                <div className="px-7 pb-7 pt-6 max-[900px]:px-5 max-[900px]:pb-[22px] max-[900px]:pt-[18px] max-[480px]:px-5 max-[480px]:pb-6 max-[480px]:pt-5">
                  <p className="mb-2 flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-vos-cyan/60 max-[900px]:text-[10px] max-[900px]:tracking-[0.12em]">
                    <span className="text-vos-cyan/30">@</span>
                    {m.handle}
                  </p>
                  <h3 className="mb-2.5 font-display text-[42px] uppercase leading-[0.95] tracking-[0.01em] text-white max-[900px]:text-[28px] max-[480px]:text-[36px]">
                    {m.name}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/35 max-[900px]:text-[10px] max-[480px]:text-[10px]">
                    {m.role}
                  </p>

                  <div className="my-5 h-px w-full bg-white/[0.06] max-[900px]:my-3.5 max-[480px]:my-4" />

                  <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-vos-cyan/40">
                    {"// Focus"}
                  </p>
                  <p className="mb-5 font-mono text-[11px] leading-[1.7] text-white/25 max-[900px]:text-[10px] max-[480px]:text-[11px]">
                    {m.focus}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        className={`rounded-[3px] border px-2.5 py-[3px] font-mono text-[9px] uppercase tracking-[0.1em] max-[900px]:px-[7px] max-[900px]:text-[8px] ${
                          SPECIAL_TAGS.includes(t)
                            ? "border-white/[0.14] bg-white/[0.04] text-white/70"
                            : "border-vos-cyan/[0.12] bg-vos-cyan/[0.04] text-vos-cyan/60"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/gh flex w-full items-center gap-2 border-t border-white/[0.06] pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30 transition-[color,letter-spacing] hover:tracking-[0.18em] hover:text-vos-cyan max-[900px]:text-[9px]"
                  >
                    github.com/{m.handle}
                    <span className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/gh:translate-x-[3px] group-hover/gh:-translate-y-[3px]">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
