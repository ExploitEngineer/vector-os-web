"use client";

import { useEffect, useRef, useState } from "react";
import { MISSION_LINES } from "@/data/mission";
import { useInView } from "@/hooks/useInView";

export default function Mission() {
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Highlight whichever line is nearest the vertical center of the viewport.
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      let best = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - vh / 2);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIndex(best);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="w-full bg-vos-black px-12 py-[100px] max-[900px]:px-8 max-[900px]:py-20 max-[480px]:px-5 max-[480px]:py-[60px]"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <p
          className={`mb-14 flex items-center gap-4 font-mono text-[13px] uppercase tracking-[0.3em] text-white/35 opacity-0 after:h-px after:flex-1 after:bg-white/[0.07] after:content-[''] max-[900px]:mb-10 max-[900px]:text-[11px] max-[480px]:mb-6 max-[480px]:tracking-[0.18em] max-[480px]:text-[10px] ${
            inView
              ? "animate-[fade-up_0.7s_cubic-bezier(0.4,0,0.2,1)_0.1s_forwards]"
              : ""
          }`}
        >
          <span className="tracking-normal text-vos-cyan/50">{"//"}</span>Our
          Mission
        </p>

        {MISSION_LINES.map((line, i) => {
          const isActive = activeIndex === i;
          const isPast = activeIndex > i;
          const isHovered = hoverIndex === i;
          return (
            // biome-ignore lint/a11y/noStaticElementInteractions: decorative hover highlight only
            <div
              key={line.label}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="grid cursor-pointer grid-cols-[64px_1fr_72px] items-center gap-6 border-t border-white/[0.06] py-5 opacity-0 animate-[fade-up_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards] last-of-type:border-b last-of-type:border-white/[0.06] max-[900px]:grid-cols-[40px_1fr_48px] max-[900px]:gap-4 max-[900px]:py-4 max-[480px]:grid-cols-[28px_1fr_32px] max-[480px]:gap-2 max-[480px]:py-2.5"
              style={{
                opacity: isPast ? 0.1 : isActive ? 1 : 0.3,
                transform: `scale(${isActive ? 1 : 0.98})`,
                animationDelay: `${0.2 + i * 0.12}s`,
              }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <span
                className={`self-start pt-2.5 font-mono text-[13px] tracking-[0.1em] transition-[color,text-shadow] duration-[250ms] max-[900px]:pt-2 max-[900px]:text-[11px] max-[480px]:pt-[5px] max-[480px]:text-[9px] ${
                  isHovered
                    ? "text-vos-cyan [text-shadow:0_0_12px_rgba(0,229,255,0.8),0_0_30px_rgba(0,229,255,0.4)]"
                    : "text-white/[0.18]"
                }`}
              >
                {line.label}
              </span>

              <div className="flex flex-wrap items-baseline leading-[0.88]">
                <span className="font-display text-[148px] uppercase tracking-[0.01em] text-white max-[900px]:text-[72px] max-[480px]:text-[42px]">
                  {line.pre}
                </span>
                <span className="mx-2 self-center font-mono text-[42px] text-white/[0.12] max-[900px]:mx-1.5 max-[900px]:text-[22px] max-[480px]:mx-1 max-[480px]:text-[14px]">
                  /
                </span>
                <span
                  className={`font-display text-[148px] uppercase tracking-[0.01em] text-vos-cyan transition-[text-shadow] duration-[400ms] max-[900px]:text-[72px] max-[480px]:text-[42px] ${
                    isActive
                      ? "[text-shadow:0_0_40px_rgba(0,229,255,0.45),0_0_80px_rgba(0,229,255,0.15)]"
                      : "[text-shadow:0_0_40px_rgba(0,229,255,0.2)]"
                  }`}
                >
                  {line.post}
                </span>
              </div>

              <div
                className={`flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center justify-self-end rounded-full border text-[20px] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] max-[900px]:h-10 max-[900px]:w-10 max-[900px]:text-base max-[480px]:h-7 max-[480px]:w-7 max-[480px]:text-xs ${
                  isHovered
                    ? "rotate-45 scale-110 border-vos-cyan bg-vos-cyan/[0.06] text-vos-cyan shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                    : "border-white/10 text-white/20"
                }`}
              >
                ↗
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
