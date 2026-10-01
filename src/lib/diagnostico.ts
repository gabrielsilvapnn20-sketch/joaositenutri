// Tipos da jornada e o diagnóstico por regras (usado como base e como fallback da IA).

import type { Objetivo } from "@content/resultados";
import type { Plano } from "@content/site";

export type Horario = "manha" | "tarde" | "noite" | "nao-treino";
export type FimDeSemana = "foco" | "relaxo" | "chuto";
export type Local = "pontalina" | "goiania" | "outra";
export type Sexo = "feminino" | "masculino";

export const SABOTADORES = [
  { id: "fome-noite", label: "Fome à noite" },
  { id: "sem-tempo", label: "Falta de tempo para cozinhar" },
  { id: "pos-treino", label: "Não sei o que comer no pré/pós-treino" },
  { id: "beliscos", label: "Belisco o dia todo" },
  { id: "doce", label: "Vontade de doce" },
  { id: "alcool", label: "Álcool no fim de semana" },
  { id: "pouca-proteina", label: "Como pouca proteína" },
  { id: "pulo-refeicoes", label: "Pulo refeições" },
  { id: "ansiedade", label: "Como por ansiedade" },
  { id: "sem-resultado", label: "Treino muito e não vejo resultado" },
] as const;

export type SabotadorId = (typeof SABOTADORES)[number]["id"];

export type Respostas = {
  objetivo: Objetivo;
  sexo: Sexo;
  peso: number;
  altura: number;
  idade: number;
  diasTreino: number;
  refeicoes: number;
  horario: Horario;
  acorda: number;
  dorme: number;
  fimDeSemana: FimDeSemana;
  sabotadores: SabotadorId[];
  local: Local;
};

export type Lead = { nome: string; whatsapp: string; consentimento: boolean };

export type Perfil = { codigo: string; titulo: string; descricao: string };

export type Diagnostico = {
  perfil: Perfil;
  insights: { titulo: string; texto: string }[];
  joaoFaria: string;
  planoRecomendado: Plano["id"];
  fechamento: string;
  score: "quente" | "morno" | "frio";
  fonte: "ia" | "regras";
};

export const objetivoTexto: Record<Objetivo, string> = {
  hipertrofia: "ganhar massa muscular",
  emagrecimento: "secar sem perder músculo",
  performance: "render mais no esporte",
  rotina: "evoluir na academia com a rotina que tenho",
};

export const PERFIS = {
  disciplinado: {
    codigo: "PERFIL / DSE-01",
    titulo: "O Disciplinado Sem Estratégia",
    descricao: "Você tem o que a maioria não tem: constância. O que falta é direção — o esforço está indo para o lugar errado.",
  },
  fimDeSemana: {
    codigo: "PERFIL / GFS-02",
    titulo: "O Guerreiro de Segunda a Sexta",
    descricao: "A semana é impecável, mas o fim de semana desfaz parte do trabalho. Não precisa ser 8 ou 80 — precisa estar no plano.",
  },
  agenda: {
    codigo: "PERFIL / AAC-03",
    titulo: "O Atleta de Agenda Cheia",
    descricao: "Sua rotina é corrida e a alimentação fica para depois. Um plano prático, que cabe no seu dia, muda o jogo.",
  },
  construtor: {
    codigo: "PERFIL / CTR-04",
    titulo: "O Construtor Travado",
    descricao: "Você treina para crescer, mas o corpo não recebe material suficiente para construir. A conta não fecha no prato.",
  },
  recomeco: {
    codigo: "PERFIL / RCI-05",
    titulo: "O Recomeço Inteligente",
    descricao: "Você está no começo (ou recomeço) — o melhor momento para construir hábitos certos desde o primeiro dia.",
  },
  competidor: {
    codigo: "PERFIL / CPL-06",
    titulo: "O Competidor em Lapidação",
    descricao: "Você já performa. Agora o ganho está nos detalhes: timing de nutrientes, hidratação e recuperação.",
  },
} satisfies Record<string, Perfil>;

const INSIGHTS: Record<SabotadorId, { titulo: string; texto: string }> = {
  "fome-noite": { titulo: "A fome da noite é construída de dia", texto: "Quando a distribuição das refeições está errada, o corpo cobra no fim do dia. Isso se ajusta com estratégia, não com força de vontade." },
  "sem-tempo": { titulo: "Plano bom é plano que cabe na agenda", texto: "Dá para comer bem com preparo rápido e opções práticas. O segredo é planejar uma vez e repetir sem pensar." },
  "pos-treino": { titulo: "O treino começa no prato", texto: "O que você come antes e depois do treino muda energia, recuperação e resultado. É um dos ajustes mais rápidos de sentir." },
  beliscos: { titulo: "Beliscar é sinal, não defeito", texto: "Beliscos costumam aparecer quando as refeições principais não sustentam. Ajustando o prato, a vontade diminui." },
  doce: { titulo: "O doce pode estar no plano", texto: "Cortar tudo costuma terminar em exagero. Com estratégia, o doce entra sem sabotar o resultado." },
  alcool: { titulo: "O fim de semana também tem estratégia", texto: "Não precisa abrir mão da vida social. Dá para planejar o sábado sem perder o que você construiu na semana." },
  "pouca-proteina": { titulo: "Proteína é tijolo", texto: "Sem o suficiente, o treino não vira músculo. Distribuir bem ao longo do dia faz diferença enorme." },
  "pulo-refeicoes": { titulo: "Pular refeição cobra juros", texto: "Ficar muitas horas sem comer derruba o rendimento e aumenta a fome depois. Ritmo importa." },
  ansiedade: { titulo: "Comer por ansiedade tem manejo", texto: "Organizar a rotina alimentar reduz os gatilhos. E quando precisa, o acompanhamento é feito junto com outros profissionais." },
  "sem-resultado": { titulo: "Esforço sem dado é chute", texto: "Se o espelho não muda, é hora de medir. A avaliação mostra exatamente onde está o ajuste." },
};

export function imc(r: Pick<Respostas, "peso" | "altura">) {
  return r.peso / (r.altura / 100) ** 2;
}

export function escolherPerfil(r: Respostas): Perfil {
  if (r.objetivo === "performance") return PERFIS.competidor;
  if (r.diasTreino <= 2) return PERFIS.recomeco;
  if (r.fimDeSemana === "chuto") return PERFIS.fimDeSemana;
  if (r.sabotadores.includes("sem-tempo") || r.refeicoes <= 2 || r.sabotadores.includes("pulo-refeicoes")) return PERFIS.agenda;
  if (r.objetivo === "hipertrofia" && (r.sabotadores.includes("pouca-proteina") || r.sabotadores.includes("sem-resultado") || r.refeicoes <= 3))
    return PERFIS.construtor;
  return PERFIS.disciplinado;
}

export function pontuar(r: Respostas): Diagnostico["score"] {
  let s = 0;
  if (r.diasTreino >= 3) s += 2;
  if (r.sabotadores.length >= 2) s += 2;
  if (r.sabotadores.includes("sem-resultado")) s += 2;
  if (r.local !== "outra") s += 1;
  if (r.objetivo !== "rotina") s += 1;
  return s >= 5 ? "quente" : s >= 3 ? "morno" : "frio";
}

export function planoPara(r: Respostas): Plano["id"] {
  if (r.objetivo === "performance" && r.local !== "outra") return "presencial";
  return "online-trimestral";
}

export function diagnosticoPorRegras(r: Respostas, lead: Pick<Lead, "nome">): Diagnostico {
  const perfil = escolherPerfil(r);
  const lista = r.sabotadores.map((s) => INSIGHTS[s]).filter(Boolean);
  const extra = [
    r.horario !== "nao-treino" && { titulo: "Seu horário de treino pede um prato específico", texto: `Treinando de ${r.horario === "manha" ? "manhã" : r.horario}, a refeição anterior e a seguinte precisam ser pensadas para esse horário.` },
    r.refeicoes <= 3 && { titulo: "Poucas refeições, pouco material", texto: `Com ${r.refeicoes} refeições por dia, fica difícil atingir o que o corpo precisa para ${objetivoTexto[r.objetivo]}.` },
    { titulo: "A balança não conta a história toda", texto: "O IMC não diferencia músculo de gordura. É por isso que a avaliação antropométrica é o ponto de partida." },
  ].filter(Boolean) as { titulo: string; texto: string }[];
  const insights = [...lista, ...extra].slice(0, 3);
  const primeiro = lead.nome.trim().split(" ")[0] || "você";

  return {
    perfil,
    insights,
    joaoFaria: `${primeiro}, no seu caso eu começaria pela avaliação para entender sua composição corporal. Depois, montaria um plano em torno do seu horário de treino e dos ${r.sabotadores.length || "seus"} pontos que te travam hoje — com ajustes frequentes até o corpo responder.`,
    planoRecomendado: planoPara(r),
    fechamento: "Nada disso se resolve com dieta da internet. Se resolve com estratégia feita para você.",
    score: pontuar(r),
    fonte: "regras",
  };
}

const SABOTADOR_LABEL = Object.fromEntries(SABOTADORES.map((s) => [s.id, s.label])) as Record<SabotadorId, string>;
export const sabotadorLabel = (id: SabotadorId) => SABOTADOR_LABEL[id] ?? id;

const horarioLabel: Record<Horario, string> = { manha: "manhã", tarde: "tarde", noite: "noite", "nao-treino": "não treina" };
const fdsLabel: Record<FimDeSemana, string> = { foco: "mantém o foco", relaxo: "relaxa um pouco", chuto: "chuta o balde" };
const localLabel: Record<Local, string> = { pontalina: "Pontalina", goiania: "Goiânia e região", outra: "outra cidade" };

/** Texto que vai pronto para o WhatsApp do João — ele já começa a conversa sabendo tudo. */
export function resumoWhatsapp(r: Respostas, lead: Lead, d: Diagnostico, planoNome: string) {
  return [
    `Oi João! Fiz o diagnóstico no site 👋`,
    ``,
    `*Nome:* ${lead.nome}`,
    `*Objetivo:* ${objetivoTexto[r.objetivo]}`,
    `*Perfil:* ${d.perfil.titulo}`,
    `*Treino:* ${r.diasTreino}x/semana, de ${horarioLabel[r.horario]}`,
    `*Refeições:* ${r.refeicoes}/dia · fim de semana: ${fdsLabel[r.fimDeSemana]}`,
    `*O que me trava:* ${r.sabotadores.map(sabotadorLabel).join(", ") || "—"}`,
    `*Onde estou:* ${localLabel[r.local]}`,
    ``,
    `Quero saber mais sobre: *${planoNome}*`,
  ].join("\n");
}

export function validarRespostas(x: unknown): Respostas | null {
  if (!x || typeof x !== "object") return null;
  const r = x as Record<string, unknown>;
  const num = (v: unknown, a: number, b: number) => typeof v === "number" && Number.isFinite(v) && v >= a && v <= b;
  const objetivos = ["hipertrofia", "emagrecimento", "performance", "rotina"];
  const ids = SABOTADORES.map((s) => s.id) as string[];
  if (!objetivos.includes(r.objetivo as string)) return null;
  if (!["feminino", "masculino"].includes(r.sexo as string)) return null;
  if (!num(r.peso, 30, 250) || !num(r.altura, 120, 230) || !num(r.idade, 12, 100)) return null;
  if (!num(r.diasTreino, 0, 7) || !num(r.refeicoes, 1, 8) || !num(r.acorda, 0, 24) || !num(r.dorme, 0, 30)) return null;
  if (!["manha", "tarde", "noite", "nao-treino"].includes(r.horario as string)) return null;
  if (!["foco", "relaxo", "chuto"].includes(r.fimDeSemana as string)) return null;
  if (!["pontalina", "goiania", "outra"].includes(r.local as string)) return null;
  if (!Array.isArray(r.sabotadores) || r.sabotadores.length > ids.length || !r.sabotadores.every((s) => ids.includes(s as string))) return null;
  return r as unknown as Respostas;
}

export function validarLead(x: unknown): Lead | null {
  if (!x || typeof x !== "object") return null;
  const l = x as Record<string, unknown>;
  if (typeof l.nome !== "string" || l.nome.trim().length < 2 || l.nome.length > 80) return null;
  if (typeof l.whatsapp !== "string") return null;
  const digits = l.whatsapp.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return null;
  if (l.consentimento !== true) return null;
  return { nome: l.nome.trim(), whatsapp: digits, consentimento: true };
}
