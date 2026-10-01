"use client";

import Link from "next/link";
import Leaf from "./Leaf";
import { whatsappUrl } from "@/lib/whatsapp";
import { track } from "@/lib/track";

export default function CtaFinal() {
  return (
    <section className="gutter pb-20">
      <div className="relative overflow-hidden rounded-[36px] bg-leaf px-6 py-16 text-center text-white sm:px-12 sm:py-24">
        <Leaf className="absolute -left-6 top-6 h-24 w-24 -rotate-12 text-white/15" />
        <Leaf className="absolute -right-4 bottom-4 h-32 w-32 rotate-45 text-white/10" />
        <h2 className="serif mx-auto max-w-3xl text-[clamp(2.3rem,6vw,4.8rem)] font-medium leading-[1.02]">
          O melhor dia pra começar é <em className="italic">hoje</em>. O segundo melhor é segunda.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-white/85">Manda um oi. Sem compromisso, sem julgamento. A gente vê junto o melhor caminho pra você.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl("Oi João! Vi seu site e quero começar.")}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { local: "final" })}
            className="btn-leaf !bg-white !text-leaf-deep hover:!bg-mint"
          >
            Chamar no WhatsApp →
          </a>
          <Link href="/diagnostico" target="_blank" onClick={() => track("quiz_open", { local: "final" })} className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-4 font-semibold hover:bg-white/10">
            Fazer o teste de 2 min ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
