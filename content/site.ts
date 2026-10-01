// Todo o texto editável do site fica aqui. Itens marcados com TODO dependem do João.

export const contato = {
  nome: "João Vitor",
  titulo: "Nutricionista Esportivo",
  crn: "CRN-1 ———", // TODO: número do CRN
  instagram: "nutrijoaovitorr",
  seguidores: "7 mil", // seguidores no Instagram
  whatsapp: "5562991628357",
  cidades: ["Pontalina", "Goiânia", "Online"],
};

export const hero = {
  selo: "Nutricionista · Goiás e online",
  titulo: ["Mudar o corpo", "pode ser"],
  destaque: "leve.",
  apoio: "Sem dieta chata, sem passar fome. Um plano com a comida que você gosta, no ritmo da sua rotina, e eu do seu lado no WhatsApp.",
  ctaWhats: "Quero começar",
  ctaQuiz: "Descobrir meu perfil em 2 min",
  antes: ["Cansaço", "Sem energia", "Roupa apertando"],
  depois: ["Disposição", "Autoestima", "Treino rendendo"],
};

export const faixa = [
  "Comida de verdade",
  "Sem cortar o que você gosta",
  "Acompanhamento no WhatsApp",
  "Online para todo o Brasil",
  "Avaliação ISAK",
  "Plano que cabe na rotina",
];

export const identifica = {
  titulo: "Você se identifica com alguma dessas?",
  sub: "Toque nas que têm a sua cara.",
  itens: [
    "Começo a dieta na segunda e paro na quarta",
    "Treino, mas o corpo não muda",
    "Sinto fome à noite e belisco",
    "Não tenho tempo pra cozinhar",
    "Já tentei várias dietas da internet",
    "O fim de semana desfaz tudo",
  ],
  resposta: "Nada disso é falta de força de vontade. É falta de um plano feito para você.",
};

export const passos = [
  { n: "1", titulo: "A gente conversa", texto: "Online ou presencial. Eu entendo sua rotina, seu treino e o que você gosta de comer.", tempo: "~ 1 hora" },
  { n: "2", titulo: "Você recebe seu plano", texto: "Com comida de verdade, fácil de seguir, encaixado nos seus horários.", tempo: "em poucos dias" },
  { n: "3", titulo: "Ajustamos juntos", texto: "Travou? Me chama no WhatsApp. O plano muda quando a sua vida muda.", tempo: "todo o processo" },
];

export const beneficios = [
  { titulo: "Energia o dia todo", texto: "Chega de sono depois do almoço e de cansaço no treino.", cor: "mint" },
  { titulo: "Sem passar fome", texto: "Você come bem, sente prazer e ainda vê resultado.", cor: "sand" },
  { titulo: "Fim de semana livre", texto: "O churrasco e a pizza entram no plano, sem culpa.", cor: "white" },
  { titulo: "Resultado que fica", texto: "Hábito que se mantém, não efeito sanfona.", cor: "mint" },
] as const;

export const medir = {
  titulo: "A balança não conta a história toda.",
  texto:
    "Duas pessoas com o mesmo peso podem ter corpos muito diferentes. Com a avaliação ISAK eu vejo quanto é músculo e quanto é gordura, e assim acompanho o que realmente importa.",
  barras: [
    { rotulo: "Pessoa A", magra: 62, gordura: 22 },
    { rotulo: "Pessoa B", magra: 48, gordura: 36 },
  ],
  nota: "Mesmo peso: 72 kg. Valores ilustrativos.",
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
    itens: ["Consulta online", "Plano alimentar individual", "Suporte pelo WhatsApp", "1 ajuste no mês"],
  },
  {
    id: "online-trimestral",
    nome: "Consultoria Online",
    formato: "Trimestral",
    preco: null,
    periodo: "/3 meses",
    destaque: true,
    itens: ["Tudo do mensal", "Ajustes a cada 15 dias", "Reavaliação com comparativo", "Estratégia para fim de semana e viagens", "Prioridade no suporte"],
  },
  {
    id: "presencial",
    nome: "Presencial + ISAK",
    formato: "Pontalina · Goiânia",
    preco: null,
    periodo: "/consulta",
    itens: ["Avaliação ISAK completa", "Plano alimentar individual", "Retorno com reavaliação", "Suporte pelo WhatsApp"],
  },
];

export const sobre = {
  titulo: "Oi, eu sou o João.",
  texto: [
    "Sou nutricionista esportivo e antropometrista ISAK. Atendo desde atletas até quem só quer se sentir bem e evoluir na academia.",
    "Meu jeito de trabalhar é simples: entender sua rotina, montar um plano que você consegue seguir e estar perto até o resultado aparecer.",
  ], // TODO: revisar com a voz do João
  credenciais: ["Nutricionista Esportivo", "Antropometrista ISAK", "Atendimento online em todo o Brasil"],
};

export const faq = [
  { p: "Consultoria online funciona mesmo?", r: "Funciona, e muito bem. A gente conversa por vídeo, você recebe o plano no celular e fala comigo pelo WhatsApp sempre que precisar." },
  { p: "Vou ter que cortar tudo o que eu gosto?", r: "Não. O plano é montado com as comidas que você já gosta. A ideia é você conseguir manter, não sofrer por 30 dias." },
  { p: "Não tenho tempo pra cozinhar. Dá certo?", r: "Dá. Eu monto opções práticas e rápidas, e até estratégias para quem come fora ou pede delivery." },
  { p: "Preciso ser atleta ou treinar muito?", r: "Não. A maioria dos meus pacientes são pessoas comuns que treinam na academia e querem se sentir melhor." },
  { p: "Em quanto tempo vejo resultado?", r: "Cada corpo tem seu ritmo e eu não prometo prazos. O que eu garanto é acompanhamento de perto e ajustes até o seu corpo responder." },
];

export const privacidade = { atualizado: "outubro de 2026" };

// Escassez só quando for verdade: o João liga quando abrir agenda limitada.
export const vagas = { ativo: false, texto: "Agenda da consultoria online aberta para novembro, com vagas limitadas." };
