/**
 * /objetos — Catálogo editorial de objetos decorativos.
 * Header magazine + bento dinâmico (curadoria em tamanhos variados)
 * espelhando o ritmo de EditorialCollections ("Inspiração curada").
 */
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X, ArrowDownAZ, ArrowUpAZ, ListFilter } from "lucide-react";
import { PremiumOverlayCard } from "@/components/ui/premium-cards";
import { SEO_OBJETOS, type ObjetoSlug } from "@/lib/seo-objetos-data";

const TITLE = "Objetos decorativos curados | Ideal Space";
const DESCRIPTION =
  "Catálogo editorial de objetos decorativos: vasos, luminárias, espelhos, quadros, têxteis, plantas, esculturas e mesas de apoio. Curadoria por categoria para inspirar composições reais.";

/**
 * Bento dinâmico — 12 colunas. Cada slug define seu span e o aspect
 * da imagem. Total de larguras por linha soma 12 no desktop.
 *   Linha 1: vasos(7,tall) + luminarias(5,portrait)
 *   Linha 2: espelhos(5,portrait) + quadros(7,wide)
 *   Linha 3: texteis(4,tall) + plantas(4,tall) + esculturas(4,tall)
 *   Linha 4: mesas-apoio(12,wide) — banner editorial
 */
const LAYOUT: Record<
  ObjetoSlug,
  { span: string; aspect: "tall" | "portrait" | "wide"; size?: "sm" | "md" | "lg" }
> = {
  vasos:         { span: "lg:col-span-7", aspect: "tall",     size: "lg" },
  luminarias:    { span: "lg:col-span-5", aspect: "portrait", size: "md" },
  espelhos:      { span: "lg:col-span-5", aspect: "portrait", size: "md" },
  quadros:       { span: "lg:col-span-7", aspect: "wide",     size: "lg" },
  texteis:       { span: "lg:col-span-4", aspect: "tall",     size: "sm" },
  plantas:       { span: "lg:col-span-4", aspect: "tall",     size: "sm" },
  esculturas:    { span: "lg:col-span-4", aspect: "tall",     size: "sm" },
  "mesas-apoio": { span: "lg:col-span-12", aspect: "wide",    size: "lg" },
};

export const Route = createFileRoute("/objetos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://idealspace.com.br/objetos" }],
  }),
  component: ObjetosPage,
});

function ObjetosPage() {
  const categories = useMemo(
    () => Array.from(new Set(SEO_OBJETOS.map((o) => o.kicker))).sort(),
    [],
  );
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<"curated" | "az" | "za">("curated");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = SEO_OBJETOS.filter((o) => {
      const matchesQ =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.kicker.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q);
      const matchesCat = activeCats.size === 0 || activeCats.has(o.kicker);
      return matchesQ && matchesCat;
    });
    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (sort === "za") list = [...list].sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));
    return list;
  }, [query, activeCats, sort]);

  const toggleCat = (c: string) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const clearAll = () => {
    setQuery("");
    setActiveCats(new Set());
    setSort("curated");
  };

  const hasFilters = query !== "" || activeCats.size > 0 || sort !== "curated";

  return (
    <main className="bg-background">
      <section
        aria-labelledby="objetos-heading"
        className="py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Cabeçalho de catálogo: título compacto + busca, ordenação e filtros */}
          <header className="mb-8 sm:mb-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="is-kicker">Objetos decorativos</span>
                <h1
                  id="objetos-heading"
                  className="mt-2 font-serif text-2xl leading-tight tracking-tight text-foreground sm:text-3xl"
                >
                  Catálogo
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                {filtered.length} de {SEO_OBJETOS.length}{" "}
                {filtered.length === 1 ? "categoria" : "categorias"}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-3 sm:flex-row sm:items-center sm:gap-2 sm:p-2">
              {/* Busca */}
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nome, categoria ou descrição"
                  aria-label="Buscar objetos"
                  className="h-10 w-full rounded-md border border-border/60 bg-background pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-[color:var(--gold-soft)] focus:ring-2 focus:ring-[color:var(--gold-soft)]/30"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Limpar busca"
                    className="absolute right-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-soft)]/40"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Ordenação */}
              <label className="sr-only" htmlFor="objetos-sort">
                Ordenar
              </label>
              <div className="relative">
                <select
                  id="objetos-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="h-10 w-full appearance-none rounded-md border border-border/60 bg-background pl-9 pr-8 text-sm text-foreground outline-none transition focus:border-[color:var(--gold-soft)] focus:ring-2 focus:ring-[color:var(--gold-soft)]/30 sm:w-44"
                >
                  <option value="curated">Curadoria</option>
                  <option value="az">Nome A–Z</option>
                  <option value="za">Nome Z–A</option>
                </select>
                {sort === "za" ? (
                  <ArrowUpAZ className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                ) : (
                  <ArrowDownAZ className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Filtros por categoria */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                <ListFilter aria-hidden="true" className="size-3.5" />
                Filtros
              </span>
              {categories.map((c) => {
                const active = activeCats.has(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCat(c)}
                    aria-pressed={active}
                    className={`inline-flex h-8 items-center rounded-full border px-3 text-xs transition focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-soft)]/40 ${
                      active
                        ? "border-[color:var(--gold-soft)] bg-[color:var(--gold-soft)]/15 text-foreground"
                        : "border-border/60 bg-background text-muted-foreground hover:border-[color:var(--gold-soft)]/60 hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs text-muted-foreground transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-soft)]/40"
                >
                  <X className="size-3.5" /> Limpar
                </button>
              )}
            </div>
          </header>

          {/* Bento dinâmico — tamanhos variados (lg:12-col). */}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
              <p className="font-serif text-xl text-foreground">Nada por aqui</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tente outra busca ou remova os filtros aplicados.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 inline-flex h-9 items-center rounded-full border border-[color:var(--gold-soft)]/60 px-4 text-xs text-foreground transition hover:bg-[color:var(--gold-soft)]/10 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-soft)]/40"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12">
            {filtered.map((obj) => {
              const l = LAYOUT[obj.slug];
              return (
                <div key={obj.slug} className={l.span}>
                  <PremiumOverlayCard
                    src={obj.src}
                    alt={obj.alt}
                    kicker={obj.kicker}
                    title={obj.name}
                    description={obj.description}
                    aspect={l.aspect}
                    size={l.size}
                    to={obj.to}
                    ctaLabel="Ver em ambiente"
                  />
                </div>
              );
            })}
          </div>
          )}
        </div>
      </section>
    </main>
  );
}