/**
 * /objetos — Catálogo editorial de objetos decorativos.
 * Header magazine + bento dinâmico (curadoria em tamanhos variados)
 * espelhando o ritmo de EditorialCollections ("Inspiração curada").
 */
import { createFileRoute } from "@tanstack/react-router";
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
  return (
    <main className="bg-background">
      <section
        aria-labelledby="objetos-heading"
        className="py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="is-kicker">Objetos decorativos</span>
              <h1
                id="objetos-heading"
                className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
              >
                Catálogo de{" "}
                <span className="italic text-[color:var(--gold-soft)]">objetos</span>{" "}
                curados.
              </h1>
              <span
                aria-hidden="true"
                className="mt-5 block h-px w-16 bg-[color:var(--gold-soft)]/60"
              />
            </div>
            <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
              Oito categorias editoriais para compor ambientes com presença. Cada
              objeto leva a um estilo ou ambiente onde ele entra com naturalidade.
            </p>
          </div>

          {/* Bento dinâmico — tamanhos variados (lg:12-col). */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12">
            {SEO_OBJETOS.map((obj) => {
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
        </div>
      </section>
    </main>
  );
}