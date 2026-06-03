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
  "demo_viewed",
  "start_project_blocked_by_auth",
  // Decisao de estilo no modal de upload — momento critico do funil.
  "style_selected",
  // Pos-geracao: usuario volta em /projetos e reabre um projeto.
  "project_detail_opened",
  // Lista de compras: usuario clica em "Ver mais" e expande os itens
  // que estavam ocultos atras do paywall leve.
  "shopping_list_expanded",
  // Growth loop: compartilhamento publico de projeto.
  "project_made_public",
  "project_made_private",
  "share_link_copied",
  "public_project_viewed",
  "public_project_cta_click",
  // Lote A (tracking funil real) — Hero v9 + Guia v10
  // Hero: dropzone, demo, carrossel clicável, CTA central
  "hero_upload_click",
  "hero_demo_click",
  "hero_before_after_project_selected",
  "hero_before_after_cta_click",
  // Sprint 2: CTAs do hero editorial (executar projeto, ver projetos).
  "hero_executar_projeto_click",
  "hero_see_projects_click",
  // Navegação header/menu
  "nav_menu_click",
  "pricing_click",
  // Guia/Onboarding (PresentationModal) — 4 CTAs
  "guia_cta_click",
  // Pricing
  "pricing_viewed",
  "plan_selected",
  "plan_checkout_started",
  // Lead form (profissionais, planos pagos)
  "lead_form_opened",
  "lead_form_submitted",
  "lead_form_error",
  // professional_lead_click e professional_card_click removidos na Sprint 2 (allowlistados, nunca disparados).
  // Reward modal (7 tipos: budget, send_phone, save_project, etc)
  "reward_modal_opened",
  // Curso
  "course_modal_opened",
  "course_enrolled",
  // Orçamento
  "budget_viewed",
  "download_budget_click",
  // Lote A.3 — pipeline de upload + geração IA
  "upload_modal_opened",
  "upload_file_selected",
  "upload_file_error",
  "room_type_selected",
  "generation_started",
  "generation_succeeded",
  "generation_failed",
  // Growth/Marketing — Sprint 1: atribuição de origem/campanha (UTMs/click ids).
  "marketing_attribution_captured",
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
export const logEvent = createServerFn({ method: "POST" })
  .inputValidator((data: LogEventInput) => data)
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const input = data;
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
