import { useEffect, useRef, useState } from "react";

const ROWS = [
  {
    num: "NO. 1",
    title: "Vector Operating System",
    desc: "Custom Linux distro for hackers and developers",
  },
  {
    num: "NO. 2",
    title: "Cybersecurity Tools",
    desc: "Port scanners, RATs, payload builders, network tools",
  },
  {
    num: "NO. 3",
    title: "AI-Powered Utilities",
    desc: "Machine learning tools for real world problems",
  },
  {
    num: "NO. 4",
    title: "Developer Tooling",
    desc: "DLL converters, build scripts, documentation systems",
  },
];

const TYPEWRITER_LINE = "# build something that matters.";

const CODE_LINES = [
  "# get started with Vector OS",
  "$ git clone https://github.com/Vector-OS/<project>",
  "$ cd <project>",
  "$ cat README.md",
];

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 *
 * Aligned to the VOS spacing system:
 *   Desktop : 100/48  |  Tablet (≤900) : 80/32  |  Phone (≤480) : 60/20
 *   Max content width 1200px, container queries (not media queries).
 */
export default function VOSWhatWeBuild() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setTyped(TYPEWRITER_LINE.slice(0, i));
        if (i >= TYPEWRITER_LINE.length) clearInterval(id);
      }, 55);
      return () => clearInterval(id);
    }, 600);
    return () => clearTimeout(delay);
  }, [started]);

  function renderLine(text: string) {
    if (text.startsWith("$ ")) {
      const rest = text.slice(2);
      const urlMatch = rest.match(/(https?:\/\/[^\s]+|<[^>]+>)/g);
      if (urlMatch) {
        const parts: React.ReactNode[] = [];
        let remaining = rest;
        urlMatch.forEach((url, idx) => {
          const split = remaining.split(url);
          if (split[0])
            parts.push(
              <span key={`t${idx}`} style={{ color: "#fff" }}>
                {split[0]}
              </span>,
            );
          parts.push(
            <span key={`u${idx}`} style={{ color: "#00E5FF" }}>
              {url}
            </span>,
          );
          remaining = split.slice(1).join(url);
        });
        if (remaining)
          parts.push(
            <span key="end" style={{ color: "#fff" }}>
              {remaining}
            </span>,
          );
        return (
          <span>
            <span style={{ color: "#22FF6E" }}>$ </span>
            {parts}
          </span>
        );
      }
      return (
        <span>
          <span style={{ color: "#22FF6E" }}>$ </span>
          <span style={{ color: "#fff" }}>{rest}</span>
        </span>
      );
    }
    return <span style={{ color: "#555" }}>{text}</span>;
  }

  return (
    <section ref={sectionRef} className="vwwb-section">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;600&display=swap');

                /* ── SAME CONVENTIONS AS EVERY OTHER PAGE ──
                   Desktop : 100px 48px  |  max-width 1200px
                   Tablet  :  80px 32px  (≤ 900px container)
                   Phone   :  60px 20px  (≤ 480px container)   */
                .vwwb-section {
                    container-type: inline-size;
                    width: 100%;
                    background: #000;
                    border-top: 1px solid #1A1A1A;
                    padding: 100px 48px;
                    box-sizing: border-box;
                }

                .vwwb-inner {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .vwwb-headline {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 100px;
                    color: #fff; text-transform: uppercase;
                    line-height: 0.95; margin: 0 0 60px;
                }
                .vwwb-headline em {
                    color: #00E5FF; font-style: normal;
                    text-shadow: 0 0 15px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.15);
                }

                .vwwb-layout {
                    display: grid;
                    grid-template-columns: 60fr 40fr;
                    gap: 60px;
                    align-items: start;
                }

                .vwwb-row {
                    display: flex; align-items: center; gap: 20px;
                    border-bottom: 1px solid #1A1A1A;
                    padding: 20px 0;
                    position: relative; overflow: hidden;
                    transition: background 0.2s; cursor: pointer;
                }
                .vwwb-row::before {
                    content: '';
                    position: absolute; top: 0; left: 0; bottom: 0;
                    width: 2px; background: #00E5FF;
                    transform: scaleY(0); transition: transform 0.2s ease;
                }
                .vwwb-row:hover { background: #080808; }
                .vwwb-row:hover::before { transform: scaleY(1); }
                .vwwb-row:hover .vwwb-arrow { color: #00E5FF; }

                .vwwb-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #333; letter-spacing: 0.1em; min-width: 52px; flex-shrink: 0; }
                .vwwb-col { flex: 1; }
                .vwwb-title { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #fff; letter-spacing: 0.04em; display: block; }
                .vwwb-desc { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #555; letter-spacing: 0.03em; display: block; margin-top: 4px; }
                .vwwb-arrow { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #2a2a2a; transition: color 0.2s; flex-shrink: 0; }

                .vwwb-code {
                    background: #0A0A0A; border: 1px solid #1A1A1A; border-radius: 8px;
                    overflow: hidden; position: sticky; top: 80px;
                }
                .vwwb-code-header { display: flex; align-items: center; gap: 6px; padding: 10px 16px; border-bottom: 1px solid #1A1A1A; }
                .vwwb-code-dot { width: 12px; height: 12px; border-radius: 50%; }
                .vwwb-code-filename { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555; margin-left: 8px; letter-spacing: 0.06em; }
                .vwwb-code-body { padding: 24px 24px 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 2.2; overflow-x: auto; }
                .vwwb-cursor { display: inline-block; width: 7px; height: 14px; background: #22FF6E; vertical-align: middle; margin-left: 2px; animation: blink-cur 1s step-end infinite; }
                @keyframes blink-cur { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

                /* ── TABLET ≤ 900px — collapse to single column ── */
                @container (max-width: 900px) {
                    .vwwb-section  { padding: 80px 32px; }
                    .vwwb-headline { font-size: 68px; margin-bottom: 48px; }
                    .vwwb-layout   { grid-template-columns: 1fr; gap: 40px; }
                    .vwwb-code     { position: static; }
                    .vwwb-code-body { padding: 20px 24px; font-size: 12px; }
                }

                /* ── PHONE ≤ 480px — tighter rhythm ── */
                @container (max-width: 480px) {
                    .vwwb-section   { padding: 60px 20px; }
                    .vwwb-headline  { font-size: 44px; margin-bottom: 32px; }
                    .vwwb-layout    { gap: 28px; }
                    .vwwb-row       { gap: 14px; padding: 16px 0; }
                    .vwwb-num       { min-width: 40px; font-size: 10px; }
                    .vwwb-title     { font-size: 13px; }
                    .vwwb-desc      { font-size: 11px; }
                    .vwwb-code-body { padding: 14px 16px; font-size: 11px; line-height: 1.95; }
                    .vwwb-code-header { padding: 8px 14px; }
                }
            `}</style>

      <div className="vwwb-inner">
        <h2 className="vwwb-headline">
          WHILE YOU EXPLORE,
          <br />
          <em>DIVE DEEP.</em>
        </h2>
        <div className="vwwb-layout">
          <div>
            {ROWS.map((row, i) => (
              <div key={i} className="vwwb-row">
                <span className="vwwb-num">{row.num}</span>
                <div className="vwwb-col">
                  <span className="vwwb-title">{row.title}</span>
                  <span className="vwwb-desc">{row.desc}</span>
                </div>
                <span className="vwwb-arrow">→</span>
              </div>
            ))}
          </div>
          <div className="vwwb-code">
            <div className="vwwb-code-header">
              <div
                className="vwwb-code-dot"
                style={{ background: "#FF5F57" }}
              />
              <div
                className="vwwb-code-dot"
                style={{ background: "#FFBD2E" }}
              />
              <div
                className="vwwb-code-dot"
                style={{ background: "#28CA41" }}
              />
              <span className="vwwb-code-filename">vector-os.sh</span>
            </div>
            <div className="vwwb-code-body">
              {CODE_LINES.map((line, i) => (
                <div key={i}>{renderLine(line)}</div>
              ))}
              <div>
                <span style={{ color: "#555" }}>{typed}</span>
                {typed.length < TYPEWRITER_LINE.length && (
                  <span className="vwwb-cursor" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
