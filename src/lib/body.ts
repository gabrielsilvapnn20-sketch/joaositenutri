// Figura humana procedural em linhas (anéis transversais projetados em perspectiva).
// Tem versão feminina e masculina, e um "antes → depois": espessura, postura e cor
// mudam juntas. Sem assets e sem WebGL — leve no navegador do Instagram.

export type Sexo = "f" | "m";

export type BodyState = {
  rotation: number; // radianos em torno do eixo Y
  girth: number; // 0.85..1.45 — espessura
  slouch?: number; // 0..1 — postura curvada (antes)
  tone?: number; // 0 cinza (antes) → 1 verde (depois)
  sex?: Sexo;
  explode?: number; // 0..1 — separa as partes (efeito "análise")
  labels?: number; // 0..1 — pontos de medida
  scan?: number; // -1 desliga; 0..1 linha de varredura
};

type Part = "head" | "neck" | "chest" | "abdomen" | "armL" | "armR" | "legL" | "legR" | "hair";
type Ring = { part: Part; cx: number; cy: number; cz: number; rx: number; rz: number };
type Mark = { part: Part; x: number; y: number; z: number; side: 1 | -1; title: string };

const STEPS = 28;
const COS = Array.from({ length: STEPS + 1 }, (_, i) => Math.cos((i / STEPS) * Math.PI * 2));
const SIN = Array.from({ length: STEPS + 1 }, (_, i) => Math.sin((i / STEPS) * Math.PI * 2));

function profile(points: [number, number][], y: number) {
  if (y <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [y1, v1] = points[i];
    const [y0, v0] = points[i - 1];
    if (y <= y1) {
      const t = (y - y0) / (y1 - y0);
      return v0 + (v1 - v0) * t * t * (3 - 2 * t);
    }
  }
  return points[points.length - 1][1];
}

type Shape = {
  torso: [number, number][];
  depth: [number, number][];
  leg: [number, number][];
  arm: [number, number][];
  shoulderX: number;
  hipX: number;
  head: { y: number; rx: number; ry: number; rz: number };
  hair: boolean;
};

const MALE: Shape = {
  torso: [[0.92, 0.158], [1.0, 0.17], [1.1, 0.146], [1.22, 0.156], [1.34, 0.176], [1.45, 0.19], [1.5, 0.186], [1.54, 0.14], [1.58, 0.07]],
  depth: [[0.92, 0.1], [1.1, 0.098], [1.3, 0.118], [1.45, 0.11], [1.58, 0.055]],
  leg: [[0.08, 0.03], [0.3, 0.042], [0.45, 0.058], [0.58, 0.05], [0.8, 0.082], [0.93, 0.093]],
  arm: [[0, 0.055], [0.25, 0.046], [0.48, 0.035], [0.6, 0.04], [0.95, 0.027], [1.05, 0.032], [1.12, 0.02]],
  shoulderX: 0.218,
  hipX: 0.086,
  head: { y: 1.755, rx: 0.084, ry: 0.118, rz: 0.1 },
  hair: false,
};

const FEMALE: Shape = {
  torso: [[0.9, 0.17], [0.98, 0.182], [1.06, 0.15], [1.13, 0.124], [1.22, 0.13], [1.31, 0.152], [1.38, 0.15], [1.45, 0.16], [1.49, 0.152], [1.53, 0.115], [1.56, 0.06]],
  depth: [[0.9, 0.105], [1.0, 0.11], [1.12, 0.09], [1.3, 0.122], [1.4, 0.1], [1.56, 0.05]],
  leg: [[0.08, 0.027], [0.3, 0.038], [0.45, 0.053], [0.58, 0.047], [0.8, 0.083], [0.92, 0.096]],
  arm: [[0, 0.044], [0.25, 0.038], [0.48, 0.029], [0.6, 0.033], [0.95, 0.023], [1.03, 0.028], [1.1, 0.017]],
  shoulderX: 0.188,
  hipX: 0.092,
  head: { y: 1.72, rx: 0.078, ry: 0.11, rz: 0.094 },
  hair: true,
};

function buildRings(s: Shape): Ring[] {
  const rings: Ring[] = [];
  const dy = 0.026;
  const top = s.torso[s.torso.length - 1][0];
  const { head } = s;
  for (let y = head.y - head.ry + 0.005; y <= head.y + head.ry; y += dy * 0.8) {
    const k = Math.sqrt(Math.max(0, 1 - ((y - head.y) / head.ry) ** 2));
    rings.push({ part: "head", cx: 0, cy: y, cz: 0.005, rx: head.rx * k, rz: head.rz * k });
  }
  if (s.hair) {
    // coque atrás da cabeça
    for (let y = head.y - 0.02; y <= head.y + 0.1; y += dy * 0.7) {
      const k = Math.sqrt(Math.max(0, 1 - ((y - (head.y + 0.04)) / 0.06) ** 2));
      rings.push({ part: "hair", cx: 0, cy: y, cz: -0.115, rx: 0.05 * k, rz: 0.045 * k });
    }
  }
  for (let y = top - 0.01; y < head.y - head.ry + 0.01; y += dy) rings.push({ part: "neck", cx: 0, cy: y, cz: 0, rx: 0.048, rz: 0.048 });
  for (let y = s.torso[0][0]; y < top; y += dy) {
    rings.push({ part: y > 1.26 ? "chest" : "abdomen", cx: 0, cy: y, cz: 0, rx: profile(s.torso, y), rz: profile(s.depth, y) });
  }
  const legTop = s.torso[0][0] + 0.02;
  for (const side of [-1, 1] as const) {
    for (let y = 0.08; y < legTop; y += dy) {
      const r = profile(s.leg, y);
      rings.push({ part: side < 0 ? "legL" : "legR", cx: side * (s.hipX + (legTop - y) * 0.012), cy: y, cz: 0, rx: r, rz: r * 1.04 });
    }
    const n = 24;
    const shoulderY = top - 0.09;
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 1.1;
      const r = profile(s.arm, t);
      rings.push({ part: side < 0 ? "armL" : "armR", cx: side * (s.shoulderX + t * 0.07), cy: shoulderY - t * 0.54, cz: 0.01 - t * 0.02, rx: r, rz: r });
    }
  }
  return rings;
}

const RINGS: Record<Sexo, Ring[]> = { m: buildRings(MALE), f: buildRings(FEMALE) };

const MARKS: Mark[] = [
  { part: "armR", x: 0.25, y: 1.31, z: -0.04, side: 1, title: "Braço" },
  { part: "abdomen", x: 0.05, y: 1.12, z: 0.095, side: 1, title: "Abdômen" },
  { part: "chest", x: -0.1, y: 1.38, z: -0.1, side: -1, title: "Costas" },
  { part: "legR", x: 0.1, y: 0.76, z: 0.08, side: 1, title: "Coxa" },
  { part: "legL", x: -0.06, y: 0.46, z: 0.03, side: -1, title: "Panturrilha" },
];

function partOffset(part: Part, e: number): [number, number, number] {
  switch (part) {
    case "head":
    case "hair":
      return [0, 0.2 * e, 0];
    case "neck":
      return [0, 0.12 * e, 0];
    case "chest":
      return [0, 0.06 * e, 0];
    case "abdomen":
      return [0, -0.02 * e, 0];
    case "armL":
      return [-0.22 * e, 0.04 * e, 0];
    case "armR":
      return [0.22 * e, 0.04 * e, 0];
    case "legL":
      return [-0.07 * e, -0.15 * e, 0];
    case "legR":
      return [0.07 * e, -0.15 * e, 0];
  }
}

const GREY = [160, 168, 162];
const GREEN = [46, 156, 90];
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",");

export type DrawOptions = {
  width: number;
  height: number;
  dpr: number;
  state: BodyState;
  font?: string;
  offsetX?: number; // fração da largura
  scale?: number;
};

export function drawBody(ctx: CanvasRenderingContext2D, opts: DrawOptions) {
  const { width: W, height: H, dpr, state: s } = opts;
  const sex = s.sex ?? "m";
  const g = s.girth;
  const e = s.explode ?? 0;
  const slouch = s.slouch ?? 0;
  const tone = s.tone ?? 1;
  const cosR = Math.cos(s.rotation);
  const sinR = Math.sin(s.rotation);
  const camD = 3.4;
  const f = (H / 2.3) * camD * (opts.scale ?? 1);
  const cx0 = W / 2 + (opts.offsetX ?? 0) * W;
  const cy0 = H / 2;
  const lw = Math.max(0.8, dpr * 0.9);
  const color = mix(GREY, GREEN, tone);

  const project = (x: number, y: number, z: number): [number, number, number] => {
    const xr = x * cosR + z * sinR;
    const zr = -x * sinR + z * cosR;
    const k = f / (camD - zr);
    return [cx0 + xr * k, cy0 - (y - 0.96) * k, zr];
  };

  // postura: ombros e cabeça projetados à frente, leve queda
  const posture = (y: number): [number, number] => {
    const k = Math.max(0, (y - 0.95) / 0.85);
    return [slouch * 0.11 * k * k, -slouch * 0.035 * k];
  };

  const front = new Path2D();
  const back = new Path2D();
  const scanPath = new Path2D();
  const scanY = (s.scan ?? -1) >= 0 ? 1.9 - (s.scan as number) * 1.9 : -10;

  for (const r of RINGS[sex]) {
    const [ox, oy, oz] = partOffset(r.part, e);
    const [pz, py] = posture(r.cy);
    const soft = r.part !== "head" && r.part !== "neck" && r.part !== "hair";
    // barriga cresce mais que o resto no "antes"
    const belly = r.part === "abdomen" ? 1 + (g - 1) * 0.6 : 1;
    const rx = r.rx * (soft ? g : 1);
    const rz = r.rz * (soft ? 1 + (g - 1) * 1.2 * belly : 1);
    const isArm = r.part === "armL" || r.part === "armR";
    const cx = (isArm ? r.cx * (1 + (g - 1) * 0.85) : r.cx) + ox;
    const cy = r.cy + oy + py;
    const cz = r.cz + oz + pz;
    const centerZ = -cx * sinR + cz * cosR;
    let penDown = false;
    let prevFront = false;
    for (let i = 0; i <= STEPS; i++) {
      const [px, pyy, pzz] = project(cx + rx * COS[i], cy, cz + rz * SIN[i]);
      const isFront = pzz >= centerZ;
      const path = isFront ? front : back;
      if (!penDown || isFront !== prevFront) {
        if (penDown) (prevFront ? front : back).lineTo(px, pyy);
        path.moveTo(px, pyy);
        penDown = true;
        prevFront = isFront;
      } else path.lineTo(px, pyy);
    }
    if (Math.abs(r.cy - scanY) < 0.035) {
      for (let i = 0; i <= STEPS; i++) {
        const [px, pyy] = project(cx + rx * 1.03 * COS[i], cy, cz + rz * 1.03 * SIN[i]);
        if (i === 0) scanPath.moveTo(px, pyy);
        else scanPath.lineTo(px, pyy);
      }
    }
  }

  ctx.save();
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.strokeStyle = `rgba(${color},0.16)`;
  ctx.stroke(back);
  ctx.strokeStyle = `rgba(${color},${0.55 + tone * 0.3})`;
  ctx.stroke(front);

  if ((s.scan ?? -1) >= 0) {
    ctx.lineWidth = lw * 2;
    ctx.strokeStyle = "rgba(46,156,90,0.9)";
    ctx.stroke(scanPath);
  }

  const labels = s.labels ?? 0;
  if (labels > 0.01) {
    ctx.font = `600 ${11 * dpr}px ${opts.font ?? "sans-serif"}`;
    ctx.textBaseline = "middle";
    MARKS.forEach((m, i) => {
      const local = Math.min(1, Math.max(0, labels * MARKS.length - i * 0.7));
      if (local <= 0) return;
      const [ox, oy, oz] = partOffset(m.part, e);
      const isArm = m.part === "armL" || m.part === "armR";
      const mx = (isArm ? m.x * (1 + (g - 1) * 0.85) : m.x * g) + ox;
      const [px, py] = project(mx, m.y + oy, m.z + oz);
      const ex = px + m.side * 30 * dpr * local;
      ctx.globalAlpha = local;
      ctx.strokeStyle = "rgba(46,156,90,1)";
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(ex, py);
      ctx.stroke();
      ctx.fillStyle = "rgba(46,156,90,1)";
      ctx.beginPath();
      ctx.arc(px, py, 3.2 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.textAlign = m.side > 0 ? "left" : "right";
      ctx.fillStyle = "#16271D";
      ctx.fillText(m.title, ex + m.side * 6 * dpr, py);
    });
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
