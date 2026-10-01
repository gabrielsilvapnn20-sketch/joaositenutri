"use client";

import { useEffect, useMemo, useState } from "react";
import ReelPhone from "./ReelPhone";
import Mosaic from "./Mosaic";
import { objetivosLabel, resultados, type Objetivo } from "@content/resultados";
import { track } from "@/lib/track";

const filtros: (Objetivo | "todos")[] = ["todos", "hipertrofia", "emagrecimento", "rotina", "performance"];

export default function Resultados() {
  const [filtro, setFiltro] = useState<Objetivo | "todos">("todos");

  // quem já fez o diagnóstico vê primeiro casos do mesmo objetivo
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("jv_jornada") || "{}");
      if (saved?.respostas?.objetivo) setFiltro(saved.respostas.objetivo);
    } catch {
      /* sem storage */
    }
  }, []);

  const itens = useMemo(
    () => (filtro === "todos" ? resultados : [...resultados].sort((a, b) => Number(b.objetivo === filtro) - Number(a.objetivo === filtro))),
    [filtro],
  );
  const comparativo = resultados.find((r) => r.antes && r.depois);

  return (
    <section id="resultados" className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="gutter grid grid-cols-1 gap-14 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-20">
        <div className="min-w-0">
          <p className="label" data-reveal>08 / RESULTADOS REAIS</p>
          <h2 className="wide mt-4 text-[clamp(2.2rem,6vw,5.4rem)] font-bold uppercase leading-[0.9] tracking-tighter" data-reveal>
            Quem seguiu<br />o plano <span className="text-signal">conta.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-bone/75" data-reveal>
            Depoimentos dos pacientes, direto do Instagram. Escolha o objetivo parecido com o seu.
          </p>
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por objetivo">
            {filtros.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filtro === f}
                onClick={() => {
                  setFiltro(f);
                  track("filtro_resultados", { objetivo: f });
                }}
                className={`border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  filtro === f ? "border-signal bg-signal text-ink" : "border-line text-bone/80 hover:border-bone"
                }`}
              >
                {f === "todos" ? "Todos" : objetivosLabel[f]}
              </button>
            ))}
          </div>

          {comparativo?.antes && comparativo.depois && (
            <div className="mt-12 grid max-w-xl grid-cols-2 gap-3 border border-line p-3 sm:gap-4">
              <Mosaic antes={comparativo.antes} depois={comparativo.depois} className="aspect-[3/4]" />
              <div className="flex min-w-0 flex-col justify-between gap-3 sm:p-2">
                <p className="label">COMPARATIVO / {comparativo.paciente}</p>
                <p className="wide break-words text-xl font-bold uppercase leading-none tracking-tight sm:text-3xl">{comparativo.destaque}</p>
                <p className="text-[13px] leading-snug text-bone/70 sm:text-sm">{comparativo.legenda}</p>
                <p className="font-mono text-[10px] text-mute">Imagens publicadas com autorização do paciente.</p>
              </div>
            </div>
          )}
        </div>

        <ReelPhone itens={itens} />
      </div>
    </section>
  );
}
