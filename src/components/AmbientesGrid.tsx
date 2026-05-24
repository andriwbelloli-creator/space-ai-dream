/**
 * Ambientes para transformar — UMA seção consolidada na home com todos
 * os 11 ambientes que têm landing dedicada em /ambientes/<slug>. Substitui
 * EmptyRoomsCarousel + MoreRoomsGrid (eliminados pra evitar redundância).
 *
 * Layout: grid editorial com 1 destaque grande (col-span-2) + 10 cards
 * regulares. Mobile 1 col, sm 2 cols, lg 4 cols. Cada card é PremiumOverlayCard
 * apontando pra /ambientes/<slug>, com aspect tall pra dar peso visual.
 *
 * Imagens reaproveitam assets já existentes (sem trocar nem regerar).
 */
import { PremiumOverlayCard } from "@/components/ui/premium-cards";

import decoratedLivingWarm from "@/assets/decorated-living-warm.jpg";
import decoratedBedroom from "@/assets/decorated-bedroom.jpg";
import decoratedKitchen from "@/assets/decorated-kitchen.jpg";
import galleryOffice from "@/assets/gallery-office.jpg";
import decoratedBathroom from "@/assets/decorated-bathroom.jpg";
import galleryLoft from "@/assets/gallery-loft.jpg";
import rankMinimalBedroom from "@/assets/rank-minimal-bedroom.jpg";
import galleryVaranda from "@/assets/gallery-varanda.jpg";
import styleJapandi from "@/assets/style-japandi.jpg";
import decoratedBathroomSuite from "@/assets/decorated-bathroom-suite.jpg";
import styleIndustrial from "@/assets/style-industrial.jpg";

type RoomItem = {
  slug: string;
  name: string;
  description: string;
  src: string;
  alt: string;
  featured?: boolean;
};

const ROOMS: ReadonlyArray<RoomItem> = [
  {
    slug: "sala",
    name: "Sala de estar",
    description: "Sofá, tapete, iluminação e mesa de centro em harmonia.",
    src: decoratedLivingWarm,
    alt: "Sala de estar decorada em estilo moderno acolhedor",
    featured: true,
  },
  {
    slug: "quarto",
    name: "Quarto",
    description: "Sono, descanso e identidade pessoal em uma paleta calma.",
    src: decoratedBedroom,
    alt: "Quarto decorado com texturas naturais",
  },
  {
    slug: "cozinha",
    name: "Cozinha",
    description: "Funcional e bonita, integrada ou compacta.",
    src: decoratedKitchen,
    alt: "Cozinha decorada em estilo premium",
  },
  {
    slug: "home-office",
    name: "Home office",
    description: "Foco, ergonomia e fundo profissional pra calls.",
    src: galleryOffice,
    alt: "Home office com madeira e iluminação natural",
  },
  {
    slug: "banheiro",
    name: "Banheiro",
    description: "Visualize metal, espelho e iluminação antes de comprar.",
    src: decoratedBathroom,
    alt: "Banheiro decorado em estilo minimalista premium",
  },
  {
    slug: "sala-jantar",
    name: "Sala de jantar",
    description: "Mesa central, iluminação certa, paleta coerente.",
    src: galleryLoft,
    alt: "Sala de jantar integrada com mesa central e iluminação",
  },
  {
    slug: "closet",
    name: "Closet",
    description: "Organização modular e iluminação que valorizam.",
    src: rankMinimalBedroom,
    alt: "Closet organizado com iluminação direta",
  },
  {
    slug: "varanda-gourmet",
    name: "Varanda gourmet",
    description: "Receba bem em escala proporcional ao seu espaço.",
    src: galleryVaranda,
    alt: "Varanda gourmet com plantas e mesa de receber",
  },
  {
    slug: "quarto-infantil",
    name: "Quarto infantil",
    description: "Funcional pra dormir, brincar e estudar. Cresce com a criança.",
    src: styleJapandi,
    alt: "Quarto infantil com paleta serena e composição minimal",
  },
  {
    slug: "lavabo",
    name: "Lavabo",
    description: "Aceita ousadia: papel de parede, cuba esculpida, espelho ornamental.",
    src: decoratedBathroomSuite,
    alt: "Lavabo decorado com materiais nobres",
  },
  {
    slug: "sala-tv",
    name: "Sala de TV",
    description: "Conforto pra assistir, beleza pra receber.",
    src: styleIndustrial,
    alt: "Sala de TV com sofá, painel e iluminação ambiente",
  },
] as const;

export function AmbientesGrid() {
  const [featured, ...rest] = ROOMS;
  return (
    <section
      id="ambientes"
      className="bg-background py-14 sm:py-20"
      aria-labelledby="ambientes-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker">Ambientes para transformar</span>
            <h2
              id="ambientes-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Onze cômodos com <span className="italic">landing dedicada</span>, do quarto ao
              lavabo.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Cada ambiente abre uma página com benefícios, FAQ, sugestões de estilo e lista de
            compras de referência.
          </p>
        </div>

        {/* Destaque + grid */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-4">
          {/* Destaque ocupa 2 cols no desktop. */}
          <div className="lg:col-span-2 lg:row-span-2">
            <PremiumOverlayCard
              src={featured.src}
              alt={featured.alt}
              kicker="Ambiente em destaque"
              title={featured.name}
              description={featured.description}
              aspect="square"
              size="lg"
              to={`/ambientes/${featured.slug}`}
              ctaLabel="Decorar este ambiente"
            />
          </div>
          {rest.map((room) => (
            <PremiumOverlayCard
              key={room.slug}
              src={room.src}
              alt={room.alt}
              kicker="Ambiente"
              title={room.name}
              description={room.description}
              aspect="tall"
              to={`/ambientes/${room.slug}`}
              ctaLabel="Decorar"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
