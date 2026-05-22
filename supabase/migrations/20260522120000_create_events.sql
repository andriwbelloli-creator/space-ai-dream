-- Lote 2 — instrumentação do funil mínimo do MVP (Ideal Space).
-- Tabela append-only de eventos. Escrita apenas via service_role (server
-- functions). Leitura via SQL editor / admin. RLS ligada sem policies =
-- fechada para anon/authenticated. Sem PII — apenas metadados de domínio.

create table if not exists public.events (
  id         uuid primary key default gen_random_uuid(),
  event      text not null,
  user_id    uuid,
  props      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_event_created_idx
  on public.events (event, created_at desc);

alter table public.events enable row level security;

-- service_role ignora RLS; o grant concede o privilégio de tabela.
grant select, insert on public.events to service_role;
