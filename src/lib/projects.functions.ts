// @ts-nocheck — dívida técnica: types.ts do Supabase está vazio (DB sem schema gerado); silenciado para destravar build sem tocar em banco/migrations (ver CLAUDE.md §6).
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Snapshot publico de um projeto, exibido na rota /p/$projectId quando
 * is_public = true. Nao expoe user_id, ai_prompt, ai_model nem before_url
 * (a foto original do usuario nunca aparece na pagina publica — so o
 * resultado da IA).
 */
export type PublicProjectSnapshot = {
  id: string;
  title: string | null;
  styleSlug: string | null;
  afterUrl: string | null;
  createdAt: string;
  roomType: string | null;
};

type ProjectAiResponse = {
  roomType?: string;
  style?: string;
  variant?: string | null;
};

/**
 * Busca um projeto publico read-only. Falha silenciosa retorna null
 * (pagina mostra 404 amigavel). Usa supabaseAdmin pra ignorar RLS, ja
 * que a regra de negocio (is_public = true) e mais simples que policy.
 * Nao precisa de auth.
 */
export const getPublicProject = createServerFn({ method: "GET" })
  .inputValidator((id: unknown): { id: string } => {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("ID do projeto inválido.");
    }
    return { id: id.trim() };
  })
  .handler(async ({ data }): Promise<PublicProjectSnapshot | null> => {
    const { data: row, error } = await supabaseAdmin
      .from("projects")
      .select("id, title, style_slug, after_url, created_at, ai_response, is_public")
      .eq("id", data.id)
      .eq("is_public", true)
      .maybeSingle();

    if (error || !row) return null;

    const ai = (row.ai_response ?? null) as ProjectAiResponse | null;

    return {
      id: row.id,
      title: row.title,
      styleSlug: row.style_slug,
      afterUrl: row.after_url,
      createdAt: row.created_at,
      roomType: ai?.roomType ?? null,
    };
  });

/**
 * Liga/desliga o flag is_public de um projeto do usuario logado.
 * RLS da tabela projects garante que so o owner consegue UPDATE,
 * mas reforcamos no WHERE com user_id pra ser explicito.
 */
export const toggleProjectPublic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown): { id: string; isPublic: boolean } => {
    if (!input || typeof input !== "object") throw new Error("Input inválido.");
    const i = input as { id?: unknown; isPublic?: unknown };
    if (typeof i.id !== "string" || !i.id.trim()) throw new Error("ID inválido.");
    if (typeof i.isPublic !== "boolean") throw new Error("isPublic deve ser booleano.");
    return { id: i.id.trim(), isPublic: i.isPublic };
  })
  .handler(async ({ context, data }): Promise<{ isPublic: boolean }> => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("projects")
      .update({ is_public: data.isPublic })
      .eq("id", data.id)
      .eq("user_id", userId);

    if (error) {
      console.error("toggleProjectPublic falhou", error);
      throw new Error("Não foi possível atualizar a visibilidade do projeto.");
    }
    return { isPublic: data.isPublic };
  });