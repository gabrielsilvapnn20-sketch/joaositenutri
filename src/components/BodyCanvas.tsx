"use client";

import { useEffect, useRef } from "react";
import { drawBody, type BodyState } from "@/lib/body";

type Props = {
  /** chamado a cada frame — leia refs aqui, sem re-render do React */
  getState: (t: number) => BodyState;
  className?: string;
  offsetX?: number | (() => number);
  scale?: number | (() => number);
  ariaLabel?: string;
};

export function monoFontFamily() {
  if (typeof document === "undefined") return "monospace";
  const v = getComputedStyle(document.body).getPropertyValue("--font-mono").trim();
  return v || "ui-monospace, monospace";
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
    const mono = monoFontFamily();
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
      drawBody(ctx, {
        width: canvas.width,
        height: canvas.height,
        dpr,
        state: getRef.current(t),
        monoFont: mono,
        offsetX: val(offRef.current),
        scale: val(scaleRef.current),
      });
      if (visible) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} role="img" aria-label={ariaLabel ?? "Corpo humano em linhas de varredura"} />;
}
