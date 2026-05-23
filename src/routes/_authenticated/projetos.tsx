import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { Loader2, ImageIcon, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BeforeAfter } from "@/components/BeforeAfter";
import { getShoppingFallback, estimateTotal } from "@/lib/shopping";
import { logEvent } from "@/lib/tracking.functions";

/**
 * Snapshot do que o detalhe do projeto precisa exibir. `ai_response` traz
 * { roomType, variant, style } persistido na geracao (ver transform.functions);
 * usado pra escolher o fallback de lista de produtos coerente com o comodo.
 * Mantemos tipagem leve aqui — schema completo vive em supabase/types.
 */
type ProjectAiResponse = {
  roomType?: string;
  variant?: string | null;
  style?: string;
};

type ProjectRow = {
  id: string;
  title: string | null;
  style_slug: string | null;
  before_url: string | null;
  after_url: string | null;
  created_at: string;
  ai_response: ProjectAiResponse | null;
};

/** Rótulos legíveis para os slugs persistidos em projects.style_slug. */
const STYLE_LABELS: Record<string, string> = {
  japandi: "Japandi",
  modern: "Contemporâneo",
  contemporaneo: "Contemporâneo",
  minimal: "Minimalista",
  minimalista: "Minimalista",
  natural: "Natural",
  industrial: "Industrial",
  luxe: "Luxo discreto",
  escandinavo: "Escandinavo",
};

/** Converte o slug de estilo num rótulo legível; capitaliza se desconhecido. */
function styleLabel(slug: string): string {
  return STYLE_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

export const Route = createFileRoute("/_authenticated/projetos")({
  head: () => ({
    meta: [{ title: "Meus projetos | Ideal Space" }],
  }),
  component: ProjetosPage,
});

function ProjetosPage() {
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Projeto selecionado para abrir no modal de detalhe. `null` = modal fechado.
  const [selected, setSelected] = useState<ProjectRow | null>(null);
  const track = useServerFn(logEvent);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, style_slug, before_url, after_url, created_at, ai_response")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        console.error("listar projetos falhou", error);
        setError("Não foi possível carregar seus projetos.");
        setProjects([]);
        return;
      }
      setProjects((data ?? []) as ProjectRow[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
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

      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Meus projetos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Os ambientes que você gerou com IA ficam salvos aqui.
            </p>
          </div>
          <Link
            to="/"
            search={{ upload: "1" }}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            + Novo projeto
          </Link>
        </div>

        {projects === null ? (
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-sm text-muted-foreground">{error}</div>
        ) : projects.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <ImageIcon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-foreground">
              Você ainda não tem projetos.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gere seu primeiro ambiente na página inicial.
            </p>
            <Link
              to="/"
              search={{ upload: "1" }}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Criar meu primeiro ambiente
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelected(p);
                  // Funil pos-geracao: usuario voltou em /projetos e reabriu
                  // o detalhe de um projeto antigo. Fire-and-forget.
                  void track({
                    data: {
                      event: "project_detail_opened",
                      props: { projectId: p.id, style: p.style_slug ?? "" },
                    },
                  }).catch(() => {});
                }}
                aria-label={`Ver detalhes do ${p.title ?? "projeto"}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {p.after_url && (
                    <img
                      src={p.after_url}
                      alt={p.title ?? "Projeto"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  {p.before_url && (
                    <img
                      src={p.before_url}
                      alt="Antes da transformação"
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  {p.before_url && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground backdrop-blur">
                      Antes / Depois
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="truncate text-sm font-medium text-foreground">
                    {p.title ?? "Projeto"}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    {p.style_slug && (
                      <>
                        <span className="text-foreground">{styleLabel(p.style_slug)}</span>
                        <span aria-hidden>·</span>
                      </>
                    )}
                    <span>{new Date(p.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <ProjectDetailDialog project={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}

/**
 * Modal de detalhe do projeto — abre ao clicar num card de `/projetos`.
 * Reusa BeforeAfter (slider antes/depois) e a lista fallback estatica de
 * compras coerente com o cômodo (via ai_response.roomType). Nao chama a IA
 * de novo nem gasta créditos.
 *
 * Drafts interrompidos vivem em localStorage do UploadPhotoModal — nao
 * passam por aqui. Esse modal só lida com `projects` (Supabase).
 */
function ProjectDetailDialog({
  project,
  onOpenChange,
}: {
  project: ProjectRow | null;
  onOpenChange: (open: boolean) => void;
}) {
  // Mantém o `project` durante a animação de fechamento — evita "flash" vazio.
  const open = !!project;
  const items = getShoppingFallback(project?.ai_response?.roomType);
  const total = estimateTotal(items);
  const dateLabel = project ? new Date(project.created_at).toLocaleDateString("pt-BR") : "";
  const styleName = project?.style_slug != null ? styleLabel(project.style_slug) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-3xl rounded-3xl p-0 overflow-hidden border-0 shadow-2xl max-h-[92vh] overflow-y-auto">
        <DialogTitle className="sr-only">Detalhes do Projeto</DialogTitle>
        {/* sr-only description cobre o warning de a11y do Radix Dialog */}
        <DialogDescription className="sr-only">
          Detalhe do projeto com antes/depois e lista sugerida de produtos.
        </DialogDescription>

        {/* Botão fechar customizado (canto superior direito) */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur hover:bg-background transition"
        >
          <X className="h-4 w-4" />
        </button>

        {project && (
          <>
            {/* Header */}
            <div className="px-5 pt-6 pb-3 sm:px-7">
              <div className="text-lg sm:text-xl font-semibold tracking-tight pr-10 text-foreground">
                {project.title ?? "Projeto"}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                {styleName && (
                  <>
                    <span className="text-foreground">{styleName}</span>
                    <span aria-hidden>·</span>
                  </>
                )}
                <span>{dateLabel}</span>
              </div>
            </div>

            {/* Antes / Depois */}
            <div className="px-5 sm:px-7">
              {project.before_url && project.after_url ? (
                <BeforeAfter
                  before={project.before_url}
                  after={project.after_url}
                  alt={project.title ?? "Antes e depois"}
                  className="aspect-[4/3] w-full"
                />
              ) : project.after_url ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
                  <img
                    src={project.after_url}
                    alt={project.title ?? "Projeto"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full rounded-3xl bg-muted grid place-items-center text-sm text-muted-foreground">
                  Sem imagem disponível
                </div>
              )}
            </div>

            {/* Lista de compras (fallback estatico coerente com o ambiente) */}
            <div className="px-5 sm:px-7 pt-6 pb-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-medium text-foreground">Sugestões para o ambiente</h3>
                <span className="text-xs text-muted-foreground">{items.length} itens</span>
              </div>
              <div className="mt-3 rounded-xl bg-muted/60 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Estimativa total
                </div>
                <div className="text-base font-medium text-foreground">{total}</div>
              </div>
              <ul className="mt-3 divide-y divide-border/60">
                {items.map((it) => (
                  <li key={it.name} className="py-2.5 flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-flex h-5 items-center rounded-full px-2 text-[10px] uppercase tracking-wider ${
                        it.tag === "Essencial"
                          ? "bg-accent/15 text-accent"
                          : it.tag === "Recomendado"
                            ? "bg-foreground/10 text-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {it.tag}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground truncate">{it.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {it.cat} · {it.price}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[10px] text-muted-foreground">
                Lista sugerida com base no cômodo. Para uma seleção curada com links de compra, gere
                um novo projeto pela página inicial.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
