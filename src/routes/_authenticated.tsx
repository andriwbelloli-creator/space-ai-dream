import { useEffect, useRef } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

/**
 * Gate de rotas autenticadas. Tudo em src/routes/_authenticated/ só renderiza
 * pra usuário logado; senão redireciona pro /login guardando o destino.
 */
export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // Captura o pathname original APENAS na primeira montagem (não-reativo) e
  // dispara o redirect exatamente uma vez. A versão antiga lia o pathname via
  // useRouterState e o incluía nas deps — cada navigate pra /login mudava o
  // router state e refire o effect, criando uma URL com redirect aninhado
  // (.../login?redirect=%2Flogin%3F...) e estourando o limite de re-render do
  // React (#185).
  const initialPathRef = useRef<string | null>(null);
  const redirectedRef = useRef(false);

  useEffect(() => {
    // useEffect não roda em SSR — `window` é seguro aqui.
    if (initialPathRef.current === null && typeof window !== "undefined") {
      initialPathRef.current = window.location.pathname;
    }
    if (loading || user || redirectedRef.current) return;
    const target = initialPathRef.current;
    // Defensivo: nunca usar /login como redirect de si mesmo.
    if (!target || target.startsWith("/login")) return;
    redirectedRef.current = true;
    navigate({ to: "/login", search: { redirect: target } });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
      </div>
    );
  }

  return <Outlet />;
}
