"use client";

import Link from "next/link";
import { useCallback } from "react";
import BodyCanvas from "./BodyCanvas";
import { track } from "@/lib/track";

/** Convite para o quiz — abre em nova aba, só para quem quiser. */
export default function QuizTeaser() {
  const getState = useCallback((t: number) => ({ rotation: t * 0.5, girth: 1, sex: "f" as const, tone: 1, scan: (t * 0.3) % 1, labels: 1 }), []);
  return (
    <section className="py-20 sm:py-28">
      <div className="gutter">
        <div className="relative grid overflow-hidden rounded-[36px] bg-mint lg:grid-cols-[1.2fr_1fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="label">Teste gratuito · 2 minutos</p>
            <h2 className="h-section mt-3">
              Descubra seu <em className="italic text-leaf">perfil</em> e o que está travando seu resultado.
            </h2>
            <p className="mt-5 max-w-md text-lg text-ink-2">
              Responda umas perguntas leves sobre sua rotina. No final você recebe um diagnóstico personalizado e já sabe por onde começar.
            </p>
            <ul className="mt-6 space-y-2 text-ink-2">
              {["Sem cadastro chato", "Resultado na hora", "Dá pra compartilhar nos stories"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-leaf text-[11px] text-white">✓</span>{t}</li>
              ))}
            </ul>
            <Link href="/diagnostico" target="_blank" onClick={() => track("quiz_open", { local: "teaser" })} className="btn-leaf mt-8">
              Fazer meu teste ↗
            </Link>
          </div>
          <div className="relative min-h-[320px]">
            <div className="absolute inset-8 rounded-blob bg-white/70" />
            <BodyCanvas getState={getState} scale={0.82} className="absolute inset-0 h-full w-full" ariaLabel="Ilustração do teste de perfil" />
          </div>
        </div>
      </div>
    </section>
  );
}
