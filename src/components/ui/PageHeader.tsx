"use client";

import { useInView } from "@/hooks/useInView";
import { useScrambleText } from "@/hooks/useScramble";

/**
 * Centered page hero shared by /projects and /about: a bracketed eyebrow, a
 * large scrambling Anton title, and a mono subline. Corner brackets included.
 */
export default function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const scrambled = useScrambleText(title, inView, {
    delay: 100,
    frames: 22,
    interval: 32,
  });

  const corner =
    "pointer-events-none absolute h-4 w-4 border-white opacity-20 max-[480px]:h-3 max-[480px]:w-3";

  return (
    <section
      ref={ref}
      className="relative flex w-full flex-col items-center overflow-hidden border-b border-white/[0.06] bg-vos-black px-12 pb-20 pt-[100px] text-center max-[900px]:px-8 max-[900px]:pb-[60px] max-[900px]:pt-20 max-[480px]:px-5 max-[480px]:pb-12 max-[480px]:pt-[60px]"
    >
      <span className={`${corner} left-[18px] top-4 border-l border-t`} />
      <span className={`${corner} right-[18px] top-4 border-r border-t`} />
      <span className={`${corner} bottom-4 left-[18px] border-b border-l`} />
      <span className={`${corner} bottom-4 right-[18px] border-b border-r`} />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1200px] flex-col items-center">
        <p
          className={`mb-6 flex items-center justify-center gap-4 font-mono text-[13px] uppercase tracking-[0.3em] text-white/35 opacity-0 before:h-px before:w-10 before:bg-white/10 before:content-[''] after:h-px after:w-10 after:bg-white/10 after:content-[''] max-[900px]:text-[11px] max-[900px]:before:w-6 max-[900px]:after:w-6 max-[480px]:mb-4 max-[480px]:gap-2.5 max-[480px]:text-[10px] max-[480px]:tracking-[0.2em] max-[480px]:before:w-4 max-[480px]:after:w-4 ${inView ? "animate-[fade-up_0.7s_cubic-bezier(0.4,0,0.2,1)_0.1s_forwards]" : ""}`}
        >
          <span className="tracking-normal text-vos-cyan/50">{"//"}</span>
          {eyebrow}
        </p>
        <h1 className="mb-4 font-display text-[160px] uppercase leading-[0.88] tracking-[0.01em] text-white [text-shadow:0_0_60px_rgba(255,255,255,0.15),0_0_120px_rgba(255,255,255,0.06)] max-[900px]:text-[100px] max-[480px]:text-[72px]">
          {scrambled}
        </h1>
        <p
          className={`font-mono text-[12px] uppercase tracking-[0.2em] text-white/30 opacity-0 max-[900px]:text-[11px] max-[900px]:tracking-[0.16em] max-[480px]:text-[10px] max-[480px]:tracking-[0.14em] ${inView ? "animate-[fade-up_0.7s_cubic-bezier(0.4,0,0.2,1)_0.3s_forwards]" : ""}`}
        >
          {sub}
        </p>
      </div>
    </section>
  );
}
