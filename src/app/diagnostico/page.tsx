import type { Metadata } from "next";
import Jornada from "@/components/jornada/Jornada";

export const metadata: Metadata = {
  title: "Diagnóstico gratuito — João Vitor, Nutricionista Esportivo",
  description: "6 fases, 2 minutos. Descubra seu perfil de treino e o que está travando seu resultado.",
};

export default function DiagnosticoPage() {
  return <Jornada />;
}
