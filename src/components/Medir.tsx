import { medir } from "@content/site";

export default function Medir() {
  return (
    <section className="bg-leaf-deep py-20 text-white sm:py-28">
      <div className="gutter grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="label !text-leaf-soft" data-reveal>Avaliação ISAK</p>
          <h2 className="serif mt-3 text-[clamp(2.1rem,5vw,4rem)] font-medium leading-[1.04]" data-reveal>{medir.titulo}</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80" data-reveal>{medir.texto}</p>
        </div>
        <div className="rounded-[28px] bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8" data-reveal>
          {medir.barras.map((b) => (
            <div key={b.rotulo} className="mb-7 last:mb-0">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{b.rotulo}</span>
                <span className="text-white/70">72 kg</span>
              </div>
              <div className="mt-3 flex h-12 overflow-hidden rounded-full bg-white/10">
                <div className="flex items-center bg-leaf pl-4 text-sm font-semibold" style={{ width: `${b.magra}%` }}>{b.magra}% músculo e massa magra</div>
                <div className="flex items-center justify-center bg-sun text-sm font-semibold text-ink" style={{ width: `${b.gordura}%` }}>{b.gordura}%</div>
              </div>
            </div>
          ))}
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/75">
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-leaf" /> Massa magra</span>
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-sun" /> Gordura</span>
          </div>
          <p className="mt-4 text-xs text-white/50">{medir.nota}</p>
        </div>
      </div>
    </section>
  );
}
