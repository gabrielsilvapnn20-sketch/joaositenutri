"use client";

import Link from "next/link";
import { useState } from "react";
import { identifica } from "@content/site";
import { track } from "@/lib/track";

/** Micro-interação: a pessoa marca o que vive. Gera identificação sem esforço. */
export default function Identifica() {
  const [marcados, setMarcados] = useState<number[]>([]);
  const toggle = (i: number) => {
    setMarcados((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]));
    track("identifica_toggle", { item: i });
  };
  const n = marcados.length;

  return (
    <section className="py-20 sm:py-28">
      <div className="gutter mx-auto max-w-5xl text-center">
        <p className="label" data-reveal>Rapidinho</p>
        <h2 className="h-section mt-3" data-reveal>{identifica.titulo}</h2>
        <p className="mt-3 text-mute" data-reveal>{identifica.sub}</p>

        <div className="mt-10 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
          {identifica.itens.map((t, i) => {
            const on = marcados.includes(i);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(i)}
                className={`flex items-center gap-4 rounded-2xl border px-5 py-5 text-left text-[16px] transition-all duration-300 ${
                  on ? "border-leaf bg-mint text-leaf-deep shadow-soft" : "border-line bg-white text-ink hover:border-leaf/50"
                }`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${on ? "border-leaf bg-leaf text-white" : "border-line"}`}>
                  {on && (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {t}
              </button>
            );
          })}
        </div>

        <div className={`mx-auto mt-10 max-w-xl transition-all duration-500 ${n > 0 ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`} aria-live="polite">
          <p className="serif text-2xl leading-snug text-ink sm:text-3xl">
            {n >= 3 ? "Você marcou várias. " : ""}
            {identifica.resposta}
          </p>
          <Link href="/diagnostico" target="_blank" onClick={() => track("quiz_open", { local: "identifica", marcados: n })} className="btn-leaf mt-6">
            Ver o que está te travando ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
