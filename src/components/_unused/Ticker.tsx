import { addPropertyControls, ControlType } from "framer";
import { useEffect, useRef } from "react";

const ITEMS = [
  "LINUX KERNEL",
  "PORT SCANNER",
  "VECTOR OS DISTRO",
  "CYBERSECURITY",
  "AI TOOLS",
  "SYSTEM SOFTWARE",
  "REMOTE ACCESS",
  "EXPLOIT RESEARCH",
  "DLL CONVERTER",
  "OPEN SOURCE",
];

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Ticker({ speed = 40, textColor = "#22FF6E" }) {
  const items = [...ITEMS, ...ITEMS];

  return (
    <div
      style={{
        width: "100%",
        height: 44,
        background: "#000000",
        borderTop: "1px solid #1A1A1A",
        borderBottom: "1px solid #1A1A1A",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap');
                @keyframes ticker {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .ticker-track {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    animation: ticker ${speed}s linear infinite;
                    will-change: transform;
                }
            `}</style>
      <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.15em",
              color: textColor,
              textTransform: "uppercase",
              padding: "0 28px",
              userSelect: "none",
            }}
          >
            {item}
            <span style={{ marginLeft: 28, opacity: 0.4 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

addPropertyControls(Ticker, {
  speed: {
    type: ControlType.Number,
    title: "Speed (s)",
    defaultValue: 40,
    min: 10,
    max: 120,
  },
  textColor: {
    type: ControlType.Color,
    title: "Color",
    defaultValue: "#22FF6E",
  },
});
