import { passos } from "@content/site";

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white py-20 sm:py-28">
      <div className="gutter">
        <div className="max-w-2xl">
          <p className="label" data-reveal>Como funciona</p>
          <h2 className="h-section mt-3" data-reveal>
            Simples de começar. <em className="italic text-leaf">Fácil de manter.</em>
          </h2>
          <p className="mt-4 text-lg text-ink-2" data-reveal>Você não precisa mudar tudo de uma vez. A gente vai junto, passo a passo.</p>
        </div>
        <ol className="relative mt-14 grid gap-5 lg:grid-cols-3">
          <span aria-hidden className="absolute left-[16%] right-[16%] top-11 hidden border-t-2 border-dashed border-mint-2 lg:block" />
          {passos.map((p) => (
            <li key={p.n} className="relative rounded-[28px] border border-line bg-paper p-7 sm:p-8" data-reveal>
              <span className="serif grid h-14 w-14 place-items-center rounded-full bg-leaf text-2xl text-white">{p.n}</span>
              <h3 className="serif mt-6 text-2xl font-medium">{p.titulo}</h3>
              <p className="mt-3 text-ink-2">{p.texto}</p>
              <p className="mt-6 inline-block rounded-full bg-mint px-3 py-1 text-[13px] font-medium text-leaf-deep">{p.tempo}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
