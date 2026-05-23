import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/**
 * /auth/callback — processa o redirect do Supabase após:
 *  - confirmação de email (signup) → ?code=... na URL
 *  - login Google (OAuth)          → ?code=... na URL
 *  - reset de senha (recovery)     → #access_token=...&refresh_token=... no HASH
 *  - magic link                    → mesmo padrão de #access_token=...
 *
 * Após processar, redireciona:
 *  - recovery → /reset-password (com sessão temporária ativa)
 *  - signup/oauth → returnUrl validado OU início
 *  - erro → mostra tela com botão "voltar pro login"
 *
 * Anti open-redirect: só caminhos same-origin começando com '/' e sem '//'.
 */

type CallbackSearch = {
  redirect?: string;
  next?: string;
};

const SAFE_REDIRECT = (raw: unknown): string | undefined => {
  if (typeof raw !== "string" || !raw) return undefined;
  if (!raw.startsWith("/") || raw.startsWith("//")) return undefined;
  return raw;
};

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search): CallbackSearch => ({
    redirect: SAFE_REDIRECT(search.redirect),
    next: SAFE_REDIRECT(search.next),
  }),
  head: () => ({
    meta: [{ title: "Confirmando | Ideal Space" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AuthCallback,
});

type Status =
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

function AuthCallback() {
  const navigate = useNavigate();
  const { redirect, next } = Route.useSearch();
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);

        // 1) Hash flow (recovery / magic link / oauth implicit): tokens já vêm na URL
        if (url.hash && url.hash.length > 1) {
          const params = new URLSearchParams(url.hash.slice(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          const type = params.get("type"); // "recovery" | "magiclink" | "signup" | etc

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (error) throw error;

            // Recovery → user precisa definir nova senha
            if (type === "recovery") {
              setStatus({ kind: "success", message: "Sessão de redefinição ativa." });
              navigate({ to: "/reset-password" });
              return;
            }

            // Magic link / signup confirmado via hash → início
            setStatus({ kind: "success", message: "Login confirmado." });
            navigate({ to: (redirect || next || "/") as "/" });
            return;
          }
        }

        // 2) Code flow (PKCE / OAuth code grant): ?code=... na query
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setStatus({ kind: "success", message: "Login confirmado." });
          navigate({ to: (redirect || next || "/") as "/" });
          return;
        }

        // 3) Sem tokens nem code — algum erro upstream do Supabase
        const errorDesc =
          url.searchParams.get("error_description") || url.searchParams.get("error");
        throw new Error(errorDesc || "Link inválido ou já utilizado.");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao processar autenticação.";
        setStatus({ kind: "error", message: msg });
      }
    })();
  }, [navigate, redirect, next]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-16 text-center">
        {status.kind === "loading" && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
              Confirmando sua autenticação…
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Isso costuma levar 1 ou 2 segundos.
            </p>
          </>
        )}

        {status.kind === "success" && (
          <>
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
              {status.message}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Redirecionando…</p>
          </>
        )}

        {status.kind === "error" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <XCircle className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
              Não consegui confirmar
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{status.message}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Se o link expirou, gere um novo na tela de login.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="default">
                <Link to="/login">Voltar pro login</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/">Ir pra home</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
