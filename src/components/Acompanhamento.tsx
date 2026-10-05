"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FoodCanvas from "./FoodCanvas";
import { jornada } from "@content/site";
import { getSprites } from "@/lib/foods";
import { stickyProgress } from "@/lib/scroll";

/** O corredor de comida passa pelas "estações" do acompanhamento conforme o scroll. */
export default function Acompanhamento() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const ground = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [ativa, setAtiva] = useState(0);
  const [comidas, setComidas] = useState<string[]>([]);
  const n = jornada.estacoes.length;

  useEffect(() => {
    setComidas(getSprites().healthy.slice(0, 8).map((c) => c.toDataURL()));
  }, []);

  const getControls = useCallback(() => {
    const p = stickyProgress(section.current);
    progress.current += (p - progress.current) * 0.15;
    const v = progress.current;
    const i = Math.min(n - 1, Math.floor(v * n * 0.999));
    setAtiva((a) => (a === i ? a : i));
    if (ground.current) ground.current.style.backgroundPosition = `${-v * 2600}px 0`;
    if (bar.current) bar.current.style.transform = `scaleX(${v})`;
    const wide = typeof window !== "undefined" && window.innerWidth >= 1024;
    // ao longo da jornada o corpo afina e o ritmo aumenta
    return { form: 1, pose: "run" as const, girth: 1.32 - 0.36 * v, speed: 4.5 + 5 * v, centerX: wide ? 0.5 : 0.5, size: 0.95 };
  }, [n]);

  const e = jornada.estacoes[ativa];

  return (
    <section id="como-funciona" ref={section} className="relative bg-white" style={{ height: `${n * 90 + 60}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-20 sm:pt-24">
        <div className="gutter">
          <p className="label">Como funciona</p>
          <h2 className="serif mt-2 text-[clamp(1.9rem,4.4vw,3.6rem)] font-medium leading-[1.04]">
            {jornada.titulo} <em className="italic text-leaf">{jornada.destaque}</em>
          </h2>
        </div>

        <div className="gutter relative grid flex-1 grid-rows-[1fr_auto] gap-4 pb-6 lg:grid-cols-[1fr_1fr] lg:grid-rows-1 lg:items-center lg:gap-10">
          {/* pista */}
          <div className="relative h-full min-h-[240px]">
            <FoodCanvas getControls={getControls} count={280} seed={11} className="absolute inset-0 h-full w-full" />
            <div
              ref={ground}
              aria-hidden
              className="absolute inset-x-0 bottom-[7%] h-[3px] opacity-70"
              style={{ backgroundImage: "repeating-linear-gradient(90deg, #CDE8D4 0 28px, transparent 28px 52px)" }}
            />
          </div>

          {/* estação atual */}
          <div className="relative">
            <div key={e.id} className="animate-[fase_0.6s_cubic-bezier(.2,.7,.1,1)] rounded-[28px] border border-line bg-paper p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="serif grid h-10 w-10 place-items-center rounded-full bg-leaf text-lg text-white">{ativa + 1}</span>
                <h3 className="serif text-2xl font-medium sm:text-3xl">{e.titulo}</h3>
              </div>
              <p className="mt-3 text-ink-2 sm:text-lg">{e.texto}</p>
              <div className="mt-5 min-h-[120px]">
                <Estacao id={e.id} comidas={comidas} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mint">
                <div ref={bar} className="h-full origin-left rounded-full bg-leaf" style={{ transform: "scaleX(0)" }} />
              </div>
              <span className="text-[12px] font-semibold tabular-nums text-mute">
                {ativa + 1}/{n}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------- mini-animações de cada estação */

function useSequencia(total: number, passo = 450) {
  const [k, setK] = useState(0);
  useEffect(() => {
    setK(0);
    const id = setInterval(() => setK((x) => (x >= total ? x : x + 1)), passo);
    return () => clearInterval(id);
  }, [total, passo]);
  return k;
}

function Estacao({ id, comidas }: { id: string; comidas: string[] }) {
  if (id === "avaliacao") return <Fita />;
  if (id === "plano") return <Prato comidas={comidas} />;
  if (id === "conversa") return <Chat />;
  if (id === "motivacao") return <Sequencia />;
  return <Grafico />;
}

function Fita() {
  const k = useSequencia(4, 380);
  const itens = ["Peso e medidas", "Composição corporal", "Rotina e treino", "Comidas favoritas"];
  return (
    <div>
      <svg viewBox="0 0 300 40" className="w-full" aria-hidden>
        <rect x="0" y="10" width="300" height="20" rx="4" fill="#F4C152" />
        {Array.from({ length: 31 }, (_, i) => (
          <line key={i} x1={i * 10} x2={i * 10} y1="10" y2={i % 5 ? 17 : 22} stroke="#7a5a1a" strokeWidth="1.2" />
        ))}
        <rect x="0" y="10" width="300" height="20" rx="4" fill="#fff" style={{ transformOrigin: "300px 0", transform: `scaleX(${1 - k / 4})`, transition: "transform .4s ease" }} />
      </svg>
      <div className="mt-3 flex flex-wrap gap-2">
        {itens.map((t, i) => (
          <span key={t} className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-all duration-300 ${i < k ? "bg-mint text-leaf-deep" : "bg-white text-mute/50"}`}>
            {i < k ? "✓ " : ""}
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Prato({ comidas }: { comidas: string[] }) {
  const k = useSequencia(comidas.length, 260);
  return (
    <div className="flex items-center gap-5">
      <div className="relative h-32 w-32 shrink-0 rounded-full bg-white shadow-soft ring-8 ring-mint">
        {comidas.map((src, i) => {
          const a = (i / comidas.length) * Math.PI * 2;
          const r = i === 0 ? 0 : 32;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="absolute h-11 w-11 transition-all duration-500"
              style={{
                left: `calc(50% + ${Math.cos(a) * r}px - 22px)`,
                top: `calc(50% + ${Math.sin(a) * r}px - 22px)`,
                opacity: i < k ? 1 : 0,
                transform: `scale(${i < k ? 1 : 0.3}) rotate(${i * 40}deg)`,
              }}
            />
          );
        })}
      </div>
      <p className="text-sm text-ink-2">
        <strong className="block text-ink">Seu prato, do seu jeito.</strong>
        Com as comidas que você gosta e nos horários da sua rotina.
      </p>
    </div>
  );
}

function Chat() {
  const k = useSequencia(jornada.conversa.length * 2, 650);
  return (
    <div className="space-y-2 rounded-2xl bg-[#ECE5DD] p-3">
      {jornada.conversa.map((m, i) => {
        const show = k >= i * 2 + 1;
        const typing = k === i * 2 && m.de === "joao";
        if (!show && !typing) return null;
        const joao = m.de === "joao";
        return (
          <div key={i} className={`flex ${joao ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[80%] animate-[fase_0.35s_ease] rounded-xl px-3 py-2 text-[14px] shadow-sm ${joao ? "rounded-tl-sm bg-white" : "rounded-tr-sm bg-[#D9FDD3]"}`}>
              {joao && <p className="text-[11px] font-semibold text-leaf">João</p>}
              {typing ? <span className="tracking-widest text-mute">digitando…</span> : m.texto}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Sequencia() {
  const k = useSequencia(7, 300);
  const dias = ["S", "T", "Q", "Q", "S", "S", "D"];
  return (
    <div>
      <div className="flex gap-2">
        {dias.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition-all duration-300 ${i < k ? "scale-100 bg-leaf text-white" : "scale-90 bg-mint text-leaf-deep/40"}`}
            >
              {i < k ? "✓" : ""}
            </span>
            <span className="text-[11px] font-medium text-mute">{d}</span>
          </div>
        ))}
      </div>
      <p className={`mt-4 text-[15px] font-semibold transition-opacity duration-500 ${k >= 7 ? "opacity-100" : "opacity-0"}`}>
        🔥 7 dias seguidos. <span className="font-normal text-ink-2">Eu tô vendo, hein!</span>
      </p>
    </div>
  );
}

function Grafico() {
  const k = useSequencia(1, 200);
  return (
    <div className="flex items-end gap-5">
      <svg viewBox="0 0 220 110" className="h-28 w-56 shrink-0" aria-hidden>
        <line x1="0" y1="105" x2="220" y2="105" stroke="#CDE8D4" strokeWidth="2" />
        <path
          d="M5 95 C40 92 60 80 85 74 S130 50 150 40 S195 16 215 10"
          fill="none"
          stroke="#2E9C5A"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="300"
          strokeDashoffset={k ? 0 : 300}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.2,.7,.1,1)" }}
        />
        <circle cx="215" cy="10" r="7" fill="#F4C152" opacity={k ? 1 : 0} style={{ transition: "opacity .4s 1.4s" }} />
      </svg>
      <p className="text-sm text-ink-2">
        <strong className="block text-ink">Energia, disposição, autoestima.</strong>
        E números novos na reavaliação para provar.
      </p>
    </div>
  );
}
