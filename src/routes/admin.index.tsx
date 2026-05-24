import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Users,
  FolderOpen,
  Globe,
  Mail,
  CreditCard,
  Activity,
  ShoppingBag,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { getAdminOverview, type AdminOverview } from "@/lib/admin";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBlock } from "@/components/admin/StatusBlock";
import { RankedList } from "@/components/admin/RankedList";
import { FunnelRow } from "@/components/admin/FunnelRow";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Visão geral | Admin Ideal Space" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOverviewPage,
});

type PageState =
  | { status: "loading" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | { status: "ready"; overview: AdminOverview };

function AdminOverviewPage() {
  const fetchOverview = useServerFn(getAdminOverview);
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetchOverview({});
      if (!res.ok) {
        setState(
          res.reason === "forbidden"
            ? { status: "forbidden" }
            : { status: "error", message: res.message ?? "Falha ao carregar a visão geral." },
        );
        return;
      }
      setState({ status: "ready", overview: res.overview });
    } catch {
      setState({ status: "error", message: "Não foi possível carregar a visão geral." });
    }
  }, [fetchOverview]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Visão geral</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Saúde do produto, últimos 7 dias para eventos. Somente leitura.
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

      {state.status === "ready" && (
        <>
          {/* KPIs principais */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Usuários"
              value={state.overview.totals.users}
            />
            <StatCard
              icon={<FolderOpen className="h-4 w-4" />}
              label="Projetos"
              value={state.overview.totals.projects}
              sub={`${state.overview.totals.projectsPublic} públicos`}
            />
            <StatCard
              icon={<Mail className="h-4 w-4" />}
              label="Leads"
              value={state.overview.totals.leads}
            />
            <StatCard
              icon={<CreditCard className="h-4 w-4" />}
              label="Assinaturas ativas"
              value={state.overview.totals.activeSubs}
            />
            <StatCard
              icon={<Activity className="h-4 w-4" />}
              label="Eventos (7 dias)"
              value={state.overview.totals.events7d}
            />
            <StatCard
              icon={<ShoppingBag className="h-4 w-4" />}
              label="Cliques afiliados (7d)"
              value={state.overview.totals.affiliateClicks7d}
            />
            <StatCard
              icon={<Globe className="h-4 w-4" />}
              label="Projetos públicos"
              value={state.overview.totals.projectsPublic}
              sub={`${
                state.overview.totals.projects > 0
                  ? Math.round(
                      (state.overview.totals.projectsPublic / state.overview.totals.projects) * 100,
                    )
                  : 0
              }% do total`}
            />
          </div>

          {/* Funil compacto */}
          <section className="mt-8">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight">Funil (últimos 7 dias)</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Eventos relativos a "Iniciou projeto".
                </p>
              </div>
              <Link
                to="/admin/insights"
                className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition"
              >
                Ver detalhes <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
            {state.overview.funnel[0]?.count === 0 ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Nenhum evento nos últimos 7 dias.
              </p>
            ) : (
              <div className="mt-4 rounded-2xl border border-border bg-card p-4 space-y-3">
                {state.overview.funnel.map((step) => (
                  <FunnelRow
                    key={step.event}
                    step={step}
                    baseline={state.overview.funnel[0]?.count ?? 1}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Top estilos + ambientes */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="text-base font-semibold tracking-tight">Top 5 estilos</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Baseado nos projetos gerados mais recentes.
              </p>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <RankedList
                  items={state.overview.topStyles}
                  empty="Nenhum projeto com estilo registrado."
                />
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold tracking-tight">Top 5 ambientes</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Cômodo detectado pela IA em cada projeto.
              </p>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <RankedList
                  items={state.overview.topRooms}
                  empty="Nenhum projeto com ambiente registrado."
                />
              </div>
            </section>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Dados pessoais não exibidos. Uso restrito conforme a LGPD.
          </p>
        </>
      )}
    </div>
  );
}
