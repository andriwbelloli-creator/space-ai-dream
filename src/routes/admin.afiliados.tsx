import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  MousePointerClick,
  CalendarClock,
  Heart,
  ShoppingBag,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { getAdminAffiliates, type AdminAffiliates } from "@/lib/admin";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBlock } from "@/components/admin/StatusBlock";
import { formatDate } from "@/components/admin/formatters";

export const Route = createFileRoute("/admin/afiliados")({
  head: () => ({
    meta: [
      { title: "Afiliados | Admin Ideal Space" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminAffiliatesPage,
});

type PageState =
  | { status: "loading" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | { status: "ready"; affiliates: AdminAffiliates };

function formatPrice(cents: number | null): string {
  if (cents === null) return "—";
  return `R$ ${(cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function AdminAffiliatesPage() {
  const fetchAffiliates = useServerFn(getAdminAffiliates);
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetchAffiliates({});
      if (!res.ok) {
        setState(
          res.reason === "forbidden"
            ? { status: "forbidden" }
            : { status: "error", message: res.message ?? "Falha ao carregar os afiliados." },
        );
        return;
      }
      setState({ status: "ready", affiliates: res.affiliates });
    } catch {
      setState({ status: "error", message: "Não foi possível carregar os afiliados." });
    }
  }, [fetchAffiliates]);

  useEffect(() => {
    void load();
  }, [load]);

  const isEmpty =
    state.status === "ready" &&
    state.affiliates.totalClicks === 0 &&
    state.affiliates.affiliateClickEvents7d === 0 &&
    state.affiliates.wishlistItems === 0;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Afiliados</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cliques em produtos, sinais de wishlist e tracking de eventos.
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

      {isEmpty && (
        <StatusBlock
          icon={<MousePointerClick className="h-5 w-5" />}
          tone="muted"
          title="Sem cliques afiliados registrados ainda"
          text="Quando os usuários começarem a clicar nos produtos sugeridos, aparecerá aqui."
        />
      )}

      {state.status === "ready" && !isEmpty && (
        <>
          {/* KPIs */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<MousePointerClick className="h-4 w-4" />}
              label="Cliques totais"
              value={state.affiliates.totalClicks}
              sub="product_clicks"
            />
            <StatCard
              icon={<CalendarClock className="h-4 w-4" />}
              label="Cliques (7 dias)"
              value={state.affiliates.clicks7d}
            />
            <StatCard
              icon={<ShoppingBag className="h-4 w-4" />}
              label="Eventos affiliate_click (7d)"
              value={state.affiliates.affiliateClickEvents7d}
              sub="Funil de tracking"
            />
            <StatCard
              icon={<Heart className="h-4 w-4" />}
              label="Itens em wishlist"
              value={state.affiliates.wishlistItems}
            />
          </div>

          {/* Top clicados + Top wishlisted */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="text-base font-semibold tracking-tight">Top produtos clicados</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Agregado da tabela product_clicks.
              </p>
              {state.affiliates.topClicked.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                  Sem cliques registrados em produtos com nome.
                </div>
              ) : (
                <div className="mt-3 rounded-2xl border border-border bg-card overflow-hidden">
                  <ol className="divide-y divide-border/60">
                    {state.affiliates.topClicked.map((p, i) => (
                      <li key={p.name} className="px-4 py-2.5 flex items-center gap-3">
                        <span className="w-4 shrink-0 text-[11px] text-muted-foreground">
                          {i + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{p.name}</div>
                          {p.category && (
                            <div className="text-[11px] text-muted-foreground">{p.category}</div>
                          )}
                        </div>
                        <span className="shrink-0 text-xs font-semibold tabular-nums">
                          {p.count.toLocaleString("pt-BR")}
                        </span>
                        {p.lastUrl && (
                          <a
                            href={p.lastUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition"
                            aria-label="Abrir produto"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-base font-semibold tracking-tight">Top wishlisted</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Itens que mais voltam na wishlist dos usuários.
              </p>
              {state.affiliates.topWishlisted.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                  Wishlist ainda vazia.
                </div>
              ) : (
                <div className="mt-3 rounded-2xl border border-border bg-card overflow-hidden">
                  <ol className="divide-y divide-border/60">
                    {state.affiliates.topWishlisted.map((p, i) => (
                      <li key={p.name} className="px-4 py-2.5 flex items-center gap-3">
                        <span className="w-4 shrink-0 text-[11px] text-muted-foreground">
                          {i + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            Preço médio: {formatPrice(p.avgPriceCents)}
                          </div>
                        </div>
                        <span className="shrink-0 text-xs font-semibold tabular-nums">
                          {p.count.toLocaleString("pt-BR")}
                        </span>
                        {p.lastUrl && (
                          <a
                            href={p.lastUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition"
                            aria-label="Abrir produto"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>
          </div>

          {/* Cliques recentes */}
          <section className="mt-8">
            <h2 className="text-base font-semibold tracking-tight">Cliques recentes</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Últimos 30 registros em product_clicks.
            </p>
            {state.affiliates.recent.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                Sem cliques registrados.
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2.5 font-medium">Produto</th>
                      <th className="px-3 py-2.5 font-medium">Categoria</th>
                      <th className="px-3 py-2.5 font-medium">Quando</th>
                      <th className="px-3 py-2.5 font-medium w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.affiliates.recent.map((c) => (
                      <tr key={c.id} className="border-b border-border/60 last:border-0">
                        <td className="px-3 py-2.5 font-medium truncate max-w-[280px]">
                          {c.productName ?? "—"}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {c.productCategory ?? "—"}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                          {formatDate(c.clickedAt)}
                        </td>
                        <td className="px-3 py-2.5">
                          {c.productUrl && (
                            <a
                              href={c.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition"
                              aria-label="Abrir produto"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="mt-6 text-xs text-muted-foreground">
            Identificadores de usuário omitidos. Apenas dados de produto.
          </p>
        </>
      )}
    </div>
  );
}
