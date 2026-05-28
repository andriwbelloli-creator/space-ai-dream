// Captação de leads do funil de monetização (formulário comercial).
// Consumido por src/components/LeadFormModal.tsx e pelos CTAs de /pricing,
// da home e da lista de compras.

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/** Slug que identifica leads originados do formulário comercial genérico. */
export const LEAD_FORM_SLUG = "lead-form";

/** Perfil de quem está entrando em contato — direciona o atendimento comercial. */
export type LeadInterest = "pessoal" | "designer" | "arquiteto" | "imobiliaria" | "empresa";

/** Tipo Insert da tabela leads (autogerado pelo Supabase CLI). */
type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export interface LeadFormPayload {
  // Obrigatórios (em todas as variantes)
  name: string;
  phone: string;
  interest: LeadInterest;
  consent_lgpd: boolean;
  // E-mail pode vir vazio "" em variantes onde é opcional (ex.: executar-projeto).
  // Quando preenchido, valida formato.
  email: string;
  // Opcionais (variantes legadas)
  room_type?: string;
  plan_interest?: string;
  budget_range?: string;
  style?: string;
  message?: string;
  source?: string;
  // Opcionais (variante executar-projeto)
  cep?: string;
  investment_range?: string;
  start_timing?: string;
  user_id?: string;
  project_id?: string;
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
  // E-mail é validado APENAS se preenchido — variantes como "executar-projeto"
  // permitem envio sem e-mail (campo opcional). UI ainda pode forçar como
  // obrigatório onde fizer sentido.
  if (email.length > 0 && !EMAIL_RE.test(email)) {
    return { ok: false, error: "Informe um e-mail válido ou deixe em branco." };
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

  const row: LeadInsert = {
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
    cep: clean(payload.cep),
    investment_range: clean(payload.investment_range),
    start_timing: clean(payload.start_timing),
    user_id: clean(payload.user_id),
    project_id: clean(payload.project_id),
  };

  try {
    const { error } = await supabase.from("leads").insert(row);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Não foi possível enviar agora. Tente novamente.",
    };
  }
}
