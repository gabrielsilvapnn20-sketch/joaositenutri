"use client";

import { useEffect, useRef } from "react";
import { metodo } from "@content/site";
import { ease, range, stickyProgress } from "@/lib/scroll";

/** Cards que entram em perspectiva e se empilham como fichas técnicas. */
export default function Metodo() {
  const section = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = stickyProgress(section.current);
      const n = cards.current.length;
      let active = 0;
      cards.current.forEach((el, i) => {
        if (!el) return;
        const enter = i === 0 ? 1 : ease(range(p, (i - 0.6) / n, (i + 0.15) / n));
        const after = range(p, (i + 0.2) / n, (i + 1) / n); // quanto já foi coberto pelos próximos
        if (enter > 0.5) active = i;
        const depth = Math.min(after * (n - 1 - i), 3);
        el.style.transform = `translate3d(0, ${(1 - enter) * 85 - depth * 3.2}vh, ${-depth * 70}px) rotateX(${(1 - enter) * -38}deg) scale(${1 - depth * 0.035})`;
        el.style.opacity = String(enter < 0.02 ? 0 : 1);
        el.style.filter = `brightness(${1 - depth * 0.22})`;
      });
      if (counter.current) counter.current.textContent = metodo[active].n;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="metodo" ref={section} className="relative h-[420vh]">
      <div className="gutter sticky top-0 grid h-[100svh] grid-rows-[auto_1fr] gap-6 pb-8 pt-24 lg:grid-cols-[1fr_1.3fr] lg:grid-rows-1 lg:items-center">
        <div>
          <p className="label">06 / O MÉTODO</p>
          <h2 className="wide mt-4 text-[clamp(2.2rem,6vw,5.2rem)] font-bold uppercase leading-[0.9] tracking-tighter">
            Quatro etapas.<br />
            <span className="text-mute">Zero achismo.</span>
          </h2>
          <p className="mt-6 hidden font-mono text-[clamp(4rem,10vw,9rem)] leading-none text-signal lg:block">
            <span ref={counter}>01</span>
            <span className="text-line">/04</span>
          </p>
        </div>
        <div className="relative h-full min-h-[340px] [perspective:1400px] lg:h-[62vh]">
          {metodo.map((m, i) => (
            <div
              key={m.n}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className="absolute inset-0 flex origin-bottom flex-col justify-between border border-line bg-ink-2 p-6 will-change-transform sm:p-10"
              style={{ zIndex: i + 1, opacity: i === 0 ? 1 : 0 }}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-sm text-signal">{m.n}</span>
                <span className="label">{m.dado}</span>
              </div>
              <div>
                <h3 className="wide text-[clamp(2.4rem,7vw,5.5rem)] font-bold uppercase leading-none tracking-tighter">{m.titulo}</h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-bone/75 sm:text-lg">{m.texto}</p>
              </div>
              <div className="flex gap-1" aria-hidden>
                {metodo.map((_, j) => (
                  <span key={j} className={`h-[3px] flex-1 ${j <= i ? "bg-signal" : "bg-line"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
