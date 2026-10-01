import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dor from "@/components/Dor";
import Metodo from "@/components/Metodo";
import Isak from "@/components/Isak";
import Resultados from "@/components/Resultados";
import Planos from "@/components/Planos";
import Sobre from "@/components/Sobre";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Dor />
        <Metodo />
        <Isak />
        <Resultados />
        <Planos />
        <Sobre />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
