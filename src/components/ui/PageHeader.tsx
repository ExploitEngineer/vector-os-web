"use client";

import { Fragment } from "react";
import { useInView } from "@/hooks/useInView";
import { useScrambleText } from "@/hooks/useScramble";

export type HeaderStat = {
  value: string;
  label: string;
  color?: "green" | "cyan";
};

/**
 * Centered page hero shared by /projects and /about: a bracketed eyebrow, a
 * two-line scrambling title (white lead word + cyan accent word), a mono
 * subline, and an optional stats row.
 */
export default function PageHeader({
  eyebrow,
  lead,
  accent,
  sub,
  stats,
}: {
  eyebrow: string;
  lead: string;
  accent: string;
  sub: string;
  stats?: HeaderStat[];
}) {
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const leadText = useScrambleText(lead, inView, {
    delay: 100,
    frames: 18,
    interval: 32,
  });
  const accentText = useScrambleText(accent, inView, {
    delay: 220,
    frames: 22,
    interval: 32,
  });

  const corner =
    "pointer-events-none absolute h-4 w-4 border-white opacity-20 max-[480px]:h-3 max-[480px]:w-3";
  const titleType =
    "block font-display uppercase leading-[0.85] tracking-[0.01em] text-[150px] max-[900px]:text-[96px] max-[480px]:text-[64px]";
  const statColor = (c?: HeaderStat["color"]) =>
    c === "green"
      ? "text-vos-green"
      : c === "cyan"
        ? "text-vos-cyan"
        : "text-white";

  return (
    <section
      ref={ref}
      className="relative flex w-full flex-col items-center overflow-hidden border-b border-white/[0.06] bg-vos-black px-12 pb-20 pt-[100px] text-center max-[900px]:px-8 max-[900px]:pb-[60px] max-[900px]:pt-20 max-[480px]:px-5 max-[480px]:pb-12 max-[480px]:pt-[60px]"
    >
      {/* top spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[640px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_70%)]" />

      <span className={`${corner} left-[18px] top-4 border-l border-t`} />
      <span className={`${corner} right-[18px] top-4 border-r border-t`} />
      <span className={`${corner} bottom-4 left-[18px] border-b border-l`} />
      <span className={`${corner} bottom-4 right-[18px] border-b border-r`} />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1200px] flex-col items-center">
        <p
          className={`mb-6 flex items-center justify-center gap-4 font-mono text-[13px] uppercase tracking-[0.3em] text-white/35 opacity-0 before:h-px before:w-10 before:bg-white/10 before:content-[''] after:h-px after:w-10 after:bg-white/10 after:content-[''] max-[900px]:text-[11px] max-[900px]:before:w-6 max-[900px]:after:w-6 max-[480px]:mb-4 max-[480px]:gap-2.5 max-[480px]:text-[10px] max-[480px]:tracking-[0.2em] max-[480px]:before:w-4 max-[480px]:after:w-4 ${inView ? "animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_0.1s_forwards]" : ""}`}
        >
          <span className="tracking-normal text-vos-cyan/50">{"//"}</span>
          {eyebrow}
        </p>

        <h1 className="mb-4 max-[480px]:mb-3">
          <span
            className={`${titleType} text-white [text-shadow:0_0_60px_rgba(255,255,255,0.18),0_0_120px_rgba(255,255,255,0.06)]`}
          >
            {leadText}
          </span>
          <span
            className={`${titleType} text-vos-cyan [text-shadow:0_0_40px_rgba(0,229,255,0.35),0_0_90px_rgba(0,229,255,0.15)]`}
          >
            {accentText}
          </span>
        </h1>

        <p
          className={`font-mono text-[12px] uppercase tracking-[0.2em] text-white/30 opacity-0 max-[900px]:text-[11px] max-[900px]:tracking-[0.16em] max-[480px]:text-[10px] max-[480px]:tracking-[0.14em] ${inView ? "animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_0.3s_forwards]" : ""}`}
        >
          {sub}
        </p>

        {stats && stats.length > 0 && (
          <div
            className={`mt-12 flex items-stretch justify-center gap-6 opacity-0 max-[900px]:mt-10 max-[900px]:gap-4 max-[480px]:mt-8 max-[480px]:gap-3 ${inView ? "animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_0.45s_forwards]" : ""}`}
          >
            {stats.map((s, i) => (
              <Fragment key={s.label}>
                {i > 0 && <span className="w-px self-stretch bg-white/10" />}
                <div className="flex flex-col items-center">
                  <span
                    className={`font-display text-[38px] leading-none ${statColor(s.color)} max-[480px]:text-[30px]`}
                  >
                    {s.value}
                  </span>
                  <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 max-[480px]:text-[8px] max-[480px]:tracking-[0.14em]">
                    {s.label}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
