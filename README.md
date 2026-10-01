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

| Parte | Onde | O que faz |
|---|---|---|
| Hero "Corpo Dissecado" | `src/components/Hero.tsx` + `src/lib/body.ts` | Corpo em linhas de varredura que gira e se abre em camadas no scroll, com rótulos de antropometria ISAK. Canvas 2D procedural: sem assets, leve no navegador do Instagram. |
| Dor | `Dor.tsx` | Palavras acendem conforme a rolagem. |
| Método | `Metodo.tsx` | 4 fichas que entram em perspectiva e se empilham. |
| ISAK | `Isak.tsx` | Números animados + barra de composição corporal + corpo com pontos de medida. |
| Resultados | `Resultados.tsx`, `ReelPhone.tsx`, `Mosaic.tsx` | Celular 3D com os reels de depoimento (interface própria, estilo Reels), filtro por objetivo e transição antes → depois em mosaico de pixels. |
| Planos, Sobre, FAQ, CTA | `Planos.tsx`, `Sobre.tsx`, `Faq.tsx`, `CtaFinal.tsx` | Trimestral em destaque, preços via config. |
| Jornada gamificada | `/diagnostico` → `src/components/jornada/` | 6 fases com XP e badges: objetivo → corpo (modelo reage aos sliders) → rotina (mapa do dia) → sabotadores → desbloqueio (lead) → diagnóstico. |
| Diagnóstico com IA | `src/app/api/diagnostico/route.ts` | Claude personaliza os insights na voz do João, com regras de ética rígidas. Sem `ANTHROPIC_API_KEY`, usa o diagnóstico por regras (`src/lib/diagnostico.ts`). |
| Leads | Supabase (`supabase/leads.sql`) | Salva respostas, perfil, score (quente/morno/frio) e UTMs. Sem Supabase, o lead segue só pelo WhatsApp. |
| WhatsApp | botão final da jornada | Mensagem pronta com nome, objetivo, perfil, rotina e sabotadores — o João já começa a conversa sabendo tudo. |
| Card para stories | `src/lib/shareCard.ts` | Gera PNG 1080×1920 com o perfil da pessoa marcando @nutrijoaovitorr. |
| Rastreamento | `src/lib/track.ts` | Meta Pixel + GA4, um evento por fase (`journey_step_N`, `lead_submitted`, `whatsapp_click`, `share_card`…). |

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

"Laboratório editorial": Archivo expandida (display) + JetBrains Mono (dados), grafite `#0D0E0C`, osso `#ECE9E1`, um único destaque laranja-sinal `#FF5A1F`, grade técnica, granulação, rótulos de ficha técnica. Tokens em `tailwind.config.ts` e `src/app/globals.css`.
