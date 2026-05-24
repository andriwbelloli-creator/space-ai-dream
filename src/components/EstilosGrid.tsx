/**
 * Estilos de decoração — UMA seção consolidada na home com todos os 11
 * estilos que têm landing dedicada em /estilos/<slug>. Substitui o
 * StylesCarousel + MoreStylesGrid (eliminados pra evitar redundância).
 *
 * Layout: grid editorial com cards verticais aspect tall. Mobile 1 col,
 * sm 2 cols, md 3, lg 4. Cada card linka pra /estilos/<slug> (landing
 * com FAQ + benefits + lista de compras).
 *
 * Imagens reaproveitam assets style-*.jpg e fallbacks coerentes.
 */
import { PremiumVerticalCard } from "@/components/ui/premium-cards";

import styleJapandi from "@/assets/style-japandi.jpg";
import styleScandi from "@/assets/style-scandi.jpg";
import styleModern from "@/assets/style-modern.jpg";
import styleIndustrial from "@/assets/style-industrial.jpg";
import styleLuxo from "@/assets/style-luxo.jpg";
import styleNatural from "@/assets/style-natural.jpg";
import decoratedLiving from "@/assets/decorated-living.jpg";
import decoratedLivingWarm from "@/assets/decorated-living-warm.jpg";
import decoratedDining from "@/assets/decorated-dining.jpg";
import decoratedBathroomSuite from "@/assets/decorated-bathroom-suite.jpg";
import moodboardPro from "@/assets/moodboard-pro.jpg";

type StyleItem = {
  slug: string;
  name: string;
  description: string;
  src: string;
  alt: string;
};

const STYLES: ReadonlyArray<StyleItem> = [
  {
    slug: "japandi",
    name: "Japandi",
    description: "Madeira clara, linho e cerâmica. Calma japonesa com conforto escandinavo.",
    src: styleJapandi,
    alt: "Ambiente em estilo Japandi com paleta serena",
  },
  {
    slug: "contemporaneo",
    name: "Contemporâneo",
    description: "Linhas atuais, mistura de texturas, conforto e sofisticação no mesmo gesto.",
    src: styleModern,
    alt: "Ambiente em estilo contemporâneo com linhas atuais",
  },
  {
    slug: "minimalista",
    name: "Minimalista",
    description: "Menos peças, mais respiro. Paleta clara e composição essencial.",
    src: styleScandi,
    alt: "Ambiente em estilo minimalista com paleta clara",
  },
  {
    slug: "natural",
    name: "Natural",
    description: "Fibras, plantas e cerâmica artesanal. Aconchego com leveza.",
    src: styleNatural,
    alt: "Ambiente em estilo natural com fibras e plantas",
  },
  {
    slug: "industrial",
    name: "Industrial",
    description: "Tijolo aparente, metal e couro. Edge urbano sem perder calor.",
    src: styleIndustrial,
    alt: "Ambiente em estilo industrial com tijolo aparente",
  },
  {
    slug: "luxo",
    name: "Luxo discreto",
    description: "Materiais nobres, paleta restrita, acabamentos refinados.",
    src: styleLuxo,
    alt: "Ambiente em estilo luxo discreto com materiais nobres",
  },
  {
    slug: "boho-chic",
    name: "Boho chic",
    description: "Camadas naturais, plantas e tons quentes com curadoria atenta.",
    src: decoratedLivingWarm,
    alt: "Ambiente em estilo boho chic com camadas naturais",
  },
  {
    slug: "mid-century",
    name: "Mid-century modern",
    description: "Linhas limpas, madeira morna, elegância atemporal em peças ícones.",
    src: decoratedLiving,
    alt: "Ambiente em estilo mid-century modern com madeira morna",
  },
  {
    slug: "mediterraneo",
    name: "Mediterrâneo",
    description: "Paleta clara, cerâmica artesanal e luz natural como protagonista.",
    src: decoratedBathroomSuite,
    alt: "Ambiente em estilo mediterrâneo com paleta clara",
  },
  {
    slug: "art-deco",
    name: "Art déco",
    description: "Geometria sofisticada e materiais nobres com glamour controlado.",
    src: moodboardPro,
    alt: "Composição em estilo art déco com geometria sofisticada",
  },
  {
    slug: "maximalista",
    name: "Maximalista elegante",
    description: "Camadas ricas de cor, padrão e arte costuradas por curadoria.",
    src: decoratedDining,
    alt: "Ambiente maximalista com camadas ricas de cor",
  },
] as const;

export function EstilosGrid() {
  return (
    <section
      id="estilos"
      className="bg-card/40 border-y border-border/60 py-14 sm:py-20"
      aria-labelledby="estilos-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker">Estilos de decoração</span>
            <h2
              id="estilos-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Onze direções estéticas, do <span className="italic">Japandi</span> ao{" "}
              <span className="italic">Maximalismo</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Cada estilo abre uma página com FAQ, benefícios, exemplos e lista de compras de
            referência. A IA respeita a estrutura real do seu ambiente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {STYLES.map((style) => (
            <PremiumVerticalCard
              key={style.slug}
              src={style.src}
              alt={style.alt}
              kicker="Estilo"
              title={style.name}
              description={style.description}
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
