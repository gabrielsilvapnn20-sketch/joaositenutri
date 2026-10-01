import { contato, sobre } from "@content/site";

export default function Sobre() {
  return (
    <section className="border-t border-line py-24 sm:py-32">
      <div className="gutter grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {/* TODO: substituir pela foto do ensaio (public/joao/retrato.jpg) */}
        <div className="relative aspect-[4/5] overflow-hidden border border-line bg-ink-2" data-reveal>
          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(135deg, #1e201b 0 14px, #191b17 14px 28px)" }} />
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="label !text-signal">PLACEHOLDER</p>
              <p className="mt-2 font-mono text-xs text-bone/60">Retrato do João · ensaio profissional</p>
            </div>
          </div>
          <span className="label absolute bottom-4 left-4">{contato.crn}</span>
        </div>
        <div>
          <p className="label" data-reveal>10 / QUEM ESTÁ POR TRÁS</p>
          <h2 className="wide mt-4 text-[clamp(2.2rem,6vw,5rem)] font-bold uppercase leading-[0.9] tracking-tighter" data-reveal>
            {sobre.titulo}
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-bone/80">
            {sobre.texto.map((t) => (
              <p key={t} data-reveal>{t}</p>
            ))}
          </div>
          <ul className="mt-10 border-t border-line">
            {sobre.credenciais.map((c, i) => (
              <li key={c} className="flex items-center justify-between border-b border-line py-4" data-reveal>
                <span>{c}</span>
                <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
