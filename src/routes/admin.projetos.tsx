import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  FolderOpen,
  Globe,
  CalendarClock,
  Palette,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  ImageIcon,
} from "lucide-react";
import { getAdminProjects, type AdminProjects } from "@/lib/admin";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBlock } from "@/components/admin/StatusBlock";
import { RankedList } from "@/components/admin/RankedList";
import { formatDateOnly } from "@/components/admin/formatters";
import { styleLabel } from "@/lib/style-labels";

export const Route = createFileRoute("/admin/projetos")({
  head: () => ({
    meta: [
      { title: "Projetos | Admin Ideal Space" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminProjectsPage,
});

type PageState =
  | { status: "loading" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | { status: "ready"; projects: AdminProjects };

const ROOM_LABELS: Record<string, string> = {
  sala: "Sala",
  quarto: "Quarto",
  cozinha: "Cozinha",
  "home-office": "Home office",
  banheiro: "Banheiro",
  outro: "Outro",
};

function roomLabel(slug: string | null): string {
  if (!slug) return "—";
  return ROOM_LABELS[slug] ?? slug;
}

function AdminProjectsPage() {
  const fetchProjects = useServerFn(getAdminProjects);
  const [state, setState] = useState<PageState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetchProjects({});
      if (!res.ok) {
        setState(
          res.reason === "forbidden"
            ? { status: "forbidden" }
            : { status: "error", message: res.message ?? "Falha ao carregar os projetos." },
        );
        return;
      }
      setState({ status: "ready", projects: res.projects });
    } catch {
      setState({ status: "error", message: "Não foi possível carregar os projetos." });
    }
  }, [fetchProjects]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projetos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Todos os projetos gerados pela plataforma. Somente leitura.
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

      {state.status === "ready" && state.projects.total === 0 && (
        <StatusBlock
          icon={<FolderOpen className="h-5 w-5" />}
          tone="muted"
          title="Sem projetos ainda"
          text="Quando os usuários começarem a gerar ambientes, eles aparecerão aqui."
        />
      )}

      {state.status === "ready" && state.projects.total > 0 && (
        <>
          {/* KPIs */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<FolderOpen className="h-4 w-4" />}
              label="Total"
              value={state.projects.total}
            />
            <StatCard
              icon={<Globe className="h-4 w-4" />}
              label="Públicos"
              value={state.projects.totalPublic}
              sub={`${
                state.projects.total > 0
                  ? Math.round((state.projects.totalPublic / state.projects.total) * 100)
                  : 0
              }% do total`}
            />
            <StatCard
              icon={<CalendarClock className="h-4 w-4" />}
              label="Últimos 7 dias"
              value={state.projects.totalLast7}
            />
            <StatCard
              icon={<Palette className="h-4 w-4" />}
              label="Estilos únicos"
              value={state.projects.uniqueStyles}
            />
          </div>

          {/* Breakdowns */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="text-base font-semibold tracking-tight">Por estilo</h2>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <RankedList items={state.projects.topStyles} empty="Sem estilo registrado ainda." />
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold tracking-tight">Por ambiente</h2>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <RankedList items={state.projects.topRooms} empty="Sem ambiente detectado ainda." />
              </div>
            </section>
          </div>

          {/* Tabela dos 30 mais recentes */}
          <section className="mt-8">
            <h2 className="text-base font-semibold tracking-tight">Mais recentes</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Últimos 30 projetos. Imagens vinculadas ao Supabase Storage.
            </p>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2.5 font-medium w-16">Imagem</th>
                    <th className="px-3 py-2.5 font-medium">Estilo</th>
                    <th className="px-3 py-2.5 font-medium">Ambiente</th>
                    <th className="px-3 py-2.5 font-medium">Visibilidade</th>
                    <th className="px-3 py-2.5 font-medium">Criado</th>
                  </tr>
                </thead>
                <tbody>
                  {state.projects.recent.map((p) => (
                    <tr key={p.id} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-2.5">
                        <div className="h-10 w-12 overflow-hidden rounded-md bg-muted relative">
                          {p.afterUrl ? (
                            <img
                              src={p.afterUrl}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <ImageIcon className="absolute inset-0 m-auto h-4 w-4 text-muted-foreground/50" />
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-medium">{styleLabel(p.styleSlug, "—")}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{roomLabel(p.roomType)}</td>
                      <td className="px-3 py-2.5">
                        {p.isPublic ? (
                          <Link
                            to="/p/$projectId"
                            params={{ projectId: p.id }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                          >
                            <Globe className="h-3 w-3" /> Público
                          </Link>
                        ) : (
                          <span className="text-xs text-muted-foreground">Privado</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                        {formatDateOnly(p.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="mt-6 text-xs text-muted-foreground">
            Tabela com até {state.projects.recent.length} projeto(s) mais recentes. Identificadores
            de usuário não exibidos.
          </p>
        </>
      )}
    </div>
  );
}
