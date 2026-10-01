import { faq } from "@content/site";

export default function Faq() {
  return (
    <section className="border-t border-line py-24 sm:py-32">
      <div className="gutter grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="label" data-reveal>11 / DÚVIDAS</p>
          <h2 className="wide mt-4 text-[clamp(2.2rem,5vw,4.4rem)] font-bold uppercase leading-[0.9] tracking-tighter" data-reveal>
            Antes de<br />começar.
          </h2>
        </div>
        <div className="border-t border-line">
          {faq.map((f, i) => (
            <details key={f.p} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start gap-5 py-6 [&::-webkit-details-marker]:hidden">
                <span className="pt-1 font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-lg sm:text-xl">{f.p}</span>
                <span className="mt-1 font-mono text-lg text-mute transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="pb-7 pl-10 pr-8 text-bone/70">{f.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
