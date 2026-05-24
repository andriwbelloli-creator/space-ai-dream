/**
 * Qual ambiente você quer transformar? — UMA seção consolidada na home
 * mostrando 10 cômodos em grid 5x2 desktop (3 cols ≤1024, 2 cols ≤640).
 * Uniforme (sem destaque grande) pra dar ritmo editorial e reduzir scroll.
 *
 * As 11 rotas /ambientes/<slug> continuam acessíveis; só limito a presença
 * visual na home a 10 (deixo "sala-tv" de fora pra cair em 5x2 exato).
 * sala-tv segue acessível via cross-links nas páginas relacionadas.
 *
 * Imagens reaproveitam assets existentes (sem trocar nem regerar).
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

type RoomItem = {
  slug: string;
  name: string;
  description: string;
  src: string;
  alt: string;
};

const ROOMS: ReadonlyArray<RoomItem> = [
  {
    slug: "sala",
    name: "Sala de estar",
    description: "Sofá, tapete, iluminação e mesa de centro em harmonia.",
    src: decoratedLivingWarm,
    alt: "Sala de estar decorada em estilo moderno acolhedor",
  },
  {
    slug: "quarto",
    name: "Quarto",
    description: "Sono, descanso e identidade pessoal em paleta calma.",
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
    slug: "varanda-gourmet",
    name: "Varanda gourmet",
    description: "Receba bem em escala proporcional ao seu espaço.",
    src: galleryVaranda,
    alt: "Varanda gourmet com plantas e mesa de receber",
  },
  {
    slug: "closet",
    name: "Closet",
    description: "Organização modular e iluminação que valorizam.",
    src: rankMinimalBedroom,
    alt: "Closet organizado com iluminação direta",
  },
  {
    slug: "quarto-infantil",
    name: "Quarto infantil",
    description: "Funcional pra dormir, brincar e estudar.",
    src: styleJapandi,
    alt: "Quarto infantil com paleta serena",
  },
  {
    slug: "lavabo",
    name: "Lavabo",
    description: "Aceita ousadia: papel de parede, cuba esculpida.",
    src: decoratedBathroomSuite,
    alt: "Lavabo decorado com materiais nobres",
  },
] as const;

export function AmbientesGrid() {
  return (
    <section
      id="ambientes"
      className="bg-background py-14 sm:py-20"
      aria-labelledby="ambientes-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker">Qual ambiente você quer transformar?</span>
            <h2
              id="ambientes-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Escolha o <span className="italic">cômodo</span> para transformar.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Cada ambiente abre uma página com benefícios, FAQ, estilos sugeridos e lista de compras
            de referência.
          </p>
        </div>

        {/* Grid uniforme 5x2 desktop, 3 sm, 2 mobile. */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {ROOMS.map((room) => (
            <PremiumOverlayCard
              key={room.slug}
              src={room.src}
              alt={room.alt}
              kicker="Ambiente"
              title={room.name}
              description={room.description}
              aspect="portrait"
              size="sm"
              to={`/ambientes/${room.slug}`}
              ctaLabel="Decorar"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
