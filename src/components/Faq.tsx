import { faq } from "@content/site";

export default function Faq() {
  return (
    <section className="py-20 sm:py-28">
      <div className="gutter mx-auto max-w-3xl">
        <p className="label text-center" data-reveal>Dúvidas</p>
        <h2 className="h-section mt-3 text-center" data-reveal>Antes de começar</h2>
        <div className="mt-12 space-y-3">
          {faq.map((f) => (
            <details key={f.p} className="group rounded-[22px] border border-line bg-white px-6 open:shadow-soft">
              <summary className="flex cursor-pointer list-none items-center gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <span className="flex-1 text-[17px] font-semibold">{f.p}</span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint text-leaf-deep transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="pb-6 pr-10 leading-relaxed text-ink-2">{f.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
