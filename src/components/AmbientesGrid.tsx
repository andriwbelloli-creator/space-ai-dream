/**
 * Escolha o ambiente para transformar — UMA seção consolidada na home
 * mostrando 8 cômodos principais em grid 4x2 desktop (3 cols ≤1024, 2
 * cols ≤640). Uniforme, sem destaque grande, pra dar ritmo editorial.
 *
 * As 11 rotas /ambientes/<slug> continuam acessíveis; quarto-infantil,
 * lavabo e sala-tv ficam fora do grid pra evitar imagens muito parecidas
 * (já cobrimos quarto e banheiro no grid principal). Eles seguem acessíveis
 * via cross-links em páginas relacionadas e via URL direta.
 *
 * Imagens majoritariamente reaproveitadas dos assets existentes. Duas
 * novas adicionadas pelo dono em src/assets/:
 *   - decorated-closet.jpg (closet com armários abertos e ilha)
 *   - decorated-varanda-gourmet.jpg (varanda com churrasqueira e mesa)
 */
import { PremiumOverlayCard } from "@/components/ui/premium-cards";

import decoratedLivingWarm from "@/assets/decorated-living-warm.jpg";
import decoratedBedroom from "@/assets/decorated-bedroom.jpg";
import decoratedKitchen from "@/assets/decorated-kitchen.jpg";
import galleryOffice from "@/assets/gallery-office.jpg";
import decoratedBathroom from "@/assets/decorated-bathroom.jpg";
import galleryLoft from "@/assets/gallery-loft.jpg";
import decoratedCloset from "@/assets/decorated-closet.jpg";
import decoratedVarandaGourmet from "@/assets/decorated-varanda-gourmet.jpg";
import decoratedLavanderia from "@/assets/decorated-lavanderia.jpg";
import decoratedQuartoBebe from "@/assets/decorated-quarto-bebe.jpg";
import decoratedHomeTheater from "@/assets/decorated-home-theater.jpg";
import decoratedAreaPet from "@/assets/decorated-area-pet.jpg";

type RoomItem = {
  slug: string;
  name: string;
  description: string;
  src: string;
  alt: string;
  /** Span em 12 colunas no breakpoint lg (bento dinâmico). */
  span: string;
  /** Aspect da imagem combinado com o span pra dar ritmo magazine. */
  aspect: "tall" | "portrait" | "wide";
  /** Tamanho tipográfico do card, casa com a área visual. */
  size: "sm" | "md" | "lg";
};

const ROOMS: ReadonlyArray<RoomItem> = [
  {
    slug: "sala",
    name: "Sala de estar",
    description: "Sofá, tapete, iluminação e mesa de centro em harmonia.",
    src: decoratedLivingWarm,
    alt: "Sala de estar decorada em estilo moderno acolhedor",
    span: "lg:col-span-7",
    aspect: "tall",
    size: "lg",
  },
  {
    slug: "quarto",
    name: "Quarto",
    description: "Sono, descanso e identidade pessoal em paleta calma.",
    src: decoratedBedroom,
    alt: "Quarto decorado com texturas naturais",
    span: "lg:col-span-5",
    aspect: "portrait",
    size: "md",
  },
  {
    slug: "cozinha",
    name: "Cozinha",
    description: "Funcional e bonita, integrada ou compacta.",
    src: decoratedKitchen,
    alt: "Cozinha decorada em estilo premium",
    span: "lg:col-span-4",
    aspect: "tall",
    size: "sm",
  },
  {
    slug: "home-office",
    name: "Home office",
    description: "Foco, ergonomia e fundo profissional pra calls.",
    src: galleryOffice,
    alt: "Home office com madeira e iluminação natural",
    span: "lg:col-span-4",
    aspect: "tall",
    size: "sm",
  },
  {
    slug: "banheiro",
    name: "Banheiro",
    description: "Visualize metal, espelho e iluminação antes de comprar.",
    src: decoratedBathroom,
    alt: "Banheiro decorado em estilo minimalista premium",
    span: "lg:col-span-4",
    aspect: "tall",
    size: "sm",
  },
  {
    slug: "sala-jantar",
    name: "Sala de jantar",
    description: "Mesa central, iluminação certa, paleta coerente.",
    src: galleryLoft,
    alt: "Sala de jantar integrada com mesa central e iluminação",
    span: "lg:col-span-5",
    aspect: "portrait",
    size: "md",
  },
  {
    slug: "varanda-gourmet",
    name: "Varanda gourmet",
    description: "Mesa, bancada, churrasqueira e plantas. Extensão da sala como área social.",
    src: decoratedVarandaGourmet,
    alt: "Varanda gourmet com churrasqueira, mesa de madeira e vista urbana",
    span: "lg:col-span-7",
    aspect: "wide",
    size: "lg",
  },
  {
    slug: "closet",
    name: "Closet",
    description:
      "Roupas, sapatos e acessórios organizados e visíveis. Cômodo dedicado ou integrado.",
    src: decoratedCloset,
    alt: "Closet com armários abertos, ilha central e iluminação direta",
    span: "lg:col-span-4",
    aspect: "tall",
    size: "sm",
  },
  {
    slug: "lavanderia",
    name: "Lavanderia",
    description:
      "Marcenaria sob medida, máquinas integradas e organização vertical pra aproveitar cada centímetro.",
    src: decoratedLavanderia,
    alt: "Lavanderia planejada com marcenaria sob medida e máquinas integradas",
    span: "lg:col-span-4",
    aspect: "tall",
    size: "sm",
  },
  {
    slug: "quarto-bebe",
    name: "Quarto de bebê",
    description:
      "Berço, paleta calma e organização funcional pros primeiros anos.",
    src: decoratedQuartoBebe,
    alt: "Quarto de bebê em estilo escandinavo com berço e paleta clara",
    span: "lg:col-span-4",
    aspect: "tall",
    size: "sm",
  },
  {
    slug: "home-theater",
    name: "Home theater",
    description:
      "Acústica, blackout e poltronas certas pra experiência de cinema em casa.",
    src: decoratedHomeTheater,
    alt: "Home theater residencial com poltronas reclináveis e tela grande",
    span: "lg:col-span-7",
    aspect: "wide",
    size: "lg",
  },
  {
    slug: "area-pet",
    name: "Área pet",
    description:
      "Nicho dedicado, piso lavável e organização de utensílios pra cães e gatos.",
    src: decoratedAreaPet,
    alt: "Área pet integrada com cama em nicho e prateleiras organizadas",
    span: "lg:col-span-5",
    aspect: "portrait",
    size: "md",
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
              Escolha o{" "}
              <span className="italic text-[color:var(--gold-soft)]">cômodo</span>{" "}
              para transformar.
            </h2>
            <span
              aria-hidden="true"
              className="mt-5 block h-px w-16 bg-[color:var(--gold-soft)]/60"
            />
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Cada ambiente abre uma página com benefícios, FAQ, estilos sugeridos e lista de compras
            de referência.
          </p>
        </div>

        {/* Bento dinâmico — 12 col no desktop, ritmo editorial. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12">
          {ROOMS.map((room) => (
            <div key={room.slug} className={room.span}>
              <PremiumOverlayCard
                src={room.src}
                alt={room.alt}
                kicker="Ambiente"
                title={room.name}
                description={room.description}
                aspect={room.aspect}
                size={room.size}
                to={`/ambientes/${room.slug}`}
                ctaLabel="Decorar"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
