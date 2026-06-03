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
import { BeforeAfter } from "@/components/BeforeAfter";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

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
// Imagens "antes" (cômodos vazios) — reaproveitam os mesmos pares já
// curados do hero, sem regenerar via IA (regra inviolável do projeto).
import emptyLiving from "@/assets/empty-living.jpg";
import emptyBedroom from "@/assets/empty-bedroom.jpg";
import emptyKitchen from "@/assets/empty-kitchen.jpg";
import emptyBathroom from "@/assets/empty-bathroom.jpg";

type RoomItem = {
  slug: string;
  name: string;
  description: string;
  src: string;
  alt: string;
  /** Imagem "antes" — quando presente, o card vira slider antes/depois. */
  before?: string;
};

/**
 * Hierarquia objetiva por ubiquidade do cômodo na residência brasileira média
 * (PNAD/IBGE): Essenciais = presentes em ~100% dos domicílios; Comuns =
 * presentes em parcela majoritária; Especialidade = cômodos opcionais ou
 * dedicados. Dentro de cada tier os cards são uniformes — hierarquia vem do
 * tier (tamanho, posição, kicker), não de "destaque" subjetivo card a card.
 */
type Tier = {
  id: string;
  label: string;
  caption: string;
  /** Aspect/size aplicados uniformemente a todos os cards do tier. */
  aspect: "tall" | "portrait" | "wide";
  size: "sm" | "md" | "lg";
  /** Span em 12 cols no breakpoint lg, uniforme dentro do tier. */
  span: string;
  rooms: ReadonlyArray<RoomItem>;
};

const TIERS: ReadonlyArray<Tier> = [
  {
    id: "essenciais",
    label: "Essenciais",
    caption: "Cômodos presentes em praticamente toda residência.",
    aspect: "portrait",
    size: "lg",
    span: "lg:col-span-6",
    rooms: [
      {
        slug: "sala",
        name: "Sala de estar",
        description: "Sofá, tapete, iluminação e mesa de centro em harmonia.",
        src: decoratedLivingWarm,
        alt: "Sala de estar decorada em estilo moderno acolhedor",
        before: emptyLiving,
      },
      {
        slug: "quarto",
        name: "Quarto",
        description: "Sono, descanso e identidade pessoal em paleta calma.",
        src: decoratedBedroom,
        alt: "Quarto decorado com texturas naturais",
        before: emptyBedroom,
      },
      {
        slug: "cozinha",
        name: "Cozinha",
        description: "Funcional e bonita, integrada ou compacta.",
        src: decoratedKitchen,
        alt: "Cozinha decorada em estilo premium",
        before: emptyKitchen,
      },
      {
        slug: "banheiro",
        name: "Banheiro",
        description: "Visualize metal, espelho e iluminação antes de comprar.",
        src: decoratedBathroom,
        alt: "Banheiro decorado em estilo minimalista premium",
        before: emptyBathroom,
      },
    ],
  },
  {
    id: "comuns",
    label: "Comuns",
    caption: "Cômodos frequentes em apartamentos e casas familiares.",
    aspect: "tall",
    size: "md",
    span: "lg:col-span-3",
    rooms: [
      {
        slug: "home-office",
        name: "Home office",
        description: "Foco, ergonomia e fundo profissional pra calls.",
        src: galleryOffice,
        alt: "Home office com madeira e iluminação natural",
      },
      {
        slug: "sala-jantar",
        name: "Sala de jantar",
        description: "Mesa central, iluminação certa, paleta coerente.",
        src: galleryLoft,
        alt: "Sala de jantar integrada com mesa central e iluminação",
      },
      {
        slug: "lavanderia",
        name: "Lavanderia",
        description: "Marcenaria sob medida, máquinas integradas e organização vertical.",
        src: decoratedLavanderia,
        alt: "Lavanderia planejada com marcenaria sob medida e máquinas integradas",
      },
      {
        slug: "varanda-gourmet",
        name: "Varanda gourmet",
        description: "Mesa, bancada, churrasqueira e plantas como extensão da sala.",
        src: decoratedVarandaGourmet,
        alt: "Varanda gourmet com churrasqueira, mesa de madeira e vista urbana",
      },
    ],
  },
  {
    id: "especialidade",
    label: "Especialidade",
    caption: "Cômodos dedicados, opcionais ou planejados sob medida.",
    aspect: "tall",
    size: "sm",
    span: "lg:col-span-3",
    rooms: [
      {
        slug: "closet",
        name: "Closet",
        description: "Roupas, sapatos e acessórios organizados e visíveis.",
        src: decoratedCloset,
        alt: "Closet com armários abertos, ilha central e iluminação direta",
      },
      {
        slug: "quarto-bebe",
        name: "Quarto de bebê",
        description: "Berço, paleta calma e organização funcional pros primeiros anos.",
        src: decoratedQuartoBebe,
        alt: "Quarto de bebê em estilo escandinavo com berço e paleta clara",
      },
      {
        slug: "home-theater",
        name: "Home theater",
        description: "Acústica, blackout e poltronas certas pra cinema em casa.",
        src: decoratedHomeTheater,
        alt: "Home theater residencial com poltronas reclináveis e tela grande",
      },
      {
        slug: "area-pet",
        name: "Área pet",
        description: "Nicho dedicado, piso lavável e organização de utensílios.",
        src: decoratedAreaPet,
        alt: "Área pet integrada com cama em nicho e prateleiras organizadas",
      },
    ],
  },
] as const;

export function AmbientesGrid() {
  return (
    <section
      id="ambientes"
      className="bg-background py-12 sm:py-16"
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
              className="mt-6 block h-px w-24 bg-[color:var(--gold-soft)]/60"
            />
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Cada ambiente abre uma página com benefícios, FAQ, estilos sugeridos e lista de compras
            de referência.
          </p>
        </div>

        {/* Tiers objetivos: Essenciais → Comuns → Especialidade. Hierarquia
            visual vem do tier (tamanho/posição), não de destaque arbitrário. */}
        <div className="flex flex-col gap-12 sm:gap-16">
          {TIERS.map((tier) => (
            <div key={tier.id}>
              <div className="mb-5 flex items-baseline justify-between gap-4 sm:mb-6">
                <span className="is-kicker">{tier.label}</span>
                <p className="hidden max-w-sm text-right text-xs text-muted-foreground sm:block sm:text-sm">
                  {tier.caption}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12">
                {tier.rooms.map((room) => (
                  <div key={room.slug} className={tier.span}>
                    {room.before ? (
                      <BeforeAfterRoomCard
                        room={{ ...room, before: room.before }}
                        kicker={tier.label}
                      />
                    ) : (
                      <PremiumOverlayCard
                        src={room.src}
                        alt={room.alt}
                        kicker={tier.label}
                        title={room.name}
                        description={room.description}
                        aspect={tier.aspect}
                        size={tier.size}
                        to={`/ambientes/${room.slug}`}
                        ctaLabel="Decorar"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Card antes/depois para os 4 cômodos essenciais. Slider interativo
 * (drag/teclado) acima, com cabeçalho editorial e CTA abaixo apontando
 * para a página do cômodo. Mantém o ritmo visual do tier Essenciais
 * (aspect portrait 3/4) sem alterar os outros tiers.
 */
function BeforeAfterRoomCard({
  room,
  kicker,
}: {
  room: RoomItem & { before: string };
  kicker: string;
}) {
  return (
    <article className="group flex h-full flex-col gap-4">
      <BeforeAfter
        before={room.before}
        after={room.src}
        alt={room.alt}
        className="aspect-[3/4] w-full ring-1 ring-black/5 shadow-xl shadow-black/5"
      />
      <div className="flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <span className="is-kicker">{kicker}</span>
          <h3 className="mt-1.5 font-serif text-xl leading-tight tracking-tight text-foreground sm:text-2xl">
            {room.name}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{room.description}</p>
        </div>
        <Link
          to="/ambientes/$roomSlug"
          params={{ roomSlug: room.slug }}
          className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
          aria-label={`Decorar ${room.name}`}
        >
          Decorar
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
