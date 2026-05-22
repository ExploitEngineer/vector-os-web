"use client";

import Link from "next/link";
import { GITHUB_URL } from "@/data/navigation";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { useScrambleText } from "@/hooks/useScramble";
import { COLORS } from "@/lib/theme";

const statValue =
  "block px-7 font-display text-[72px] leading-none text-white transition-[color,text-shadow] duration-300 group-hover/stat:text-vos-cyan group-hover/stat:[text-shadow:0_0_30px_rgba(0,229,255,0.3)] max-[900px]:px-5 max-[900px]:text-[52px] max-[480px]:px-4 max-[480px]:text-[40px]";
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

const TERM_ROWS = [
  { key: "repos", val: "08", color: COLORS.white },
  { key: "members", val: "07", color: COLORS.white },
  { key: "stars", val: "38+", color: COLORS.white },
  { key: "domain", val: "VERIFIED", color: COLORS.cyan },
  { key: "status", val: "[ACTIVE]", color: COLORS.green },
];

export default function AboutSection() {
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const { ref: statsRef, inView: statsStarted } =
    useInView<HTMLDivElement>(0.3);

  return (
    <section
      ref={ref}
      className="w-full border-t border-white/[0.06] bg-vos-black px-12 py-[100px] max-[900px]:px-8 max-[900px]:py-20 max-[480px]:px-5 max-[480px]:py-[60px]"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <p
          className={`mb-16 flex items-center gap-4 font-mono text-[13px] uppercase tracking-[0.3em] text-white/35 opacity-0 after:h-px after:flex-1 after:bg-white/[0.07] after:content-[''] max-[900px]:mb-10 max-[900px]:text-[11px] max-[480px]:mb-7 max-[480px]:text-[10px] max-[480px]:tracking-[0.2em] ${inView ? "animate-[fade-up_0.7s_cubic-bezier(0.4,0,0.2,1)_0.1s_forwards]" : ""}`}
        >
          <span className="tracking-normal text-vos-cyan/50">{"//"}</span>About
          Us
        </p>

        <div
          className={`mb-20 grid grid-cols-[1fr_360px] items-start gap-20 opacity-0 max-[900px]:mb-12 max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[480px]:mb-9 max-[480px]:gap-7 ${inView ? "animate-[fade-up_0.7s_cubic-bezier(0.4,0,0.2,1)_0.25s_forwards]" : ""}`}
        >
          <div>
            <h2 className="mb-8 font-display text-[96px] uppercase leading-[0.9] tracking-[0.01em] text-white max-[900px]:mb-6 max-[900px]:text-[64px] max-[480px]:mb-5 max-[480px]:text-center max-[480px]:text-[44px]">
              WE BUILD WHAT
              <br />
              OTHERS{" "}
              <em className="not-italic text-vos-cyan [text-shadow:0_0_40px_rgba(0,229,255,0.25)]">
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
                href="/projects"
                className="group/btn relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-sm border border-white bg-white px-7 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-vos-cyan max-[480px]:h-11 max-[480px]:w-full max-[480px]:justify-center max-[480px]:px-5 max-[480px]:text-[10px]"
              >
                <span className="absolute inset-0 -translate-x-[101%] bg-vos-cyan transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/btn:translate-x-0" />
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

          {/* terminal */}
          <div className="overflow-hidden rounded-[10px] border border-white/[0.08] bg-vos-surface max-[900px]:max-w-[480px] max-[480px]:max-w-full">
            <div className="flex items-center gap-[7px] border-b border-white/[0.06] bg-[#0c0c0c] px-4 py-3">
              <span className="h-3 w-3 flex-shrink-0 rounded-full bg-vos-dot-red" />
              <span className="h-3 w-3 flex-shrink-0 rounded-full bg-vos-dot-amber" />
              <span className="h-3 w-3 flex-shrink-0 rounded-full bg-vos-dot-green" />
              <span className="flex-1 text-center font-mono text-[11px] tracking-[0.08em] text-white/25">
                vector-os — terminal
              </span>
            </div>
            <div className="px-6 pb-5 pt-6 max-[480px]:px-4 max-[480px]:pb-3.5 max-[480px]:pt-4">
              {TERM_ROWS.map((r) => (
                <div
                  key={r.key}
                  className="flex items-center border-b border-white/[0.03] py-[5px] last-of-type:border-none"
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
              <span className="mt-3 inline-block font-mono text-[14px] text-vos-green [text-shadow:0_0_8px_rgba(34,255,110,0.5)] animate-[blink_0.9s_step-end_infinite]">
                ▮
              </span>
            </div>
          </div>
        </div>

        {/* stats */}
        <div
          ref={statsRef}
          className={`grid grid-cols-4 border-t border-white/[0.06] opacity-0 max-[900px]:grid-cols-2 ${inView ? "animate-[fade-up_0.7s_cubic-bezier(0.4,0,0.2,1)_0.4s_forwards]" : ""}`}
        >
          <StatCounter
            target={8}
            label="Repositories"
            started={statsStarted}
            delay={0}
          />
          <StatCounter
            target={7}
            label="Members"
            started={statsStarted}
            delay={150}
          />
          <StatCounter
            target={38}
            suffix="+"
            label="Stars"
            started={statsStarted}
            delay={300}
          />
          <StatScramble label="Status" started={statsStarted} delay={450} />
        </div>
      </div>
    </section>
  );
}
