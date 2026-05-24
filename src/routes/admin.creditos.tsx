import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Coins,
  TrendingUp,
  TrendingDown,
  Users,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { getAdminCredits, type AdminCredits } from "@/lib/admin";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBlock } from "@/components/admin/StatusBlock";
import { RankedList } from "@/components/admin/RankedList";
import { formatDate } from "@/components/admin/formatters";

export const Route = createFileRoute("/admin/creditos")({
  head: () => ({
    meta: [
      { title: "Créditos | Admin Ideal Space" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminCreditsPage,
});

type PageState =
  | { status: "loading" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | { status: "ready"; credits: AdminCredits };

const KIND_LABELS: Record<string, string> = {
  signup_bonus: "Bônus de cadastro",
  generation: "Consumo (geração)",
  subscription_grant: "Crédito de assinatura",
  admin_adjust: "Ajuste admin",
  refund: "Reembolso",
};

function kindLabel(k: string): string {
  return KIND_LABELS[k] ?? k;
}

function kindBadgeClass(k: string): string {
  if (k === "generation") return "bg-foreground/10 text-foreground";
  if (k === "refund" || k === "signup_bonus" || k === "subscription_grant")
    return "bg-accent/15 text-accent";
  return "bg-muted text-muted-foreground";
}

function AdminCreditsPage() {
  const fetchCredits = useServerFn(getAdminCredits);
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetchCredits({});
      if (!res.ok) {
        setState(
          res.reason === "forbidden"
            ? { status: "forbidden" }
            : { status: "error", message: res.message ?? "Falha ao carregar os créditos." },
        );
        return;
      }
      setState({ status: "ready", credits: res.credits });
    } catch {
      setState({ status: "error", message: "Não foi possível carregar os créditos." });
    }
  }, [fetchCredits]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Créditos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ledger de transações de crédito. Read-only. Não altera saldos.
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

      {state.status === "ready" && state.credits.totalTx === 0 && (
        <StatusBlock
          icon={<Coins className="h-5 w-5" />}
          tone="muted"
          title="Sem movimentação de créditos ainda"
          text="Quando o primeiro usuário usar créditos, o ledger aparecerá aqui."
        />
      )}

      {state.status === "ready" && state.credits.totalTx > 0 && (
        <>
          {/* KPIs */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Coins className="h-4 w-4" />}
              label="Total transações"
              value={state.credits.totalTx}
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4" />}
              label="Créditos adicionados"
              value={state.credits.creditsAdded}
              sub="Bônus + assinatura + ajuste +"
            />
            <StatCard
              icon={<TrendingDown className="h-4 w-4" />}
              label="Créditos consumidos"
              value={state.credits.creditsConsumed}
              sub="Geração de imagens"
            />
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Usuários únicos"
              value={state.credits.uniqueUsers}
            />
          </div>

          {/* Breakdown por kind */}
          <section className="mt-8">
            <h2 className="text-base font-semibold tracking-tight">Por tipo</h2>
            <div className="mt-3 rounded-2xl border border-border bg-card p-4">
              <RankedList items={state.credits.byKind} empty="Sem transações registradas ainda." />
            </div>
          </section>

          {/* Top consumidores */}
          <section className="mt-8">
            <h2 className="text-base font-semibold tracking-tight">Top consumidores</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Os 10 que mais consumiram créditos. Nome do perfil quando disponível.
            </p>
            {state.credits.topConsumers.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                Sem consumo registrado ainda.
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full min-w-[420px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2.5 font-medium w-10">#</th>
                      <th className="px-3 py-2.5 font-medium">Nome</th>
                      <th className="px-3 py-2.5 font-medium">Consumidos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.credits.topConsumers.map((u, i) => (
                      <tr key={u.userId} className="border-b border-border/60 last:border-0">
                        <td className="px-3 py-2.5 text-xs text-muted-foreground tabular-nums">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2.5 font-medium">
                          {u.userName?.trim() ? (
                            u.userName
                          ) : (
                            <span className="text-muted-foreground italic">Sem nome</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 font-semibold tabular-nums">{u.consumed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Tabela */}
          <section className="mt-8">
            <h2 className="text-base font-semibold tracking-tight">Últimas transações</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              30 últimas movimentações. Sinal positivo adiciona, negativo consome.
            </p>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2.5 font-medium">Tipo</th>
                    <th className="px-3 py-2.5 font-medium">Quantia</th>
                    <th className="px-3 py-2.5 font-medium">Usuário</th>
                    <th className="px-3 py-2.5 font-medium">Referência</th>
                    <th className="px-3 py-2.5 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {state.credits.recent.map((t) => (
                    <tr key={t.id} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${kindBadgeClass(t.kind)}`}
                        >
                          {kindLabel(t.kind)}
                        </span>
                      </td>
                      <td
                        className={`px-3 py-2.5 font-semibold tabular-nums ${t.amount < 0 ? "text-muted-foreground" : "text-foreground"}`}
                      >
                        {t.amount > 0 ? `+${t.amount}` : t.amount}
                      </td>
                      <td className="px-3 py-2.5 text-sm">
                        {t.userName?.trim() ? (
                          t.userName
                        ) : (
                          <span className="text-muted-foreground italic">Sem nome</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-muted-foreground font-mono truncate max-w-[180px]">
                        {t.reference ?? "—"}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                        {formatDate(t.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="mt-6 text-xs text-muted-foreground">
            E-mail e identificador interno omitidos. Apenas display_name é exibido.
          </p>
        </>
      )}
    </div>
  );
}
