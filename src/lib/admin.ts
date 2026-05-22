// Server functions isoladas do Admin — Lote 5 P0 (Admin Leads Dashboard).
// Reaproveita o padrão de verificação de admin já usado em
// src/lib/credits.functions.ts e src/lib/transform.functions.ts:
// consulta a tabela `user_roles` (role = "admin") com o client service-role.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Linha de lead exposta ao dashboard admin (somente leitura). */
export type AdminLeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  plan_interest: string | null;
  room_type: string | null;
  interest: string | null;
  created_at: string;
};

/** Indicadores agregados exibidos nos cards do topo do dashboard. */
export type AdminLeadsKpis = {
  total: number;
  planPaid: number;
  b2b: number;
  last7days: number;
};

/** Resultado da leitura de leads — sucesso, sem permissão ou erro. */
export type AdminLeadsResult =
  | { ok: true; kpis: AdminLeadsKpis; rows: AdminLeadRow[] }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/** Perfis de lead considerados B2B (profissional), em oposição a "pessoal". */
const B2B_INTERESTS = ["designer", "arquiteto", "imobiliaria", "empresa"];
/** Planos pagos de interesse contabilizados no card "Pro / Premium". */
const PAID_PLANS = ["pro", "premium"];
/** Teto de leitura no P0 — evita varrer a tabela inteira sem paginação. */
const MAX_LEADS = 500;

/**
 * Verifica server-side se o usuário tem role "admin" na tabela `user_roles`.
 * Mesmo padrão de credits.functions.ts / transform.functions.ts.
 */
async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) {
      console.error("[admin] verificação de role falhou");
      return false;
    }
    return !!data;
  } catch {
    console.error("[admin] verificação de role lançou exceção");
    return false;
  }
}

/** Server function: informa se o usuário autenticado atual é admin. */
export const checkAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean }> => {
    return { isAdmin: await isUserAdmin(context.userId) };
  });

/**
 * Server function: retorna os leads + KPIs APENAS se o usuário for admin.
 * Não-admin recebe { ok: false, reason: "forbidden" } — nenhum dado trafega.
 * Leitura somente — nenhuma escrita/edição/exclusão.
 */
export const getAdminLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminLeadsResult> => {
    if (!(await isUserAdmin(context.userId))) {
      return { ok: false, reason: "forbidden" };
    }

    try {
      // O types.ts gerado está defasado para `leads` (faltam phone, interest,
      // plan_interest, room_type) — mesmo descompasso já tratado em
      // src/lib/leads.ts. O cast fica restrito a este ponto de leitura.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query = supabaseAdmin.from("leads") as any;
      const { data, error, count } = await query
        .select(
          "id, name, email, phone, source, plan_interest, room_type, interest, created_at",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .limit(MAX_LEADS);

      if (error) {
        console.error("[admin] getAdminLeads — query falhou:", error.message);
        return { ok: false, reason: "error", message: "Falha ao carregar os leads." };
      }

      const rows = (data ?? []) as AdminLeadRow[];
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      const kpis: AdminLeadsKpis = {
        total: typeof count === "number" ? count : rows.length,
        planPaid: rows.filter(
          (r) => r.plan_interest && PAID_PLANS.includes(r.plan_interest.toLowerCase()),
        ).length,
        b2b: rows.filter(
          (r) => r.interest && B2B_INTERESTS.includes(r.interest.toLowerCase()),
        ).length,
        last7days: rows.filter((r) => {
          const t = new Date(r.created_at).getTime();
          return !Number.isNaN(t) && t >= sevenDaysAgo;
        }).length,
      };

      return { ok: true, kpis, rows };
    } catch (e) {
      console.error("[admin] getAdminLeads — exceção:", e);
      return { ok: false, reason: "error", message: "Erro inesperado ao carregar os leads." };
    }
  });
