import { beneficios } from "@content/site";
import Leaf from "./Leaf";

const bg = { mint: "bg-mint", sand: "bg-sand", white: "bg-white" } as const;

export default function Beneficios() {
  return (
    <section className="py-20 sm:py-28">
      <div className="gutter grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="label" data-reveal>O que muda</p>
          <h2 className="h-section mt-3" data-reveal>
            Não é sobre fazer dieta. É sobre <em className="italic text-leaf">se sentir bem</em> de novo.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {beneficios.map((b, i) => (
            <div key={b.titulo} className={`relative overflow-hidden rounded-[28px] p-7 ${bg[b.cor]} ${b.cor === "white" ? "shadow-soft" : ""} ${i % 2 ? "sm:translate-y-8" : ""}`} data-reveal>
              <Leaf className="absolute -right-3 -top-3 h-14 w-14 rotate-12 text-leaf/15" />
              <h3 className="serif text-2xl font-medium">{b.titulo}</h3>
              <p className="mt-3 text-ink-2">{b.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
