/**
 * Ambientes para transformar — UMA seção consolidada na home mostrando 8
 * ambientes principais + CTA pros 3 restantes. As 11 rotas /ambientes/<slug>
 * continuam acessíveis; só limito a presença visual na home pra evitar
 * scroll longo. Cards menos representados (lavabo, quarto-infantil, sala-tv)
 * ficam disponíveis via landing direta + cross-links nas páginas de estilo.
 *
 * Layout: grid editorial 1 destaque grande + 7 cards regulares. Mobile 1
 * col, sm 2, lg 4. Cada card é PremiumOverlayCard apontando pra rota.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PremiumOverlayCard } from "@/components/ui/premium-cards";

import decoratedLivingWarm from "@/assets/decorated-living-warm.jpg";
import decoratedBedroom from "@/assets/decorated-bedroom.jpg";
import decoratedKitchen from "@/assets/decorated-kitchen.jpg";
import galleryOffice from "@/assets/gallery-office.jpg";
import decoratedBathroom from "@/assets/decorated-bathroom.jpg";
import galleryLoft from "@/assets/gallery-loft.jpg";
import rankMinimalBedroom from "@/assets/rank-minimal-bedroom.jpg";
import galleryVaranda from "@/assets/gallery-varanda.jpg";

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
            <span className="is-kicker">Qual ambiente você quer transformar?</span>
            <h2
              id="ambientes-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Comece pelo cômodo que faz <span className="italic">a maior diferença</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Cada ambiente abre uma página com benefícios, FAQ, estilos sugeridos e lista de compras
            de referência.
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

        {/* CTA "Ver todos" — 11 ambientes total, 8 em destaque acima. */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6 sm:mt-10">
          <p className="text-sm text-muted-foreground">
            Também temos landings dedicadas pra quarto infantil, lavabo e sala de TV.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/ambientes/quarto-infantil"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
            >
              Quarto infantil
            </Link>
            <Link
              to="/ambientes/lavabo"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
            >
              Lavabo
            </Link>
            <Link
              to="/ambientes/sala-tv"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
            >
              Sala de TV
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
