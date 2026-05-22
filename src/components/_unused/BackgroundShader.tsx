import { addPropertyControls, ControlType } from "framer";
import { useEffect, useRef } from "react";

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function BackgroundShader({ opacity = 0.06 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const noise = (x: number, y: number, t: number) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + t * 0.3) * 43758.5453;
      return n - Math.floor(n);
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const px = (i / 4) % w;
        const py = Math.floor(i / 4 / w);
        const n = noise(px / 180, py / 180, time);
        const grain = n * 255;
        data[i] = grain * 0.08;
        data[i + 1] = grain * 0.25;
        data[i + 2] = grain * 0.1;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      time += 0.018;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}

addPropertyControls(BackgroundShader, {
  opacity: {
    type: ControlType.Number,
    title: "Opacity",
    defaultValue: 0.06,
    min: 0,
    max: 0.3,
    step: 0.01,
  },
});
