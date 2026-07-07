import Link from "next/link";
import {
  BRAND,
  CONNECT_LINKS,
  LEGAL_ITEMS,
  NAV_LINKS,
  SUPPORT_EMAIL,
} from "@/data/navigation";

const colHead =
  "mb-5 block border-b border-white/[0.06] pb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-white/30 max-[480px]:tracking-[0.2em]";
const linkRow =
  "group flex items-center justify-between border-b border-white/[0.04] py-[7px] font-mono text-[11px] uppercase tracking-[0.08em] text-white/45 transition-colors last:border-none hover:text-white/90";
const linkArrow =
  "translate-x-[-4px] translate-y-[4px] text-[10px] opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-60";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.08] bg-vos-black">
      {/* Wordmark + tagline */}
      <div className="border-b border-white/[0.08]">
        <div className="group relative mx-auto max-w-[1200px] cursor-default overflow-hidden px-12 pt-16 max-[900px]:px-8 max-[900px]:pt-12 max-[480px]:px-5 max-[480px]:pt-10">
          <span className="block select-none text-center font-display text-[200px] uppercase leading-[0.85] tracking-[0.01em] text-white/[0.12] transition-[letter-spacing,color,text-shadow] duration-[550ms] group-hover:tracking-[0.06em] group-hover:text-white/[0.17] group-hover:[text-shadow:0_0_60px_rgb(var(--glow-cyan)/0.08)] max-[900px]:text-[120px] max-[480px]:text-[56px] max-[480px]:tracking-[0.02em]">
            VECTOR OS
          </span>
          <span className="pointer-events-none absolute left-0 top-0 h-full w-[15%] -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent group-hover:animate-[sweep_1s_ease_forwards]" />
        </div>
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-12 pb-11 pt-[18px] max-[900px]:px-8 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-[10px] max-[480px]:px-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35 max-[480px]:text-[9px]">
            Open source.{" "}
            <em className="not-italic text-vos-cyan/70">Built different.</em>{" "}
            Zero limits.
          </p>
          <div className="inline-flex shrink-0 items-center gap-2 rounded-[20px] border border-vos-green/20 bg-vos-green/5 px-[14px] py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-vos-green max-[480px]:text-[8px]">
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-vos-green shadow-[0_0_6px_rgb(var(--glow-green)/0.9)] animate-[pulse-soft_2s_ease-in-out_infinite]" />
            All systems operational
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-[2fr_1fr_1fr_1fr] items-start gap-12 border-y border-white/[0.08] px-12 py-[52px] max-[900px]:grid-cols-2 max-[900px]:gap-8 max-[900px]:px-8 max-[900px]:py-10 max-[480px]:grid-cols-1 max-[480px]:gap-6 max-[480px]:px-5 max-[480px]:py-8">
        <div>
          <span className={colHead}>{BRAND.name}</span>
          <p className="mb-5 max-w-[260px] font-mono text-[11px] leading-[1.85] text-white/40 max-[900px]:max-w-full max-[900px]:text-[10px]">
            {BRAND.description}
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="block font-mono text-[10px] tracking-[0.05em] text-white/40 transition-colors hover:text-vos-cyan"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>

        <div>
          <span className={colHead}>Navigate</span>
          <div className="flex flex-col">
            {NAV_LINKS.map((x) => (
              <Link key={x.label} href={x.href} className={linkRow}>
                {x.label}
                <span className={linkArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <span className={colHead}>Connect</span>
          <div className="flex flex-col">
            {CONNECT_LINKS.map((x) => (
              <a
                key={x.label}
                href={x.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkRow}
              >
                {x.label}
                <span className={linkArrow}>↗</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <span className={colHead}>Legal</span>
          <div className="flex flex-col">
            {LEGAL_ITEMS.map((item) => (
              <span
                key={item}
                className="block border-b border-white/[0.04] py-[7px] font-mono text-[11px] uppercase tracking-[0.08em] text-white/30 last:border-none"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-12 py-5 max-[900px]:px-8 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-2 max-[480px]:px-5">
        <div className="flex flex-wrap items-center gap-[14px]">
          <span className="font-mono text-[10px] tracking-[0.07em] text-white/30 max-[900px]:text-[9px]">
            © Vector OS {year}
          </span>
          <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-white/20" />
          <span className="font-mono text-[10px] tracking-[0.07em] text-white/30 max-[900px]:text-[9px]">
            MIT License
          </span>
          <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-white/20" />
          <span className="font-mono text-[10px] tracking-[0.07em] text-white/30 max-[900px]:text-[9px]">
            Built in the open
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.07em] text-white/30 max-[900px]:text-[9px]">
          Designed & built by VOS
        </span>
      </div>
    </footer>
  );
}
