import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  CreditCard,
  Activity,
  XCircle,
  CalendarClock,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { getAdminRevenue, type AdminRevenue } from "@/lib/admin";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBlock } from "@/components/admin/StatusBlock";
import { RankedList } from "@/components/admin/RankedList";
import { formatDateOnly } from "@/components/admin/formatters";

export const Route = createFileRoute("/admin/receita")({
  head: () => ({
    meta: [
      { title: "Receita | Admin Ideal Space" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRevenuePage,
});

type PageState =
  | { status: "loading" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | { status: "ready"; revenue: AdminRevenue };

const STATUS_LABELS: Record<string, string> = {
  active: "Ativa",
  canceled: "Cancelada",
  past_due: "Em atraso",
  trialing: "Trial",
  incomplete: "Incompleta",
  incomplete_expired: "Expirada",
  unpaid: "Não paga",
};

function statusLabel(s: string): string {
  return STATUS_LABELS[s] ?? s;
}

function statusBadgeClass(s: string): string {
  if (s === "active" || s === "trialing") return "bg-accent text-accent-foreground";
  if (s === "canceled" || s === "incomplete_expired" || s === "unpaid")
    return "bg-muted text-muted-foreground";
  return "bg-foreground/10 text-foreground";
}

function AdminRevenuePage() {
  const fetchRevenue = useServerFn(getAdminRevenue);
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetchRevenue({});
      if (!res.ok) {
        setState(
          res.reason === "forbidden"
            ? { status: "forbidden" }
            : { status: "error", message: res.message ?? "Falha ao carregar a receita." },
        );
        return;
      }
      setState({ status: "ready", revenue: res.revenue });
    } catch {
      setState({ status: "error", message: "Não foi possível carregar a receita." });
    }
  }, [fetchRevenue]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Receita</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Assinaturas do Stripe. Read-only. Não altera pricing nem checkout.
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

      {state.status === "ready" && state.revenue.total === 0 && (
        <StatusBlock
          icon={<CreditCard className="h-5 w-5" />}
          tone="muted"
          title="Assinaturas ainda não conectadas"
          text="Quando o primeiro usuário assinar, os dados aparecerão aqui."
        />
      )}

      {state.status === "ready" && state.revenue.total > 0 && (
        <>
          {/* KPIs */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<CreditCard className="h-4 w-4" />}
              label="Total assinaturas"
              value={state.revenue.total}
            />
            <StatCard
              icon={<Activity className="h-4 w-4" />}
              label="Ativas"
              value={state.revenue.active}
              sub={`${
                state.revenue.total > 0
                  ? Math.round((state.revenue.active / state.revenue.total) * 100)
                  : 0
              }% do total`}
            />
            <StatCard
              icon={<XCircle className="h-4 w-4" />}
              label="Canceladas (30d)"
              value={state.revenue.canceledLast30}
            />
            <StatCard
              icon={<CalendarClock className="h-4 w-4" />}
              label="Renovam (30d)"
              value={state.revenue.renewingNext30}
            />
          </div>

          {/* Breakdowns */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="text-base font-semibold tracking-tight">Por status</h2>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <RankedList items={state.revenue.byStatus} empty="Sem dados de status ainda." />
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold tracking-tight">Por plano (price_id)</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                IDs da Stripe. Mapear pra rótulos legíveis no futuro.
              </p>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <RankedList
                  items={state.revenue.byPrice}
                  empty="Sem assinaturas com plano ainda."
                />
              </div>
            </section>

            <section className="lg:col-span-2">
              <h2 className="text-base font-semibold tracking-tight">Por ambiente</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Test vs Live no Stripe.</p>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <RankedList
                  items={state.revenue.byEnvironment}
                  empty="Sem ambiente registrado ainda."
                />
              </div>
            </section>
          </div>

          {/* Tabela */}
          <section className="mt-8">
            <h2 className="text-base font-semibold tracking-tight">Mais recentes</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Últimas 30 assinaturas criadas. IDs do Stripe ocultos.
            </p>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Plano</th>
                    <th className="px-3 py-2.5 font-medium">Ambiente</th>
                    <th className="px-3 py-2.5 font-medium">Renovação</th>
                    <th className="px-3 py-2.5 font-medium">Cancelando?</th>
                    <th className="px-3 py-2.5 font-medium">Criado</th>
                  </tr>
                </thead>
                <tbody>
                  {state.revenue.recent.map((s) => (
                    <tr key={s.id} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${statusBadgeClass(s.status)}`}
                        >
                          {statusLabel(s.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground truncate max-w-[180px]">
                        {s.priceId}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{s.environment}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                        {s.currentPeriodEnd ? formatDateOnly(s.currentPeriodEnd) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">
                        {s.cancelAtPeriodEnd ? "Sim" : "Não"}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                        {formatDateOnly(s.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="mt-6 text-xs text-muted-foreground">
            Identificadores Stripe (customer/subscription) propositalmente ocultos. Uso restrito.
          </p>
        </>
      )}
    </div>
  );
}
