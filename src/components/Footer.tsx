import Link from "next/link";
import { contato } from "@content/site";

export default function Footer() {
  return (
    <footer className="gutter border-t border-line py-10">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="wide text-2xl font-bold uppercase tracking-tight">{contato.nome}</p>
          <p className="label mt-2">{contato.titulo} · {contato.crn}</p>
          <p className="label mt-1">{contato.cidades.join(" · ")}</p>
        </div>
        <div className="flex flex-wrap gap-5">
          <a href={`https://www.instagram.com/${contato.instagram}/`} target="_blank" rel="noopener" className="label hover:!text-bone">Instagram ↗</a>
          <a href={`https://wa.me/${contato.whatsapp}`} target="_blank" rel="noopener" className="label hover:!text-bone">WhatsApp ↗</a>
          <Link href="/privacidade" className="label hover:!text-bone">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
