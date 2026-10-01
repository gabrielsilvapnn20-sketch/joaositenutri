import type { Horario } from "@/lib/diagnostico";

/** Linha do tempo de 24h: sono, refeições e treino. Atualiza com as respostas. */
export default function MapaDoDia({ acorda, dorme, refeicoes, horario }: { acorda: number; dorme: number; refeicoes: number; horario: Horario }) {
  const pct = (h: number) => `${(((h % 24) + 24) % 24) / 24 * 100}%`;
  const fimDia = dorme - 1.2;
  const inicio = acorda + 0.5;
  const meals = Array.from({ length: refeicoes }, (_, i) => (refeicoes === 1 ? (inicio + fimDia) / 2 : inicio + ((fimDia - inicio) * i) / (refeicoes - 1)));
  const treino = horario === "manha" ? acorda + 0.6 : horario === "tarde" ? 15 : horario === "noite" ? 19 : null;
  const sonoAteMeiaNoite = dorme < 24;
  const maiorIntervalo = meals.slice(1).reduce((m, h, i) => Math.max(m, h - meals[i]), 0);

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-soft sm:p-7">
      <div className="flex items-center justify-between">
        <p className="label">MAPA DO DIA / 24H</p>
        <p className="label tabular-nums">{refeicoes} refeições · maior intervalo {maiorIntervalo.toFixed(1).replace(".", ",")}h</p>
      </div>
      <div className="relative mt-8 h-16">
        {/* sono */}
        <div className="absolute inset-y-0 left-0 bg-mint/70" style={{ width: pct(acorda) }} />
        {sonoAteMeiaNoite ? (
          <div className="absolute inset-y-0 right-0 bg-mint/70" style={{ left: pct(dorme) }} />
        ) : (
          <div className="absolute inset-y-0 left-0 bg-mint/70" style={{ width: pct(dorme) }} />
        )}
        <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
        {treino !== null && (
          <div className="absolute top-1/2 h-6 -translate-y-1/2 rounded-md border-2 border-leaf-deep bg-leaf-deep/10 transition-[left] duration-500" style={{ left: pct(treino), width: `${(1.2 / 24) * 100}%` }}>
            <span className="absolute -top-6 left-0 whitespace-nowrap text-[11px] font-semibold text-leaf-deep">TREINO</span>
          </div>
        )}
        {meals.map((h, i) => (
          <span key={i} className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf transition-[left] duration-500" style={{ left: pct(h) }} />
        ))}
        <span className="absolute -bottom-7 -translate-x-1/2 text-[11px] font-medium text-mute" style={{ left: pct(acorda) }}>acorda</span>
        <span className="absolute -bottom-7 -translate-x-1/2 text-[11px] font-medium text-mute" style={{ left: pct(dorme) }}>dorme</span>
      </div>
      <div className="mt-10 flex justify-between text-[11px] text-mute">
        {[0, 6, 12, 18, 24].map((h) => (
          <span key={h}>{String(h).padStart(2, "0")}h</span>
        ))}
      </div>
    </div>
  );
}
