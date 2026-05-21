import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
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
  const pathname = useRouterState({ select: (s) => s.location.href });

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [loading, user, navigate, pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
      </div>
    );
  }

  return <Outlet />;
}
