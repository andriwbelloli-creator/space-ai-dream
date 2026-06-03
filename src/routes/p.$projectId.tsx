import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { Footer } from "@/components/Footer";
import { ShoppingEmptyState } from "@/components/ShoppingEmptyState";
import { Camera, ArrowRight, ShieldCheck, Sparkles, Copy } from "lucide-react";
import { getPublicProject, type PublicProjectSnapshot } from "@/lib/projects.functions";
import {
  getShoppingFallback,
  estimateTotal,
  sortByPriority,
  countByTag,
  groupByCategory,
  toClipboardText,
} from "@/lib/shopping";
import type { BudgetItem } from "@/lib/budget-pdf";
import { toast } from "sonner";
import { logEvent } from "@/lib/tracking.functions";
import { styleLabel } from "@/lib/style-labels";

const ROOM_LABELS: Record<string, string> = {
  sala: "Sala",
  quarto: "Quarto",
  cozinha: "Cozinha",
  "home-office": "Home office",
  banheiro: "Banheiro",
  outro: "Ambiente",
};

function roomLabel(slug: string | null): string {
  if (!slug) return "Ambiente";
  return ROOM_LABELS[slug] ?? slug;
}

export const Route = createFileRoute("/p/$projectId")({
  loader: async ({ params }) => {
    const project = await getPublicProject({ data: params.projectId });
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project as PublicProjectSnapshot | undefined;
    if (!project) {
      return {
        meta: [{ title: "Projeto | Ideal Space" }, { name: "robots", content: "noindex,follow" }],
      };
    }
    const style = styleLabel(project.styleSlug);
    const room = roomLabel(project.roomType);
    const title = `${room} em ${style} | Ideal Space`;
    const description = `Veja este ambiente decorado com IA: ${room} no estilo ${style}. Crie o seu agora no Ideal Space.`;
    const url = `https://idealspace.com.br/p/${project.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        // V1: noindex enquanto validamos qualidade media das paginas publicas.
        // Quando tivermos volume, revisitar pra abrir indexacao.
        { name: "robots", content: "noindex,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(project.afterUrl
          ? [
              { property: "og:image", content: project.afterUrl },
              { property: "og:image:alt", content: `${room} no estilo ${style}` },
              { name: "twitter:image", content: project.afterUrl },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PublicProjectPage,
  notFoundComponent: NotFound,
});

function PublicProjectPage() {
  const { project } = Route.useLoaderData();
  const track = useServerFn(logEvent);
  const navigate = useNavigate();

  // Dispara 1x quando a pagina monta. Util pra estimar virality e CTR.
  useEffect(() => {
    void track({
      data: { event: "public_project_viewed", props: { projectId: project.id } },
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = sortByPriority(getShoppingFallback(project.roomType ?? undefined));
  const total = estimateTotal(items);
  const style = styleLabel(project.styleSlug);
  const room = roomLabel(project.roomType);
  const dateLabel = new Date(project.createdAt).toLocaleDateString("pt-BR");
  const counts = countByTag(items);
  const [tagFilter, setTagFilter] = useState<BudgetItem["tag"] | "Todos">("Todos");
  const [grouped, setGrouped] = useState(false);
  const [copied, setCopied] = useState(false);
  const filtered: ReadonlyArray<BudgetItem> =
    tagFilter === "Todos" ? items : items.filter((it) => it.tag === tagFilter);
  const filteredTotal = estimateTotal(filtered);
  const projectName = project.title ?? `${room} no estilo ${style}`;
  const tagChips: ReadonlyArray<BudgetItem["tag"] | "Todos"> = [
    "Todos",
    "Essencial",
    "Recomendado",
    "Opcional",
  ];

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(toClipboardText(items, projectName));
      setCopied(true);
      toast.success("Lista copiada");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const goCreate = () => {
    void track({
      data: { event: "public_project_cta_click", props: { projectId: project.id } },
    }).catch(() => {});
    void navigate({ to: "/", search: { upload: "1" } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 h-16">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <IdealSpaceLogo />
          </Link>
          <Button
            onClick={goCreate}
            className="h-10 rounded-full px-5 text-sm bg-foreground text-background hover:bg-foreground/90"
          >
            <Camera className="h-4 w-4 mr-1.5" /> Criar o meu
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Projeto compartilhado
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] font-semibold leading-[1.05]">
            {project.title ?? `${room} no estilo ${style}`}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {room} no estilo <span className="text-foreground font-medium">{style}</span>. Gerado em{" "}
            {dateLabel}.
          </p>
        </div>

        <div className="mt-10 relative aspect-[5/4] w-full overflow-hidden rounded-3xl border bg-card shadow-xl shadow-black/5">
          {project.afterUrl ? (
            <img
              src={project.afterUrl}
              alt={`${room} no estilo ${style}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
              Imagem indisponível
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground max-w-xl mx-auto">
          A foto original do ambiente não é exibida nesta página. Veja apenas o resultado gerado
          pela IA.
        </p>

        <section className="mt-12 sm:mt-16 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <div>
            <h2 className="text-xl sm:text-2xl tracking-[-0.01em] font-semibold">
              Sugestões para o ambiente
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Lista padrão por cômodo, com faixas de preço estimadas em reais. Ponto de partida para
              o seu projeto.
            </p>

            <div className="mt-5 rounded-2xl border bg-card/60 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {filtered.length} de {items.length} itens
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {tagFilter === "Todos" ? total : filteredTotal}
                  </span>
                  <button
                    type="button"
                    onClick={onCopy}
                    className="inline-flex items-center gap-1 rounded-full bg-muted hover:bg-muted/80 px-2.5 py-1 text-[11px] font-medium text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Copy className="h-3 w-3" /> {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1 flex-wrap" role="tablist" aria-label="Filtrar por prioridade">
                  {tagChips.map((t) => {
                    const active = tagFilter === t;
                    const n = t === "Todos" ? items.length : counts[t];
                    return (
                      <button
                        key={t}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setTagFilter(t)}
                        disabled={n === 0}
                        className={`text-[10px] font-medium uppercase tracking-wider rounded-full px-2.5 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-40 ${
                          active
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        {t} <span className="opacity-70">· {n}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setGrouped((v) => !v)}
                  className="text-[10px] text-muted-foreground hover:text-foreground rounded-full px-2 py-1 transition"
                  aria-pressed={grouped}
                >
                  {grouped ? "Lista" : "Por categoria"}
                </button>
              </div>

              <ul className="mt-3 divide-y divide-border/60">
                {grouped
                  ? groupByCategory(filtered).flatMap((g, gi) => [
                      <li
                        key={`cat_${gi}_${g.cat}`}
                        className="pt-3 pb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                      >
                        {g.cat} · {g.items.length}
                      </li>,
                      ...g.items.map((it) => (
                        <li
                          key={`${g.cat}_${it.name}`}
                          className="py-2.5 flex items-start gap-3"
                        >
                          <span
                            className={`mt-0.5 inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${
                              it.tag === "Essencial"
                                ? "bg-accent text-accent-foreground"
                                : it.tag === "Recomendado"
                                  ? "bg-foreground/85 text-background"
                                  : "bg-muted text-foreground"
                            }`}
                          >
                            {it.tag}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-sm truncate ${it.tag === "Essencial" ? "font-semibold" : "font-medium"}`}
                            >
                              {it.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground">{it.cat}</div>
                          </div>
                          <span className="text-xs font-medium whitespace-nowrap">{it.price}</span>
                        </li>
                      )),
                    ])
                  : filtered.map((it) => (
                  <li key={it.name} className="py-2.5 flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${
                        it.tag === "Essencial"
                          ? "bg-accent text-accent-foreground"
                          : it.tag === "Recomendado"
                            ? "bg-foreground/85 text-background"
                            : "bg-muted text-foreground"
                      }`}
                    >
                      {it.tag}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-sm truncate ${it.tag === "Essencial" ? "font-semibold" : "font-medium"}`}
                      >
                        {it.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{it.cat}</div>
                    </div>
                    <span className="text-xs font-medium whitespace-nowrap">{it.price}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[10px] text-muted-foreground">
                Sugestões aproximadas pelo estilo do ambiente, sem garantia de produto idêntico.
                Para a lista personalizada do seu ambiente, gere um projeto.
              </p>
            </div>
          </div>

          <aside className="rounded-3xl border bg-foreground text-background p-6 sm:p-7 sticky top-6">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
              Seu ambiente em IA
            </div>
            <h3 className="mt-3 text-2xl sm:text-3xl tracking-[-0.02em] font-semibold leading-tight">
              Quer um{" "}
              <span className="font-serif italic font-normal text-accent">igual ao seu</span>?
            </h3>
            <p className="mt-3 text-sm text-background/75 leading-relaxed">
              Envie a foto do seu ambiente, escolha um estilo e veja a IA decorar em minutos. Lista
              de compras com produtos reais e orçamento estimado.
            </p>
            <ul className="mt-5 space-y-2 text-xs">
              {[
                "3 gerações grátis por mês",
                "Sem cartão no início",
                "Fotos privadas",
                "Resultado em poucos minutos",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-background/85">
                  <ShieldCheck className="h-3 w-3 text-accent" /> {b}
                </li>
              ))}
            </ul>
            <Button
              onClick={goCreate}
              className="mt-6 h-12 w-full rounded-full bg-accent text-accent-foreground hover:opacity-95 text-sm font-medium"
            >
              Criar meu projeto agora
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="mt-3 text-[10px] text-background/60 text-center">
              Leva menos de 1 minuto, sem cadastro pra ver a primeira ideia.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 h-16">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <IdealSpaceLogo />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <h1 className="text-3xl sm:text-4xl tracking-[-0.02em] font-semibold">
          Projeto não encontrado
        </h1>
        <p className="mt-4 text-muted-foreground">
          Este projeto pode ter sido removido ou ainda não está público. Que tal criar o seu agora?
        </p>
        <Link
          to="/"
          search={{ upload: "1" }}
          className="mt-8 inline-flex h-11 items-center rounded-full px-6 bg-accent text-accent-foreground hover:opacity-95 text-sm font-medium"
        >
          <Camera className="h-4 w-4 mr-2" /> Criar projeto com IA
        </Link>
      </main>
    </div>
  );
}
