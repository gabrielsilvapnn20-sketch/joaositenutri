import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import Analytics from "@/components/Analytics";
import { contato } from "@content/site";
import "./globals.css";

const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "João Vitor — Nutricionista Esportivo | Goiânia, Pontalina e Online",
  description:
    "Nutrição esportiva guiada por avaliação antropométrica ISAK. Consultoria nutricional online para todo o Brasil e atendimento presencial em Goiânia e Pontalina (GO).",
  keywords: [
    "nutricionista esportivo Goiânia",
    "nutricionista Pontalina",
    "consultoria nutricional online",
    "antropometria ISAK",
    "nutricionista hipertrofia",
  ],
  openGraph: {
    title: "Seu corpo tem dados. Eu leio cada um deles.",
    description: "Faça seu diagnóstico gratuito e descubra o que trava seu resultado na academia.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0D0E0C", width: "device-width", initialScale: 1 };

const schema = {
  "@context": "https://schema.org",
  "@type": ["Person", "MedicalBusiness"],
  name: `${contato.nome} — ${contato.titulo}`,
  jobTitle: contato.titulo,
  telephone: `+${contato.whatsapp}`,
  sameAs: [`https://www.instagram.com/${contato.instagram}/`],
  areaServed: ["Goiânia", "Pontalina", "Brasil"],
  medicalSpecialty: "Nutrition",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${mono.variable}`}>
      <body className="grain bg-ink text-bone antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
