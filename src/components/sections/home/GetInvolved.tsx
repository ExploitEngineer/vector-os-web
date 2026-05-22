"use client";

import { GITHUB_URL } from "@/data/navigation";
import { useInView } from "@/hooks/useInView";

const LINES = [
  { type: "comment", text: "# get started with Vector OS" },
  {
    type: "cmd",
    cmd: "$ git clone ",
    path: "https://github.com/Vector-OS/<project>",
  },
  { type: "cmd", cmd: "$ cd ", path: "<project>" },
  { type: "cmd", cmd: "$ cat ", path: "README.md" },
  { type: "comment", text: "# build something that matters." },
] as const;

const reveal = "animate-[fade-up_0.7s_cubic-bezier(0.4,0,0.2,1)_forwards]";

export default function GetInvolved() {
  const { ref, inView } = useInView<HTMLElement>(0.1);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden border-t border-white/[0.06] bg-vos-black px-12 py-[100px] max-[900px]:px-8 max-[900px]:py-20 max-[480px]:px-5 max-[480px]:py-[60px]"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.04)_0%,transparent_70%)]" />

      <div className="relative z-[1] mx-auto flex w-full max-w-[1200px] flex-col items-center">
        <p
          className={`mb-12 flex w-full items-center gap-4 font-mono text-[13px] uppercase tracking-[0.3em] text-white/35 opacity-0 after:h-px after:flex-1 after:bg-white/[0.07] after:content-[''] max-[900px]:mb-8 max-[900px]:text-[11px] max-[480px]:mb-6 max-[480px]:text-[10px] max-[480px]:tracking-[0.18em] ${inView ? reveal : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <span className="tracking-normal text-vos-cyan/50">{"//"}</span>Get
          Involved
        </p>

        <h2
          className={`mb-4 text-center font-display text-[100px] uppercase leading-[0.9] tracking-[0.01em] text-white opacity-0 max-[900px]:text-[68px] max-[480px]:text-[52px] ${inView ? reveal : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          BUILD WITH
          <br />
          <em className="not-italic text-vos-cyan [text-shadow:0_0_40px_rgba(0,229,255,0.25)]">
            THE PACK.
          </em>
        </h2>

        <p
          className={`mb-16 text-center font-mono text-[12px] tracking-[0.15em] text-white/25 opacity-0 max-[900px]:mb-10 max-[900px]:text-[11px] max-[900px]:tracking-[0.12em] max-[480px]:mb-7 max-[480px]:text-[10px] max-[480px]:tracking-[0.1em] ${inView ? reveal : ""}`}
          style={{ animationDelay: "0.3s" }}
        >
          Open source. Open contributions. Fork it. Break it. Ship it.
        </p>

        {/* terminal */}
        <div
          className={`group mb-10 w-full overflow-hidden rounded-lg border border-white/[0.07] bg-vos-surface opacity-0 transition-[border-color,box-shadow] duration-300 hover:border-vos-cyan/20 hover:shadow-[0_0_40px_rgba(0,229,255,0.04)] ${inView ? reveal : ""}`}
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-[7px] border-b border-white/[0.05] bg-[#050505] px-5 py-3">
            <span className="h-3 w-3 flex-shrink-0 rounded-full bg-vos-dot-red" />
            <span className="h-3 w-3 flex-shrink-0 rounded-full bg-vos-dot-amber" />
            <span className="h-3 w-3 flex-shrink-0 rounded-full bg-vos-dot-green" />
            <span className="flex-1 text-center font-mono text-[11px] tracking-[0.08em] text-white/20">
              vector-os — terminal
            </span>
          </div>
          <div className="overflow-x-auto px-8 pb-6 pt-7 max-[900px]:px-6 max-[900px]:py-5 max-[480px]:px-4 max-[480px]:py-3.5">
            {LINES.map((l, i) =>
              l.type === "comment" ? (
                <span
                  key={i}
                  className="block whitespace-nowrap font-mono text-[13px] leading-[2.1] tracking-[0.04em] text-white/[0.18] max-[900px]:text-[12px] max-[480px]:text-[11px] max-[480px]:leading-[1.9]"
                >
                  {l.text}
                </span>
              ) : (
                <span
                  key={i}
                  className="block whitespace-nowrap font-mono text-[13px] leading-[2.1] tracking-[0.04em] max-[900px]:text-[12px] max-[480px]:text-[11px] max-[480px]:leading-[1.9]"
                >
                  <span className="text-vos-green">{l.cmd}</span>
                  <span className="text-vos-cyan">{l.path}</span>
                </span>
              ),
            )}
          </div>
        </div>

        {/* actions */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 opacity-0 max-[480px]:w-full max-[480px]:flex-col max-[480px]:gap-2.5 ${inView ? reveal : ""}`}
          style={{ animationDelay: "0.5s" }}
        >
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2.5 rounded-sm border border-vos-cyan bg-vos-cyan px-10 font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-black transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,229,255,0.3)] max-[900px]:h-[50px] max-[900px]:px-7 max-[900px]:text-[11px] max-[480px]:h-12 max-[480px]:w-full max-[480px]:justify-center max-[480px]:px-5 max-[480px]:tracking-[0.16em]"
          >
            START CONTRIBUTING →
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2 rounded-sm border border-white/10 px-8 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-white/40 transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-white/30 hover:text-white max-[900px]:h-[50px] max-[900px]:px-6 max-[900px]:text-[11px] max-[480px]:h-12 max-[480px]:w-full max-[480px]:justify-center max-[480px]:px-5 max-[480px]:tracking-[0.14em]"
          >
            VIEW ALL REPOS ↗
          </a>
        </div>
      </div>
    </section>
  );
}
