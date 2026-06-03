/**
 * ObjetosTeaser — teaser editorial dos objetos decorativos na home.
 * Mostra 4 categorias em bento compacto (1 grande + 3 menores) reaproveitando
 * SEO_OBJETOS, com CTA pro catálogo completo em /objetos.
 */
import { Link } from "@tanstack/react-router";
import { PremiumOverlayCard } from "@/components/ui/premium-cards";
import { SEO_OBJETOS } from "@/lib/seo-objetos-data";

// Pega 4 categorias hero: vasos (feature), luminárias, esculturas, têxteis.
const PICK_SLUGS = ["vasos", "luminarias", "esculturas", "texteis"] as const;
const PICKED = PICK_SLUGS.map((s) => SEO_OBJETOS.find((o) => o.slug === s)!);

export function ObjetosTeaser() {
  const [feature, ...rest] = PICKED;
  return (
    <section
      className="bg-background py-16 sm:py-24"
      aria-labelledby="objetos-teaser-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker">Objetos decorativos</span>
            <h2
              id="objetos-teaser-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Curadoria de{" "}
              <span className="italic text-[color:var(--gold-soft)]">
                objetos
              </span>{" "}
              que dão presença.
            </h2>
            <span
              aria-hidden="true"
              className="mt-5 block h-px w-16 bg-[color:var(--gold-soft)]/60"
            />
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Oito categorias editoriais, do vaso de cerâmica à mesa de apoio em
            travertino. Cada peça leva ao estilo onde entra com naturalidade.
          </p>
        </div>

        {/* Bento compacto: 1 feature (col-7, tall) + 3 menores (col-5 em coluna). */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <PremiumOverlayCard
              src={feature.src}
              alt={feature.alt}
              kicker={feature.kicker}
              title={feature.name}
              description={feature.description}
              aspect="tall"
              size="lg"
              to={feature.to}
              ctaLabel="Ver em ambiente"
            />
          </div>
          <div className="grid gap-5 sm:gap-6 lg:col-span-5">
            <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2">
              {rest.slice(0, 2).map((o) => (
                <PremiumOverlayCard
                  key={o.slug}
                  src={o.src}
                  alt={o.alt}
                  kicker={o.kicker}
                  title={o.name}
                  description={o.description}
                  aspect="portrait"
                  size="sm"
                  to={o.to}
                  ctaLabel="Ver"
                />
              ))}
            </div>
            <PremiumOverlayCard
              src={rest[2].src}
              alt={rest[2].alt}
              kicker={rest[2].kicker}
              title={rest[2].name}
              description={rest[2].description}
              aspect="wide"
              size="md"
              to={rest[2].to}
              ctaLabel="Ver"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            to="/objetos"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Ver catálogo completo
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}