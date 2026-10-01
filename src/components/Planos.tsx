"use client";

import { planos, type Plano } from "@content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { track } from "@/lib/track";

const preco = (p: Plano) =>
  p.preco === null ? "R$ —" : p.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default function Planos() {
  return (
    <section id="planos" className="py-20 sm:py-28">
      <div className="gutter">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label" data-reveal>Planos</p>
          <h2 className="h-section mt-3" data-reveal>Escolha como quer começar.</h2>
          <p className="mt-4 text-lg text-ink-2" data-reveal>Online de qualquer lugar ou presencial em Goiás. Na dúvida, me chama que eu te ajudo a escolher.</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl items-stretch gap-5 lg:grid-cols-3">
          {planos.map((p) => (
            <article
              key={p.id}
              className={`relative flex flex-col rounded-[28px] p-7 sm:p-8 ${p.destaque ? "bg-leaf-deep text-white shadow-soft lg:-my-4 lg:py-12" : "border border-line bg-white"}`}
              data-reveal
            >
              {p.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sun px-4 py-1.5 text-[12px] font-bold text-ink">Mais escolhido</span>
              )}
              <p className={`text-[13px] font-semibold uppercase tracking-wider ${p.destaque ? "text-leaf-soft" : "text-leaf"}`}>{p.formato}</p>
              <h3 className="serif mt-2 text-3xl font-medium">{p.nome}</h3>
              <p className="mt-6 text-4xl font-semibold tracking-tight">
                {preco(p)}
                <span className={`ml-1 text-sm font-normal ${p.destaque ? "text-white/60" : "text-mute"}`}>{p.periodo}</span>
              </p>
              <ul className="mt-7 flex-1 space-y-3">
                {p.itens.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px]">
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] ${p.destaque ? "bg-leaf text-white" : "bg-mint text-leaf-deep"}`}>✓</span>
                    {i}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappUrl(`Oi João! Tenho interesse no plano ${p.nome} (${p.formato}).`)}
                target="_blank"
                rel="noopener"
                onClick={() => track("whatsapp_click", { local: "planos", plano: p.id })}
                className={`mt-8 ${p.destaque ? "btn-leaf !bg-white !text-leaf-deep hover:!bg-mint" : "btn-soft"}`}
              >
                Quero esse plano
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
