// "Corpo feito de comida": um esqueleto 2D com poses animadas (correndo, em pé,
// acenando) e centenas de partículas-comida presas aos ossos. As partículas
// começam como uma nuvem de fast food e, ao formar, viram comida de verdade.

import { getSprites, type Sprites } from "./foods";

export type Pose = "run" | "stand" | "wave";
type V = [number, number];

type Joints = {
  hip: V; neck: V; head: V; pony: V; ponyEnd: V;
  shL: V; elL: V; haL: V; shR: V; elR: V; haR: V;
  hiL: V; knL: V; anL: V; ftL: V; hiR: V; knR: V; anR: V; ftR: V;
};

const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const dir = (a: number, len: number): V => [Math.sin(a) * len, -Math.cos(a) * len]; // a=0 aponta para baixo

const HEAD_R = 0.068;

export function poseJoints(pose: Pose, phase: number): Joints {
  if (pose === "run") {
    const bob = 0.022 * Math.cos(phase * 2);
    const lean = 0.2;
    const hip: V = [0, 0.5 + bob];
    const neck = add(hip, [Math.sin(lean) * 0.3, Math.cos(lean) * 0.3]);
    const head = add(neck, [Math.sin(lean * 1.3) * 0.1, 0.1]);
    const leg = (ph: number) => {
      const thigh = 0.62 * Math.sin(ph);
      const flex = 0.25 + 1.0 * Math.max(0, Math.sin(ph - 1.1)) ** 1.2;
      const kn = add(hip, dir(thigh, 0.25));
      const shinA = thigh - flex;
      const an = add(kn, dir(shinA, 0.25));
      const ft = add(an, [Math.cos(shinA) * 0.075, Math.sin(shinA) * 0.075]);
      return [hip, kn, an, ft] as const;
    };
    const arm = (ph: number) => {
      const sh = add(neck, [0, -0.035]);
      const a = -0.75 * Math.sin(ph);
      const el = add(sh, dir(a, 0.16));
      const ha = add(el, dir(a + 1.5, 0.14));
      return [sh, el, ha] as const;
    };
    const [hiL, knL, anL, ftL] = leg(phase + Math.PI);
    const [hiR, knR, anR, ftR] = leg(phase);
    const [shL, elL, haL] = arm(phase);
    const [shR, elR, haR] = arm(phase + Math.PI);
    const pony = add(head, [-0.055, 0.035]);
    const ponyEnd = add(pony, [-0.11, -0.03 + 0.03 * Math.sin(phase * 2)]);
    return { hip, neck, head, pony, ponyEnd, shL, elL, haL, shR, elR, haR, hiL, knL, anL, ftL, hiR, knR, anR, ftR };
  }

  // em pé (com respiração) ou acenando
  const breathe = 0.006 * Math.sin(phase);
  const hip: V = [0, 0.52];
  const neck: V = [0, 0.82 + breathe];
  const head: V = [0, 0.92 + breathe];
  const legS = (s: number) => {
    const hi: V = [s * 0.05, 0.52];
    const kn: V = [s * 0.065, 0.27];
    const an: V = [s * 0.075, 0.03];
    const ft: V = [s * 0.075 + 0.06, 0.02];
    return [hi, kn, an, ft] as const;
  };
  const [hiL, knL, anL, ftL] = legS(-1);
  const [hiR, knR, anR, ftR] = legS(1);
  const shL: V = [-0.1, 0.78 + breathe];
  const shR: V = [0.1, 0.78 + breathe];
  const elL: V = [-0.15, 0.62];
  const haL: V = [-0.17, 0.47];
  let elR: V = [0.15, 0.62];
  let haR: V = [0.17, 0.47];
  if (pose === "wave") {
    elR = [0.24, 0.9];
    const w = 0.35 * Math.sin(phase * 3);
    haR = add(elR, [Math.sin(w) * 0.14, Math.cos(w) * 0.14]);
  }
  const pony = add(head, [0, 0.06]);
  const ponyEnd = add(pony, [0.02 * Math.sin(phase), 0.05]);
  return { hip, neck, head, pony, ponyEnd, shL, elL, haL, shR, elR, haR, hiL, knL, anL, ftL, hiR, knR, anR, ftR };
}

// ossos: [início, fim, meia-largura no início, no fim, camada de desenho]
type BoneDef = { a: keyof Joints; b: keyof Joints; w0: number; w1: number; layer: number; soft: boolean };
const BONES: BoneDef[] = [
  { a: "shL", b: "elL", w0: 0.034, w1: 0.028, layer: 0, soft: true },
  { a: "elL", b: "haL", w0: 0.027, w1: 0.021, layer: 0, soft: true },
  { a: "hiL", b: "knL", w0: 0.058, w1: 0.04, layer: 1, soft: true },
  { a: "knL", b: "anL", w0: 0.04, w1: 0.026, layer: 1, soft: true },
  { a: "anL", b: "ftL", w0: 0.024, w1: 0.02, layer: 1, soft: false },
  { a: "pony", b: "ponyEnd", w0: 0.026, w1: 0.012, layer: 2, soft: false },
  { a: "hip", b: "neck", w0: 0.075, w1: 0.082, layer: 3, soft: true },
  { a: "hiR", b: "knR", w0: 0.058, w1: 0.04, layer: 5, soft: true },
  { a: "knR", b: "anR", w0: 0.04, w1: 0.026, layer: 5, soft: true },
  { a: "anR", b: "ftR", w0: 0.024, w1: 0.02, layer: 5, soft: false },
  { a: "shR", b: "elR", w0: 0.034, w1: 0.028, layer: 6, soft: true },
  { a: "elR", b: "haR", w0: 0.027, w1: 0.021, layer: 6, soft: true },
];
const HEAD_LAYER = 4;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Particle = {
  bone: number; // -1 = cabeça
  t: number;
  s: number;
  layer: number;
  healthy: number;
  junk: number;
  size: number;
  rot: number;
  spin: number;
  delay: number;
  cloud: V;
  pos: V;
  push: V;
  init: boolean;
};

export type SceneControls = {
  form: number; // 0 = nuvem de fast food, 1 = corpo formado
  pose: Pose;
  speed?: number; // velocidade da corrida
  girth?: number; // 0.85..1.45 — corpo mais cheio/mais magro
  pointer?: V | null; // posição do ponteiro em px (canvas)
  centerX?: number; // 0..1 — onde a figura fica na largura do canvas
  size?: number; // escala relativa da figura
};

export class FoodScene {
  private parts: Particle[] = [];
  private sprites: Sprites;
  private phase = 0;
  private formShown = 0;
  private density = 1;

  constructor(count: number, seed = 7) {
    this.sprites = getSprites();
    this.density = Math.sqrt(340 / Math.max(60, count)); // menos partículas → comidas maiores
    const rnd = mulberry32(seed);
    const areas = BONES.map((b) => {
      const len = 0.25;
      return len * (b.w0 + b.w1) * (b.a === "hip" ? 1.25 : 1);
    });
    const headArea = Math.PI * HEAD_R * HEAD_R * 1.4;
    const total = areas.reduce((a, b) => a + b, 0) + headArea;
    const push = (bone: number, layer: number) => {
      const healthy = Math.floor(rnd() * this.sprites.healthy.length);
      this.parts.push({
        bone,
        t: rnd(),
        s: (rnd() * 2 - 1) * 0.85,
        layer,
        healthy,
        junk: Math.floor(rnd() * this.sprites.junk.length),
        size: 0.8 + rnd() * 0.45,
        rot: (rnd() - 0.5) * 1.6,
        spin: (rnd() - 0.5) * 2,
        delay: rnd() * 0.45,
        cloud: [(rnd() * 2 - 1) * 0.5, 0.48 + (rnd() * 2 - 1) * 0.44],
        pos: [0, 0],
        push: [0, 0],
        init: false,
      });
    };
    BONES.forEach((b, i) => {
      const n = Math.max(4, Math.round((areas[i] / total) * count));
      for (let k = 0; k < n; k++) push(i, b.layer);
    });
    const nh = Math.round((headArea / total) * count);
    for (let k = 0; k < nh; k++) push(-1, HEAD_LAYER);
    this.parts.sort((a, b) => a.layer - b.layer);
  }

  /** Posição-alvo da partícula no corpo (unidades da figura). */
  private target(p: Particle, j: Joints, girth: number): V {
    if (p.bone < 0) {
      const a = p.t * Math.PI * 2;
      const r = Math.sqrt(Math.abs(p.s)) * HEAD_R;
      return [j.head[0] + Math.cos(a) * r, j.head[1] + Math.sin(a) * r];
    }
    const b = BONES[p.bone];
    const A = j[b.a];
    const B = j[b.b];
    const dx = B[0] - A[0];
    const dy = B[1] - A[1];
    const len = Math.hypot(dx, dy) || 1;
    let w = b.w0 + (b.w1 - b.w0) * p.t;
    if (b.soft) w *= girth;
    if (b.a === "hip") w *= 1 + (girth - 1) * 1.4 * Math.sin(Math.PI * Math.min(1, p.t * 1.6)); // barriga
    return [A[0] + dx * p.t + (-dy / len) * p.s * w, A[1] + dy * p.t + (dx / len) * p.s * w];
  }

  step(dt: number, time: number, c: SceneControls, W: number, H: number) {
    const girth = c.girth ?? 1;
    this.formShown += (c.form - this.formShown) * Math.min(1, dt * 2.2);
    this.phase += dt * (c.pose === "run" ? (c.speed ?? 7) : 1.6);
    const j = poseJoints(c.pose, this.phase);
    this.layout = { cx: c.centerX ?? 0.5, size: c.size ?? 1 };
    const { scale, ox, oy } = this.frame(W, H);
    const f = this.formShown;
    const follow = Math.min(1, dt * 14);

    for (const p of this.parts) {
      const lp = Math.min(1, Math.max(0, (f - p.delay) / 0.55));
      const e = lp * lp * (3 - 2 * lp);
      const drift: V = [Math.sin(time * 0.6 + p.delay * 20) * 0.025, Math.cos(time * 0.5 + p.t * 10) * 0.025];
      const cloud = add(p.cloud, drift);
      const tg = this.target(p, j, girth);
      const want: V = [cloud[0] + (tg[0] - cloud[0]) * e, cloud[1] + (tg[1] - cloud[1]) * e];
      const sx = ox + want[0] * scale;
      const sy = oy - want[1] * scale;
      const k = p.init ? follow : 1;
      p.init = true;
      p.pos[0] += (sx - p.pos[0]) * k;
      p.pos[1] += (sy - p.pos[1]) * k;

      // ponteiro espalha a comida
      if (c.pointer) {
        const dx = p.pos[0] + p.push[0] - c.pointer[0];
        const dy = p.pos[1] + p.push[1] - c.pointer[1];
        const d2 = dx * dx + dy * dy;
        const R = scale * 0.16;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const k = (1 - d / R) * scale * 0.05;
          p.push[0] += (dx / d) * k;
          p.push[1] += (dy / d) * k;
        }
      }
      p.push[0] *= 0.92;
      p.push[1] *= 0.92;
      p.rot += p.spin * dt * (1 - e * 0.85);
    }
  }

  private layout = { cx: 0.5, size: 1 };

  private frame(W: number, H: number) {
    const scale = Math.min(H * 0.8, W * 1.25) * this.layout.size;
    return { scale, ox: W * this.layout.cx, oy: H * 0.92 };
  }

  /** Posição em px do topo da cabeça — para ancorar balões de conversa. */
  headPx(W: number, H: number): V {
    const { scale, ox, oy } = this.frame(W, H);
    const j = poseJoints("run", this.phase);
    return [ox + j.head[0] * scale, oy - (j.head[1] + HEAD_R * 1.6) * scale];
  }

  draw(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const { scale, ox, oy } = this.frame(W, H);
    const f = this.formShown;
    const base = scale * 0.06 * this.density;

    // sombra no chão
    if (f > 0.05) {
      ctx.fillStyle = `rgba(17,78,47,${0.1 * f})`;
      ctx.beginPath();
      ctx.ellipse(ox, oy + base * 0.15, scale * 0.2, scale * 0.025, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const p of this.parts) {
      const lp = Math.min(1, Math.max(0, (f - p.delay) / 0.55));
      const healthy = lp > 0.5;
      const img = healthy ? this.sprites.healthy[p.healthy] : this.sprites.junk[p.junk];
      // "pop" na troca de fast food por comida de verdade
      const pop = 1 - Math.sin(lp * Math.PI) * 0.55;
      const size = base * p.size * pop * (healthy ? 1 : 1.25);
      const x = p.pos[0] + p.push[0];
      const y = p.pos[1] + p.push[1];
      ctx.globalAlpha = healthy ? 1 : 0.92;
      ctx.setTransform(Math.cos(p.rot), Math.sin(p.rot), -Math.sin(p.rot), Math.cos(p.rot), x, y);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  }
}
