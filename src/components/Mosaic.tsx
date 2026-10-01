"use client";

import { useEffect, useRef, useState } from "react";

/** Transição antes → depois em mosaico de pixels (canvas 2D). */
export default function Mosaic({ antes, depois, className }: { antes: string; depois: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [showAfter, setShowAfter] = useState(false);
  const stateRef = useRef({ t: 0, target: 0 });

  useEffect(() => {
    stateRef.current.target = showAfter ? 1 : 0;
  }, [showAfter]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const imgs = [antes, depois].map((src) => {
      const im = new Image();
      im.src = src;
      return im;
    });
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d")!;
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const auto = setInterval(() => visible && setShowAfter((v) => !v), 3600);

    const draw = () => {
      const st = stateRef.current;
      st.t += (st.target - st.t) * 0.06;
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      const W = canvas.width;
      const H = canvas.height;
      const img = st.t < 0.5 ? imgs[0] : imgs[1];
      const k = 1 - Math.abs(st.t - 0.5) * 2;
      const block = Math.max(1, Math.round(1 + k * k * 40 * dpr));
      if (img.complete && img.naturalWidth) {
        const sw = Math.max(1, Math.round(W / block));
        const sh = Math.max(1, Math.round(H / block));
        small.width = sw;
        small.height = sh;
        const ir = img.naturalWidth / img.naturalHeight;
        const cr = W / H;
        let dw = sw, dh = sh, dx = 0, dy = 0;
        if (ir > cr) { dw = sh * ir; dx = (sw - dw) / 2; } else { dh = sw / ir; dy = (sh - dh) / 2; }
        sctx.drawImage(img, dx, dy, dw, dh);
        ctx.imageSmoothingEnabled = block <= 1;
        ctx.drawImage(small, 0, 0, sw, sh, 0, 0, W, H);
        if (k > 0.05) {
          ctx.fillStyle = `rgba(46,156,90,${k * 0.2})`;
          ctx.fillRect(0, 0, W, H);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(auto);
      io.disconnect();
    };
  }, [antes, depois]);

  return (
    <div className={`relative overflow-hidden rounded-[20px] ${className ?? ""}`}>
      <canvas ref={ref} className="h-full w-full" aria-label="Comparativo antes e depois" role="img" />
      <div className="absolute inset-x-2 bottom-2 flex rounded-full bg-white/90 p-1 backdrop-blur">
        {(["Antes", "Depois"] as const).map((l, i) => (
          <button
            key={l}
            onClick={() => setShowAfter(i === 1)}
            className={`flex-1 rounded-full py-2 text-[13px] font-semibold transition-colors ${showAfter === (i === 1) ? "bg-leaf text-white" : "text-ink-2"}`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
