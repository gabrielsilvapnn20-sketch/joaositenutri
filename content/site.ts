// Todo o texto editável do site fica aqui. Itens marcados com TODO dependem do João.

export const contato = {
  nome: "João Vitor",
  titulo: "Nutricionista Esportivo",
  crn: "CRN-1 ———", // TODO: número do CRN
  instagram: "nutrijoaovitorr",
  whatsapp: "5562991628357",
  cidades: ["Pontalina", "Goiânia", "Online"],
};

export const hero = {
  objeto: "OBJETO / 001 — CORPO HUMANO EM TREINO",
  titulo: ["Seu corpo", "tem dados."],
  subtitulo: "Eu leio cada um deles.",
  apoio:
    "Nutrição esportiva guiada por avaliação antropométrica ISAK. Presencial em Goiás ou online, de qualquer lugar.",
  cta: "Começar meu diagnóstico",
  capitulos: [
    { codigo: "01 / SUPERFÍCIE", titulo: "O que o espelho mostra", texto: "Peso e aparência contam só parte da história." },
    { codigo: "02 / CAMADAS", titulo: "O que a balança esconde", texto: "Dobras, perímetros e composição revelam onde está a gordura e onde está o músculo." },
    { codigo: "03 / ESTRATÉGIA", titulo: "Dados viram plano", texto: "Cada número da avaliação vira uma decisão no seu prato e no seu treino." },
  ],
};

export const dor = {
  linhas: [
    "Você treina.",
    "Você se esforça.",
    "Corta doce, faz cardio,",
    "e o corpo não responde.",
  ],
  fecho:
    "O problema quase nunca é falta de esforço. É falta de estratégia — feita para o seu corpo, sua rotina e seu treino.",
};

export const metodo = [
  { n: "01", titulo: "Avaliação", texto: "Antropometria ISAK, histórico, rotina, treino e exames. A gente começa pelos dados, não pelo achismo.", dado: "8 DOBRAS · 12 PERÍMETROS" },
  { n: "02", titulo: "Plano", texto: "Um plano alimentar que cabe no seu dia — com as comidas que você gosta e o horário do seu treino.", dado: "100% INDIVIDUAL" },
  { n: "03", titulo: "Ajustes", texto: "Acompanhamento próximo pelo WhatsApp. O plano muda quando o seu corpo muda.", dado: "SUPORTE CONTÍNUO" },
  { n: "04", titulo: "Resultado", texto: "Reavaliação com números novos. Você vê, em dados, o que mudou.", dado: "COMPARATIVO REAL" },
];

export const isak = {
  titulo: "Medir é o que separa palpite de estratégia.",
  texto:
    "A antropometria ISAK é o padrão internacional de medidas corporais. Com ela, sabemos quanto do seu peso é músculo, quanto é gordura — e onde cada um está.",
  medidas: [
    { rotulo: "MASSA MAGRA", valor: 64.2, unidade: "%", delta: "+3,1" },
    { rotulo: "GORDURA CORPORAL", valor: 15.8, unidade: "%", delta: "−4,6" },
    { rotulo: "Σ 8 DOBRAS", valor: 78, unidade: "mm", delta: "−31" },
    { rotulo: "PERÍMETRO BRAÇO", valor: 38.5, unidade: "cm", delta: "+2,0" },
  ],
  nota: "Valores ilustrativos de um acompanhamento de 12 semanas.",
};

export type Plano = {
  id: "online-trimestral" | "online-mensal" | "presencial";
  nome: string;
  formato: string;
  preco: number | null; // TODO: valores reais
  periodo: string;
  destaque?: boolean;
  itens: string[];
};

export const planos: Plano[] = [
  {
    id: "online-mensal",
    nome: "Consultoria Online",
    formato: "Mensal",
    preco: null,
    periodo: "/mês",
    itens: ["Avaliação online completa", "Plano alimentar individual", "Suporte pelo WhatsApp", "1 ajuste no mês"],
  },
  {
    id: "online-trimestral",
    nome: "Consultoria Online",
    formato: "Trimestral",
    preco: null,
    periodo: "/3 meses",
    destaque: true,
    itens: [
      "Tudo do mensal",
      "Ajustes a cada 15 dias",
      "Reavaliação com comparativo",
      "Estratégia para fim de semana e viagens",
      "Prioridade no suporte",
    ],
  },
  {
    id: "presencial",
    nome: "Presencial + ISAK",
    formato: "Pontalina · Goiânia",
    preco: null,
    periodo: "/consulta",
    itens: ["Antropometria ISAK completa", "Plano alimentar individual", "Retorno com reavaliação", "Suporte pelo WhatsApp"],
  },
];

export const sobre = {
  titulo: "Prazer, João Vitor.",
  texto: [
    "Nutricionista esportivo e antropometrista ISAK nível 1. Atendo quem vive a academia — do atleta ao aluno que treina às 6h antes do trabalho.",
    "Meu trabalho é simples de explicar: medir, entender sua rotina e transformar isso num plano que você consegue seguir.",
  ], // TODO: revisar com a voz do João
  credenciais: ["Nutricionista Esportivo", "Antropometrista ISAK 1", "Atendimento online em todo o Brasil"],
};

export const faq = [
  { p: "A consultoria online funciona mesmo?", r: "Funciona. A avaliação é guiada por vídeo e fotos padronizadas, e o acompanhamento é mais próximo do que no presencial: você fala comigo pelo WhatsApp sempre que precisar." },
  { p: "Preciso de balança ou adipômetro em casa?", r: "Não. Eu te passo um protocolo simples de medidas com fita métrica e fotos. Quem pode vir ao consultório faz a antropometria ISAK completa." },
  { p: "E se eu não conseguir seguir a dieta?", r: "Então o plano estava errado, não você. Ele é montado com as comidas que você gosta, nos horários da sua rotina — e ajustado sempre que travar." },
  { p: "Em quanto tempo vejo resultado?", r: "Cada corpo responde num ritmo, e eu não prometo prazos. O que garanto é acompanhamento próximo e ajustes baseados em dados, não em achismo." },
  { p: "Atende quem só quer melhorar na academia?", r: "Sim — essa é a maior parte dos meus pacientes. Não precisa ser atleta para ter estratégia." },
];

export const privacidade = {
  atualizado: "outubro de 2026",
};

// Escassez só quando for verdade: o João liga quando abrir agenda limitada.
export const vagas = { ativo: false, texto: "Agenda da consultoria online aberta para novembro — vagas limitadas." };
