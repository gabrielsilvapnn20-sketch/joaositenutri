"use client";

import Link from "next/link";
import { planos, type Plano } from "@content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { track } from "@/lib/track";

const preco = (p: Plano) =>
  p.preco === null ? "R$ —" : p.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default function Planos() {
  // trimestral no centro, em destaque
  const ordem = [planos[0], planos[1], planos[2]];
  return (
    <section id="planos" className="border-t border-line py-24 sm:py-32">
      <div className="gutter">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="label" data-reveal>09 / PLANOS</p>
            <h2 className="wide mt-4 text-[clamp(2.2rem,6vw,5.4rem)] font-bold uppercase leading-[0.9] tracking-tighter" data-reveal>
              Escolha<br />seu ritmo.
            </h2>
          </div>
          <p className="max-w-sm text-bone/70" data-reveal>
            Não sabe qual é o seu? O diagnóstico indica o plano ideal para o seu objetivo e rotina.
          </p>
        </div>

        <div className="mt-14 grid gap-px bg-line lg:grid-cols-3">
          {ordem.map((p) => (
            <article
              key={p.id}
              className={`relative flex flex-col p-6 sm:p-8 ${p.destaque ? "bg-bone text-ink lg:-my-6 lg:py-14" : "bg-ink"}`}
              data-reveal
            >
              {p.destaque && (
                <span className="absolute right-0 top-0 bg-signal px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
                  Mais escolhido
                </span>
              )}
              <p className={`label ${p.destaque ? "!text-ink/60" : ""}`}>{p.formato}</p>
              <h3 className="wide mt-2 text-2xl font-bold uppercase tracking-tight">{p.nome}</h3>
              <p className="mt-8 font-mono text-5xl tracking-tight">
                {preco(p)}
                <span className={`ml-1 text-sm ${p.destaque ? "text-ink/60" : "text-mute"}`}>{p.periodo}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {p.itens.map((i) => (
                  <li key={i} className="flex gap-3 text-[15px]">
                    <span className="text-signal">+</span> {i}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-2">
                <Link
                  href={`/diagnostico?plano=${p.id}`}
                  onClick={() => track("cta_click", { local: "planos", plano: p.id })}
                  className={p.destaque ? "btn-signal justify-center" : "btn-ghost justify-center"}
                >
                  Fazer diagnóstico →
                </Link>
                <a
                  href={whatsappUrl(`Oi João! Vi no site o plano ${p.nome} (${p.formato}) e quero saber mais.`)}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("whatsapp_click", { local: "planos", plano: p.id })}
                  className={`py-2 text-center font-mono text-[11px] uppercase tracking-[0.12em] underline-offset-4 hover:underline ${
                    p.destaque ? "text-ink/70" : "text-mute"
                  }`}
                >
                  ou falar no WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
