import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Faixa from "@/components/Faixa";
import Identifica from "@/components/Identifica";
import ComoFunciona from "@/components/ComoFunciona";
import Beneficios from "@/components/Beneficios";
import Resultados from "@/components/Resultados";
import Medir from "@/components/Medir";
import QuizTeaser from "@/components/QuizTeaser";
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
        <Faixa />
        <Identifica />
        <ComoFunciona />
        <Beneficios />
        <Resultados />
        <Medir />
        <QuizTeaser />
        <Planos />
        <Sobre />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
