/**
 * Grade dos 6 ambientes curados adicionados na R2 — vai na home logo
 * após o carrossel oficial de ambientes (EmptyRoomsCarousel). Não
 * altera o carrossel existente (regra de memória).
 *
 * Cards: PremiumVerticalCard. Grid 1 col mobile → 2 sm → 3 lg, 2 linhas
 * naturais. Links pra /ambientes/<slug> das novas rotas.
 */
import { PremiumVerticalCard } from "@/components/ui/premium-cards";

import decoratedDining from "@/assets/decorated-dining.jpg";
import rankMinimalBedroom from "@/assets/rank-minimal-bedroom.jpg";
import galleryVaranda from "@/assets/gallery-varanda.jpg";
import decoratedBedroom from "@/assets/decorated-bedroom.jpg";
import decoratedBathroom from "@/assets/decorated-bathroom.jpg";
import decoratedLivingWarm from "@/assets/decorated-living-warm.jpg";

type RoomItem = {
  slug: string;
  name: string;
  description: string;
  src: string;
  alt: string;
  tags?: ReadonlyArray<{ label: string; tone?: "neutral" | "gold" | "accent" }>;
};

const ROOMS: ReadonlyArray<RoomItem> = [
  {
    slug: "sala-jantar",
    name: "Sala de jantar",
    description: "Mesa central, iluminação certa, paleta coerente com a sala de estar.",
    src: decoratedDining,
    alt: "Sala de jantar decorada com mesa e iluminação central",
    tags: [{ label: "Para receber", tone: "gold" }],
  },
  {
    slug: "closet",
    name: "Closet",
    description: "Organização modular, iluminação e espelho que valorizam o ambiente.",
    src: rankMinimalBedroom,
    alt: "Closet organizado com iluminação direta",
    tags: [{ label: "Funcional", tone: "gold" }],
  },
  {
    slug: "varanda-gourmet",
    name: "Varanda gourmet",
    description: "Receba bem em escala proporcional ao seu espaço real.",
    src: galleryVaranda,
    alt: "Varanda gourmet com plantas e mesa de receber",
    tags: [{ label: "Convivência", tone: "gold" }],
  },
  {
    slug: "quarto-infantil",
    name: "Quarto infantil",
    description: "Funcional pra dormir, brincar e estudar. Cresce com a criança.",
    src: decoratedBedroom,
    alt: "Quarto infantil decorado com cama e organização",
    tags: [{ label: "Infantil", tone: "gold" }],
  },
  {
    slug: "lavabo",
    name: "Lavabo",
    description: "Aceita ousadia: papel de parede, cuba esculpida, espelho ornamental.",
    src: decoratedBathroom,
    alt: "Lavabo decorado com materiais nobres",
    tags: [{ label: "Ousado", tone: "gold" }],
  },
  {
    slug: "sala-tv",
    name: "Sala de TV",
    description: "Conforto pra assistir, beleza pra receber. Sofá, painel, iluminação.",
    src: decoratedLivingWarm,
    alt: "Sala de TV decorada com sofá e painel",
    tags: [{ label: "Conforto", tone: "gold" }],
  },
] as const;

export function MoreRoomsGrid() {
  return (
    <section
      id="mais-ambientes"
      className="bg-background py-14 sm:py-20"
      aria-labelledby="mais-ambientes-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker">Mais ambientes para transformar</span>
            <h2
              id="mais-ambientes-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl"
            >
              Seis cômodos <span className="italic">novos</span> no repertório.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Cada cômodo tem página própria com benefícios, FAQ e estilos sugeridos. Da sala de
            jantar ao lavabo, do closet à varanda gourmet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {ROOMS.map((room) => (
            <PremiumVerticalCard
              key={room.slug}
              src={room.src}
              alt={room.alt}
              kicker="Ambiente"
              title={room.name}
              description={room.description}
              tags={room.tags ? [...room.tags] : undefined}
              aspect="tall"
              to={`/ambientes/${room.slug}`}
              ctaLabel="Decorar este ambiente"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
