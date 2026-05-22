import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Users,
  Crown,
  Briefcase,
  CalendarClock,
  AlertCircle,
  Inbox,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { getAdminLeads, type AdminLeadRow, type AdminLeadsKpis } from "@/lib/admin";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Admin Ideal Space" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLeadsPage,
});

type PageState =
  | { status: "loading" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | { status: "ready"; kpis: AdminLeadsKpis; rows: AdminLeadRow[] };

/** Formata um campo opcional — vazio/nulo vira travessão. */
function cell(value: string | null | undefined): string {
  const v = value?.trim();
  return v ? v : "—";
}

/** Formata a data do lead em pt-BR (data + hora curtas). */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

/** Card de indicador do topo do dashboard. */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent/15 text-accent">
          {icon}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

/** Bloco centralizado de estado (vazio / erro / sem permissão). */
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

function AdminLeadsPage() {
  const fetchLeads = useServerFn(getAdminLeads);
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetchLeads({});
      if (!res.ok) {
        setState(
          res.reason === "forbidden"
            ? { status: "forbidden" }
            : { status: "error", message: res.message ?? "Falha ao carregar os leads." },
        );
        return;
      }
      setState({ status: "ready", kpis: res.kpis, rows: res.rows });
    } catch {
      setState({ status: "error", message: "Não foi possível carregar os leads." });
    }
  }, [fetchLeads]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads capturados</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visualização somente leitura dos leads do funil comercial.
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
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando leads…
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
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Total de leads"
              value={state.kpis.total}
            />
            <StatCard
              icon={<Crown className="h-4 w-4" />}
              label="Pro / Premium"
              value={state.kpis.planPaid}
            />
            <StatCard
              icon={<Briefcase className="h-4 w-4" />}
              label="Leads B2B"
              value={state.kpis.b2b}
            />
            <StatCard
              icon={<CalendarClock className="h-4 w-4" />}
              label="Últimos 7 dias"
              value={state.kpis.last7days}
            />
          </div>

          {state.rows.length === 0 ? (
            <StatusBlock
              icon={<Inbox className="h-5 w-5" />}
              tone="muted"
              title="Nenhum lead ainda"
              text="Os leads capturados pelo funil aparecerão aqui."
            />
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">E-mail</th>
                    <th className="px-4 py-3 font-medium">Telefone</th>
                    <th className="px-4 py-3 font-medium">Origem</th>
                    <th className="px-4 py-3 font-medium">Plano</th>
                    <th className="px-4 py-3 font-medium">Ambiente</th>
                    <th className="px-4 py-3 font-medium">Perfil</th>
                    <th className="px-4 py-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {state.rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 font-medium">{cell(r.name)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cell(r.email)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cell(r.phone)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cell(r.source)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cell(r.plan_interest)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cell(r.room_type)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cell(r.interest)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {formatDate(r.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            Exibindo até {state.rows.length} lead(s) mais recente(s). Dados pessoais — uso restrito
            conforme a LGPD.
          </p>
        </>
      )}
    </div>
  );
}
