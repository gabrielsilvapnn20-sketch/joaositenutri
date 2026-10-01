import { drawBody } from "./body";
import type { Perfil } from "./diagnostico";
import { contato } from "@content/site";

/** Gera o card 1080×1920 para os stories, com o perfil da pessoa. */
export async function gerarCardStories(perfil: Perfil, nome: string, mono: string, display: string): Promise<Blob | null> {
  const W = 1080, H = 1920;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  await document.fonts?.ready;

  ctx.fillStyle = "#0D0E0C";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(236,233,225,0.08)";
  ctx.lineWidth = 2;
  for (let x = 90; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 160; y < H; y += 160) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.save();
  ctx.translate(0, 260);
  drawBody(ctx, {
    width: W, height: 1000, dpr: 2.4, monoFont: mono, scale: 0.95,
    state: { rotation: 0.5, explode: 0.35, layers: 1, labels: 0, scan: -1, girth: 1, highlight: 1 },
  });
  ctx.restore();

  ctx.fillStyle = "#8B8980";
  ctx.font = `30px ${mono}`;
  ctx.fillText("MEU PERFIL DE TREINO", 80, 140);
  ctx.fillStyle = "#FF5A1F";
  ctx.fillText(perfil.codigo, 80, 190);

  ctx.fillStyle = "#ECE9E1";
  ctx.font = `800 104px ${display}`;
  const palavras = perfil.titulo.toUpperCase().split(" ");
  const linhas: string[] = [];
  let atual = "";
  for (const p of palavras) {
    const teste = atual ? `${atual} ${p}` : p;
    if (ctx.measureText(teste).width > W - 160 && atual) { linhas.push(atual); atual = p; } else atual = teste;
  }
  linhas.push(atual);
  const base = 1400 - (linhas.length - 1) * 100;
  linhas.forEach((l, i) => ctx.fillText(l, 80, base + i * 100));

  ctx.fillStyle = "#ECE9E1";
  ctx.font = `36px ${mono}`;
  ctx.fillText(`${nome.split(" ")[0].toUpperCase()} FEZ O DIAGNÓSTICO.`, 80, base + linhas.length * 100 + 40);

  ctx.fillStyle = "#FF5A1F";
  ctx.fillRect(80, 1680, W - 160, 130);
  ctx.fillStyle = "#0D0E0C";
  ctx.font = `600 40px ${mono}`;
  ctx.fillText(`DESCUBRA O SEU → @${contato.instagram.toUpperCase()}`, 120, 1760);

  return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
}
