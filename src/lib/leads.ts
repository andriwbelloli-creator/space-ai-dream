// Captação de leads do funil de monetização (formulário comercial).
// Consumido por src/components/LeadFormModal.tsx e pelos CTAs de /pricing,
// da home e da lista de compras.

import { supabase } from "@/integrations/supabase/client";

/** Slug que identifica leads originados do formulário comercial genérico. */
export const LEAD_FORM_SLUG = "lead-form";

/** Perfil de quem está entrando em contato — direciona o atendimento comercial. */
export type LeadInterest = "pessoal" | "designer" | "arquiteto" | "imobiliaria" | "empresa";

export interface LeadFormPayload {
  // Obrigatórios
  name: string;
  email: string;
  phone: string;
  interest: LeadInterest;
  consent_lgpd: boolean;
  // Opcionais
  room_type?: string;
  plan_interest?: string;
  budget_range?: string;
  style?: string;
  message?: string;
  source?: string;
}

/** Regex padrão de e-mail — algo@dominio.tld, sem espaços. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEAD_INTERESTS: ReadonlyArray<LeadInterest> = [
  "pessoal",
  "designer",
  "arquiteto",
  "imobiliaria",
  "empresa",
];

/** Normaliza um campo opcional para string limpa ou `null`. */
function clean(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Valida e grava um lead na tabela `leads`. Nunca lança — devolve sempre
 * `{ ok }` para que a UI trate o erro de forma graciosa.
 */
export async function submitLead(
  payload: LeadFormPayload,
): Promise<{ ok: boolean; error?: string }> {
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim().toLowerCase() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const phoneDigits = phone.replace(/\D/g, "");

  if (name.length < 2) {
    return { ok: false, error: "Informe o seu nome completo." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Informe um e-mail válido." };
  }
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    return { ok: false, error: "Informe um celular válido com DDD." };
  }
  if (!LEAD_INTERESTS.includes(payload.interest)) {
    return { ok: false, error: "Selecione o seu perfil de interesse." };
  }
  if (!payload.consent_lgpd) {
    return {
      ok: false,
      error: "É necessário aceitar a Política de Privacidade para continuar.",
    };
  }

  const row = {
    idea_slug: LEAD_FORM_SLUG,
    source: clean(payload.source) ?? LEAD_FORM_SLUG,
    name,
    email,
    phone,
    interest: payload.interest,
    consent_lgpd: true,
    room_type: clean(payload.room_type),
    plan_interest: clean(payload.plan_interest),
    budget_range: clean(payload.budget_range),
    style: clean(payload.style),
    message: clean(payload.message),
  };

  try {
    // Os tipos autogerados em integrations/supabase/types.ts podem estar
    // desatualizados em relação ao schema atual da tabela `leads`; por isso
    // o cast `as any` fica restrito exatamente a este ponto de inserção.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("leads").insert(row as any);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Não foi possível enviar agora. Tente novamente.",
    };
  }
}
