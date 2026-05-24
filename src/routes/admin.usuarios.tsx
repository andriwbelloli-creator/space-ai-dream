import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Users,
  UserPlus,
  Activity,
  Crown,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { getAdminUsers, type AdminUsers } from "@/lib/admin";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBlock } from "@/components/admin/StatusBlock";
import { RankedList } from "@/components/admin/RankedList";
import { formatDateOnly } from "@/components/admin/formatters";

export const Route = createFileRoute("/admin/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários | Admin Ideal Space" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminUsersPage,
});

type PageState =
  | { status: "loading" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | { status: "ready"; users: AdminUsers };

const PLAN_LABELS_UI: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  premium: "Premium",
};

function planLabel(plan: string | null): string {
  if (!plan) return "Free";
  return PLAN_LABELS_UI[plan.toLowerCase()] ?? plan;
}

function AdminUsersPage() {
  const fetchUsers = useServerFn(getAdminUsers);
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetchUsers({});
      if (!res.ok) {
        setState(
          res.reason === "forbidden"
            ? { status: "forbidden" }
            : { status: "error", message: res.message ?? "Falha ao carregar os usuários." },
        );
        return;
      }
      setState({ status: "ready", users: res.users });
    } catch {
      setState({ status: "error", message: "Não foi possível carregar os usuários." });
    }
  }, [fetchUsers]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Distribuição por plano e atividade. Sem e-mail nem telefone.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={state.status === "loading"}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${state.status === "loading" ? "animate-spin" : ""}`}
          />
          Atualizar
        </button>
      </div>

      {state.status === "loading" && (
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
        </div>
      )}

      {state.status === "forbidden" && (
        <StatusBlock
          icon={<ShieldAlert className="h-5 w-5" />}
          tone="destructive"
          title="Sem permissão"
          text="A sua conta não tem acesso de administrador a esta área."
        />
      )}

      {state.status === "error" && (
        <StatusBlock
          icon={<AlertCircle className="h-5 w-5" />}
          tone="destructive"
          title="Não foi possível carregar"
          text={state.message}
          action={
            <button
              type="button"
              onClick={() => void load()}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:bg-foreground/90"
            >
              Tentar novamente
            </button>
          }
        />
      )}

      {state.status === "ready" && state.users.total === 0 && (
        <StatusBlock
          icon={<Users className="h-5 w-5" />}
          tone="muted"
          title="Sem usuários cadastrados ainda"
          text="Quando alguém se inscrever, o perfil será criado e aparecerá aqui."
        />
      )}

      {state.status === "ready" && state.users.total > 0 && (
        <>
          {/* KPIs */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Total"
              value={state.users.total}
            />
            <StatCard
              icon={<UserPlus className="h-4 w-4" />}
              label="Novos (7 dias)"
              value={state.users.newLast7}
            />
            <StatCard
              icon={<Activity className="h-4 w-4" />}
              label="Ativos (7 dias)"
              value={state.users.activeLast7}
              sub="Quem gerou algum evento"
            />
            <StatCard
              icon={<Crown className="h-4 w-4" />}
              label="Pagantes"
              value={state.users.paid}
              sub="Pro ou Premium"
            />
          </div>

          {/* Plano breakdown */}
          <section className="mt-8">
            <h2 className="text-base font-semibold tracking-tight">Distribuição por plano</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Usuários sem plano definido entram em "Free".
            </p>
            <div className="mt-3 rounded-2xl border border-border bg-card p-4">
              <RankedList items={state.users.planBreakdown} empty="Sem dados de plano ainda." />
            </div>
          </section>

          {/* Top usuários por # projetos */}
          <section className="mt-8">
            <h2 className="text-base font-semibold tracking-tight">Top usuários por projetos</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Os 20 que mais geraram. Identificador interno omitido.
            </p>
            {state.users.topByProjects.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                Sem projetos atribuídos a usuários ainda.
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2.5 font-medium w-10">#</th>
                      <th className="px-3 py-2.5 font-medium">Nome</th>
                      <th className="px-3 py-2.5 font-medium">Plano</th>
                      <th className="px-3 py-2.5 font-medium">Projetos</th>
                      <th className="px-3 py-2.5 font-medium">Créditos</th>
                      <th className="px-3 py-2.5 font-medium">Entrou</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.users.topByProjects.map((u, i) => (
                      <tr key={u.id} className="border-b border-border/60 last:border-0">
                        <td className="px-3 py-2.5 text-xs text-muted-foreground tabular-nums">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2.5 font-medium">
                          {u.displayName?.trim() ? (
                            u.displayName
                          ) : (
                            <span className="text-muted-foreground italic">Sem nome</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${
                              u.plan && ["pro", "premium"].includes(u.plan.toLowerCase())
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {planLabel(u.plan)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-medium tabular-nums">{u.projectCount}</td>
                        <td className="px-3 py-2.5 text-muted-foreground tabular-nums">
                          {u.credits ?? "—"}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                          {formatDateOnly(u.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="mt-6 text-xs text-muted-foreground">
            E-mail e telefone propositalmente ocultados. Uso restrito conforme a LGPD.
          </p>
        </>
      )}
    </div>
  );
}
