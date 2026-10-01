"use client";

import Link from "next/link";
import { track } from "@/lib/track";

export default function CtaFinal() {
  return (
    <section data-header="ink" className="relative overflow-hidden bg-signal py-24 text-ink sm:py-36">
      <div className="gutter">
        <p className="label !text-ink/70">12 / PRÓXIMO PASSO</p>
        <h2 className="wide mt-6 text-[clamp(2.6rem,10vw,9.5rem)] font-bold uppercase leading-[0.86] tracking-tightest">
          Seu diagnóstico<br />leva 2 minutos.
        </h2>
        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
          <Link
            href="/diagnostico"
            onClick={() => track("cta_click", { local: "final" })}
            className="inline-flex items-center gap-3 bg-ink px-7 py-5 font-mono text-[12px] uppercase tracking-[0.14em] text-bone transition-transform hover:scale-[1.02]"
          >
            Começar agora →
          </Link>
          <p className="max-w-xs text-sm text-ink/75">Gratuito. Você recebe seu perfil e o que está travando seu resultado.</p>
        </div>
      </div>
    </section>
  );
}
