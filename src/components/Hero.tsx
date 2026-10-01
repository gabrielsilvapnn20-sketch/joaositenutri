"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import BodyCanvas from "./BodyCanvas";
import { hero } from "@content/site";
import { ease, range, smooth, stickyProgress } from "@/lib/scroll";
import type { BodyState } from "@/lib/body";
import { track } from "@/lib/track";

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const chapters = useRef<(HTMLDivElement | null)[]>([]);
  const cta = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const smoothP = useRef(0);

  const getState = useCallback((t: number): BodyState => {
    const target = stickyProgress(section.current);
    smoothP.current += (target - smoothP.current) * 0.12;
    const p = smoothP.current;

    // DOM do overlay (sem re-render)
    if (title.current) {
      const out = ease(range(p, 0.04, 0.2));
      title.current.style.opacity = String(1 - out);
      title.current.style.transform = `translate3d(0, ${-out * 80}px, 0)`;
    }
    const windows: [number, number][] = [
      [0.18, 0.38],
      [0.38, 0.6],
      [0.6, 0.8],
    ];
    chapters.current.forEach((el, i) => {
      if (!el) return;
      const [a, b] = windows[i];
      const vin = range(p, a, a + 0.06);
      const vout = range(p, b - 0.04, b);
      const o = vin * (1 - vout);
      el.style.opacity = String(o);
      el.style.transform = `translate3d(0, ${(1 - vin) * 40 - vout * 40}px, 0)`;
      el.style.pointerEvents = o > 0.5 ? "auto" : "none";
    });
    if (cta.current) {
      const c = ease(range(p, 0.8, 0.9));
      cta.current.style.opacity = String(c);
      cta.current.style.transform = `translate3d(0, ${(1 - c) * 50}px, 0)`;
      cta.current.style.pointerEvents = c > 0.5 ? "auto" : "none";
    }
    const explode = smooth(range(p, 0.38, 0.55)) * (1 - 0.65 * smooth(range(p, 0.62, 0.8)));
    const rotation = 0.35 + t * 0.12 + p * Math.PI * 2.2;
    if (hud.current) hud.current.textContent = `ROT ${String(Math.round(((rotation * 180) / Math.PI) % 360)).padStart(3, "0")}° · EXP ${explode.toFixed(2)}`;
    if (bar.current) bar.current.style.transform = `scaleY(${p})`;

    return {
      rotation,
      explode,
      layers: smooth(range(p, 0.42, 0.58)),
      labels: range(p, 0.44, 0.62) * (1 - 0.3 * range(p, 0.85, 1)),
      scan: p < 0.36 ? (t * 0.22 + p * 2) % 1 : -1,
      girth: 1,
      highlight: smooth(range(p, 0.62, 0.75)),
    };
  }, []);

  const offsetX = useCallback(() => (window.innerWidth >= 900 ? 0.17 : 0), []);
  const scale = useCallback(() => (window.innerWidth >= 900 ? 1 : window.innerWidth < 420 ? 0.82 : 0.9), []);

  return (
    <section ref={section} className="relative h-[460vh]" aria-label="Apresentação">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* grade técnica */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "calc(100% / 12) 25vh",
            maskImage: "radial-gradient(ellipse at 60% 50%, black 30%, transparent 75%)",
          }}
        />
        <BodyCanvas getState={getState} offsetX={offsetX} scale={scale} className="absolute inset-0 h-full w-full" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55svh] bg-gradient-to-t from-ink via-ink/75 to-transparent lg:hidden" />

        {/* HUD */}
        <div className="gutter pointer-events-none absolute inset-x-0 top-16 flex justify-between">
          <span className="label">{hero.objeto}</span>
          <span ref={hud} className="label hidden tabular-nums sm:inline">ROT 000° · EXP 0.00</span>
        </div>
        <div className="pointer-events-none absolute bottom-8 right-4 top-28 w-px bg-line sm:right-8 lg:right-12">
          <div ref={bar} className="h-full w-px origin-top bg-signal" style={{ transform: "scaleY(0)" }} />
        </div>

        {/* Título */}
        <div ref={title} className="gutter absolute inset-x-0 bottom-[9svh] will-change-transform lg:bottom-auto lg:top-[24svh]">
          <h1 className="wide text-[clamp(3.1rem,12.5vw,10.5rem)] font-bold uppercase leading-[0.86] tracking-tightest">
            {hero.titulo.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h1>
          <p className="mt-5 max-w-md text-xl text-bone/90 sm:text-2xl">
            <span className="text-signal">→</span> {hero.subtitulo}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">{hero.apoio}</p>
          <p className="label mt-8 flex items-center gap-3">
            <span className="inline-block h-6 w-px animate-pulse bg-signal" /> Role para dissecar
          </p>
        </div>

        {/* Capítulos */}
        {hero.capitulos.map((c, i) => (
          <div
            key={c.codigo}
            ref={(el) => {
              chapters.current[i] = el;
            }}
            className="gutter absolute bottom-[8svh] left-0 max-w-[34rem] opacity-0 will-change-transform lg:bottom-auto lg:top-[34svh]"
          >
            <p className="label !text-signal">{c.codigo}</p>
            <h2 className="wide mt-3 text-[clamp(2rem,6vw,4.4rem)] font-bold uppercase leading-[0.92] tracking-tighter">
              {c.titulo}
            </h2>
            <p className="mt-4 max-w-sm text-base text-bone/75">{c.texto}</p>
          </div>
        ))}

        {/* CTA */}
        <div
          ref={cta}
          className="gutter absolute bottom-[8svh] left-0 max-w-[38rem] opacity-0 will-change-transform lg:bottom-auto lg:top-[30svh]"
        >
          <p className="label !text-signal">04 / DIAGNÓSTICO</p>
          <h2 className="wide mt-3 text-[clamp(2.2rem,6.5vw,5rem)] font-bold uppercase leading-[0.9] tracking-tighter">
            Agora é a vez dos <span className="text-signal">seus</span> dados.
          </h2>
          <p className="mt-4 max-w-sm text-bone/75">
            6 fases, 2 minutos. No final você recebe seu perfil e o que trava seu resultado.
          </p>
          <Link href="/diagnostico" className="btn-signal mt-7" onClick={() => track("cta_click", { local: "hero" })}>
            {hero.cta} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
