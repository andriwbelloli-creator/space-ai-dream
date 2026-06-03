/**
 * /objetos — Catálogo editorial de objetos decorativos.
 * Header magazine (kicker + h2 com keyword italic bronze + hairline divider)
 * + grid 4x2 de PremiumOverlayCard espelhando o padrão de /ambientes.
 */
import { createFileRoute } from "@tanstack/react-router";
import { PremiumOverlayCard } from "@/components/ui/premium-cards";
import { SEO_OBJETOS } from "@/lib/seo-objetos-data";

const TITLE = "Objetos decorativos curados | Ideal Space";
const DESCRIPTION =
  "Catálogo editorial de objetos decorativos: vasos, luminárias, espelhos, quadros, têxteis, plantas, esculturas e mesas de apoio. Curadoria por categoria para inspirar composições reais.";

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

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {SEO_OBJETOS.map((obj) => (
              <PremiumOverlayCard
                key={obj.slug}
                src={obj.src}
                alt={obj.alt}
                kicker={obj.kicker}
                title={obj.name}
                description={obj.description}
                aspect="portrait"
                size="sm"
                to={obj.to}
                ctaLabel="Ver em ambiente"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}