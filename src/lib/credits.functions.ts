// @ts-nocheck — dívida técnica: types.ts do Supabase está vazio (DB sem schema gerado); silenciado para destravar build sem tocar em banco/migrations (ver CLAUDE.md §6).
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type CreditsSnapshot = {
  balance: number;
  plan: "free" | "premium" | "pro" | "admin";
  renews_at: string | null;
  /** true quando o user é admin — UI mostra "Ilimitado" no lugar do número */
  unlimited: boolean;
};

export const getUserCredits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CreditsSnapshot> => {
    const { supabase, userId } = context;

    // 0) Admin bypass — créditos ilimitados pra quem tem role admin.
    //    Mesma lógica do pipeline de geração.
    try {
      const { data: roleRow } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (roleRow) {
        // balance alto (nao Infinity — quebra JSON.stringify) so como fallback
        // visual. UI deve sempre olhar `unlimited` primeiro.
        return {
          balance: 999_999,
          plan: "admin",
          renews_at: null,
          unlimited: true,
        };
      }
    } catch (e) {
      console.error("admin role check failed", e);
      // Cai pro fluxo normal se a checagem falhar
    }

    const { data, error } = await supabase
      .from("user_credits")
      .select("balance, plan, renews_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("getUserCredits error", error);
      return { balance: 0, plan: "free", renews_at: null, unlimited: false };
    }

    if (!data) {
      // Backfill in case trigger didn't run (e.g. pre-existing user)
      const { data: created } = await supabase
        .from("user_credits")
        .insert({ user_id: userId, balance: 1, plan: "free" })
        .select("balance, plan, renews_at")
        .single();
      if (created) {
        await supabase.from("credit_transactions").insert({
          user_id: userId,
          amount: 1,
          kind: "signup_bonus",
          reference: "backfill",
        });
        return {
          balance: created.balance,
          plan: created.plan as CreditsSnapshot["plan"],
          renews_at: created.renews_at,
          unlimited: false,
        };
      }
      return { balance: 0, plan: "free", renews_at: null, unlimited: false };
    }

    return {
      balance: data.balance,
      plan: data.plan as CreditsSnapshot["plan"],
      renews_at: data.renews_at,
      unlimited: false,
    };
  });