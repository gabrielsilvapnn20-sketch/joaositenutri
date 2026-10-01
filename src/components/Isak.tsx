"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BodyCanvas from "./BodyCanvas";
import { isak } from "@content/site";

function CountUp({ to, decimals, run }: { to: number; decimals: number; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 1600);
      setV(to * (1 - Math.pow(1 - k, 4)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

export default function Isak() {
  const box = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setRun(true), { threshold: 0.35 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  const getState = useCallback(
    (t: number) => ({ rotation: -0.5 + t * 0.35, explode: 0.25, layers: 1, labels: 1, scan: -1, girth: 1, highlight: 1 }),
    [],
  );

  const magra = isak.medidas[0].valor;
  const gordura = isak.medidas[1].valor;

  return (
    <section className="relative border-t border-line py-24 sm:py-32">
      <div className="gutter grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="label" data-reveal>07 / ANTROPOMETRIA ISAK</p>
          <h2 className="wide mt-4 text-[clamp(2rem,5vw,4.2rem)] font-bold uppercase leading-[0.92] tracking-tighter" data-reveal>
            {isak.titulo}
          </h2>
          <p className="mt-6 max-w-lg text-lg text-bone/75" data-reveal>{isak.texto}</p>

          <div ref={box} className="mt-12 grid grid-cols-2 border-l border-t border-line">
            {isak.medidas.map((m) => (
              <div key={m.rotulo} className="border-b border-r border-line p-4 sm:p-6">
                <p className="label">{m.rotulo}</p>
                <p className="mt-3 font-mono text-[clamp(1.8rem,4vw,2.8rem)] leading-none tabular-nums">
                  <CountUp to={m.valor} decimals={m.valor % 1 ? 1 : 0} run={run} />
                  <span className="ml-1 text-base text-mute">{m.unidade}</span>
                </p>
                <p className="mt-2 font-mono text-xs text-signal">{m.delta} em 12 sem.</p>
              </div>
            ))}
          </div>

          {/* composição corporal */}
          <div className="mt-8">
            <div className="flex h-10 w-full overflow-hidden border border-line">
              <div className="h-full bg-signal transition-[width] duration-[1600ms] ease-out" style={{ width: run ? `${magra}%` : "0%" }} />
              <div className="h-full bg-bone/80 transition-[width] delay-300 duration-[1600ms] ease-out" style={{ width: run ? `${gordura}%` : "0%" }} />
              <div className="h-full flex-1 bg-ink-3" />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <span className="label flex items-center gap-2"><i className="h-2 w-2 bg-signal" /> Massa magra</span>
              <span className="label flex items-center gap-2"><i className="h-2 w-2 bg-bone/80" /> Gordura</span>
              <span className="label flex items-center gap-2"><i className="h-2 w-2 bg-ink-3 outline outline-1 outline-line" /> Ossos, água e órgãos</span>
            </div>
            <p className="mt-4 font-mono text-[11px] text-mute">* {isak.nota}</p>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full border border-line bg-ink-2">
          <span className="label absolute left-4 top-4">FICHA / ANTROPOMÉTRICA</span>
          <span className="label absolute bottom-4 right-4">ISAK · NÍVEL 1</span>
          <BodyCanvas getState={getState} scale={0.92} className="absolute inset-0 h-full w-full" ariaLabel="Pontos de medida da antropometria ISAK" />
        </div>
      </div>
    </section>
  );
}
