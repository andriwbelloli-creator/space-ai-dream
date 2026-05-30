-- Sprint 3: adiciona "starter" ao enum plan_tier pra suportar Stripe Checkout
-- do plano Starter. Hoje o enum só tem free/premium/pro mas src/lib/plans.ts
-- já lista "starter" — esta migration resolve a inconsistência.
--
-- COMO RODAR (Andriw, MANUALMENTE no Supabase SQL Editor):
--   1. Dashboard → SQL Editor → New query
--   2. Colar este bloco
--   3. Run
--   4. Verificar com a query de verificação no final
--
-- ALTER TYPE ... ADD VALUE é não-reversível mas seguro: não afeta linhas existentes.

ALTER TYPE plan_tier ADD VALUE IF NOT EXISTS 'starter';

-- Verificação (opcional, rodar separado depois do ALTER):
-- SELECT enum_range(NULL::plan_tier);
-- Esperado: {free,premium,pro,starter}
