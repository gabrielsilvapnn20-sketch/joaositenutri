# João Vitor — Nutricionista Esportivo

Site-funil para converter consultas presenciais (Pontalina/Goiânia) e, principalmente, **consultoria online**.

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha o que tiver (tudo é opcional)
npm run dev                  # http://localhost:3000
```

Deploy recomendado: **Vercel** (importe o repositório e copie as variáveis do `.env.example`).

## O que tem no site

Landing page leve, nas cores do João (branco e verde). O quiz não é o caminho principal: ele **abre em nova aba** para quem quiser se aprofundar.

| Parte | Onde | O que faz |
|---|---|---|
| Hero "corpo feito de comida" | `Hero.tsx`, `FoodCanvas.tsx`, `src/lib/foodFigure.ts`, `src/lib/foods.ts` | Uma nuvem de fast food (hambúrguer, batata, refri, donut, pizza) se transforma em comida de verdade e forma uma pessoa correndo. Mensagens do João aparecem num balão preso ao corredor. Passar o dedo ou o mouse espalha a comida. Tudo desenhado por código, sem imagens. |
| Faixa | `Faixa.tsx` | Letreiro com os diferenciais. |
| "Você se identifica?" | `Identifica.tsx` | A pessoa toca nas situações que vive; aparece a mensagem de acolhimento e o convite para o teste. |
| Como funciona (jornada) | `Acompanhamento.tsx` | O corredor de comida passa, com o scroll, por 5 estações do acompanhamento (avaliação, plano, conversa no WhatsApp, motivação, resultado), cada uma com sua mini-animação. Ao longo do caminho o corpo afina e o ritmo aumenta. |
| O que muda | `Beneficios.tsx` | Benefícios em cards suaves. |
| Resultados | `Resultados.tsx`, `ReelPhone.tsx`, `Mosaic.tsx` | Celular 3D com os reels de depoimento, filtro por objetivo e antes → depois em mosaico. |
| Avaliação ISAK | `Medir.tsx` | "A balança não conta a história toda": duas pessoas com o mesmo peso e composições diferentes. |
| Convite ao teste | `QuizTeaser.tsx` | Abre o quiz em nova aba. |
| Planos, Sobre, FAQ, CTA final | `Planos.tsx`, `Sobre.tsx`, `Faq.tsx`, `CtaFinal.tsx` | Trimestral em destaque, CTAs para o WhatsApp. |
| Quiz gamificado | `/diagnostico` → `src/components/jornada/` | 6 fases com XP: objetivo → corpo (a pessoa de comida fica mais cheia ou mais magra conforme peso e altura) → rotina (mapa do dia) → sabotadores → desbloqueio (lead) → diagnóstico. |
| Diagnóstico com IA | `src/app/api/diagnostico/route.ts` | Claude personaliza os insights na voz do João, com regras de ética rígidas. Sem `ANTHROPIC_API_KEY`, usa o diagnóstico por regras (`src/lib/diagnostico.ts`). |
| Leads | Supabase (`supabase/leads.sql`) | Salva respostas, perfil, score e UTMs. Sem Supabase, o lead segue só pelo WhatsApp. |
| Card para stories | `src/lib/shareCard.ts` | PNG 1080×1920 com o perfil da pessoa marcando @nutrijoaovitorr. |
| Rastreamento | `src/lib/track.ts` | Meta Pixel + GA4 (`quiz_open`, `journey_step_N`, `lead_submitted`, `whatsapp_click`, `hero_slider`…). |

## Textos e configurações

Todo texto editável está em `content/`:
- `content/site.ts` — hero, método, planos e **preços**, sobre, FAQ, CRN, WhatsApp, flag de vagas.
- `content/resultados.ts` — reels de depoimento.

## O que falta o João entregar

- [ ] **Reels de depoimento** (arquivos .mp4 originais) → `public/reels/` e cadastrar em `content/resultados.ts`. Autorização por escrito de cada paciente.
- [ ] **Fotos antes/depois** do comparativo (com autorização) → substituir `public/placeholder/antes.svg`/`depois.svg`.
- [ ] **Ensaio fotográfico** do João (retrato vertical) → seção "Quem está por trás" (`Sobre.tsx`).
- [ ] **Número do CRN** e **valores dos planos** → `content/site.ts`.
- [ ] Revisar textos com a voz dele (principalmente `sobre` e `faq`).
- [ ] Confirmar com o CRN-1 o uso de antes/depois e depoimentos (Código de Ética, Resolução CFN 599/2018).
- [ ] Revisar a Política de Privacidade (`src/app/privacidade/page.tsx`).

## Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `ANTHROPIC_API_KEY` | IA do diagnóstico (opcional) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Salvar leads (opcional). Rode `supabase/leads.sql` antes. |
| `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_ID` | Rastreamento (opcional) |

## Direção de arte

Leve e acolhedora, para não assustar quem está começando: fundo off-white `#F8F7F2`, verde `#2E9C5A` (escuro `#114E2F`, menta `#E2F1E5`), um toque de amarelo `#F4C152`. Títulos em Fraunces (serifada suave, com itálico nos destaques) e texto em DM Sans. Cantos arredondados, formas orgânicas e folhas. Tokens em `tailwind.config.ts` e `src/app/globals.css`.

> Ajuste os tons de verde para os exatos da marca do João em `tailwind.config.ts`.
