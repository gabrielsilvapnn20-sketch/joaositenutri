"use client";

import { useEffect, useRef } from "react";
import { drawBody, type BodyState } from "@/lib/body";

export type Figure = { state: BodyState; offsetX?: number; scale?: number };

type Props = {
  /** chamado a cada frame — leia refs aqui, sem re-render do React. Pode devolver várias figuras. */
  getState: (t: number) => BodyState | Figure[];
  className?: string;
  offsetX?: number | (() => number);
  scale?: number | (() => number);
  ariaLabel?: string;
};

export function cssFont(variable: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.body).getPropertyValue(variable).trim();
  return v || fallback;
}

export default function BodyCanvas({ getState, className, offsetX = 0, scale = 1, ariaLabel }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const getRef = useRef(getState);
  getRef.current = getState;
  const offRef = useRef(offsetX);
  offRef.current = offsetX;
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = cssFont("--font-sans", "sans-serif");
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let visible = true;
    let raf = 0;
    const t0 = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const val = (v: number | (() => number)) => (typeof v === "function" ? v() : v);

    function frame(now: number) {
      raf = 0;
      if (!ctx || !canvas) return;
      const t = reduced ? 0 : (now - t0) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const out = getRef.current(t);
      const figures: Figure[] = Array.isArray(out) ? out : [{ state: out }];
      const baseScale = val(scaleRef.current);
      const baseOff = val(offRef.current);
      for (const fig of figures) {
        drawBody(ctx, {
          width: canvas.width,
          height: canvas.height,
          dpr,
          state: fig.state,
          font,
          offsetX: baseOff + (fig.offsetX ?? 0),
          scale: baseScale * (fig.scale ?? 1),
        });
      }
      if (visible) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} role="img" aria-label={ariaLabel ?? "Ilustração de corpo humano em linhas"} />;
}
