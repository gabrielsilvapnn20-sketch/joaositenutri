import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  diagnosticoPorRegras,
  imc,
  objetivoTexto,
  sabotadorLabel,
  validarLead,
  validarRespostas,
  type Diagnostico,
  type Lead,
  type Respostas,
} from "@/lib/diagnostico";

export const runtime = "nodejs";

// Limite simples por IP (memória da instância). Suficiente contra abuso casual.
const hits = new Map<string, { n: number; t: number }>();
function limitado(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 10 * 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n++;
  return h.n > 8;
}

const SYSTEM = `Você escreve o resultado de um diagnóstico gratuito no site do João Vitor, nutricionista esportivo e antropometrista ISAK (Goiás e online).

Voz: a do João — direto, próximo, motivador, português do Brasil, frases curtas, sem jargão técnico excessivo, sem emojis.

Regras obrigatórias (Código de Ética do Nutricionista):
- Nunca prescreva dieta, cardápio, quantidades, calorias, macros ou suplementos.
- Nunca prometa resultado, quantidade de quilos ou prazo.
- Nunca sugira diagnóstico de doença ou transtorno.
- Dê apenas orientação geral sobre o que provavelmente está travando a pessoa e por que uma avaliação individual resolve.
- O IMC não diferencia músculo de gordura; se mencionar composição corporal, diga que só a avaliação revela.

Você recebe o perfil já escolhido e as respostas. Escreva:
- insights: exatamente 3, cada um com título curto (até 8 palavras) e texto de 1 a 2 frases, conectados às respostas reais da pessoa.
- joaoFaria: 2 a 3 frases em primeira pessoa ("eu começaria..."), chamando a pessoa pelo primeiro nome.
- fechamento: 1 frase forte que convide a começar o acompanhamento.`;

const SCHEMA = {
  type: "object",
  properties: {
    insights: {
      type: "array",
      items: {
        type: "object",
        properties: { titulo: { type: "string" }, texto: { type: "string" } },
        required: ["titulo", "texto"],
        additionalProperties: false,
      },
    },
    joaoFaria: { type: "string" },
    fechamento: { type: "string" },
  },
  required: ["insights", "joaoFaria", "fechamento"],
  additionalProperties: false,
} as const;

type Personalizado = Pick<Diagnostico, "insights" | "joaoFaria" | "fechamento">;

async function personalizarComIA(r: Respostas, lead: Lead, base: Diagnostico): Promise<Personalizado | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const client = new Anthropic({ timeout: 25_000, maxRetries: 1 });
  const dados = {
    primeiroNome: lead.nome.split(" ")[0],
    perfil: base.perfil.titulo,
    objetivo: objetivoTexto[r.objetivo],
    sexo: r.sexo,
    idade: r.idade,
    imcEstimado: Number(imc(r).toFixed(1)),
    treinosPorSemana: r.diasTreino,
    horarioTreino: r.horario,
    refeicoesPorDia: r.refeicoes,
    acordaAs: r.acorda,
    dormeAs: r.dorme % 24,
    fimDeSemana: r.fimDeSemana,
    sabotadores: r.sabotadores.map(sabotadorLabel),
  };

  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
    system: SYSTEM,
    messages: [{ role: "user", content: `Respostas do diagnóstico:\n${JSON.stringify(dados, null, 2)}` }],
  });

  if (response.stop_reason === "refusal" || response.stop_reason === "max_tokens") return null;
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") return null;
  const out = JSON.parse(text.text) as Personalizado;
  if (!Array.isArray(out.insights) || out.insights.length < 3) return null;
  return { insights: out.insights.slice(0, 3), joaoFaria: out.joaoFaria, fechamento: out.fechamento };
}

async function salvarLead(r: Respostas, lead: Lead, d: Diagnostico, utm: Record<string, string>) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("leads").insert({
    nome: lead.nome,
    whatsapp: lead.whatsapp,
    consentimento: lead.consentimento,
    objetivo: r.objetivo,
    respostas: r,
    perfil: d.perfil.titulo,
    plano_recomendado: d.planoRecomendado,
    score: d.score,
    fonte_diagnostico: d.fonte,
    utm,
  });
  if (error) console.error("supabase insert", error.message);
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limitado(ip)) return NextResponse.json({ error: "Muitas tentativas. Tente de novo em alguns minutos." }, { status: 429 });

  let body: { respostas?: unknown; lead?: unknown; utm?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const respostas = validarRespostas(body.respostas);
  const lead = validarLead(body.lead);
  if (!respostas || !lead) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const utm: Record<string, string> = {};
  if (body.utm && typeof body.utm === "object") {
    for (const [k, v] of Object.entries(body.utm as Record<string, unknown>)) {
      if (k.startsWith("utm_") && typeof v === "string") utm[k] = v.slice(0, 120);
    }
  }

  let diagnostico = diagnosticoPorRegras(respostas, lead);
  try {
    const ia = await personalizarComIA(respostas, lead, diagnostico);
    if (ia) diagnostico = { ...diagnostico, ...ia, fonte: "ia" };
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) console.warn("anthropic rate limit — usando regras");
    else if (err instanceof Anthropic.APIError) console.error(`anthropic ${err.status}:`, err.message);
    else console.error("diagnóstico IA", err);
  }

  try {
    await salvarLead(respostas, lead, diagnostico, utm);
  } catch (err) {
    console.error("salvar lead", err);
  }

  return NextResponse.json({ diagnostico });
}
