import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  FolderOpen,
  Globe,
  CalendarClock,
  Users,
  ShoppingBag,
  Eye,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import {
  getAdminInsights,
  type AdminInsights,
  type AdminRankedItem,
  type AdminFunnelStep,
} from "@/lib/admin";

export const Route = createFileRoute("/admin/insights")({
  head: () => ({
    meta: [
      { title: "Funil | Admin Ideal Space" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminInsightsPage,
});

type PageState =
  | { status: "loading" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | { status: "ready"; leadsTotal: number; insights: AdminInsights };

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent/15 text-accent">
          {icon}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">
        {value.toLocaleString("pt-BR")}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function FunnelRow({ step, baseline }: { step: AdminFunnelStep; baseline: number }) {
  const pct = baseline > 0 ? Math.min(100, Math.round((step.count / baseline) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 text-xs text-muted-foreground truncate">{step.label}</div>
      <div className="flex-1 min-w-0">
        <div className="h-5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: pct > 0 ? `${Math.max(pct, 1)}%` : "0%" }}
          />
        </div>
      </div>
      <div className="w-10 shrink-0 text-right text-xs font-semibold">{pct}%</div>
      <div className="w-12 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
        {step.count.toLocaleString("pt-BR")}
      </div>
    </div>
  );
}

function RankedList({ items, empty }: { items: AdminRankedItem[]; empty: string }) {
  if (items.length === 0) {
    return <p className="mt-3 text-xs text-muted-foreground">{empty}</p>;
  }
  const max = items[0]?.count ?? 1;
  return (
    <ol className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={item.slug} className="flex items-center gap-2">
          <span className="w-4 shrink-0 text-[11px] text-muted-foreground">{i + 1}.</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate">{item.label}</div>
            <div className="mt-0.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-accent/60"
                style={{ width: `${Math.round((item.count / max) * 100)}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-xs font-medium tabular-nums">
            {item.count.toLocaleString("pt-BR")}
          </span>
        </li>
      ))}
    </ol>
  );
}

function StatusBlock({
  icon,
  tone,
  title,
  text,
  action,
}: {
  icon: React.ReactNode;
  tone: "destructive" | "muted";
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-border bg-card p-10 text-center">
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
          tone === "destructive"
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      {action}
    </div>
  );
}

function AdminInsightsPage() {
  const fetchInsights = useServerFn(getAdminInsights);
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetchInsights({});
      if (!res.ok) {
        setState(
          res.reason === "forbidden"
            ? { status: "forbidden" }
            : { status: "error", message: res.message ?? "Falha ao carregar os dados." },
        );
        return;
      }
      setState({ status: "ready", leadsTotal: res.leadsTotal, insights: res.insights });
    } catch {
      setState({ status: "error", message: "Não foi possível carregar os dados." });
    }
  }, [fetchInsights]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Funil e métricas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Projetos gerados, eventos do funil e estilos mais usados. Somente leitura.
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
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando dados…
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
          {/* KPIs */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <StatCard
              icon={<FolderOpen className="h-4 w-4" />}
              label="Projetos gerados"
              value={state.insights.projectsTotal}
              sub={`${state.insights.projectsLast7} nos últimos 7 dias`}
            />
            <StatCard
              icon={<Globe className="h-4 w-4" />}
              label="Projetos públicos"
              value={state.insights.projectsPublic}
            />
            <StatCard
              icon={<CalendarClock className="h-4 w-4" />}
              label="Projetos (7 dias)"
              value={state.insights.projectsLast7}
            />
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Leads capturados"
              value={state.leadsTotal}
            />
            <StatCard
              icon={<ShoppingBag className="h-4 w-4" />}
              label="Cliques afiliados"
              value={
                state.insights.eventCounts.find((e) => e.event === "affiliate_click")?.count ?? 0
              }
            />
            <StatCard
              icon={<Eye className="h-4 w-4" />}
              label="Páginas públicas vistas"
              value={
                state.insights.eventCounts.find((e) => e.event === "public_project_viewed")
                  ?.count ?? 0
              }
            />
          </div>

          {/* Funil */}
          <section className="mt-8">
            <h2 className="text-base font-semibold tracking-tight">Funil de geração</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Contagem bruta de eventos — um usuário pode gerar múltiplos eventos. Percentual
              relativo a "Iniciou projeto".
            </p>
            {state.insights.funnel[0]?.count === 0 ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Nenhum evento registrado ainda. Verifique se o tracking está ativo.
              </p>
            ) : (
              <div className="mt-4 rounded-2xl border border-border bg-card p-4 space-y-3">
                {state.insights.funnel.map((step) => (
                  <FunnelRow
                    key={step.event}
                    step={step}
                    baseline={state.insights.funnel[0]?.count ?? 1}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Top estilos + ambientes */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="text-base font-semibold tracking-tight">Estilos mais usados</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Baseado nos projetos gerados (primeiros{" "}
                {state.insights.projectsTotal > MAX_DISPLAY
                  ? MAX_DISPLAY.toLocaleString("pt-BR")
                  : state.insights.projectsTotal}
                ).
              </p>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <RankedList
                  items={state.insights.topStyles}
                  empty="Nenhum projeto com estilo registrado."
                />
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold tracking-tight">Ambientes mais usados</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Baseado no cômodo detectado pela IA em cada projeto.
              </p>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <RankedList
                  items={state.insights.topRooms}
                  empty="Nenhum projeto com ambiente registrado."
                />
              </div>
            </section>
          </div>

          {/* Todos os eventos */}
          {state.insights.eventCounts.length > 0 && (
            <section className="mt-8">
              <h2 className="text-base font-semibold tracking-tight">Todos os eventos</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Contagem total por tipo de evento, em ordem decrescente.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.insights.eventCounts.map(({ event, count }) => (
                  <div
                    key={event}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
                  >
                    <span className="font-semibold tabular-nums">
                      {count.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-muted-foreground">{event}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Dados pessoais não exibidos. Uso restrito conforme a LGPD.
          </p>
        </>
      )}
    </div>
  );
}

/** Limite de projetos consultados — só para o texto informativo da UI. */
const MAX_DISPLAY = 2_000;
