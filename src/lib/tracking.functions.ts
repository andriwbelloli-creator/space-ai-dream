// Tracking do funil mínimo do MVP — Lote 2.
// Server function genérica `logEvent`: grava na tabela append-only `events`
// (Supabase, via service_role). Generaliza o antigo `logAffiliateClick`.
// NUNCA inclui PII (nome, e-mail, telefone) — apenas metadados de domínio.
import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Eventos do funil mínimo — allowlist. Nomes fora desta lista são ignorados. */
export const ALLOWED_EVENTS = [
  "start_project",
  "image_uploaded",
  "image_generated",
  "shopping_list_loaded",
  "affiliate_click",
  "pdf_download",
  "whatsapp_click",
  "signup_started",
  "project_saved",
] as const;

export type FunnelEvent = (typeof ALLOWED_EVENTS)[number];

export type LogEventInput = {
  event: string;
  props?: Record<string, unknown>;
};

/**
 * Coage `props` a um objeto plano de strings curtas — barreira contra PII
 * acidental e payloads inflados. Mantém no máximo 12 chaves.
 */
function sanitizeProps(props: unknown): Record<string, string> {
  if (!props || typeof props !== "object") return {};
  const out: Record<string, string> = {};
  let n = 0;
  for (const [k, v] of Object.entries(props as Record<string, unknown>)) {
    if (n >= 12) break;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      out[k.slice(0, 40)] = String(v).slice(0, 200);
      n++;
    }
  }
  return out;
}

/**
 * Registra um evento do funil na tabela `events`. Server-only (service_role).
 * Fire-and-forget no client — nunca bloqueia nem quebra a UI. Eventos fora da
 * allowlist são ignorados silenciosamente.
 */
export const logEvent = createServerFn({ method: "POST" }).handler(
  async ({ data }): Promise<{ ok: boolean }> => {
    const input = (data ?? {}) as LogEventInput;
    if (!ALLOWED_EVENTS.includes(input.event as FunnelEvent)) {
      return { ok: false };
    }
    try {
      // `events` ainda não está nos tipos gerados (types.ts) — cast pontual,
      // mesmo padrão usado em src/lib/leads.ts.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseAdmin as any).from("events").insert({
        event: input.event,
        props: sanitizeProps(input.props),
      });
    } catch (e) {
      console.error("logEvent failed", e);
    }
    return { ok: true };
  },
);
