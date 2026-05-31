/**
 * stripe-webhook.server.ts — handler do Stripe Webhook para o Ideal Space.
 *
 * SEGURANCA:
 *   - sufixo .server.ts: nunca vai pro bundle browser.
 *   - Raw body lido ANTES de qualquer parse: necessario para verificacao HMAC.
 *   - constructEventAsync usa SubtleCrypto (Web Crypto API): compativel com
 *     Cloudflare Workers (sem Node.js crypto).
 *   - STRIPE_WEBHOOK_SECRET lido de process.env: configurado em Cloudflare
 *     Secrets (prod) ou .env.local (dev).
 *
 * Eventos tratados (MVP):
 *   - checkout.session.completed (mode=subscription, payment_status=paid)
 *     Concessao inicial de creditos mensais.
 *   - invoice.paid (billing_reason=subscription_cycle)
 *     Renovacao mensal/anual. billing_reason=subscription_create e ignorado
 *     para evitar duplo credito com checkout.session.completed.
 *   - customer.subscription.deleted
 *     Registra o evento. Sem acao de credito no MVP (creditos do periodo
 *     pago permanecem ate o fim do ciclo).
 *
 * Idempotencia (autoridade = tabela stripe_webhook_events):
 *   1. claimForProcessing insere o event.id como 'processing' (claim atomico
 *      via PRIMARY KEY).
 *   2. grantCredits concede o credito (RPC topup_monthly_credits).
 *   3. sucesso  -> markEvent('ok')      (terminal).
 *      falha    -> markEvent('failed') + 500; o retry do Stripe re-adquire
 *      SOMENTE linhas 'failed' (UPDATE ... WHERE status='failed') e tenta de
 *      novo. 'ok'/'skipped'/'processing' nao sao re-adquiriveis (retry = no-op).
 *
 *   Por que credito nunca duplica: o grant so roda quando o claim retorna
 *   'claimed', e claim so retorna 'claimed' em (insert novo) ou (re-aquisicao
 *   de 'failed'). 'failed' so e gravado DEPOIS de a RPC lancar erro — e uma
 *   funcao plpgsql lança erro com rollback, entao 'failed' implica credito
 *   NAO aplicado. Logo nenhum caminho concede duas vezes o mesmo event.id.
 *
 *   Residual conhecido: se a RPC COMETER o credito mas a resposta se perder
 *   (rede), o SDK lança, marcamos 'failed', e o retry re-concede -> credito
 *   duplo. Fechar isso exige a RPC ser idempotente por _reference (= event.id).
 *   O corpo da RPC nao esta neste repo; ver nota de validacao manual.
 *
 * Pre-requisito de infra:
 *   - Migration 20260530060000_create_stripe_webhook_events.sql deve estar
 *     aplicada no banco remoto antes de o webhook ficar ativo.
 */

import Stripe from "stripe";
import { stripe, getStripeMode } from "./stripe.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { PLANS } from "./plans";

// ---- Helpers de Response ------------------------------------------------

function ok(msg: string): Response {
  return new Response(JSON.stringify({ ok: true, msg }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function fail(msg: string, status: 400 | 500): Response {
  // Nao expor detalhes internos no body — apenas nos logs do Worker.
  console.error(`[webhook] ${status} —`, msg);
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// ---- Idempotencia -------------------------------------------------------

// stripe_webhook_events e uma tabela nova (migration 20260530060000) ainda
// nao refletida nos tipos gerados. O cast as any fica restrito a estes
// helpers server-only ate a proxima regeneracao de types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const webhookEvents = () => (supabaseAdmin as any).from("stripe_webhook_events");

type ClaimResult = "claimed" | "duplicate";

/**
 * Reivindica um evento para processamento de credito de forma atomica.
 *
 * Insere a linha como 'processing'. Se ja existe (unique_violation 23505),
 * tenta re-adquirir SOMENTE se o estado for 'failed' — um UPDATE atomico
 * condicional `WHERE status='failed'` que devolve a linha so quando troca
 * 'failed' -> 'processing'. Estados terminais ('ok', 'skipped') e uma
 * tentativa concorrente ainda em 'processing' nao sao re-adquiriveis.
 *
 * Retorna 'claimed'   = pode conceder credito agora.
 * Retorna 'duplicate' = ja processado ou em processamento; nao conceder.
 * Lanca erro          = falha inesperada de banco (vira 500 -> retry Stripe).
 */
async function claimForProcessing(
  eventId: string,
  eventType: string,
  userId: string | null,
): Promise<ClaimResult> {
  const { error: insertError } = await webhookEvents().insert({
    stripe_event_id: eventId,
    event_type: eventType,
    user_id: userId,
    status: "processing",
  });

  if (!insertError) return "claimed";

  // 23505 = unique_violation. Qualquer outro erro e inesperado.
  if ((insertError as { code?: string }).code !== "23505") {
    throw new Error(`[webhook] claim insert falhou: ${insertError.message}`);
  }

  // Linha ja existe. Re-aquisicao condicional: so 'failed' volta para
  // 'processing'. O `.select()` retorna as linhas afetadas — vazio
  // significa que o estado nao era 'failed' (terminal ou concorrente).
  const { data, error: updateError } = await webhookEvents()
    .update({ status: "processing", user_id: userId, error_message: null })
    .eq("stripe_event_id", eventId)
    .eq("status", "failed")
    .select("stripe_event_id");

  if (updateError) {
    throw new Error(`[webhook] claim re-aquisicao falhou: ${updateError.message}`);
  }

  return data && data.length > 0 ? "claimed" : "duplicate";
}

/**
 * Registra um evento ja em estado terminal num unico insert (sem concessao
 * de credito). Usado para 'skipped'. Idempotente: 23505 = ja registrado.
 */
async function recordTerminal(
  eventId: string,
  eventType: string,
  userId: string | null,
  status: "skipped",
  errorMessage?: string,
): Promise<void> {
  const { error } = await webhookEvents().insert({
    stripe_event_id: eventId,
    event_type: eventType,
    user_id: userId,
    status,
    error_message: errorMessage ?? null,
  });

  // 23505 = ja registrado antes; idempotente, ignora.
  if (error && (error as { code?: string }).code !== "23505") {
    throw new Error(`[webhook] recordTerminal insert falhou: ${error.message}`);
  }
}

/**
 * Atualiza o estado de uma linha ja reivindicada (de 'processing' para
 * 'ok' ou 'failed'). Best-effort: falha aqui apenas loga, porque o estado
 * de credito ja foi decidido pela RPC.
 */
async function markEvent(
  eventId: string,
  status: "ok" | "failed",
  errorMessage?: string,
): Promise<void> {
  const { error } = await webhookEvents()
    .update({ status, error_message: errorMessage ?? null })
    .eq("stripe_event_id", eventId);

  if (error) {
    console.error("[webhook] markEvent falhou (estado de credito ja decidido)", {
      eventId,
      status,
      error: error.message,
    });
  }
}

// ---- Concessao de creditos ----------------------------------------------

async function grantCredits(
  userId: string,
  planId: string,
  eventId: string,
): Promise<void> {
  const amount = PLANS.find((p) => p.id === planId)?.monthlyCredits;
  if (!amount) {
    console.warn("[webhook] plano sem mapeamento de creditos — nenhum credito concedido", {
      planId,
      eventId,
    });
    return;
  }

  const { error } = await supabaseAdmin.rpc("topup_monthly_credits", {
    _user_id: userId,
    _plan: planId,
    _amount: amount,
    _reference: eventId,
  });

  if (error) {
    throw new Error(`[webhook] topup_monthly_credits falhou: ${error.message}`);
  }

  console.log("[webhook] creditos concedidos", { userId, planId, amount, eventId });
}

// ---- Sync de subscription -----------------------------------------------

/**
 * Persiste (UPSERT) o estado da subscription nas tabelas stripe_subscriptions
 * e subscriptions. Chamado apos processGrant em checkout.session.completed.
 *
 * Best-effort: falhas sao apenas logadas (credito ja concedido). UPSERT e
 * idempotente — re-execucao em retry do Stripe e segura.
 *
 * Aborta sem inventar dado se a subscription vier sem items (decisao de design).
 */
async function syncSubscription(
  userId: string,
  planId: string,
  subscriptionId: string,
  customerId: string,
): Promise<void> {
  let sub: Stripe.Subscription;
  try {
    sub = await stripe.subscriptions.retrieve(subscriptionId);
  } catch (err) {
    console.error("[webhook] retrieve subscription falhou em syncSubscription", {
      subscriptionId,
      err: err instanceof Error ? err.message : String(err),
    });
    return;
  }

  const item = sub.items.data[0];
  if (!item) {
    console.warn("[webhook] no items in subscription, skipping sync", { subscriptionId });
    return;
  }

  const priceId = item.price.id;
  const rawProduct = item.price.product;
  const productId =
    typeof rawProduct === "string" ? rawProduct : (rawProduct as { id: string }).id;

  const periodStart = new Date(sub.current_period_start * 1000).toISOString();
  const periodEnd = new Date(sub.current_period_end * 1000).toISOString();

  const { error: subError } = await (supabaseAdmin as any)
    .from("stripe_subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        price_id: priceId,
        product_id: productId,
        status: sub.status,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: sub.cancel_at_period_end,
      },
      { onConflict: "stripe_subscription_id" },
    );

  if (subError) {
    console.error("[webhook] upsert stripe_subscriptions falhou", {
      subscriptionId,
      error: subError.message,
    });
  }

  const { error: accError } = await (supabaseAdmin as any)
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        provider: "stripe",
        plan: planId,
        status: "active",
        current_period_start: periodStart,
        current_period_end: periodEnd,
      },
      { onConflict: "user_id,provider" },
    );

  if (accError) {
    console.error("[webhook] upsert subscriptions falhou", {
      userId,
      error: accError.message,
    });
  }

  console.log("[webhook] sync de subscription concluido", { subscriptionId, userId, planId });
}

// ---- Handlers por tipo de evento ----------------------------------------

async function handleCheckoutSessionCompleted(event: Stripe.Event): Promise<Response> {
  const session = event.data.object as Stripe.Checkout.Session;

  // Apenas assinaturas com pagamento confirmado.
  if (session.mode !== "subscription" || session.payment_status !== "paid") {
    await recordTerminal(event.id, event.type, null, "skipped");
    return ok("skipped: not a paid subscription session");
  }

  const userId = session.metadata?.user_id ?? null;
  const planId = session.metadata?.plan_id ?? null;

  if (!userId || !planId) {
    // Metadata ausente: sessao criada fora do checkout.functions.ts.
    console.error("[webhook] metadata ausente em checkout.session.completed", {
      sessionId: session.id,
    });
    await recordTerminal(
      event.id,
      event.type,
      null,
      "skipped",
      "missing user_id or plan_id in metadata",
    );
    // Retorna 200 para o Stripe nao fazer retry infinito deste evento invalido.
    return ok("skipped: missing metadata");
  }

  const subRef = session.subscription;
  const subId =
    typeof subRef === "string" ? subRef : (subRef as Stripe.Subscription | null)?.id ?? null;

  const custRef = session.customer;
  const customerId =
    typeof custRef === "string"
      ? custRef
      : custRef != null
        ? (custRef as { id: string }).id
        : null;

  const resp = await processGrant(
    event.id,
    event.type,
    userId,
    planId,
    "checkout.session.completed",
  );

  if (subId && customerId) {
    await syncSubscription(userId, planId, subId, customerId);
  } else {
    console.warn("[webhook] session sem subscription ou customer id, sync ignorado", {
      sessionId: session.id,
      subId,
      customerId,
    });
  }

  return resp;
}

async function handleInvoicePaid(event: Stripe.Event): Promise<Response> {
  const invoice = event.data.object as Stripe.Invoice;

  // Apenas renovacoes periodicas. subscription_create e ignorado aqui para
  // evitar duplo credito com checkout.session.completed (ambos disparam
  // no primeiro pagamento, com event.id distintos).
  if (invoice.billing_reason !== "subscription_cycle") {
    await recordTerminal(event.id, event.type, null, "skipped");
    return ok(`skipped: billing_reason=${String(invoice.billing_reason)}`);
  }

  // invoice.subscription e string (ID) na webhook payload nao expandida.
  const subRef = invoice.subscription;
  const subId =
    typeof subRef === "string"
      ? subRef
      : (subRef as Stripe.Subscription | null)?.id ?? null;

  if (!subId) {
    await recordTerminal(event.id, event.type, null, "skipped");
    return ok("skipped: no subscription id in invoice");
  }

  // Busca subscription para obter metadata.user_id e metadata.plan_id
  // propagados pelo checkout.functions.ts via subscription_data.metadata.
  const subscription = await stripe.subscriptions.retrieve(subId);
  const userId = subscription.metadata?.user_id ?? null;
  const planId = subscription.metadata?.plan_id ?? null;

  if (!userId || !planId) {
    console.error("[webhook] metadata ausente na subscription", { subId, eventId: event.id });
    await recordTerminal(
      event.id,
      event.type,
      null,
      "skipped",
      "missing user_id or plan_id on subscription metadata",
    );
    return ok("skipped: missing metadata on subscription");
  }

  return processGrant(event.id, event.type, userId, planId, "invoice.paid renewal");
}

async function handleSubscriptionDeleted(event: Stripe.Event): Promise<Response> {
  const subscription = event.data.object as Stripe.Subscription;
  const subscriptionId = subscription.id;
  const userId = subscription.metadata?.user_id ?? null;

  // Idempotencia: registra o evento sem concessao de credito.
  await recordTerminal(event.id, event.type, userId, "skipped");

  // Marca cancelamento nas tabelas de subscription.
  // Creditos do periodo pago permanecem intactos (decisao de produto).
  const { error: subError } = await (supabaseAdmin as any)
    .from("stripe_subscriptions")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", subscriptionId);

  if (subError) {
    console.error("[webhook] update stripe_subscriptions canceled falhou", {
      subscriptionId,
      error: subError.message,
    });
  }

  if (userId) {
    const { error: accError } = await (supabaseAdmin as any)
      .from("subscriptions")
      .update({ status: "canceled", plan: "free" })
      .eq("user_id", userId)
      .eq("provider", "stripe");

    if (accError) {
      console.error("[webhook] update subscriptions canceled falhou", {
        userId,
        error: accError.message,
      });
    }
  }

  console.log("[webhook] subscription canceled: creditos preservados", {
    subscriptionId,
    userId,
  });
  return ok("customer.subscription.deleted: marked canceled, credits preserved");
}

/**
 * Orquestra a concessao de credito com idempotencia segura:
 *   claim (atomico) -> grant -> mark('ok') | mark('failed')+500.
 *
 * 'duplicate' do claim significa ja processado ou em processamento — no-op
 * com 200, sem reconceder. Se grantCredits lança, marca 'failed' e devolve
 * 500: o retry do Stripe re-adquire a linha 'failed' e tenta de novo, sem
 * nunca conceder duas vezes (ver doc do topo do arquivo).
 */
async function processGrant(
  eventId: string,
  eventType: string,
  userId: string,
  planId: string,
  label: string,
): Promise<Response> {
  const claim = await claimForProcessing(eventId, eventType, userId);
  if (claim === "duplicate") return ok("already processed");

  try {
    await grantCredits(userId, planId, eventId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    await markEvent(eventId, "failed", msg);
    // 500: Stripe re-entrega; a linha 'failed' sera re-adquirida no retry.
    return fail(`${label}: grant failed, will retry`, 500);
  }

  await markEvent(eventId, "ok");
  return ok(`${label}: credits granted`);
}

// ---- Entry point --------------------------------------------------------

/**
 * Ponto de entrada do webhook. Chamado por src/server.ts quando o
 * request bate em POST /api/stripe-webhook.
 *
 * Retorna sempre uma Response com status:
 *   200 — evento processado, ignorado ou ja processado antes.
 *   400 — payload invalido ou assinatura invalida.
 *   500 — erro interno inesperado.
 */
export async function handleStripeWebhook(request: Request): Promise<Response> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return fail("STRIPE_WEBHOOK_SECRET ausente no ambiente", 500);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return fail("Stripe-Signature header ausente", 400);
  }

  // Raw body: necessario para verificacao HMAC do Stripe.
  // Deve ser lido ANTES de qualquer outro processamento.
  const rawBody = await request.text();
  if (!rawBody) {
    return fail("body vazio", 400);
  }

  let event: Stripe.Event;
  try {
    // constructEventAsync usa SubtleCrypto (Web Crypto API) — compativel
    // com Cloudflare Workers. O metodo sincrono constructEvent usa
    // Node.js crypto e nao funciona no runtime do Worker.
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return fail(`Webhook signature verification failed: ${msg}`, 400);
  }

  // Rejeita eventos do ambiente errado (test vs live).
  const mode = getStripeMode();
  if ((mode === "test" && event.livemode) || (mode === "live" && !event.livemode)) {
    console.error("[webhook] livemode mismatch", { mode, livemode: event.livemode });
    return fail("livemode mismatch", 400);
  }

  console.log("[webhook] recebido:", event.type, event.id);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        return await handleCheckoutSessionCompleted(event);

      case "invoice.paid":
        return await handleInvoicePaid(event);

      case "customer.subscription.deleted":
        return await handleSubscriptionDeleted(event);

      default:
        // Evento nao tratado: retorna 200 para o Stripe nao fazer retry.
        console.log("[webhook] evento nao tratado:", event.type);
        return ok(`event ${event.type} not handled`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[webhook] erro interno", { eventId: event.id, eventType: event.type, msg });
    // 500: o Stripe vai fazer retry. Seguro para falhas transientes de banco.
    return fail(`Internal error processing ${event.type}`, 500);
  }
}
