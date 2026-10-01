"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BodyCanvas, { type Figure } from "./BodyCanvas";
import Leaf from "./Leaf";
import { contato, hero } from "@content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { track } from "@/lib/track";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Hero() {
  const [k, setK] = useState(0); // 0 = antes, 1 = depois
  const kRef = useRef(0);
  const shown = useRef(0);
  const tocou = useRef(false);

  // a transformação acontece sozinha na primeira visita; depois a pessoa arrasta
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      kRef.current = 1;
      setK(1);
      return;
    }
    let raf = 0;
    const start = performance.now() + 700;
    const loop = (now: number) => {
      if (tocou.current) return;
      const p = Math.min(1, Math.max(0, (now - start) / 2600));
      kRef.current = ease(p);
      setK(Math.round(kRef.current * 100) / 100);
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const getState = useCallback((t: number): Figure[] => {
    shown.current += (kRef.current - shown.current) * 0.14;
    const v = shown.current;
    const breathe = Math.sin(t * 1.6) * 0.008;
    const sway = Math.sin(t * 0.45) * 0.22;
    const base = { slouch: 1 - v, tone: v };
    return [
      { offsetX: -0.17, state: { ...base, sex: "f", rotation: 0.55 + sway, girth: 1.33 - 0.36 * v + breathe } },
      { offsetX: 0.17, state: { ...base, sex: "m", rotation: -0.5 - sway, girth: 1.3 - 0.33 * v + breathe } },
    ];
  }, []);

  const onSlide = (v: number) => {
    if (!tocou.current) track("hero_slider");
    tocou.current = true;
    kRef.current = v;
    setK(v);
  };

  return (
    <section className="relative overflow-hidden pb-10 pt-20 sm:pt-28 lg:pb-20">
      <Leaf className="pointer-events-none absolute -left-6 top-40 h-16 w-16 rotate-[-20deg] text-leaf-soft/50 floaty" />
      <Leaf className="pointer-events-none absolute right-[8%] top-24 h-10 w-10 rotate-[40deg] text-leaf/30 floaty" style={{ animationDelay: "1.5s" }} />

      <div className="gutter grid items-center gap-x-10 gap-y-6 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_auto]">
        <div className="relative z-10 order-1 lg:order-none lg:self-end">
          <p className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-[13px] font-medium text-leaf-deep">
            <span className="h-2 w-2 shrink-0 rounded-full bg-leaf" /> {hero.selo}
          </p>
          <h1 className="serif mt-5 text-[clamp(2.7rem,7.4vw,6.2rem)] font-medium leading-[0.98] text-ink">
            {hero.titulo[0]}
            <br />
            {hero.titulo[1]} <em className="font-normal italic text-leaf">{hero.destaque}</em>
          </h1>
        </div>

        <div className="relative z-10 order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="max-w-md text-lg leading-relaxed text-ink-2">{hero.apoio}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl("Oi João! Vi seu site e quero começar meu acompanhamento.")}
              target="_blank"
              rel="noopener"
              onClick={() => track("whatsapp_click", { local: "hero" })}
              className="btn-leaf"
            >
              {hero.ctaWhats} <span aria-hidden>→</span>
            </a>
            <Link href="/diagnostico" target="_blank" onClick={() => track("quiz_open", { local: "hero" })} className="btn-soft">
              {hero.ctaQuiz} <span aria-hidden>↗</span>
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#CDE8D4", "#F2EADA", "#7CC596", "#E2F1E5"].map((c, i) => (
                <span key={i} className="h-9 w-9 rounded-full border-2 border-paper" style={{ background: c }} />
              ))}
            </div>
            <p className="text-sm text-mute">
              <strong className="text-ink">{contato.seguidores} pessoas</strong> acompanham o João no Instagram
            </p>
          </div>
        </div>

        {/* palco da transformação */}
        <div className="relative order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="relative mx-auto aspect-[1/0.9] w-full max-w-[620px] sm:aspect-[1/1.05]">
            <div className="absolute inset-[6%] rounded-blob bg-mint transition-colors duration-700" style={{ background: k > 0.5 ? "#E2F1E5" : "#EEEDE7" }} />
            <BodyCanvas getState={getState} scale={0.98} className="absolute inset-0 h-full w-full" ariaLabel="Mulher e homem se transformando de cansados para saudáveis" />

            {hero.antes.map((c, i) => (
              <span
                key={c}
                className="absolute whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-mute shadow-soft transition-all duration-500"
                style={{
                  left: ["2%", "64%", "6%"][i],
                  top: ["22%", "14%", "70%"][i],
                  opacity: k < 0.35 ? 1 : 0,
                  transform: `translateY(${k < 0.35 ? 0 : 10}px)`,
                }}
              >
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#A0A8A2]" />
                {c}
              </span>
            ))}
            {hero.depois.map((c, i) => (
              <span
                key={c}
                className="absolute whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-leaf-deep shadow-soft transition-all duration-500"
                style={{
                  left: ["0%", "66%", "58%"][i],
                  top: ["30%", "20%", "74%"][i],
                  opacity: k > 0.65 ? 1 : 0,
                  transform: `translateY(${k > 0.65 ? 0 : 10}px) scale(${k > 0.65 ? 1 : 0.9})`,
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-leaf" />
                {c}
              </span>
            ))}
          </div>

          <div className="mx-auto -mt-2 max-w-[420px] px-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={k}
              onChange={(e) => onSlide(Number(e.target.value))}
              aria-label="Arraste para ver a transformação"
            />
            <div className="mt-2 flex justify-between text-[13px] font-medium">
              <span className={k < 0.5 ? "text-ink" : "text-mute"}>Antes</span>
              <span className="text-mute">arraste ↔</span>
              <span className={k >= 0.5 ? "text-leaf" : "text-mute"}>Depois</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
