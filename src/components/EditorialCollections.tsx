/**
 * Coleções editoriais — 6 curadorias temáticas que apontam pra páginas
 * reais (/ambientes/<slug>, /estilos/<slug>). Layout asymmetric: feature
 * card grande à esquerda + 2 collection cards à direita no desktop,
 * stack vertical no mobile.
 *
 * Não usa imagens novas: reaproveita assets já presentes em src/assets/
 * importando diretamente (fora do image-catalog pra evitar conflito com
 * `assertNoOverlap`, que zela apenas pelas seções principais da home).
 */
import {
  EditorialFeatureCard,
  CollectionCard,
  PremiumOverlayCard,
} from "@/components/ui/premium-cards";

// Reutilizando imagens existentes (não troca nem regera nada).
import livingWarm from "@/assets/decorated-living-warm.jpg";
import bedroom from "@/assets/decorated-bedroom.jpg";
import diningDecorated from "@/assets/decorated-dining.jpg";
import kitchenDecorated from "@/assets/decorated-kitchen.jpg";
import office from "@/assets/gallery-office.jpg";
import loft from "@/assets/gallery-loft.jpg";

const COLLECTIONS = {
  feature: {
    src: livingWarm,
    alt: "Sala de estar decorada em estilo moderno acolhedor",
    kicker: "Coleção em destaque",
    title: (
      <>
        Apartamentos pequenos com <span className="font-serif italic">presença grande</span>.
      </>
    ),
    description:
      "Ambientes compactos que ganharam respiro, foco e personalidade. Inspiração curada por estilo e função.",
    meta: "8 ambientes · estilo a estilo",
    to: "/ambientes/sala",
    ctaLabel: "Ver coleção",
  },
  homeOffice: {
    src: office,
    alt: "Home office com madeira e iluminação natural",
    title: "Home office produtivo",
    description: "Setups para foco, calls e ergonomia, do compacto ao executivo.",
    count: "6 estilos",
    to: "/ambientes/home-office",
  },
  cozyBedroom: {
    src: bedroom,
    alt: "Quarto japandi com tons quentes e textura natural",
    title: "Quartos aconchegantes",
    description: "Texturas, paleta neutra e iluminação suave pra desacelerar.",
    count: "5 estilos",
    to: "/ambientes/quarto",
  },
  dining: {
    src: diningDecorated,
    alt: "Sala de jantar integrada com luz natural",
    kicker: "Para receber",
    title: "Salas de jantar para conviver",
    description: "Mesa central, paleta neutra, iluminação certa.",
    to: "/ambientes/sala",
  },
  luxoDiscreto: {
    src: kitchenDecorated,
    alt: "Cozinha decorada em estilo luxo discreto",
    kicker: "Estilo",
    title: "Luxo discreto",
    description: "Materiais nobres, paleta restrita, acabamentos refinados.",
    to: "/estilos/luxo",
  },
  japandi: {
    src: loft,
    alt: "Loft em estilo japandi com paleta sóbria",
    kicker: "Estilo",
    title: "Japandi sereno",
    description: "Encontro entre o silêncio japonês e o conforto escandinavo.",
    to: "/estilos/japandi",
  },
} as const;

export function EditorialCollections() {
  return (
    <section
      className="bg-background py-16 sm:py-24"
      aria-labelledby="editorial-collections-heading"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker">Coleções editoriais</span>
            <h2
              id="editorial-collections-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Inspire-se por <span className="italic">tipo de espaço</span>,{" "}
              <span className="italic">estilo</span> e <span className="italic">intenção</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Coleções curadas para você navegar sem perder tempo. Cada uma reúne ambientes, estilos e
            referências reais para começar o seu projeto.
          </p>
        </div>

        {/* Desktop: 12-col asymmetric grid. Mobile: stack. */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <EditorialFeatureCard
              src={COLLECTIONS.feature.src}
              alt={COLLECTIONS.feature.alt}
              kicker={COLLECTIONS.feature.kicker}
              title={COLLECTIONS.feature.title}
              description={COLLECTIONS.feature.description}
              meta={COLLECTIONS.feature.meta}
              ctaLabel={COLLECTIONS.feature.ctaLabel}
              to={COLLECTIONS.feature.to}
            />
          </div>
          <div className="grid gap-5 sm:gap-6 lg:col-span-5">
            <CollectionCard
              src={COLLECTIONS.homeOffice.src}
              alt={COLLECTIONS.homeOffice.alt}
              title={COLLECTIONS.homeOffice.title}
              description={COLLECTIONS.homeOffice.description}
              count={COLLECTIONS.homeOffice.count}
              to={COLLECTIONS.homeOffice.to}
            />
            <CollectionCard
              src={COLLECTIONS.cozyBedroom.src}
              alt={COLLECTIONS.cozyBedroom.alt}
              title={COLLECTIONS.cozyBedroom.title}
              description={COLLECTIONS.cozyBedroom.description}
              count={COLLECTIONS.cozyBedroom.count}
              to={COLLECTIONS.cozyBedroom.to}
            />
          </div>
        </div>

        {/* Segundo bloco — 3 overlay cards equivalentes. */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PremiumOverlayCard
            src={COLLECTIONS.dining.src}
            alt={COLLECTIONS.dining.alt}
            kicker={COLLECTIONS.dining.kicker}
            title={COLLECTIONS.dining.title}
            description={COLLECTIONS.dining.description}
            aspect="tall"
            to={COLLECTIONS.dining.to}
            ctaLabel="Ver inspirações"
          />
          <PremiumOverlayCard
            src={COLLECTIONS.luxoDiscreto.src}
            alt={COLLECTIONS.luxoDiscreto.alt}
            kicker={COLLECTIONS.luxoDiscreto.kicker}
            title={COLLECTIONS.luxoDiscreto.title}
            description={COLLECTIONS.luxoDiscreto.description}
            aspect="tall"
            to={COLLECTIONS.luxoDiscreto.to}
            ctaLabel="Ver estilo"
          />
          <PremiumOverlayCard
            src={COLLECTIONS.japandi.src}
            alt={COLLECTIONS.japandi.alt}
            kicker={COLLECTIONS.japandi.kicker}
            title={COLLECTIONS.japandi.title}
            description={COLLECTIONS.japandi.description}
            aspect="tall"
            to={COLLECTIONS.japandi.to}
            ctaLabel="Ver estilo"
          />
        </div>
      </div>
    </section>
  );
}
