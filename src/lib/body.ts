// Renderizador procedural do "Corpo Dissecado": um corpo descrito por anéis
// (cortes transversais) projetados em perspectiva no canvas 2D.
// Sem assets e sem WebGL — roda liso no navegador interno do Instagram.

export type BodyState = {
  rotation: number; // radianos em torno do eixo Y
  explode: number; // 0..1 — separa as partes do corpo
  layers: number; // 0..1 — revela a camada interna (músculo)
  labels: number; // 0..1 — rótulos antropométricos
  scan: number; // -1 desliga; 0..1 posição da linha de varredura (de cima para baixo)
  girth: number; // 0.8..1.4 — espessura do corpo (usado no quiz)
  highlight?: number; // 0..1 — destaca os anéis de perímetro
};

type Part = "head" | "neck" | "chest" | "abdomen" | "armL" | "armR" | "legL" | "legR";

type Ring = { part: Part; cx: number; cy: number; cz: number; rx: number; rz: number; measure?: string };

type Mark = {
  part: Part;
  x: number;
  y: number;
  z: number;
  side: 1 | -1; // para que lado o rótulo aponta na tela
  title: string;
  value: string;
};

const STEPS = 30;
const COS = Array.from({ length: STEPS + 1 }, (_, i) => Math.cos((i / STEPS) * Math.PI * 2));
const SIN = Array.from({ length: STEPS + 1 }, (_, i) => Math.sin((i / STEPS) * Math.PI * 2));

function profile(points: [number, number][], y: number) {
  if (y <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [y1, v1] = points[i];
    const [y0, v0] = points[i - 1];
    if (y <= y1) {
      const t = (y - y0) / (y1 - y0);
      const s = t * t * (3 - 2 * t);
      return v0 + (v1 - v0) * s;
    }
  }
  return points[points.length - 1][1];
}

const TORSO: [number, number][] = [
  [0.92, 0.158],
  [1.0, 0.172],
  [1.1, 0.146],
  [1.22, 0.156],
  [1.34, 0.176],
  [1.45, 0.19],
  [1.5, 0.186],
  [1.54, 0.14],
  [1.58, 0.07],
];
const TORSO_DEPTH: [number, number][] = [
  [0.92, 0.1],
  [1.1, 0.098],
  [1.3, 0.118],
  [1.45, 0.11],
  [1.58, 0.055],
];
const LEG: [number, number][] = [
  [0.08, 0.03],
  [0.3, 0.042],
  [0.45, 0.059],
  [0.58, 0.05],
  [0.8, 0.083],
  [0.93, 0.094],
];
const ARM: [number, number][] = [
  [0, 0.056],
  [0.25, 0.047],
  [0.48, 0.035],
  [0.6, 0.041],
  [0.95, 0.027],
  [1.05, 0.033],
  [1.12, 0.02],
];

function buildRings(): Ring[] {
  const rings: Ring[] = [];
  const dy = 0.024;

  for (let y = 1.64; y <= 1.87; y += dy * 0.8) {
    const k = Math.max(0, 1 - ((y - 1.755) / 0.118) ** 2);
    rings.push({ part: "head", cx: 0, cy: y, cz: 0.005, rx: 0.084 * Math.sqrt(k), rz: 0.1 * Math.sqrt(k) });
  }
  for (let y = 1.57; y < 1.64; y += dy) rings.push({ part: "neck", cx: 0, cy: y, cz: 0, rx: 0.052, rz: 0.052 });
  for (let y = 0.93; y < 1.575; y += dy) {
    rings.push({
      part: y > 1.26 ? "chest" : "abdomen",
      cx: 0,
      cy: y,
      cz: 0,
      rx: profile(TORSO, y),
      rz: profile(TORSO_DEPTH, y),
      measure: Math.abs(y - 1.104) < dy / 2 ? "cintura" : undefined,
    });
  }
  for (const side of [-1, 1] as const) {
    for (let y = 0.08; y < 0.94; y += dy) {
      const r = profile(LEG, y);
      const x = side * (0.086 + (0.94 - y) * 0.018);
      rings.push({
        part: side < 0 ? "legL" : "legR",
        cx: x,
        cy: y,
        cz: 0,
        rx: r,
        rz: r * 1.04,
        measure: side > 0 && Math.abs(y - 0.45) < dy / 2 ? "panturrilha" : undefined,
      });
    }
    // braço: ombro → punho, levemente afastado do tronco
    const n = 26;
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 1.12;
      const r = profile(ARM, t);
      rings.push({
        part: side < 0 ? "armL" : "armR",
        cx: side * (0.218 + t * 0.075),
        cy: 1.49 - t * 0.56,
        cz: 0.01 - t * 0.02,
        rx: r,
        rz: r,
        measure: side > 0 && i === 6 ? "braço" : undefined,
      });
    }
  }
  return rings;
}

const RINGS = buildRings();

const MARKS: Mark[] = [
  { part: "armR", x: 0.258, y: 1.31, z: -0.05, side: 1, title: "DOBRA / TRICIPITAL", value: "12 mm" },
  { part: "chest", x: -0.09, y: 1.38, z: -0.11, side: -1, title: "DOBRA / SUBESCAPULAR", value: "14 mm" },
  { part: "abdomen", x: 0.05, y: 1.12, z: 0.098, side: 1, title: "DOBRA / ABDOMINAL", value: "18 mm" },
  { part: "abdomen", x: -0.15, y: 1.0, z: 0.02, side: -1, title: "DOBRA / SUPRAILÍACA", value: "11 mm" },
  { part: "legR", x: 0.1, y: 0.76, z: 0.08, side: 1, title: "DOBRA / COXA", value: "16 mm" },
  { part: "legL", x: -0.06, y: 0.46, z: 0.03, side: -1, title: "DOBRA / PANTURRILHA", value: "8 mm" },
  { part: "armR", x: 0.26, y: 1.37, z: 0.04, side: 1, title: "PERÍMETRO / BRAÇO", value: "38,5 cm" },
  { part: "abdomen", x: -0.12, y: 1.15, z: 0.07, side: -1, title: "PERÍMETRO / CINTURA", value: "81 cm" },
];

function partOffset(part: Part, e: number): [number, number, number] {
  switch (part) {
    case "head":
      return [0, 0.2 * e, 0];
    case "neck":
      return [0, 0.12 * e, 0];
    case "chest":
      return [0, 0.06 * e, 0];
    case "abdomen":
      return [0, -0.02 * e, 0];
    case "armL":
      return [-0.24 * e, 0.04 * e, 0];
    case "armR":
      return [0.24 * e, 0.04 * e, 0];
    case "legL":
      return [-0.07 * e, -0.16 * e, 0];
    case "legR":
      return [0.07 * e, -0.16 * e, 0];
  }
}

export type Palette = { line: string; back: string; accent: string; text: string; mute: string };

export const defaultPalette: Palette = {
  line: "236,233,225",
  back: "236,233,225",
  accent: "255,90,31",
  text: "#ECE9E1",
  mute: "#8B8980",
};

export type DrawOptions = {
  width: number;
  height: number;
  dpr: number;
  state: BodyState;
  palette?: Palette;
  monoFont?: string;
  /** desloca o corpo horizontalmente (fração da largura) */
  offsetX?: number;
  /** escala relativa (1 = corpo ocupa ~78% da altura) */
  scale?: number;
};

export function drawBody(ctx: CanvasRenderingContext2D, opts: DrawOptions) {
  const { width: W, height: H, dpr, state } = opts;
  const pal = opts.palette ?? defaultPalette;
  const mono = opts.monoFont ?? "ui-monospace, monospace";
  const s = state;
  const g = s.girth;
  const e = s.explode;
  const cosR = Math.cos(s.rotation);
  const sinR = Math.sin(s.rotation);
  const camD = 3.4;
  const f = (H / 2.35) * camD * (opts.scale ?? 1);
  const cx0 = W / 2 + (opts.offsetX ?? 0) * W;
  const cy0 = H / 2;
  const lw = Math.max(0.6, dpr * 0.75);

  const project = (x: number, y: number, z: number): [number, number, number] => {
    const xr = x * cosR + z * sinR;
    const zr = -x * sinR + z * cosR;
    const k = f / (camD - zr);
    return [cx0 + xr * k, cy0 - (y - 0.98) * k, zr];
  };

  const front = new Path2D();
  const back = new Path2D();
  const inner = new Path2D();
  const hot = new Path2D();
  const scanY = s.scan >= 0 ? 1.92 - s.scan * 1.92 : -10;
  const scanPath = new Path2D();
  const outerScale = 1 + 0.16 * s.layers;

  const ringPath = (r: Ring, scaleR: number, target: "split" | Path2D) => {
    const [ox, oy, oz] = partOffset(r.part, e);
    const isLimbOrTorso = r.part !== "head" && r.part !== "neck";
    const gx = isLimbOrTorso ? g : 1;
    const gz = isLimbOrTorso ? 1 + (g - 1) * 1.25 : 1;
    const rx = r.rx * gx * scaleR;
    const rz = r.rz * gz * scaleR;
    // braços acompanham o alargamento do tronco
    const cx = (r.part === "armL" || r.part === "armR" ? r.cx * (1 + (g - 1) * 0.9) : r.cx) + ox;
    let penDown = false;
    let prevFront = false;
    const centerZ = -cx * sinR + (r.cz + oz) * cosR;
    for (let i = 0; i <= STEPS; i++) {
      const [px, py, pz] = project(cx + rx * COS[i], r.cy + oy, r.cz + oz + rz * SIN[i]);
      if (target === "split") {
        const isFront = pz >= centerZ;
        const path = isFront ? front : back;
        if (!penDown || isFront !== prevFront) {
          // fecha o segmento no caminho anterior para não deixar buracos
          if (penDown) (prevFront ? front : back).lineTo(px, py);
          path.moveTo(px, py);
          penDown = true;
          prevFront = isFront;
        } else path.lineTo(px, py);
      } else {
        if (i === 0) target.moveTo(px, py);
        else target.lineTo(px, py);
      }
    }
  };

  for (const r of RINGS) {
    ringPath(r, outerScale, "split");
    if (s.layers > 0.01 && r.part !== "head") ringPath(r, 0.72, inner);
    if (r.measure && (s.highlight ?? 0) > 0.01) ringPath(r, outerScale * 1.04, hot);
    if (s.scan >= 0 && Math.abs(r.cy - scanY) < 0.035) ringPath(r, outerScale * 1.02, scanPath);
  }

  ctx.save();
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.strokeStyle = `rgba(${pal.back},0.13)`;
  ctx.stroke(back);
  if (s.layers > 0.01) {
    ctx.strokeStyle = `rgba(${pal.accent},${0.55 * s.layers})`;
    ctx.stroke(inner);
  }
  ctx.strokeStyle = `rgba(${pal.line},${0.62 - 0.12 * s.layers})`;
  ctx.stroke(front);
  if ((s.highlight ?? 0) > 0.01) {
    ctx.lineWidth = lw * 2.2;
    ctx.strokeStyle = `rgba(${pal.accent},${s.highlight})`;
    ctx.stroke(hot);
  }
  if (s.scan >= 0) {
    ctx.lineWidth = lw * 1.8;
    ctx.strokeStyle = `rgba(${pal.accent},0.95)`;
    ctx.stroke(scanPath);
    // linha de varredura horizontal
    const [, sy] = project(0, scanY, 0);
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, `rgba(${pal.accent},0)`);
    grad.addColorStop(0.5, `rgba(${pal.accent},0.55)`);
    grad.addColorStop(1, `rgba(${pal.accent},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, sy, W, lw);
    ctx.font = `${10 * dpr}px ${mono}`;
    ctx.fillStyle = `rgba(${pal.accent},0.9)`;
    ctx.fillText(`SCAN  Y=${(scanY * 100).toFixed(0).padStart(3, "0")}`, 12 * dpr, sy - 6 * dpr);
  }

  // rótulos antropométricos
  if (s.labels > 0.01) {
    ctx.font = `${10 * dpr}px ${mono}`;
    ctx.textBaseline = "middle";
    MARKS.forEach((m, i) => {
      const local = Math.min(1, Math.max(0, s.labels * MARKS.length - i * 0.7));
      if (local <= 0) return;
      const [ox, oy, oz] = partOffset(m.part, e);
      const isArm = m.part === "armL" || m.part === "armR";
      const mx = (isArm ? m.x * (1 + (g - 1) * 0.9) : m.x * g) * outerScale + ox;
      const [px, py, pz] = project(mx, m.y + oy, m.z * outerScale + oz);
      const visible = pz > -0.06 ? 1 : 0.35;
      const lineLen = (W < 700 * dpr ? 26 : 70) * dpr;
      const dir = m.side;
      const ex = px + dir * lineLen * local;
      ctx.globalAlpha = local * visible;
      ctx.strokeStyle = `rgba(${pal.accent},1)`;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(ex, py);
      ctx.stroke();
      ctx.fillStyle = `rgba(${pal.accent},1)`;
      ctx.fillRect(px - 2.5 * dpr, py - 2.5 * dpr, 5 * dpr, 5 * dpr);
      ctx.textAlign = dir > 0 ? "left" : "right";
      const tx = ex + dir * 6 * dpr;
      ctx.fillStyle = pal.mute;
      ctx.fillText(m.title, tx, py - 7 * dpr);
      ctx.fillStyle = pal.text;
      ctx.font = `${12 * dpr}px ${mono}`;
      ctx.fillText(m.value, tx, py + 7 * dpr);
      ctx.font = `${10 * dpr}px ${mono}`;
    });
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
