"use client";

import { useEffect, useMemo, useState } from "react";
import ReelPhone from "./ReelPhone";
import Mosaic from "./Mosaic";
import { objetivosLabel, resultados, type Objetivo } from "@content/resultados";
import { track } from "@/lib/track";

const filtros: (Objetivo | "todos")[] = ["todos", "emagrecimento", "hipertrofia", "rotina", "performance"];

export default function Resultados() {
  const [filtro, setFiltro] = useState<Objetivo | "todos">("todos");

  // quem já fez o teste vê primeiro casos do mesmo objetivo
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
    <section id="resultados" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="gutter grid grid-cols-1 gap-14 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-20">
        <div className="min-w-0">
          <p className="label" data-reveal>Resultados reais</p>
          <h2 className="h-section mt-3" data-reveal>
            Quem começou, <em className="italic text-leaf">não se arrependeu.</em>
          </h2>
          <p className="mt-4 max-w-md text-lg text-ink-2" data-reveal>
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
                className={`rounded-full border px-4 py-2.5 text-[14px] font-medium transition-colors ${
                  filtro === f ? "border-leaf bg-leaf text-white" : "border-line bg-paper text-ink-2 hover:border-leaf/50"
                }`}
              >
                {f === "todos" ? "Todos" : objetivosLabel[f]}
              </button>
            ))}
          </div>

          {comparativo?.antes && comparativo.depois && (
            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 rounded-[28px] bg-paper p-3">
              <Mosaic antes={comparativo.antes} depois={comparativo.depois} className="aspect-[3/4]" />
              <div className="flex min-w-0 flex-col justify-center gap-3 pr-2">
                <p className="text-[13px] font-medium text-mute">{comparativo.paciente} · {objetivosLabel[comparativo.objetivo]}</p>
                <p className="serif text-2xl leading-tight text-leaf-deep sm:text-3xl">{comparativo.destaque}</p>
                <p className="text-[14px] leading-snug text-ink-2">{comparativo.legenda}</p>
                <p className="text-[11px] text-mute">Imagens publicadas com autorização do paciente.</p>
              </div>
            </div>
          )}
        </div>

        <ReelPhone itens={itens} />
      </div>
    </section>
  );
}
