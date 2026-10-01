// Reels de depoimento / resultados. Coloque os vídeos em /public/reels/ e os posters em /public/reels/posters/.
// TODO: trocar placeholders pelos reels reais do João (com autorização por escrito de cada paciente).

export type Objetivo = "hipertrofia" | "emagrecimento" | "performance" | "rotina";

export type Resultado = {
  id: string;
  objetivo: Objetivo;
  paciente: string; // nome ou iniciais autorizadas
  legenda: string;
  destaque: string; // métrica curta exibida no card
  video?: string; // /reels/arquivo.mp4
  poster?: string;
  antes?: string; // imagens para a transição em mosaico
  depois?: string;
  link: string; // URL do reel no Instagram
  curtidas: string;
};

export const objetivosLabel: Record<Objetivo, string> = {
  hipertrofia: "Hipertrofia",
  emagrecimento: "Emagrecimento",
  performance: "Performance",
  rotina: "Rotina de academia",
};

const IG = "https://www.instagram.com/nutrijoaovitorr/";

export const resultados: Resultado[] = [
  { id: "r1", objetivo: "emagrecimento", paciente: "M. A.", legenda: "12 semanas sem cortar o que ela gosta. A diferença foi estratégia, não sofrimento.", destaque: "−9,4 kg · −6% gordura", link: IG, curtidas: "1.248", antes: "/placeholder/antes.svg", depois: "/placeholder/depois.svg" },
  { id: "r2", objetivo: "hipertrofia", paciente: "R. S.", legenda: "Treinava pesado há 3 anos e não saía do lugar. Faltava comida certa na hora certa.", destaque: "+4,2 kg massa magra", link: IG, curtidas: "982" },
  { id: "r3", objetivo: "rotina", paciente: "L. F.", legenda: "Trabalha 10h por dia e treina às 6h. Montamos um plano que cabe na rotina dela.", destaque: "−11 cm cintura", link: IG, curtidas: "756" },
  { id: "r4", objetivo: "performance", paciente: "G. P.", legenda: "Corrida de 21 km com energia até o fim. Estratégia de pré e intra-treino.", destaque: "−8 min nos 21 km", link: IG, curtidas: "631" },
  { id: "r5", objetivo: "hipertrofia", paciente: "T. M.", legenda: "Ganhou massa sem ganhar barriga. A avaliação mostrou onde ajustar.", destaque: "+3,1% massa magra", link: IG, curtidas: "1.034" },
  { id: "r6", objetivo: "emagrecimento", paciente: "C. R.", legenda: "Fim de semana era o problema. Agora é parte do plano.", destaque: "−7,8 kg em 10 semanas", link: IG, curtidas: "877" },
];
