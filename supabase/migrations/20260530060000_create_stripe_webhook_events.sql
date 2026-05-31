-- ============================================================
-- Ideal Space — tabela de idempotência para eventos Stripe
--
-- Por quê: o Stripe pode entregar o mesmo evento mais de uma vez
-- (retries automáticos). Esta tabela é a autoridade de idempotência:
-- garante que um evento só conceda crédito uma vez por entrega
-- bem-sucedida, sem perder crédito em falha transiente.
--
-- Ciclo de vida do status (ver src/lib/stripe-webhook.server.ts):
--   1. handler insere o evento como 'processing' (claim atômico via PK);
--   2. concede o crédito (RPC topup_monthly_credits);
--   3. em sucesso  -> atualiza para 'ok'    (terminal);
--      em falha    -> atualiza para 'failed' e retorna 500;
--   4. o retry do Stripe re-adquire SÓ linhas 'failed' (UPDATE atômico
--      WHERE status = 'failed') e tenta a concessão de novo.
--
-- stripe_event_id é PRIMARY KEY: o segundo insert do mesmo ID falha
-- com unique_violation (code 23505). 'ok'/'skipped' são terminais
-- (retry vira no-op); 'failed' é o único estado re-adquirível.
--
-- Seguro: idempotente (IF NOT EXISTS).
-- Não-destrutivo: não dropa tabelas, não altera dados.
-- ============================================================

create table if not exists public.stripe_webhook_events (
  stripe_event_id  text        primary key,
  event_type       text        not null,
  processed_at     timestamptz not null default now(),
  user_id          uuid,                    -- null quando indisponível
  status           text        not null default 'processing'
                   check (status in ('processing', 'ok', 'skipped', 'failed')),
  -- 'processing' = evento reivindicado, concessão de crédito em andamento
  -- 'ok'         = crédito concedido com sucesso (estado terminal)
  -- 'skipped'    = evento ignorado de propósito (ex: billing_reason != cycle)
  -- 'failed'     = concessão falhou; retry do Stripe re-adquire e reprocessa
  error_message    text
);

comment on table public.stripe_webhook_events is
  'Idempotência de eventos Stripe Webhook. PK stripe_event_id + status processing/ok/skipped/failed. Crédito só vira ok após concessão concluída; failed é re-adquirível por retry.';

-- RLS ativa sem policies = tabela fechada para anon/authenticated.
-- O webhook handler usa supabaseAdmin (service_role bypassa RLS automaticamente).
alter table public.stripe_webhook_events enable row level security;

-- service_role precisa de insert + select (handler verifica + insere).
-- update: para atualizar status em caso de retry parcial futuro.
grant select, insert, update on public.stripe_webhook_events to service_role;

-- ============================================================
-- UNIQUE constraints para UPSERT em stripe_subscriptions e subscriptions.
-- Necessários para que o handler use onConflict sem ambiguidade.
--
-- Blocos DO $$ com EXCEPTION: re-rodáveis sem erro caso a constraint
-- já exista (idempotentes). Rodar manualmente no Supabase SQL Editor
-- ANTES de ativar o webhook endpoint em produção.
-- ============================================================

DO $$
BEGIN
  ALTER TABLE public.stripe_subscriptions
    ADD CONSTRAINT stripe_subscriptions_stripe_subscription_id_unique
    UNIQUE (stripe_subscription_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER TABLE public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_provider_unique
    UNIQUE (user_id, provider);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;
