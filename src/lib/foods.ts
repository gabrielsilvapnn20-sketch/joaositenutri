// Ícones de comida desenhados por código (canvas 2D), numa caixa de 100×100.
// Viram sprites uma única vez e depois são só "carimbados" — leve até no celular.

type Draw = (c: CanvasRenderingContext2D) => void;

function ellipse(c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot = 0) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
}
function circle(c: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  c.fillStyle = fill;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
}
function shine(c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot = -0.6) {
  c.fillStyle = "rgba(255,255,255,0.38)";
  ellipse(c, x, y, rx, ry, rot);
  c.fill();
}

// ------------------------------------------------------------ comida de verdade
const apple: Draw = (c) => {
  c.strokeStyle = "#7A4A2A";
  c.lineWidth = 5;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(50, 32);
  c.lineTo(53, 16);
  c.stroke();
  circle(c, 40, 58, 30, "#E5484D");
  circle(c, 60, 58, 30, "#E5484D");
  c.fillStyle = "#4CAF50";
  ellipse(c, 64, 20, 12, 6, -0.5);
  c.fill();
  shine(c, 36, 48, 7, 11);
};

const orange: Draw = (c) => {
  circle(c, 50, 54, 36, "#F59E2B");
  c.fillStyle = "#E58A17";
  for (const [x, y] of [[36, 46], [60, 40], [66, 62], [44, 70], [52, 56]]) circle(c, x, y, 1.8, "#E58A17");
  c.fillStyle = "#4CAF50";
  ellipse(c, 58, 18, 11, 5, -0.4);
  c.fill();
  shine(c, 36, 42, 7, 11);
};

const broccoli: Draw = (c) => {
  c.fillStyle = "#9CCC65";
  c.beginPath();
  c.moveTo(42, 56);
  c.lineTo(58, 56);
  c.lineTo(56, 92);
  c.quadraticCurveTo(50, 95, 44, 92);
  c.closePath();
  c.fill();
  for (const [x, y, r] of [[30, 46, 18], [50, 32, 21], [70, 46, 18], [50, 54, 18], [38, 30, 14], [62, 30, 14]]) circle(c, x, y, r, "#2E9C5A");
  for (const [x, y] of [[30, 44], [46, 28], [58, 40], [70, 48], [42, 52], [54, 22]]) circle(c, x, y, 3.5, "#1F7A45");
};

const avocado: Draw = (c) => {
  c.fillStyle = "#2F6B3A";
  ellipse(c, 50, 54, 31, 40);
  c.fill();
  c.fillStyle = "#D4E89A";
  ellipse(c, 50, 56, 25, 33);
  c.fill();
  circle(c, 50, 64, 13, "#8B5A2B");
  shine(c, 45, 59, 4, 6);
};

const egg: Draw = (c) => {
  c.fillStyle = "#FFFFFF";
  c.strokeStyle = "#E9E2D3";
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(20, 55);
  c.bezierCurveTo(16, 24, 52, 14, 70, 26);
  c.bezierCurveTo(90, 38, 88, 72, 66, 82);
  c.bezierCurveTo(44, 92, 22, 80, 20, 55);
  c.fill();
  c.stroke();
  circle(c, 52, 52, 16, "#F7B32B");
  shine(c, 47, 47, 4, 6);
};

const banana: Draw = (c) => {
  c.lineCap = "round";
  c.strokeStyle = "#F2C230";
  c.lineWidth = 20;
  c.beginPath();
  c.arc(50, 22, 46, 0.32 * Math.PI, 0.86 * Math.PI);
  c.stroke();
  c.strokeStyle = "#FBE07A";
  c.lineWidth = 7;
  c.beginPath();
  c.arc(50, 22, 42, 0.38 * Math.PI, 0.8 * Math.PI);
  c.stroke();
  circle(c, 88, 47, 4, "#6B4A2B");
};

const carrot: Draw = (c) => {
  c.fillStyle = "#F28C28";
  c.beginPath();
  c.moveTo(32, 34);
  c.quadraticCurveTo(50, 26, 68, 34);
  c.lineTo(52, 92);
  c.quadraticCurveTo(50, 95, 48, 92);
  c.closePath();
  c.fill();
  c.strokeStyle = "#D9741A";
  c.lineWidth = 3;
  c.lineCap = "round";
  for (const [x1, y, x2] of [[40, 48, 50], [52, 60, 60], [44, 72, 52]]) {
    c.beginPath();
    c.moveTo(x1, y);
    c.lineTo(x2, y + 2);
    c.stroke();
  }
  c.fillStyle = "#4CAF50";
  for (const r of [-0.5, 0, 0.5]) {
    ellipse(c, 50 + r * 18, 18, 6, 14, r);
    c.fill();
  }
};

const strawberry: Draw = (c) => {
  c.fillStyle = "#E5484D";
  c.beginPath();
  c.moveTo(50, 92);
  c.bezierCurveTo(16, 70, 14, 38, 30, 30);
  c.bezierCurveTo(42, 24, 58, 24, 70, 30);
  c.bezierCurveTo(86, 38, 84, 70, 50, 92);
  c.fill();
  for (const [x, y] of [[36, 44], [50, 42], [64, 44], [42, 58], [58, 58], [50, 72], [34, 60], [66, 60]]) circle(c, x, y, 2.2, "#FDE68A");
  c.fillStyle = "#3E9B4F";
  for (const r of [-1.1, -0.4, 0.4, 1.1]) {
    ellipse(c, 50 + Math.sin(r) * 14, 26 - Math.cos(r) * 4, 5, 12, r);
    c.fill();
  }
};

const lettuce: Draw = (c) => {
  c.fillStyle = "#6CC070";
  c.beginPath();
  c.moveTo(14, 86);
  c.bezierCurveTo(14, 40, 44, 14, 86, 14);
  c.bezierCurveTo(86, 58, 60, 86, 14, 86);
  c.fill();
  c.strokeStyle = "rgba(255,255,255,0.65)";
  c.lineWidth = 4;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(18, 82);
  c.quadraticCurveTo(46, 50, 80, 20);
  c.stroke();
};

const blueberries: Draw = (c) => {
  for (const [x, y] of [[34, 60], [64, 58], [50, 34]]) {
    circle(c, x, y, 19, "#4C5FD5");
    circle(c, x + 2, y - 4, 4, "#2D3A8C");
    shine(c, x - 7, y - 6, 4, 6);
  }
};

const tomato: Draw = (c) => {
  circle(c, 50, 56, 34, "#EF5350");
  c.fillStyle = "#3E9B4F";
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ellipse(c, 50 + Math.cos(a) * 9, 26 + Math.sin(a) * 5, 9, 4, a);
    c.fill();
  }
  shine(c, 36, 46, 6, 10);
};

const salmon: Draw = (c) => {
  c.fillStyle = "#FA8C6E";
  c.beginPath();
  c.roundRect(16, 28, 68, 44, 18);
  c.fill();
  c.strokeStyle = "#FFD9CC";
  c.lineWidth = 4;
  c.lineCap = "round";
  for (const x of [34, 50, 66]) {
    c.beginPath();
    c.moveTo(x - 6, 32);
    c.quadraticCurveTo(x + 6, 50, x - 6, 68);
    c.stroke();
  }
};

// ------------------------------------------------------------ fast food
const burger: Draw = (c) => {
  c.fillStyle = "#E0A95F";
  c.beginPath();
  c.ellipse(50, 46, 38, 26, 0, Math.PI, 0);
  c.fill();
  for (const [x, y] of [[36, 32], [50, 26], [62, 34], [44, 40]]) circle(c, x, y, 2.4, "#FFF6E0");
  c.fillStyle = "#7CC24B";
  c.beginPath();
  c.moveTo(10, 50);
  for (let x = 10; x <= 90; x += 10) c.lineTo(x, x % 20 ? 56 : 50);
  c.lineTo(90, 50);
  c.fill();
  c.fillStyle = "#F7C948";
  c.beginPath();
  c.moveTo(14, 54);
  c.lineTo(86, 54);
  c.lineTo(50, 66);
  c.fill();
  c.fillStyle = "#6B3E26";
  c.beginPath();
  c.roundRect(12, 56, 76, 14, 7);
  c.fill();
  c.fillStyle = "#D89A52";
  c.beginPath();
  c.roundRect(14, 70, 72, 14, [2, 2, 12, 12]);
  c.fill();
};

const fries: Draw = (c) => {
  c.fillStyle = "#F7C948";
  for (const [x, h, r] of [[34, 30, -0.15], [44, 22, -0.05], [54, 26, 0.05], [64, 32, 0.15], [50, 34, 0]]) {
    c.save();
    c.translate(x, 50);
    c.rotate(r);
    c.fillRect(-4, -h, 8, h + 10);
    c.restore();
  }
  c.fillStyle = "#E5484D";
  c.beginPath();
  c.moveTo(24, 46);
  c.lineTo(76, 46);
  c.lineTo(68, 92);
  c.lineTo(32, 92);
  c.closePath();
  c.fill();
  c.fillStyle = "#FFFFFF";
  circle(c, 50, 68, 7, "#FFFFFF");
};

const soda: Draw = (c) => {
  c.strokeStyle = "#F5F5F5";
  c.lineWidth = 5;
  c.beginPath();
  c.moveTo(56, 22);
  c.lineTo(66, 4);
  c.stroke();
  c.fillStyle = "#E5484D";
  c.beginPath();
  c.moveTo(28, 26);
  c.lineTo(72, 26);
  c.lineTo(65, 94);
  c.lineTo(35, 94);
  c.closePath();
  c.fill();
  c.fillStyle = "#FFFFFF";
  c.fillRect(30, 50, 40, 12);
  c.fillStyle = "#DDDDDD";
  c.beginPath();
  c.roundRect(24, 20, 52, 8, 4);
  c.fill();
};

const donut: Draw = (c) => {
  circle(c, 50, 52, 36, "#E3A866");
  c.fillStyle = "#F48FB1";
  c.beginPath();
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r = 30 + (i % 2 ? 3 : 0);
    const x = 50 + Math.cos(a) * r;
    const y = 50 + Math.sin(a) * r;
    if (i) c.lineTo(x, y);
    else c.moveTo(x, y);
  }
  c.fill();
  const colors = ["#FFFFFF", "#4C5FD5", "#F7C948", "#2E9C5A"];
  for (let i = 0; i < 12; i++) {
    const a = i * 2.4;
    const r = 18 + (i % 3) * 4;
    c.save();
    c.translate(50 + Math.cos(a) * r, 50 + Math.sin(a) * r);
    c.rotate(a);
    c.fillStyle = colors[i % 4];
    c.fillRect(-3, -1.2, 6, 2.4);
    c.restore();
  }
  c.globalCompositeOperation = "destination-out";
  circle(c, 50, 52, 11, "#000");
  c.globalCompositeOperation = "source-over";
};

const pizza: Draw = (c) => {
  c.fillStyle = "#F7C948";
  c.beginPath();
  c.moveTo(50, 92);
  c.lineTo(16, 24);
  c.quadraticCurveTo(50, 12, 84, 24);
  c.closePath();
  c.fill();
  c.strokeStyle = "#D89A52";
  c.lineWidth = 10;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(17, 24);
  c.quadraticCurveTo(50, 12, 83, 24);
  c.stroke();
  for (const [x, y] of [[40, 40], [60, 42], [50, 62], [44, 52]]) circle(c, x, y, 6.5, "#D9363E");
};

export const HEALTHY: Draw[] = [apple, broccoli, avocado, egg, banana, carrot, strawberry, lettuce, blueberries, tomato, orange, salmon, broccoli, lettuce, apple];
export const JUNK: Draw[] = [burger, fries, soda, donut, pizza];

export type Sprites = { healthy: HTMLCanvasElement[]; junk: HTMLCanvasElement[] };

let cache: Sprites | null = null;

/** Desenha cada ícone uma vez num canvas próprio (resolução fixa). */
export function getSprites(px = 96): Sprites {
  if (cache) return cache;
  const make = (d: Draw) => {
    const cv = document.createElement("canvas");
    cv.width = px;
    cv.height = px;
    const c = cv.getContext("2d")!;
    c.scale(px / 100, px / 100);
    d(c);
    return cv;
  };
  cache = { healthy: HEALTHY.map(make), junk: JUNK.map(make) };
  return cache;
}
