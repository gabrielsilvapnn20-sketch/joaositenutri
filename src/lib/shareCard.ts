import { FoodScene } from "./foodFigure";
import type { Perfil } from "./diagnostico";
import { contato } from "@content/site";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Gera o card 1080×1920 para os stories, com o perfil da pessoa. */
export async function gerarCardStories(perfil: Perfil, nome: string, sans: string, serif: string): Promise<Blob | null> {
  const W = 1080, H = 1920;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  await document.fonts?.ready;

  ctx.fillStyle = "#F8F7F2";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#E2F1E5";
  ctx.beginPath();
  ctx.ellipse(W / 2, 730, 420, 450, 0, 0, Math.PI * 2);
  ctx.fill();

  // corpo feito de comida, já formado, acenando
  const fig = document.createElement("canvas");
  fig.width = 900;
  fig.height = 980;
  const fctx = fig.getContext("2d");
  if (fctx) {
    const scene = new FoodScene(380, 5);
    for (let i = 0; i < 240; i++) scene.step(0.05, i * 0.05, { form: 1, pose: "wave" }, fig.width, fig.height);
    scene.draw(fctx, fig.width, fig.height);
    ctx.drawImage(fig, (W - fig.width) / 2, 230);
  }

  ctx.fillStyle = "#2E9C5A";
  ctx.font = `600 34px ${sans}`;
  ctx.fillText("MEU PERFIL É", 80, 150);

  ctx.fillStyle = "#114E2F";
  ctx.font = `500 100px ${serif}`;
  const palavras = perfil.titulo.split(" ");
  const linhas: string[] = [];
  let atual = "";
  for (const p of palavras) {
    const teste = atual ? `${atual} ${p}` : p;
    if (ctx.measureText(teste).width > W - 160 && atual) {
      linhas.push(atual);
      atual = p;
    } else atual = teste;
  }
  linhas.push(atual);
  const base = 1430 - (linhas.length - 1) * 104;
  linhas.forEach((l, i) => ctx.fillText(l, 80, base + i * 104));

  ctx.fillStyle = "#3A4A40";
  ctx.font = `400 38px ${sans}`;
  ctx.fillText(`${nome.split(" ")[0]} fez o teste do João Vitor.`, 80, base + linhas.length * 104 + 20);

  ctx.fillStyle = "#2E9C5A";
  roundRect(ctx, 80, 1690, W - 160, 130, 65);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `600 40px ${sans}`;
  ctx.textAlign = "center";
  ctx.fillText(`Descubra o seu → @${contato.instagram}`, W / 2, 1768);

  return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
}
