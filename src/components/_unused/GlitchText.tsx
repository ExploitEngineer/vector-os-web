import { addPropertyControls, ControlType } from "framer";
import { useEffect, useState } from "react";

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function GlitchText({
  text = "VECTOR\nOPERATING\nSYSTEM",
  fontSize = 180,
  color = "#FFFFFF",
  accentColor = "#00E5FF",
}) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const trigger = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
      const next = 4000 + Math.random() * 4000;
      setTimeout(trigger, next);
    };
    const initial = 3000 + Math.random() * 3000;
    const t = setTimeout(trigger, initial);
    return () => clearTimeout(t);
  }, []);

  const lines = text.split("\n");

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
        width: "100%",
      }}
    >
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
                @keyframes glitch-r {
                    0% { clip-path: inset(10% 0 60% 0); transform: translate(-4px, 0); }
                    20% { clip-path: inset(40% 0 20% 0); transform: translate(4px, 0); }
                    40% { clip-path: inset(70% 0 5% 0); transform: translate(-3px, 0); }
                    60% { clip-path: inset(20% 0 50% 0); transform: translate(3px, 0); }
                    80% { clip-path: inset(55% 0 25% 0); transform: translate(-2px, 0); }
                    100% { clip-path: inset(0% 0 80% 0); transform: translate(0, 0); }
                }
                @keyframes glitch-b {
                    0% { clip-path: inset(60% 0 10% 0); transform: translate(4px, 0); }
                    20% { clip-path: inset(20% 0 55% 0); transform: translate(-4px, 0); }
                    40% { clip-path: inset(5% 0 75% 0); transform: translate(3px, 0); }
                    60% { clip-path: inset(50% 0 15% 0); transform: translate(-3px, 0); }
                    80% { clip-path: inset(25% 0 40% 0); transform: translate(2px, 0); }
                    100% { clip-path: inset(80% 0 0% 0); transform: translate(0, 0); }
                }
                .glitch-layer-r {
                    animation: glitch-r 0.2s steps(1) forwards;
                }
                .glitch-layer-b {
                    animation: glitch-b 0.2s steps(1) forwards;
                }
            `}</style>
      <div
        style={{
          position: "relative",
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* Red channel */}
        {glitching && (
          <div
            className="glitch-layer-r"
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              fontFamily: "'Anton', sans-serif",
              fontSize,
              fontWeight: 400,
              lineHeight: 0.9,
              color: "#FF2D55",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            {lines.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        )}
        {/* Cyan channel */}
        {glitching && (
          <div
            className="glitch-layer-b"
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              fontFamily: "'Anton', sans-serif",
              fontSize,
              fontWeight: 400,
              lineHeight: 0.9,
              color: "#00E5FF",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            {lines.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        )}
        {/* Main text */}
        <div
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize,
            fontWeight: 400,
            lineHeight: 0.9,
            color,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

addPropertyControls(GlitchText, {
  text: {
    type: ControlType.String,
    title: "Text",
    defaultValue: "VECTOR\nOPERATING\nSYSTEM",
    displayTextArea: true,
  },
  fontSize: {
    type: ControlType.Number,
    title: "Font Size",
    defaultValue: 180,
    min: 24,
    max: 320,
  },
  color: {
    type: ControlType.Color,
    title: "Color",
    defaultValue: "#FFFFFF",
  },
  accentColor: {
    type: ControlType.Color,
    title: "Accent",
    defaultValue: "#00E5FF",
  },
});
