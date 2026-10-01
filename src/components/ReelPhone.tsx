"use client";

import { useEffect, useRef, useState } from "react";
import type { Resultado } from "@content/resultados";
import { objetivosLabel } from "@content/resultados";
import { contato } from "@content/site";
import { track } from "@/lib/track";

function Icon({ d, label }: { d: string; label: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" aria-label={label}>
      <path d={d} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const ICONS = {
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  comment: "M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z",
  send: "M21 3 10 14M21 3l-7 18-4-7-7-4 18-7z",
};

function Reel({ r, active }: { r: Resultado; active: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  return (
    <article className="relative h-full w-full shrink-0 snap-start overflow-hidden bg-[#1d2a22]">
      {r.video ? (
        <video ref={video} src={r.video} poster={r.poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        // placeholder até os reels reais chegarem
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
          style={{ background: "linear-gradient(160deg, #2e9c5a 0%, #114e2f 100%)" }}>
          <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">Placeholder</span>
          <span className="text-xs text-white/75">Reel de depoimento<br />/public/reels/{r.id}.mp4</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-4 text-white">
        <div className="flex flex-col items-center"><Icon d={ICONS.heart} label="Curtidas" /><span className="text-[11px]">{r.curtidas}</span></div>
        <Icon d={ICONS.comment} label="Comentários" />
        <Icon d={ICONS.send} label="Compartilhar" />
      </div>
      <div className="absolute inset-x-3 bottom-4 text-left">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-leaf text-[10px] font-bold text-white">JV</span>
          <span className="text-[13px] font-semibold">{contato.instagram}</span>
          <span className="rounded border border-white/60 px-1.5 py-0.5 text-[10px]">Seguir</span>
        </div>
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-snug text-white/90">{r.legenda}</p>
        <p className="mt-2 inline-block rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-leaf-deep">
          {objetivosLabel[r.objetivo]} · {r.destaque}
        </p>
      </div>
    </article>
  );
}

export default function ReelPhone({ itens }: { itens: Resultado[] }) {
  const phone = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // inclinação 3D seguindo o ponteiro
  useEffect(() => {
    const el = phone.current;
    if (!el) return;
    let rx = 6, ry = -16, tx = 6, ty = -16, raf = 0;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ty = -16 + nx * 18;
      tx = 6 - ny * 10;
    };
    const loop = () => {
      rx += (tx - rx) * 0.06;
      ry += (ty - ry) * 0.06;
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
    setActive(0);
  }, [itens]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(el.scrollTop / el.clientHeight);
    if (i !== active) {
      setActive(i);
      track("reel_view", { reel: itens[i]?.id });
    }
  };

  const atual = itens[active];

  return (
    <div className="flex flex-col items-center">
      <div className="[perspective:1600px]">
        <div ref={phone} className="relative will-change-transform [transform-style:preserve-3d]" style={{ transform: "rotateX(6deg) rotateY(-16deg)" }}>
          {/* espessura do aparelho */}
          <div className="absolute inset-0 translate-x-[10px] translate-y-[6px] rounded-[46px] bg-leaf-deep/30 blur-2xl" aria-hidden />
          <div className="relative h-[min(640px,76svh)] w-[min(310px,72vw)] rounded-[44px] border border-white/15 bg-[#050505] p-[10px] shadow-[inset_0_0_0_2px_#222]">
            <div className="absolute left-1/2 top-[18px] z-20 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-[34px]">
              <div className="absolute inset-x-0 top-0 z-10 flex justify-between px-5 pt-12 text-[15px] font-semibold">
                <span>Reels</span>
                <span className="text-[11px] text-white/70">{String(active + 1).padStart(2, "0")}/{String(itens.length).padStart(2, "0")}</span>
              </div>
              <div
                ref={scroller}
                onScroll={onScroll}
                data-lenis-prevent
                className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none]"
              >
                {itens.map((r, i) => (
                  <div key={r.id} className="h-full snap-start">
                    <Reel r={r} active={i === active} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-[13px] font-medium text-mute">Deslize dentro do celular ↕</p>
      {atual && (
        <a
          href={atual.link}
          target="_blank"
          rel="noopener"
          onClick={() => track("instagram_click", { reel: atual.id })}
          className="btn-soft mt-4"
        >
          Ver no Instagram ↗
        </a>
      )}
    </div>
  );
}
