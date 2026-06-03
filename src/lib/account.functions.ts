// @ts-nocheck — dívida técnica: types.ts do Supabase está vazio (DB sem schema gerado); silenciado para destravar build sem tocar em banco/migrations (ver CLAUDE.md §6).
// Server functions da área "Minha conta". Read-only — combina user_credits
// + stripe_subscriptions pra montar o resumo da assinatura do usuário logado.
// Sem PII, sem mutação. Stripe Customer Portal NÃO está implementado neste
// projeto (sem SDK, sem keys) — a UI cuida do estado seguro.

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AccountSubscription = {
  status: string;
  priceId: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export type AccountSummary = {
  plan: "free" | "starter" | "premium" | "pro" | "admin";
  unlimited: boolean;
  balance: number;
  renewsAt: string | null;
  subscription: AccountSubscription | null;
  /**
   * Indica se o gerenciamento de assinatura via Stripe Customer Portal
   * está configurado neste deploy. Hoje sempre `false` — não há SDK Stripe
   * nem keys. A UI mostra estado seguro quando false.
   */
  portalAvailable: boolean;
};

/**
 * Retorna o resumo da conta do usuário logado: plano, créditos e dados
 * da assinatura Stripe (quando existir). Não expõe `stripe_customer_id`
 * nem `stripe_subscription_id` pro client.
 */
export const getAccountSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AccountSummary> => {
    const { userId } = context;

    // 1) Admin bypass — mesma lógica do getUserCredits / pipeline de geração.
    let isAdminUser = false;
    try {
      const { data: roleRow } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      isAdminUser = !!roleRow;
    } catch {
      // mantém isAdminUser = false; usuário ainda é tratado como normal
    }

    // 2) user_credits — saldo e plano vigente do app.
    let balance = 0;
    let plan: AccountSummary["plan"] = "free";
    let renewsAt: string | null = null;
    try {
      const { data: row } = await supabaseAdmin
        .from("user_credits")
        .select("balance, plan, renews_at")
        .eq("user_id", userId)
        .maybeSingle();
      if (row) {
        balance = typeof row.balance === "number" ? row.balance : 0;
        if (
          row.plan === "free" ||
          row.plan === "starter" ||
          row.plan === "premium" ||
          row.plan === "pro"
        ) {
          plan = row.plan;
        }
        renewsAt = row.renews_at ?? null;
      }
    } catch {
      // mantém valores default (free / 0)
    }

    // Admin sobrepõe o plano lido — alinha com getUserCredits.
    if (isAdminUser) plan = "admin";

    // 3) stripe_subscriptions — mais recente do usuário, se existir.
    //    Apenas read; nada é criado ou atualizado.
    let subscription: AccountSubscription | null = null;
    try {
      const { data: sub } = await supabaseAdmin
        .from("stripe_subscriptions")
        .select("status, price_id, current_period_end, cancel_at_period_end")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sub) {
        subscription = {
          status: sub.status,
          priceId: sub.price_id,
          currentPeriodEnd: sub.current_period_end ?? null,
          cancelAtPeriodEnd: !!sub.cancel_at_period_end,
        };
      }
    } catch {
      // mantém subscription = null
    }

    return {
      plan,
      unlimited: isAdminUser,
      balance,
      renewsAt,
      subscription,
      // Hoje não há SDK Stripe nem keys configuradas. Manter false até alguém
      // implementar a integração — UI exibe estado seguro nesse caso.
      portalAvailable: false,
    };
  });