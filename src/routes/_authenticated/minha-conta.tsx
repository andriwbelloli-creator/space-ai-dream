import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  CreditCard,
  Coins,
  CalendarClock,
  Activity,
  AlertCircle,
  Settings,
  ArrowRight,
  Info,
} from "lucide-react";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { Button } from "@/components/ui/button";
import { getAccountSummary, type AccountSummary } from "@/lib/account.functions";

export const Route = createFileRoute("/_authenticated/minha-conta")({
  head: () => ({
    meta: [
      { title: "Minha assinatura | Ideal Space" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MinhaContaPage,
});

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  premium: "Premium",
  pro: "Pro",
  admin: "Administrador",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Ativa",
  canceled: "Cancelada",
  past_due: "Em atraso",
  trialing: "Trial",
  incomplete: "Incompleta",
  incomplete_expired: "Expirada",
  unpaid: "Não paga",
};

function planLabel(plan: string): string {
  return PLAN_LABELS[plan] ?? plan;
}

function statusLabel(status: string | undefined): string {
  if (!status) return "Sem assinatura ativa";
  return STATUS_LABELS[status] ?? status;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

type PageState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; summary: AccountSummary };

function InfoCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent/15 text-accent">
          {icon}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="mt-3 text-xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function MinhaContaPage() {
  const fetchSummary = useServerFn(getAccountSummary);
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const summary = await fetchSummary({});
      setState({ status: "ready", summary });
    } catch {
      setState({
        status: "error",
        message: "Não foi possível carregar os dados da sua conta.",
      });
    }
  }, [fetchSummary]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link to="/" aria-label="Ideal Space, início">
            <IdealSpaceLogo />
          </Link>
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 md:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Minha assinatura</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plano atual, créditos e status da sua assinatura.
          </p>
        </div>

        {state.status === "loading" && (
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </div>
        )}

        {state.status === "error" && (
          <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 text-destructive shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{state.message}</p>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="mt-3 inline-flex h-9 items-center rounded-full bg-foreground px-4 text-xs font-medium text-background hover:bg-foreground/90 transition"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {state.status === "ready" && (
          <>
            {/* Cards */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoCard
                icon={<CreditCard className="h-4 w-4" />}
                label="Plano atual"
                value={planLabel(state.summary.plan)}
                sub={state.summary.unlimited ? "Acesso interno (admin)" : undefined}
              />
              <InfoCard
                icon={<Coins className="h-4 w-4" />}
                label="Créditos disponíveis"
                value={
                  state.summary.unlimited
                    ? "Ilimitado"
                    : state.summary.balance.toLocaleString("pt-BR")
                }
              />
              <InfoCard
                icon={<Activity className="h-4 w-4" />}
                label="Status da assinatura"
                value={statusLabel(state.summary.subscription?.status)}
                sub={
                  state.summary.subscription?.cancelAtPeriodEnd
                    ? "Cancela ao fim do período"
                    : undefined
                }
              />
              <InfoCard
                icon={<CalendarClock className="h-4 w-4" />}
                label="Próxima renovação"
                value={formatDate(
                  state.summary.subscription?.currentPeriodEnd ?? state.summary.renewsAt,
                )}
              />
            </div>

            {/* Estado quando sem assinatura ativa */}
            {!state.summary.subscription && !state.summary.unlimited && (
              <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                  <CreditCard className="h-5 w-5" />
                </div>
                <p className="mt-4 text-base font-semibold">Você ainda não tem assinatura ativa</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Continue usando os créditos grátis ou veja os planos pagos.
                </p>
                <Button asChild className="mt-5 h-11 rounded-full px-6">
                  <Link to="/pricing">
                    Ver planos <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            )}

            {/* CTAs principais quando há assinatura */}
            {(state.summary.subscription || state.summary.unlimited) && (
              <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight">Gerenciar assinatura</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {state.summary.portalAvailable
                        ? "Atualize plano, cartão ou veja faturas no portal seguro do Stripe."
                        : "Quando o portal de assinatura estiver disponível, você poderá atualizar plano, cartão e consultar faturas com segurança."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center shrink-0">
                    <Button
                      disabled={!state.summary.portalAvailable}
                      className="h-11 rounded-full px-5"
                      type="button"
                    >
                      <Settings className="h-4 w-4 mr-1.5" /> Gerenciar assinatura
                    </Button>
                    <Button asChild variant="outline" className="h-11 rounded-full px-5">
                      <Link to="/pricing">Ver planos</Link>
                    </Button>
                  </div>
                </div>

                {!state.summary.portalAvailable && (
                  <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                      Gerenciamento de assinatura ainda não configurado neste deploy. Entre em
                      contato pelo suporte se precisar alterar ou cancelar.
                    </span>
                  </div>
                )}
              </div>
            )}

            <p className="mt-8 text-xs text-muted-foreground">
              Dados sensíveis (cartão, dados fiscais) não são armazenados no Ideal Space.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
