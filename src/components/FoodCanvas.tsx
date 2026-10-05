"use client";

import { useEffect, useRef } from "react";
import { FoodScene, type SceneControls } from "@/lib/foodFigure";

type Props = {
  /** chamado a cada frame — leia refs aqui, sem re-render do React */
  getControls: (t: number) => SceneControls;
  count?: number;
  seed?: number;
  className?: string;
  ariaLabel?: string;
  interactive?: boolean;
  /** recebe a cena a cada frame (para ancorar elementos HTML) */
  onFrame?: (scene: FoodScene, w: number, h: number) => void;
};

export default function FoodCanvas({ getControls, count = 300, seed = 7, className, ariaLabel, interactive = true, onFrame }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const ctlRef = useRef(getControls);
  ctlRef.current = getControls;
  const frameRef = useRef(onFrame);
  frameRef.current = onFrame;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const mobile = window.innerWidth < 700;
    const scene = new FoodScene(mobile ? Math.round(count * 0.75) : count, seed);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = 1;
    let pointer: [number, number] | null = null;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    const t0 = last;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = [(e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr];
    };
    const leave = () => (pointer = null);
    if (interactive) {
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerdown", move);
      canvas.addEventListener("pointerleave", leave);
      canvas.addEventListener("pointerup", leave);
    }

    function frame(now: number) {
      raf = 0;
      if (!ctx || !canvas) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - t0) / 1000;
      const c = ctlRef.current(t);
      if (reduced) c.form = Math.round(c.form);
      scene.step(reduced ? 0.05 : dt, t, { ...c, pointer }, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      scene.draw(ctx, canvas.width, canvas.height);
      frameRef.current?.(scene, canvas.width / dpr, canvas.height / dpr);
      if (visible) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerup", leave);
    };
  }, [count, seed, interactive]);

  return <canvas ref={ref} className={`touch-pan-y ${className ?? ""}`} role="img" aria-label={ariaLabel ?? "Pessoa formada por comida de verdade"} />;
}
