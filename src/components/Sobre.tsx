import { contato, sobre } from "@content/site";
import Leaf from "./Leaf";

export default function Sobre() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="gutter grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {/* TODO: substituir pela foto do ensaio (public/joao/retrato.jpg) */}
        <div className="relative mx-auto w-full max-w-md" data-reveal>
          <div className="aspect-[4/5] overflow-hidden rounded-blob bg-mint">
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-leaf">Placeholder</p>
                <p className="mt-2 text-sm text-ink-2">Foto do João · ensaio</p>
              </div>
            </div>
          </div>
          <Leaf className="absolute -bottom-4 -left-4 h-20 w-20 -rotate-12 text-leaf floaty" />
          <span className="absolute right-0 top-8 rounded-full bg-white px-4 py-2 text-[13px] font-semibold shadow-soft">{contato.crn}</span>
        </div>
        <div>
          <p className="label" data-reveal>Quem vai te acompanhar</p>
          <h2 className="h-section mt-3" data-reveal>{sobre.titulo}</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-2">
            {sobre.texto.map((t) => (
              <p key={t} data-reveal>{t}</p>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {sobre.credenciais.map((c) => (
              <li key={c} className="rounded-full bg-mint px-4 py-2 text-[14px] font-medium text-leaf-deep" data-reveal>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
