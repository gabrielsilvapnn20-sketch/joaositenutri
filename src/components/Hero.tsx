"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import FoodCanvas from "./FoodCanvas";
import Leaf from "./Leaf";
import type { FoodScene } from "@/lib/foodFigure";
import { contato, hero } from "@content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { track } from "@/lib/track";

export default function Hero() {
  const formRef = useRef(0);
  const startRef = useRef(0);
  const [formed, setFormed] = useState(false);
  const [msg, setMsg] = useState(0);
  const bubble = useRef<HTMLDivElement>(null);

  const replay = () => {
    formRef.current = 0;
    setFormed(false);
    startRef.current = performance.now() + 900;
    track("hero_replay");
  };

  useEffect(() => {
    startRef.current = performance.now() + 900;
  }, []);

  useEffect(() => {
    if (!formed) return;
    const id = setInterval(() => setMsg((m) => (m + 1) % hero.mensagens.length), 3200);
    return () => clearInterval(id);
  }, [formed]);

  const getControls = useCallback(() => {
    // espera um instante na nuvem de fast food, depois forma o corpo
    const due = startRef.current && performance.now() > startRef.current;
    if (due && formRef.current === 0) {
      formRef.current = 1;
      setTimeout(() => setFormed(true), 2300);
    }
    return { form: formRef.current, pose: "run" as const, speed: 6.5, centerX: 0.5 };
  }, []);

  // balão do João acompanha a cabeça do corredor
  const onFrame = useCallback((scene: FoodScene, w: number, h: number) => {
    const el = bubble.current;
    if (!el) return;
    const [x, y] = scene.headPx(w, h);
    const bw = el.offsetWidth || 200;
    const bh = el.offsetHeight || 60;
    // mantém o balão dentro do palco
    const left = Math.min(Math.max(4, x + 18), w - bw - 4);
    const top = Math.max(4, y - 14 - bh);
    el.style.transform = `translate(${left}px, ${top}px)`;
  }, []);

  return (
    <section className="relative overflow-hidden pb-10 pt-20 sm:pt-28 lg:pb-16">
      <Leaf className="pointer-events-none absolute -left-6 top-40 h-16 w-16 rotate-[-20deg] text-leaf-soft/50 floaty" />
      <Leaf className="pointer-events-none absolute right-[8%] top-24 h-10 w-10 rotate-[40deg] text-leaf/30 floaty" style={{ animationDelay: "1.5s" }} />

      <div className="gutter grid items-center gap-x-10 gap-y-6 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_auto]">
        <div className="relative z-10 order-1 lg:order-none lg:self-end">
          <p className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-[13px] font-medium text-leaf-deep">
            <span className="h-2 w-2 shrink-0 rounded-full bg-leaf" /> {hero.selo}
          </p>
          <h1 className="serif mt-5 text-[clamp(2.6rem,6.8vw,5.8rem)] font-medium leading-[0.98] text-ink">
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

        {/* palco: corpo feito de comida */}
        <div className="relative order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="relative mx-auto aspect-[1/0.95] w-full max-w-[620px] sm:aspect-[1/1.02]">
            <div
              className="absolute inset-[5%] rounded-blob transition-colors duration-1000"
              style={{ background: formed ? "#E2F1E5" : "#EFEDE6" }}
            />
            <FoodCanvas getControls={getControls} onFrame={onFrame} count={360} className="absolute inset-0 h-full w-full" />

            {/* mensagem do João presa ao corredor */}
            <div ref={bubble} className="pointer-events-none absolute left-0 top-0 will-change-transform">
              <div
                key={msg}
                className={`max-w-[200px] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-soft transition-opacity duration-500 ${formed ? "animate-[fase_0.5s_ease] opacity-100" : "opacity-0"}`}
              >
                <p className="text-[11px] font-semibold text-leaf">João · agora</p>
                <p className="text-[14px] leading-snug text-ink">{hero.mensagens[msg]}</p>
              </div>
            </div>

            {/* o que vem junto com o plano */}
            {hero.selos.map((s, i) => (
              <span
                key={s}
                className="absolute whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-leaf-deep shadow-soft transition-all duration-700 sm:px-3.5 sm:py-2 sm:text-[13px]"
                style={{
                  ...[{ left: "2%", top: "54%" }, { right: "2%", top: "72%" }, { left: "3%", top: "84%" }][i],
                  opacity: formed ? 1 : 0,
                  transform: `translateY(${formed ? 0 : 12}px)`,
                  transitionDelay: `${300 + i * 180}ms`,
                }}
              >
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-leaf" />
                {s}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-1 flex max-w-[460px] items-center justify-between gap-3 px-2">
            <p className="text-[13px] font-medium text-mute" aria-live="polite">
              {formed ? (
                <>
                  <span className="text-leaf">●</span> {hero.depois}
                </>
              ) : (
                <>
                  <span className="text-[#A0A8A2]">●</span> {hero.antes}
                </>
              )}
            </p>
            <button type="button" onClick={replay} className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-2 hover:border-leaf">
              ↺ ver de novo
            </button>
          </div>
          <p className="mt-2 text-center text-[12px] text-mute">Passe o dedo ou o mouse na comida</p>
        </div>
      </div>
    </section>
  );
}
