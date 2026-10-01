import Link from "next/link";
import { contato } from "@content/site";

export default function Footer() {
  return (
    <footer className="gutter border-t border-line py-10">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="serif grid h-10 w-10 place-items-center rounded-full bg-leaf text-white">JV</span>
          <div>
            <p className="font-semibold">{contato.nome} · {contato.titulo}</p>
            <p className="text-sm text-mute">{contato.crn} · {contato.cidades.join(" · ")}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-medium text-ink-2">
          <a href={`https://www.instagram.com/${contato.instagram}/`} target="_blank" rel="noopener" className="hover:text-leaf">Instagram</a>
          <a href={`https://wa.me/${contato.whatsapp}`} target="_blank" rel="noopener" className="hover:text-leaf">WhatsApp</a>
          <Link href="/privacidade" className="hover:text-leaf">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
