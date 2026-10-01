"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Troca a cor do cabeçalho conforme a seção que está por baixo (data-header="ink" = fundo claro). */
export default function Header() {
  const [ink, setInk] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const els = document.elementsFromPoint(20, 34);
      const sec = els.map((e) => e.closest("[data-header]")).find(Boolean);
      setInk(sec?.getAttribute("data-header") === "ink");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const text = ink ? "text-ink" : "text-bone";
  const label = ink ? "!text-ink/60 hover:!text-ink" : "!text-bone/70 hover:!text-bone";

  return (
    <header className={`gutter pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between py-4 transition-colors duration-300 ${text}`}>
      <Link href="/" className="pointer-events-auto flex items-baseline gap-3">
        <span className="wide text-[15px] font-semibold uppercase tracking-tight">João Vitor</span>
        <span className={`label hidden sm:inline ${ink ? "!text-ink/60" : "!text-bone/60"}`}>Nutrição Esportiva · ISAK</span>
      </Link>
      <nav className="pointer-events-auto flex items-center gap-5">
        <a href="#resultados" className={`label hidden md:inline ${label}`}>Resultados</a>
        <a href="#metodo" className={`label hidden md:inline ${label}`}>Método</a>
        <a href="#planos" className={`label hidden md:inline ${label}`}>Planos</a>
        <Link
          href="/diagnostico"
          className={`label border px-3 py-2 transition-colors ${ink ? "border-ink/40 !text-ink hover:bg-ink hover:!text-bone" : "border-bone/40 bg-ink/40 !text-bone backdrop-blur hover:bg-bone hover:!text-ink"}`}
        >
          Diagnóstico →
        </Link>
      </nav>
    </header>
  );
}
