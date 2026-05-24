/**
 * Grade dos 5 estilos curados adicionados na R2 — vai na home logo após o
 * carrossel oficial de estilos. Não substitui nem altera o StylesCarousel
 * existente (regra de memória sobre carrossel da landing).
 *
 * Cards: PremiumVerticalCard da biblioteca premium-cards. Aspect tall
 * (4/5) pra dar peso visual. Grid 1 col mobile → 2 sm → 5 lg (ou 3+2
 * via empty cell pra balanço editorial em telas grandes).
 */
import { PremiumVerticalCard } from "@/components/ui/premium-cards";

import decoratedBedroom from "@/assets/decorated-bedroom.jpg";
import decoratedLivingWarm from "@/assets/decorated-living-warm.jpg";
import decoratedKitchen from "@/assets/decorated-kitchen.jpg";
import decoratedBathroomSuite from "@/assets/decorated-bathroom-suite.jpg";
import decoratedDining from "@/assets/decorated-dining.jpg";

type StyleItem = {
  slug: string;
  name: string;
  description: string;
  src: string;
  alt: string;
  tags?: ReadonlyArray<{ label: string; tone?: "neutral" | "gold" | "accent" }>;
};

const STYLES: ReadonlyArray<StyleItem> = [
  {
    slug: "boho-chic",
    name: "Boho chic",
    description: "Camadas naturais, plantas e tons quentes com curadoria atenta.",
    src: decoratedBedroom,
    alt: "Ambiente em estilo boho chic com texturas naturais",
    tags: [{ label: "Acolhedor", tone: "gold" }],
  },
  {
    slug: "mid-century",
    name: "Mid-century modern",
    description: "Linhas limpas, madeira morna e elegância atemporal em peças ícones.",
    src: decoratedLivingWarm,
    alt: "Sala em estilo mid-century modern com madeira morna",
    tags: [{ label: "Atemporal", tone: "gold" }],
  },
  {
    slug: "mediterraneo",
    name: "Mediterrâneo",
    description: "Paleta clara, cerâmica artesanal e luz natural como protagonista.",
    src: decoratedKitchen,
    alt: "Cozinha em estilo mediterrâneo com paleta clara",
    tags: [{ label: "Luminoso", tone: "gold" }],
  },
  {
    slug: "art-deco",
    name: "Art déco",
    description: "Geometria sofisticada e materiais nobres com glamour controlado.",
    src: decoratedBathroomSuite,
    alt: "Lavabo em estilo art déco com materiais nobres",
    tags: [{ label: "Escultural", tone: "gold" }],
  },
  {
    slug: "maximalista",
    name: "Maximalista elegante",
    description: "Camadas ricas de cor, padrão e arte costuradas por curadoria.",
    src: decoratedDining,
    alt: "Sala de jantar em estilo maximalista com camadas ricas",
    tags: [{ label: "Autoral", tone: "gold" }],
  },
] as const;

export function MoreStylesGrid() {
  return (
    <section
      id="mais-estilos"
      className="bg-card/40 border-y border-border/60 py-14 sm:py-20"
      aria-labelledby="mais-estilos-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker">Mais estilos para explorar</span>
            <h2
              id="mais-estilos-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl"
            >
              Cinco direções <span className="italic">novas</span> de inspiração.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Estilos com pontos de vista próprios, do acolhedor ao escultural. Cada um abre uma
            página com FAQ, benefícios e lista de compras de referência.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-5">
          {STYLES.map((style) => (
            <PremiumVerticalCard
              key={style.slug}
              src={style.src}
              alt={style.alt}
              kicker="Estilo"
              title={style.name}
              description={style.description}
              tags={style.tags ? [...style.tags] : undefined}
              aspect="tall"
              to={`/estilos/${style.slug}`}
              ctaLabel="Ver estilo"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
