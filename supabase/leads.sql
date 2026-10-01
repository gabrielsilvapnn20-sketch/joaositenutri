-- Tabela de leads do diagnóstico. Rode no SQL Editor do Supabase.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  whatsapp text not null,
  consentimento boolean not null,
  objetivo text not null,
  respostas jsonb not null,
  perfil text,
  plano_recomendado text,
  score text check (score in ('quente', 'morno', 'frio')),
  fonte_diagnostico text,
  utm jsonb default '{}'::jsonb
);

-- Dados de saúde são sensíveis (LGPD): ninguém lê pela chave pública.
-- O site grava com a service role, que ignora RLS.
alter table public.leads enable row level security;
