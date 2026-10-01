export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const ease = (t: number) => 1 - Math.pow(1 - t, 3);
export const smooth = (t: number) => t * t * (3 - 2 * t);

/** progresso 0..1 de uma seção alta com conteúdo sticky */
export function stickyProgress(el: HTMLElement | null) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const total = r.height - window.innerHeight;
  return total <= 0 ? 0 : clamp(-r.top / total);
}
