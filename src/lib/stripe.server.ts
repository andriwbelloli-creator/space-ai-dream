/**
 * stripe.server.ts — cliente Stripe singleton, SERVER-ONLY.
 *
 * SEGURANÇA: sufixo `.server.ts` + uso apenas em server functions garantem
 * que `STRIPE_SECRET_KEY` nunca vai pro bundle browser. Vite/TanStack Start
 * trata `.server.ts` como server-only.
 *
 * Cloudflare Workers: usa `Stripe.createFetchHttpClient()` (HTTP client
 * baseado em `fetch` global) — o cliente padrão do Node não funciona no
 * runtime do Worker.
 *
 * Validação cruzada MODE ↔ KEY no startup: previne acidente de cobrar real
 * com chave de teste, ou vice-versa.
 */
import Stripe from "stripe";

const SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const MODE_RAW = (process.env.STRIPE_MODE ?? "test").toLowerCase();

if (!SECRET_KEY) {
  throw new Error(
    "[stripe] STRIPE_SECRET_KEY ausente no ambiente. Configure em Cloudflare Secrets (prod) ou .env.local (dev).",
  );
}

if (MODE_RAW !== "test" && MODE_RAW !== "live") {
  throw new Error(
    `[stripe] STRIPE_MODE inválido: "${MODE_RAW}". Valores aceitos: "test" | "live".`,
  );
}

const MODE: "test" | "live" = MODE_RAW;

// Validação cruzada: secret key tem prefixo (sk_test_ ou sk_live_) que precisa
// bater com o MODE declarado. Se não bater, é praticamente sempre um erro de
// configuração — e em prod pode significar cobrar/testar acidentalmente no
// projeto errado.
if (MODE === "live" && SECRET_KEY.startsWith("sk_test_")) {
  console.error("[stripe] MODE=live mas STRIPE_SECRET_KEY parece ser de test (sk_test_*)");
  throw new Error("[stripe] MODE/KEY mismatch: live mode com test key.");
}
if (MODE === "test" && SECRET_KEY.startsWith("sk_live_")) {
  console.error("[stripe] MODE=test mas STRIPE_SECRET_KEY parece ser live (sk_live_*)");
  throw new Error("[stripe] MODE/KEY mismatch: test mode com live key.");
}

export const stripe = new Stripe(SECRET_KEY, {
  // Cloudflare Workers: fetch-based HTTP client.
  httpClient: Stripe.createFetchHttpClient(),
  // Versão da API: pin pra evitar quebras silenciosas. Versão aceita pelo
  // SDK ^17.5 — atualizar quando subir o SDK e mudar o pin de versão.
  apiVersion: "2025-02-24.acacia",
});

export function getStripeMode(): "test" | "live" {
  return MODE;
}
