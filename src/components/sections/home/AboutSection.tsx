"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GITHUB_URL } from "@/data/navigation";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useScrambleText } from "@/hooks/useScramble";
import { useSequence } from "@/hooks/useSequence";
import type { GithubOrgStats } from "@/lib/services/github";
import { COLORS } from "@/lib/theme";

/** Shown when the GitHub API is unreachable so we never render zeros. */
const FALLBACK_STATS: GithubOrgStats = { repos: 8, members: 7, stars: 38 };

const statValue =
  "block px-7 font-display text-[72px] leading-none text-white transition-[color,text-shadow] duration-300 group-hover/stat:text-vos-cyan group-hover/stat:[text-shadow:0_0_30px_rgb(var(--glow-cyan)/0.3)] max-[900px]:px-5 max-[900px]:text-[52px] max-[480px]:px-4 max-[480px]:text-[40px]";
const statLabel =
  "block px-7 pt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 max-[900px]:px-5 max-[900px]:pt-1.5 max-[900px]:text-[9px] max-[480px]:px-4 max-[480px]:tracking-[0.15em]";
const statCell =
  "group/stat relative overflow-hidden border-r border-white/[0.06] py-10 transition-colors duration-[250ms] hover:bg-vos-cyan/[0.02] before:absolute before:inset-x-0 before:top-0 before:h-px before:origin-left before:scale-x-0 before:bg-vos-cyan before:transition-transform before:duration-[350ms] before:content-[''] hover:before:scale-x-100 [&:nth-child(4)]:border-r-0 max-[900px]:py-7 max-[900px]:[&:nth-child(2)]:border-r-0 max-[900px]:[&:nth-child(3)]:border-t max-[900px]:[&:nth-child(4)]:border-t max-[480px]:py-5";

function StatCounter({
  target,
  suffix = "",
  label,
  started,
  delay,
}: {
  target: number;
  suffix?: string;
  label: string;
  started: boolean;
  delay: number;
}) {
  const val = useCountUp(target, 1200, started, delay);
  return (
    <div className={statCell}>
      <span className={statValue}>
        {val}
        {suffix}
      </span>
      <span className={statLabel}>{label}</span>
    </div>
  );
}

function StatScramble({
  label,
  started,
  delay,
}: {
  label: string;
  started: boolean;
  delay: number;
}) {
  const val = useScrambleText("ACTIVE", started, {
    delay,
    frames: 18,
    interval: 50,
  });
  return (
    <div className={statCell}>
      <span
        className={`${statValue} text-[clamp(28px,4vw,60px)] tracking-[0.02em] max-[480px]:!text-[28px]`}
      >
        {val}
      </span>
      <span className={statLabel}>{label}</span>
    </div>
  );
}

export default function AboutSection({ stats }: { stats?: GithubOrgStats }) {
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const { ref: statsRef, inView: statsStarted } =
    useInView<HTMLDivElement>(0.3);
  const browseRef = useMagnetic<HTMLAnchorElement>({ strength: 0.3, max: 8 });

  const s = stats ?? FALLBACK_STATS;
  const termRows = [
    {
      key: "repos",
      val: String(s.repos).padStart(2, "0"),
      color: COLORS.white,
    },
    {
      key: "members",
      val: String(s.members).padStart(2, "0"),
      color: COLORS.white,
    },
    { key: "stars", val: String(s.stars), color: COLORS.white },
    { key: "domain", val: "VERIFIED", color: COLORS.cyan },
    { key: "status", val: "[ACTIVE]", color: COLORS.green },
  ];
  // The terminal "types" its rows out one at a time once the block reveals.
  const printed = useSequence(termRows.length, inView, 200, 450);

  return (
    <Section ref={ref} className="border-t border-white/[0.06]">
      <Container>
        <p
          className={`mb-16 flex items-center gap-4 font-mono text-[13px] uppercase tracking-[0.3em] text-white/35 opacity-0 after:h-px after:flex-1 after:bg-white/[0.07] after:content-[''] max-[900px]:mb-10 max-[900px]:text-[11px] max-[480px]:mb-7 max-[480px]:text-[10px] max-[480px]:tracking-[0.2em] ${inView ? "animate-[fade-up_0.7s_var(--ease-settle)_0.1s_forwards]" : ""}`}
        >
          <span className="tracking-normal text-vos-cyan/50">{"//"}</span>About
          Us
        </p>

        <div
          className={`mb-20 grid grid-cols-[1fr_360px] items-start gap-20 opacity-0 max-[900px]:mb-12 max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[480px]:mb-9 max-[480px]:gap-7 ${inView ? "animate-[fade-up_0.7s_var(--ease-settle)_0.25s_forwards]" : ""}`}
        >
          <div>
            <h2 className="mb-8 font-display text-[96px] uppercase leading-[0.9] tracking-[0.01em] text-white max-[900px]:mb-6 max-[900px]:text-[64px] max-[480px]:mb-5 max-[480px]:text-center max-[480px]:text-[44px]">
              WE BUILD WHAT
              <br />
              OTHERS{" "}
              <em className="not-italic text-vos-cyan [text-shadow:0_0_40px_rgb(var(--glow-cyan)/0.25)]">
                WON&apos;T.
              </em>
            </h2>
            <p className="mb-10 max-w-[420px] font-mono text-[13px] leading-[1.9] text-white/35 max-[900px]:mb-7 max-[900px]:max-w-full max-[900px]:text-[12px] max-[480px]:mb-6 max-[480px]:text-center max-[480px]:text-[11px] max-[480px]:leading-[1.8]">
              A collective of engineers and deep tools that actually matter. We
              do what we think. Low level system software built at the boundary
              of possibility.
            </p>
            <div className="flex flex-wrap items-center gap-4 max-[480px]:flex-col max-[480px]:items-center">
              <Link
                ref={browseRef}
                href="/projects"
                className="group/btn relative inline-flex h-12 translate-x-[var(--mx,0)] translate-y-[var(--my,0)] items-center gap-2.5 overflow-hidden rounded-sm border border-white bg-white px-7 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-vos-cyan active:scale-[0.98] max-[480px]:h-11 max-[480px]:w-full max-[480px]:justify-center max-[480px]:px-5 max-[480px]:text-[10px]"
              >
                <span className="absolute inset-0 -translate-x-[101%] bg-vos-cyan transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0" />
                <span className="relative z-[1]">BROWSE PROJECTS →</span>
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/35 transition-colors hover:text-vos-cyan max-[900px]:hidden"
              >
                github.com/Vector-OS ↗
              </a>
            </div>
          </div>

          {/* terminal — types its rows out on reveal */}
          <div className="overflow-hidden rounded-[10px] border border-white/[0.08] bg-vos-surface transition-[border-color,box-shadow] duration-300 hover:border-vos-cyan/25 hover:shadow-[0_0_50px_rgb(var(--glow-cyan)/0.05)] max-[900px]:max-w-[480px] max-[480px]:max-w-full">
            <div className="flex items-center gap-[7px] border-b border-white/[0.06] bg-vos-panel-2 px-4 py-3">
              <span className="h-3 w-3 flex-shrink-0 rounded-full bg-vos-dot-red" />
              <span className="h-3 w-3 flex-shrink-0 rounded-full bg-vos-dot-amber" />
              <span className="h-3 w-3 flex-shrink-0 rounded-full bg-vos-dot-green" />
              <span className="flex-1 text-center font-mono text-[11px] tracking-[0.08em] text-white/25">
                vector-os — terminal
              </span>
            </div>
            <div className="px-6 pb-5 pt-6 max-[480px]:px-4 max-[480px]:pb-3.5 max-[480px]:pt-4">
              {termRows.map((r, i) => (
                <div
                  key={r.key}
                  className={`flex items-center border-b border-white/[0.03] py-[5px] last-of-type:border-none ${i < printed ? "animate-[boot-line_0.3s_var(--ease-settle)_both]" : "opacity-0"}`}
                >
                  <span className="min-w-[90px] font-mono text-[12px] text-white/30 max-[480px]:min-w-[70px] max-[480px]:text-[11px]">
                    {r.key}
                  </span>
                  <span className="mx-3 font-mono text-[12px] text-white/10">
                    ···
                  </span>
                  <span
                    className="font-mono text-[13px] font-bold tracking-[0.05em] max-[480px]:text-[12px]"
                    style={{
                      color: r.color,
                      textShadow:
                        r.color !== COLORS.white
                          ? `0 0 12px ${r.color}66`
                          : "none",
                    }}
                  >
                    {r.val}
                  </span>
                </div>
              ))}
              <span className="mt-3 inline-block font-mono text-[14px] text-vos-green [text-shadow:0_0_8px_rgb(var(--glow-green)/0.5)] animate-[caret-blink_1.05s_step-end_infinite]">
                ▮
              </span>
            </div>
          </div>
        </div>

        {/* stats */}
        <div
          ref={statsRef}
          className={`grid grid-cols-4 border-t border-white/[0.06] opacity-0 max-[900px]:grid-cols-2 ${inView ? "animate-[fade-up_0.7s_var(--ease-settle)_0.4s_forwards]" : ""}`}
        >
          <StatCounter
            target={s.repos}
            label="Repositories"
            started={statsStarted}
            delay={0}
          />
          <StatCounter
            target={s.members}
            label="Members"
            started={statsStarted}
            delay={150}
          />
          <StatCounter
            target={s.stars}
            label="Stars"
            started={statsStarted}
            delay={300}
          />
          <StatScramble label="Status" started={statsStarted} delay={450} />
        </div>
      </Container>
    </Section>
  );
}
