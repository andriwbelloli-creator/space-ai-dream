/**
 * checkout.functions.ts — server function pra criar Stripe Checkout Session.
 *
 * Fluxo:
 *   1. Cliente clica em "Assinar" num plano pago em /pricing.
 *   2. Front chama `createCheckoutSession({data: {planId, cycle}})`.
 *   3. Server: valida planId+cycle, resolve Price ID da env, busca/cria
 *      Stripe Customer pro user, cria Checkout Session.
 *   4. Server retorna `{ok: true, url}` → front faz `window.location.href = url`.
 *
 * Webhook (Sprint 4) trata o evento `checkout.session.completed` pra sincronizar
 * `user_credits` + `subscriptions` no Supabase.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { PLANS, type PlanId } from "@/lib/plans";
import { stripe } from "@/lib/stripe.server";

type CheckoutInput = {
  planId: PlanId;
  cycle: "monthly" | "yearly";
};

type CheckoutOutput =
  | { ok: true; url: string; sessionId: string }
  | { ok: false; error: string };

function resolveOrigin(): string {
  try {
    const origin = getRequest()?.headers?.get("origin");
    if (origin) return origin;
  } catch {
    // Fora de um request HTTP (ex.: dev tooling) — cai no fallback.
  }
  return process.env.PUBLIC_APP_URL || "https://idealspace.com.br";
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CheckoutInput): CheckoutInput => {
    if (!input?.planId || !["monthly", "yearly"].includes(input.cycle)) {
      throw new Error("Parâmetros inválidos: planId e cycle (monthly|yearly) obrigatórios.");
    }
    return input;
  })
  .handler(async ({ data, context }): Promise<CheckoutOutput> => {
    const { planId, cycle } = data;

    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) {
      console.error("[checkout] plano desconhecido", { planId });
      return { ok: false, error: "plan_not_found" };
    }
    if (planId === "free") {
      return { ok: false, error: "plan_not_purchasable" };
    }

    const priceIdEnvKey = cycle === "monthly" ? plan.priceIdEnvMonthly : plan.priceIdEnvYearly;
    if (!priceIdEnvKey) {
      console.error("[checkout] plan sem priceIdEnv configurado", { planId, cycle });
      return { ok: false, error: "price_env_not_mapped" };
    }
    const priceId = process.env[priceIdEnvKey];
    if (!priceId) {
      console.error(`[checkout] env var ${priceIdEnvKey} ausente`, { planId, cycle });
      return { ok: false, error: "price_env_missing" };
    }

    // Resolve o email do user via service role (auth.users não é exposto via
    // RLS public; precisa do admin client). Email é usado pra associar
    // Customer no Stripe.
    let userEmail: string | undefined;
    try {
      const { data: userRow, error } = await supabaseAdmin.auth.admin.getUserById(context.userId);
      if (error || !userRow?.user?.email) {
        console.error("[checkout] não foi possível buscar email do user", {
          userId: context.userId,
          error: error?.message,
        });
        return { ok: false, error: "user_email_not_found" };
      }
      userEmail = userRow.user.email;
    } catch (e) {
      console.error("[checkout] erro ao buscar user", e);
      return { ok: false, error: "user_lookup_failed" };
    }

    // Busca Customer existente: filtra por email + verifica metadata.user_id
    // pra evitar conflito com customers homônimos (ex.: user trocou de email
    // depois de criar conta).
    let customerId: string;
    try {
      const list = await stripe.customers.list({ email: userEmail, limit: 10 });
      const existing = list.data.find((c) => c.metadata?.user_id === context.userId);
      if (existing) {
        customerId = existing.id;
      } else {
        const created = await stripe.customers.create({
          email: userEmail,
          metadata: { user_id: context.userId },
        });
        customerId = created.id;
      }
    } catch (e) {
      console.error("[checkout] erro ao buscar/criar customer", {
        userId: context.userId,
        error: e instanceof Error ? e.message : "unknown",
      });
      return { ok: false, error: "customer_failed" };
    }

    const origin = resolveOrigin();
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
        allow_promotion_codes: true,
        payment_method_types: ["card"],
        metadata: {
          user_id: context.userId,
          plan_id: planId,
          cycle,
        },
        // Repassa metadata pra subscription resultante (webhook precisa).
        subscription_data: {
          metadata: {
            user_id: context.userId,
            plan_id: planId,
            cycle,
          },
        },
      });

      if (!session.url) {
        console.error("[checkout] session criada mas sem url", { sessionId: session.id });
        return { ok: false, error: "session_no_url" };
      }

      return { ok: true, url: session.url, sessionId: session.id };
    } catch (e) {
      console.error("[checkout] erro ao criar session", {
        userId: context.userId,
        planId,
        cycle,
        error: e instanceof Error ? e.message : "unknown",
      });
      return { ok: false, error: "checkout_failed" };
    }
  });
