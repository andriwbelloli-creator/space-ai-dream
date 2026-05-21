import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./client";

/**
 * Client middleware global: anexa o Bearer token do Supabase em toda chamada
 * de server function. Precisa estar registrado como `functionMiddleware` em
 * src/start.ts — senão o browser nunca manda o token e as rotas protegidas
 * (requireSupabaseAuth) sempre retornam 401.
 */
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
