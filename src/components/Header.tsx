"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import { track } from "@/lib/track";

export default function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "bg-paper/85 shadow-[0_1px_0_rgba(22,39,29,.08)] backdrop-blur-md" : ""}`}>
      <div className="gutter flex items-center justify-between py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="serif grid h-9 w-9 place-items-center rounded-full bg-leaf text-[15px] text-white">JV</span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold">João Vitor</span>
            <span className="block text-[12px] text-mute">Nutricionista Esportivo</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <a href="#como-funciona" className="hidden text-[14px] font-medium text-ink-2 hover:text-leaf md:inline">Como funciona</a>
          <a href="#resultados" className="hidden text-[14px] font-medium text-ink-2 hover:text-leaf md:inline">Resultados</a>
          <a href="#planos" className="hidden text-[14px] font-medium text-ink-2 hover:text-leaf md:inline">Planos</a>
          <a
            href={whatsappUrl("Oi João! Vi seu site e quero saber mais.")}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { local: "header" })}
            className="rounded-full bg-leaf px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-leaf-deep"
          >
            Falar com o João
          </a>
        </nav>
      </div>
    </header>
  );
}
