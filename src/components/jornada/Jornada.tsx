"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FoodCanvas from "@/components/FoodCanvas";
import type { SceneControls } from "@/lib/foodFigure";
import {
  SABOTADORES,
  diagnosticoPorRegras,
  imc,
  resumoWhatsapp,
  type Diagnostico,
  type Lead,
  type Respostas,
  type SabotadorId,
} from "@/lib/diagnostico";
import { objetivosLabel, resultados, type Objetivo } from "@content/resultados";
import { planos, vagas, type Plano } from "@content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { readUtms, track } from "@/lib/track";
import { gerarCardStories } from "@/lib/shareCard";
import MapaDoDia from "./MapaDoDia";

const FASES = [
  { codigo: "01", nome: "Objetivo", badge: "Objetivo definido" },
  { codigo: "02", nome: "Seu corpo", badge: "Corpo mapeado" },
  { codigo: "03", nome: "Rotina", badge: "Rotina decodificada" },
  { codigo: "04", nome: "Sabotadores", badge: "Sabotadores expostos" },
  { codigo: "05", nome: "Desbloqueio", badge: "Diagnóstico desbloqueado" },
  { codigo: "06", nome: "Diagnóstico", badge: "" },
] as const;

const XP_POR_FASE = 120;

const cssVar = (name: string, fallback: string) => getComputedStyle(document.body).getPropertyValue(name).trim() || fallback;

const OBJETIVOS: { id: Objetivo; codigo: string; titulo: string; texto: string }[] = [
  { id: "hipertrofia", codigo: "Hipertrofia", titulo: "Ganhar massa", texto: "Crescer de verdade, sem ganhar barriga junto." },
  { id: "emagrecimento", codigo: "Emagrecimento", titulo: "Secar", texto: "Perder gordura sem perder o músculo que já tenho." },
  { id: "rotina", codigo: "Rotina", titulo: "Evoluir no treino", texto: "Ter mais energia e resultado com a rotina que eu tenho." },
  { id: "performance", codigo: "Esporte", titulo: "Performance", texto: "Render mais no meu esporte: corrida, luta, futebol…" },
];

const INICIAL: Omit<Respostas, "objetivo" | "local"> & { objetivo?: Objetivo; local?: Respostas["local"] } = {
  sexo: "masculino",
  peso: 75,
  altura: 172,
  idade: 27,
  diasTreino: 4,
  refeicoes: 4,
  horario: "noite",
  acorda: 7,
  dorme: 23,
  fimDeSemana: "relaxo",
  sabotadores: [],
};

type Rascunho = typeof INICIAL;
const STORAGE = "jv_jornada";

function salvar(data: unknown) {
  try {
    localStorage.setItem(STORAGE, JSON.stringify(data));
  } catch {
    /* modo privado */
  }
}

function formatWhats(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function Chip({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3.5 text-left text-[15px] font-medium transition-colors ${
        on ? "border-leaf bg-leaf text-white shadow-soft" : "border-line bg-white text-ink-2 hover:border-leaf/60"
      }`}
    >
      {children}
    </button>
  );
}

function Slider(props: { label: string; value: number; min: number; max: number; step?: number; unit: string; fmt?: (v: number) => string; onChange: (v: number) => void }) {
  const { label, value, min, max, step = 1, unit, fmt, onChange } = props;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="label">{label}</span>
        <span className="text-2xl tabular-nums">
          {fmt ? fmt(value) : value}
          <span className="ml-1 text-sm text-mute">{unit}</span>
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-4" />
    </label>
  );
}

export default function Jornada() {
  const [fase, setFase] = useState(0);
  const [r, setR] = useState<Rascunho>(INICIAL);
  const [lead, setLead] = useState<Lead>({ nome: "", whatsapp: "", consentimento: false });
  const [diag, setDiag] = useState<Diagnostico | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [planoPreferido, setPlanoPreferido] = useState<Plano["id"] | null>(null);
  const [erroForm, setErroForm] = useState<string | null>(null);
  const restaurado = useRef(false);

  // retomar de onde parou
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || "null");
      if (saved?.respostas) setR({ ...INICIAL, ...saved.respostas });
      if (saved?.nome) setLead((l) => ({ ...l, nome: saved.nome }));
      if (saved?.diagnostico) setDiag(saved.diagnostico);
      if (typeof saved?.fase === "number") setFase(Math.min(saved.fase, saved?.diagnostico ? 5 : 4));
    } catch {
      /* nada salvo */
    }
    const p = new URLSearchParams(window.location.search).get("plano");
    if (p && planos.some((x) => x.id === p)) setPlanoPreferido(p as Plano["id"]);
    restaurado.current = true;
    track("journey_start");
  }, []);

  useEffect(() => {
    if (!restaurado.current) return;
    salvar({ fase, respostas: r, nome: lead.nome, diagnostico: diag });
  }, [fase, r, lead.nome, diag]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [fase]);

  useEffect(() => setErroForm(null), [lead, r.local]);

  const set = <K extends keyof Rascunho>(k: K, v: Rascunho[K]) => setR((x) => ({ ...x, [k]: v }));

  const avancar = useCallback(
    (de: number) => {
      const badge = FASES[de].badge;
      if (badge) {
        setToast(`+${XP_POR_FASE} XP · ${badge}`);
        setTimeout(() => setToast(null), 1900);
      }
      track(`journey_step_${de + 1}`);
      setFase(de + 1);
    },
    [],
  );

  const xp = Math.min(fase, 5) * XP_POR_FASE + (diag ? XP_POR_FASE : 0);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErroForm(null);
    if (lead.nome.trim().length < 2) return setErroForm("Como posso te chamar?");
    if (lead.whatsapp.replace(/\D/g, "").length < 10) return setErroForm("Confere seu WhatsApp com DDD.");
    if (!r.local) return setErroForm("Escolha onde você está.");
    if (!lead.consentimento) return setErroForm("Preciso do seu consentimento para analisar as respostas.");
    if (!r.objetivo) return setFase(0);

    const respostas = r as Respostas;
    setCarregando(true);
    track("lead_submitted", { objetivo: respostas.objetivo });
    const minimo = new Promise((res) => setTimeout(res, 3200)); // tempo da "análise" na tela
    let resultado: Diagnostico;
    try {
      const resp = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respostas, lead, utm: readUtms() }),
      });
      if (!resp.ok) throw new Error(String(resp.status));
      resultado = (await resp.json()).diagnostico;
    } catch {
      resultado = diagnosticoPorRegras(respostas, lead);
    }
    await minimo;
    setDiag(resultado);
    setCarregando(false);
    avancar(4);
  }

  return (
    <div className="min-h-[100svh]">
      {/* barra superior: progresso + XP */}
      <header className="gutter sticky top-0 z-40 border-b border-line bg-paper/90 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-[14px] font-semibold"><span className="serif grid h-8 w-8 place-items-center rounded-full bg-leaf text-[13px] text-white">JV</span> João Vitor</Link>
          <span className="label tabular-nums">
            FASE {FASES[fase].codigo} / 06 · <span className="text-leaf">{xp} XP</span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-6 gap-1" aria-hidden>
          {FASES.map((f, i) => (
            <span key={f.codigo} className="h-[3px] overflow-hidden bg-mint">
              <span className={`block h-full bg-leaf transition-[width] duration-700 ${i < fase || (i === 5 && diag && fase === 5) ? "w-full" : i === fase ? "w-1/2" : "w-0"}`} />
            </span>
          ))}
        </div>
      </header>

      {toast && (
        <div role="status" className="fixed left-1/2 top-20 z-50 -translate-x-1/2 animate-[toast_1.9s_ease_forwards] rounded-full bg-leaf px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft">
          {toast}
        </div>
      )}

      <main className="gutter pb-32 pt-10 sm:pt-14">
        <div key={carregando ? "load" : fase} className="animate-[fase_0.6s_cubic-bezier(.2,.7,.1,1)]">
          {carregando ? (
            <Analisando />
          ) : fase === 0 ? (
            <FaseObjetivo
              valor={r.objetivo}
              onEscolha={(o) => {
                set("objetivo", o);
                setTimeout(() => avancar(0), 380);
              }}
            />
          ) : fase === 1 ? (
            <FaseCorpo r={r} set={set} onNext={() => avancar(1)} onBack={() => setFase(0)} />
          ) : fase === 2 ? (
            <FaseRotina r={r} set={set} onNext={() => avancar(2)} onBack={() => setFase(1)} />
          ) : fase === 3 ? (
            <FaseSabotadores r={r} set={set} onNext={() => avancar(3)} onBack={() => setFase(2)} />
          ) : fase === 4 ? (
            <FaseDesbloqueio r={r} set={set} lead={lead} setLead={setLead} erro={erroForm} onSubmit={enviar} onBack={() => setFase(3)} />
          ) : diag && r.objetivo ? (
            <FaseResultado
              r={r as Respostas}
              lead={lead}
              d={diag}
              planoPreferido={planoPreferido}
              onReset={() => {
                setDiag(null);
                setR(INICIAL);
                setFase(0);
              }}
            />
          ) : (
            <FaseDesbloqueio r={r} set={set} lead={lead} setLead={setLead} erro={erroForm} onSubmit={enviar} onBack={() => setFase(3)} />
          )}
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ fases */

function Titulo({ codigo, children, sub }: { codigo: string; children: React.ReactNode; sub?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="label !text-leaf">{codigo}</p>
      <h1 className="serif mt-3 text-[clamp(2.1rem,5.6vw,3.9rem)] font-medium leading-[1.03]">{children}</h1>
      {sub && <p className="mt-4 max-w-xl text-ink/70 sm:text-lg">{sub}</p>}
    </div>
  );
}

function Nav({ onBack, onNext, nextLabel = "Continuar", disabled }: { onBack?: () => void; onNext?: () => void; nextLabel?: string; disabled?: boolean }) {
  return (
    <div className="gutter fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-paper/95 py-3 backdrop-blur">
      {onBack ? (
        <button type="button" onClick={onBack} className="label px-2 py-3 hover:!text-ink">← Voltar</button>
      ) : (
        <span />
      )}
      {onNext && (
        <button type="button" onClick={onNext} disabled={disabled} className="btn-leaf disabled:opacity-40">
          {nextLabel} →
        </button>
      )}
    </div>
  );
}

function FaseObjetivo({ valor, onEscolha }: { valor?: Objetivo; onEscolha: (o: Objetivo) => void }) {
  return (
    <>
      <Titulo codigo="FASE 01 / OBJETIVO" sub="Escolha o que mais combina com você agora. Dá para mudar depois.">
        O que você quer<br />do seu corpo?
      </Titulo>
      <div className="mt-10 grid gap-3 [perspective:1200px] sm:grid-cols-2">
        {OBJETIVOS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onEscolha(o.id)}
            onPointerMove={(e) => {
              const el = e.currentTarget;
              const b = el.getBoundingClientRect();
              const x = (e.clientX - b.left) / b.width - 0.5;
              const y = (e.clientY - b.top) / b.height - 0.5;
              el.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
            }}
            onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
            className={`group relative flex min-h-[160px] rounded-[24px] flex-col justify-between border p-5 text-left transition-[transform,background,border-color] duration-300 ease-out sm:min-h-[220px] sm:p-7 ${
              valor === o.id ? "border-leaf bg-leaf text-white" : "border-line bg-white hover:border-ink/60"
            }`}
          >
            <span className={`label ${valor === o.id ? "!text-white/70" : ""}`}>{o.codigo}</span>
            <span>
              <span className="serif block text-[clamp(1.7rem,4vw,2.4rem)] font-medium leading-none">{o.titulo}</span>
              <span className={`mt-3 block text-[15px] ${valor === o.id ? "text-white/80" : "text-ink/65"}`}>{o.texto}</span>
            </span>
            <span className="absolute right-5 top-5 text-lg opacity-40 transition-transform group-hover:translate-x-1">→</span>
          </button>
        ))}
      </div>
    </>
  );
}

type SetFn = <K extends keyof Rascunho>(k: K, v: Rascunho[K]) => void;

function FaseCorpo({ r, set, onNext, onBack }: { r: Rascunho; set: SetFn; onNext: () => void; onBack: () => void }) {
  const rRef = useRef(r);
  rRef.current = r;
  const girthAtual = useRef(1);
  const getControls = useCallback((): SceneControls => {
    const b = imc(rRef.current);
    const alvo = Math.min(1.45, Math.max(0.85, 0.9 + ((b - 18) / 17) * 0.55));
    girthAtual.current += (alvo - girthAtual.current) * 0.1;
    return { form: 1, pose: "stand", girth: girthAtual.current, size: 0.95 };
  }, []);
  const valorImc = imc(r);

  return (
    <>
      <Titulo codigo="FASE 02 / SEU CORPO HOJE" sub="Mexa nos controles — o modelo reage em tempo real.">
        Vamos mapear<br />seu ponto de partida.
      </Titulo>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="relative aspect-square max-h-[56svh] w-full overflow-hidden rounded-[28px] bg-mint lg:aspect-[4/5]">
          <span className="label absolute left-3 top-3">Seu modelo</span>
          <span className="label absolute right-3 top-3 tabular-nums">IMC {valorImc.toFixed(1).replace(".", ",")}</span>
          <FoodCanvas getControls={getControls} count={260} className="absolute inset-0 h-full w-full" />
          <p className="absolute inset-x-3 bottom-3 text-[11px] leading-snug text-mute">
            O IMC não diferencia músculo de gordura. <span className="text-ink">É por isso que eu meço.</span>
          </p>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-2">
            <Chip on={r.sexo === "feminino"} onClick={() => set("sexo", "feminino")}>Feminino</Chip>
            <Chip on={r.sexo === "masculino"} onClick={() => set("sexo", "masculino")}>Masculino</Chip>
          </div>
          <Slider label="Peso" value={r.peso} min={40} max={160} unit="kg" onChange={(v) => set("peso", v)} />
          <Slider label="Altura" value={r.altura} min={140} max={210} unit="cm" onChange={(v) => set("altura", v)} />
          <Slider label="Idade" value={r.idade} min={14} max={75} unit="anos" onChange={(v) => set("idade", v)} />
          <Slider label="Treinos por semana" value={r.diasTreino} min={0} max={7} unit="x" onChange={(v) => set("diasTreino", v)} />
        </div>
      </div>
      <Nav onBack={onBack} onNext={onNext} />
    </>
  );
}

function FaseRotina({ r, set, onNext, onBack }: { r: Rascunho; set: SetFn; onNext: () => void; onBack: () => void }) {
  const hora = (v: number) => `${String(Math.floor(v % 24)).padStart(2, "0")}h`;
  return (
    <>
      <Titulo codigo="FASE 03 / SUA ROTINA" sub="Seu dia vira um mapa. É assim que eu enxergo onde a alimentação encaixa.">
        Como é o<br />seu dia?
      </Titulo>
      <div className="mt-8">
        <MapaDoDia acorda={r.acorda} dorme={r.dorme} refeicoes={r.refeicoes} horario={r.horario} />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <Slider label="Acordo às" value={r.acorda} min={4} max={11} unit="" fmt={hora} onChange={(v) => set("acorda", v)} />
          <Slider label="Durmo às" value={r.dorme} min={20} max={27} unit="" fmt={hora} onChange={(v) => set("dorme", v)} />
          <div>
            <p className="label">Refeições por dia</p>
            <div className="mt-3 grid grid-cols-6 gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Chip key={n} on={r.refeicoes === n} onClick={() => set("refeicoes", n)}>
                  <span className="block text-center">{n}</span>
                </Chip>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <p className="label">Treino em qual horário?</p>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {(
                [
                  ["manha", "Manhã"],
                  ["tarde", "Tarde"],
                  ["noite", "Noite"],
                  ["nao-treino", "Não treino ainda"],
                ] as const
              ).map(([id, l]) => (
                <Chip key={id} on={r.horario === id} onClick={() => set("horario", id)}>{l}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="label">No fim de semana eu…</p>
            <div className="mt-3 grid gap-1.5">
              {(
                [
                  ["foco", "Mantenho o foco"],
                  ["relaxo", "Relaxo um pouco"],
                  ["chuto", "Chuto o balde"],
                ] as const
              ).map(([id, l]) => (
                <Chip key={id} on={r.fimDeSemana === id} onClick={() => set("fimDeSemana", id)}>{l}</Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Nav onBack={onBack} onNext={onNext} />
    </>
  );
}

function FaseSabotadores({ r, set, onNext, onBack }: { r: Rascunho; set: SetFn; onNext: () => void; onBack: () => void }) {
  const toggle = (id: SabotadorId) =>
    set("sabotadores", r.sabotadores.includes(id) ? r.sabotadores.filter((s) => s !== id) : [...r.sabotadores, id]);
  const n = r.sabotadores.length;
  return (
    <>
      <Titulo codigo="FASE 04 / SABOTADORES" sub="Marque tudo o que acontece com você. Sem julgamento — é aqui que mora o resultado.">
        O que te tira<br />do plano?
      </Titulo>
      <div className="mt-10 grid gap-1.5 sm:grid-cols-2">
        {SABOTADORES.map((s) => (
          <Chip key={s.id} on={r.sabotadores.includes(s.id)} onClick={() => toggle(s.id)}>
            <span className="flex items-center justify-between gap-3">
              {s.label}
              <span className="text-xs opacity-60">{r.sabotadores.includes(s.id) ? "✕" : "+"}</span>
            </span>
          </Chip>
        ))}
      </div>
      <p className="mt-8 min-h-[3rem] max-w-xl text-sm text-ink/80" aria-live="polite">
        {n === 0
          ? "Nenhum marcado ainda."
          : `${n} ${n === 1 ? "sabotador identificado" : "sabotadores identificados"} — `}
        {n > 0 && <span className="text-leaf">todos têm solução com estratégia.</span>}
      </p>
      <Nav onBack={onBack} onNext={onNext} nextLabel={n === 0 ? "Nenhum, continuar" : "Continuar"} />
    </>
  );
}

function FaseDesbloqueio(props: {
  r: Rascunho;
  set: SetFn;
  lead: Lead;
  setLead: React.Dispatch<React.SetStateAction<Lead>>;
  erro: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  const { r, set, lead, setLead, erro, onSubmit, onBack } = props;
  return (
    <form onSubmit={onSubmit} noValidate>
      <Titulo codigo="FASE 05 / DESBLOQUEIO" sub="Seu diagnóstico está pronto. Me diga para quem eu entrego.">
        Seu perfil está<br />a um passo.
      </Titulo>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* prévia bloqueada */}
        <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-soft" aria-hidden>
          <p className="label">PERFIL / ???-0?</p>
          <div className="mt-4 select-none blur-[7px]">
            <p className="serif text-4xl leading-none">O Disciplinado Sem Estratégia</p>
            <p className="mt-4 text-ink/70">Você tem o que a maioria não tem: constância. O que falta é direção para o esforço.</p>
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-t border-line pt-3">
                  <p className="font-semibold">Insight personalizado número {i}</p>
                  <p className="text-sm text-ink/60">Texto explicando o que trava o seu resultado agora.</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-center bg-paper/30">
            <div className="text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf text-white shadow-soft"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg></span>
              <p className="label mt-3 !text-ink">{r.sabotadores.length + 4} variáveis analisadas</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <label className="block">
            <span className="label">Seu nome</span>
            <input
              value={lead.nome}
              onChange={(e) => setLead((l) => ({ ...l, nome: e.target.value }))}
              autoComplete="given-name"
              className="mt-2 w-full border-b border-line bg-transparent py-3 text-2xl outline-none focus:border-leaf"
              placeholder="Como posso te chamar?"
            />
          </label>
          <label className="block">
            <span className="label">WhatsApp com DDD</span>
            <input
              value={lead.whatsapp}
              onChange={(e) => setLead((l) => ({ ...l, whatsapp: formatWhats(e.target.value) }))}
              inputMode="tel"
              autoComplete="tel-national"
              className="mt-2 w-full border-b border-line bg-transparent py-3 text-2xl outline-none focus:border-leaf"
              placeholder="(62) 99999-9999"
            />
          </label>
          <div>
            <p className="label">Onde você está?</p>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {(
                [
                  ["pontalina", "Pontalina"],
                  ["goiania", "Goiânia e região"],
                  ["outra", "Outra cidade"],
                ] as const
              ).map(([id, l]) => (
                <Chip key={id} on={r.local === id} onClick={() => set("local", id)}>
                  <span className="text-sm">{l}</span>
                </Chip>
              ))}
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/75">
            <input
              type="checkbox"
              checked={lead.consentimento}
              onChange={(e) => setLead((l) => ({ ...l, consentimento: e.target.checked }))}
              className="mt-1 h-4 w-4 accent-[#2E9C5A]"
            />
            <span>
              Autorizo o uso das minhas respostas, incluindo dados de saúde, para gerar meu diagnóstico e para o João entrar em
              contato pelo WhatsApp. Veja a{" "}
              <Link href="/privacidade" className="underline underline-offset-2" target="_blank">política de privacidade</Link>.
            </span>
          </label>
          {erro && <p className="text-sm text-leaf" role="alert">{erro}</p>}
        </div>
      </div>

      <div className="gutter fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-paper/95 py-3 backdrop-blur">
        <button type="button" onClick={onBack} className="label px-2 py-3 hover:!text-ink">← Voltar</button>
        <button type="submit" className="btn-leaf">Desbloquear diagnóstico →</button>
      </div>
    </form>
  );
}

function Analisando() {
  const passos = ["Cruzando objetivo e rotina", "Mapeando sabotadores", "Comparando com casos parecidos", "Montando seu perfil"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => Math.min(x + 1, passos.length - 1)), 800);
    return () => clearInterval(t);
  }, [passos.length]);
  // a comida fica se transformando enquanto o diagnóstico "carrega"
  const getControls = useCallback((t: number): SceneControls => ({ form: Math.floor(t / 1.6) % 2 ? 1 : 0, pose: "run", speed: 7 }), []);

  return (
    <div className="grid min-h-[70svh] place-items-center text-center">
      <div className="w-full max-w-md">
        <div className="relative mx-auto aspect-square w-full max-w-[360px]">
          <FoodCanvas getControls={getControls} count={240} interactive={false} className="absolute inset-0 h-full w-full" />
        </div>
        <p className="label mt-6 !text-leaf">ANALISANDO</p>
        <ul className="mt-4 space-y-2 text-sm" aria-live="polite">
          {passos.map((p, j) => (
            <li key={p} className={`transition-opacity duration-500 ${j <= i ? "opacity-100" : "opacity-20"}`}>
              {j < i ? "✓" : j === i ? "›" : "·"} {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FaseResultado({ r, lead, d, planoPreferido, onReset }: { r: Respostas; lead: Lead; d: Diagnostico; planoPreferido: Plano["id"] | null; onReset: () => void }) {
  const plano = planos.find((p) => p.id === (planoPreferido ?? d.planoRecomendado)) ?? planos[1];
  const caso = useMemo(() => resultados.find((x) => x.objetivo === r.objetivo) ?? resultados[0], [r.objetivo]);
  const msg = resumoWhatsapp(r, lead, d, `${plano.nome} (${plano.formato})`);
  const [compartilhando, setCompartilhando] = useState(false);

  useEffect(() => {
    track("diagnostico_view", { perfil: d.perfil.codigo, fonte: d.fonte, score: d.score });
  }, [d]);

  async function compartilhar() {
    setCompartilhando(true);
    try {
      const blob = await gerarCardStories(d.perfil, lead.nome || "Eu", cssVar("--font-sans", "sans-serif"), cssVar("--font-serif", "serif"));
      if (!blob) return;
      const file = new File([blob], "meu-perfil-de-treino.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Meu perfil de treino" });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }
      track("share_card");
    } catch {
      /* usuário cancelou */
    } finally {
      setCompartilhando(false);
    }
  }

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="label !text-leaf">FASE 06 / DIAGNÓSTICO · {lead.nome ? lead.nome.split(" ")[0].toUpperCase() : "VOCÊ"}</p>
          <p className="label mt-6">{d.perfil.codigo}</p>
          <h1 className="serif mt-2 text-[clamp(2.5rem,6.4vw,5rem)] font-medium leading-[0.98] text-leaf-deep">{d.perfil.titulo}</h1>
          <p className="mt-6 max-w-xl text-lg text-ink/80 sm:text-xl">{d.perfil.descricao}</p>

          <ol className="mt-12 border-t border-line">
            {d.insights.map((ins, i) => (
              <li key={ins.titulo} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-6">
                <span className="text-sm text-leaf">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-lg font-semibold sm:text-xl">{ins.titulo}</p>
                  <p className="mt-2 text-ink/70">{ins.texto}</p>
                </div>
              </li>
            ))}
          </ol>

          <figure className="mt-10 border-l-2 border-leaf pl-6">
            <blockquote className="text-lg leading-relaxed text-ink/90 sm:text-xl">“{d.joaoFaria}”</blockquote>
            <figcaption className="label mt-4 flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-leaf text-[10px] font-bold text-white">JV</span>
              João Vitor · Nutricionista Esportivo
            </figcaption>
          </figure>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {vagas.ativo && <p className="rounded-2xl bg-sand px-4 py-3 text-sm font-medium text-ink">{vagas.texto}</p>}
          <div className="rounded-[28px] bg-leaf-deep p-6 text-white shadow-soft sm:p-8">
            <p className="label !text-white/60">PLANO INDICADO PARA VOCÊ</p>
            <p className="serif mt-2 text-3xl leading-none">{plano.nome}</p>
            <p className="mt-1 text-sm text-white/70">{plano.formato}</p>
            <ul className="mt-6 space-y-2">
              {plano.itens.map((i) => (
                <li key={i} className="flex gap-3 text-[15px]"><span className="text-leaf">+</span>{i}</li>
              ))}
            </ul>
            <p className="mt-6 font-semibold">{d.fechamento}</p>
            <a
              href={whatsappUrl(msg)}
              target="_blank"
              rel="noopener"
              onClick={() => track("whatsapp_click", { local: "diagnostico", plano: plano.id, score: d.score })}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-[15px] font-semibold text-leaf-deep transition-transform hover:scale-[1.01]"
            >
              Quero começar → WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-white/60">Seu diagnóstico vai junto na mensagem.</p>
          </div>

          {caso && (
            <div className="rounded-[24px] bg-white p-5 shadow-soft">
              <p className="label">CASO PARECIDO COM O SEU · {objetivosLabel[caso.objetivo].toUpperCase()}</p>
              <p className="mt-3 text-ink/85">“{caso.legenda}”</p>
              <p className="mt-3 text-sm text-leaf">{caso.destaque}</p>
              <Link href="/#resultados" className="label mt-4 inline-block underline underline-offset-4 hover:!text-ink">Ver depoimentos →</Link>
            </div>
          )}

          <button type="button" onClick={compartilhar} disabled={compartilhando} className="btn-soft w-full justify-center">
            {compartilhando ? "Gerando…" : "Compartilhar meu perfil nos stories"}
          </button>
          <div className="flex justify-between">
            <Link href="/#planos" className="label hover:!text-ink">Ver todos os planos</Link>
            <button type="button" onClick={onReset} className="label hover:!text-ink">Refazer</button>
          </div>
          <p className="pt-2 text-xs leading-relaxed text-mute">
            Este diagnóstico é uma orientação geral baseada nas suas respostas e não substitui a consulta com avaliação individual.
          </p>
        </aside>
      </div>
    </>
  );
}
