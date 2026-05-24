import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { checkAdminAccess } from "@/lib/admin";

export const Route = createFileRoute("/admin")({
  // /admin agora renderiza a Visão Geral via admin.index.tsx — sem redirect.
  head: () => ({
    meta: [{ title: "Admin | Ideal Space" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

/** Shell visual da área administrativa — header + área de conteúdo. */
function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-xl bg-foreground text-[11px] font-semibold text-background">
              IS
            </span>
            <span className="text-sm font-semibold tracking-tight">Admin · Ideal Space</span>
            <nav className="ml-1 flex items-center gap-0.5">
              <Link
                to="/admin"
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-muted text-foreground" }}
                className="rounded-full px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
              >
                Visão
              </Link>
              <Link
                to="/admin/leads"
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-muted text-foreground" }}
                className="rounded-full px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
              >
                Leads
              </Link>
              <Link
                to="/admin/insights"
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-muted text-foreground" }}
                className="rounded-full px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
              >
                Funil
              </Link>
            </nav>
          </div>
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Voltar ao site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">{children}</main>
    </div>
  );
}

/** Mensagem centralizada de tela cheia (carregando / redirecionando). */
function FullScreenNote({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> {text}
    </div>
  );
}

type GateState = "checking" | "denied" | "ok";

/**
 * Gate da área admin: exige usuário autenticado + role admin.
 * A checagem de role é server-side (checkAdminAccess). Esta é a camada de UX;
 * o enforcement real dos dados está na server function getAdminLeads.
 */
function AdminLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const verifyAdmin = useServerFn(checkAdminAccess);
  const [gate, setGate] = useState<GateState>("checking");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/admin" } });
      return;
    }
    let active = true;
    setGate("checking");
    verifyAdmin({})
      .then((res) => {
        if (active) setGate(res.isAdmin ? "ok" : "denied");
      })
      .catch(() => {
        if (active) setGate("denied");
      });
    return () => {
      active = false;
    };
  }, [loading, user, navigate, verifyAdmin]);

  if (loading) return <FullScreenNote text="Carregando…" />;
  if (!user) return <FullScreenNote text="Redirecionando para o login…" />;
  if (gate === "checking") return <FullScreenNote text="Verificando acesso…" />;

  if (gate === "denied") {
    return (
      <AdminShell>
        <div className="mx-auto mt-6 max-w-md rounded-3xl border border-border bg-card p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-semibold">Acesso restrito</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Esta área é exclusiva para administradores do Ideal Space.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            Voltar ao site
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
