"use client";

import { useEffect, useRef } from "react";
import { dor } from "@content/site";
import { stickyProgress } from "@/lib/scroll";

/** As palavras "acendem" conforme o scroll — leitura no ritmo do visitante. */
export default function Dor() {
  const section = useRef<HTMLElement>(null);
  const words = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = stickyProgress(section.current);
      const n = words.current.length;
      words.current.forEach((w, i) => {
        const local = Math.min(1, Math.max(0, p * 1.25 * n - i));
        w.style.opacity = String(0.14 + local * 0.86);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  let idx = 0;
  return (
    <section ref={section} data-header="ink" className="relative h-[230vh] bg-bone text-ink">
      <div className="gutter sticky top-0 flex h-[100svh] flex-col justify-center pt-16">
        <p className="label !text-ink/50">05 / DIAGNÓSTICO DE ROTINA</p>
        <h2 className="wide mt-6 text-[clamp(2.1rem,6.2vw,5.4rem)] font-bold uppercase leading-[0.92] tracking-tighter">
          {dor.linhas.map((linha, li) => (
            <span key={li} className={`block ${li === dor.linhas.length - 1 ? "text-signal" : ""}`}>
              {linha.split(" ").map((w) => {
                const i = idx++;
                return (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) words.current[i] = el;
                    }}
                    className="inline-block pr-[0.22em] opacity-[0.14]"
                  >
                    {w}
                  </span>
                );
              })}
            </span>
          ))}
        </h2>
        <p className="mt-10 max-w-xl text-lg leading-snug text-ink/75 sm:text-xl" data-reveal>
          {dor.fecho}
        </p>
      </div>
    </section>
  );
}
