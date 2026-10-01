import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Providers from "@/components/Providers";
import Analytics from "@/components/Analytics";
import { contato } from "@content/site";
import "./globals.css";

const serif = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

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
    title: "Comer bem pode ser leve — João Vitor, Nutricionista",
    description: "Faça seu diagnóstico gratuito e descubra o que trava seu resultado na academia.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#F8F7F2", width: "device-width", initialScale: 1 };

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
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
