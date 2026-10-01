import type { Metadata } from "next";
import Link from "next/link";
import { contato, privacidade } from "@content/site";

export const metadata: Metadata = { title: "Política de Privacidade — João Vitor" };

// TODO: revisar com o João (e, se possível, com um advogado) antes de publicar.
export default function Privacidade() {
  return (
    <main className="gutter mx-auto max-w-3xl py-24">
      <Link href="/" className="text-sm font-medium text-leaf hover:underline">← Voltar</Link>
      <h1 className="serif mt-8 text-5xl font-medium">Política de Privacidade</h1>
      <p className="mt-3 text-sm text-mute">Atualizada em {privacidade.atualizado}</p>
      <div className="mt-10 space-y-6 leading-relaxed text-ink-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink">
        <p>
          Esta política explica como {contato.nome}, {contato.titulo} ({contato.crn}), trata os dados coletados neste site, de acordo com a Lei
          Geral de Proteção de Dados (Lei 13.709/2018).
        </p>
        <h2>Quais dados coletamos</h2>
        <p>
          No diagnóstico: nome, WhatsApp, cidade e as respostas sobre objetivo, medidas (peso, altura, idade), rotina, treino e hábitos
          alimentares. Algumas dessas informações são dados pessoais sensíveis relacionados à saúde.
        </p>
        <h2>Para que usamos</h2>
        <p>
          Exclusivamente para gerar seu diagnóstico e para que o João entre em contato com você pelo WhatsApp sobre os atendimentos. Não
          vendemos nem compartilhamos seus dados com terceiros para fins de marketing.
        </p>
        <h2>Base legal</h2>
        <p>Consentimento explícito, que você dá ao marcar a caixa no formulário. Você pode revogá-lo a qualquer momento.</p>
        <h2>Ferramentas de terceiros</h2>
        <p>
          As respostas podem ser processadas por um serviço de inteligência artificial para personalizar o texto do diagnóstico, e ficam
          armazenadas em banco de dados seguro. Usamos ferramentas de medição de audiência (como Meta Pixel e Google Analytics) para entender
          o uso do site.
        </p>
        <h2>Por quanto tempo guardamos</h2>
        <p>Enquanto houver relação de atendimento ou até você pedir a exclusão.</p>
        <h2>Seus direitos</h2>
        <p>
          Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo WhatsApp{" "}
          <a className="underline" href={`https://wa.me/${contato.whatsapp}`}>+{contato.whatsapp}</a>.
        </p>
        <p className="text-sm text-mute">O diagnóstico do site é uma orientação geral e não substitui consulta nutricional individual.</p>
      </div>
    </main>
  );
}
