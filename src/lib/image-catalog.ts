/**
 * Single source of truth for marketing imagery on the homepage.
 *
 * Rule: each image has ONE primary `section`. The same `id` MUST NOT be
 * referenced from another section (the dev-only `assertNoOverlap()` runs at
 * import time and warns if a regression slips in). Within a section,
 * imagery is keyed by `room` and `style` so we can later filter or shuffle
 * per ambient type and aesthetic.
 */

// Hero
import emptyLiving from "@/assets/empty-living.jpg";
import decoratedLiving from "@/assets/decorated-living.jpg";

// Empty rooms carousel
import emptyBedroom from "@/assets/empty-bedroom.jpg";
import emptyKitchen from "@/assets/empty-kitchen.jpg";
import emptyOffice from "@/assets/empty-office.jpg";
import emptyStudio from "@/assets/empty-studio.jpg";
import emptyBathroom from "@/assets/empty-bathroom.jpg";
import emptyDining from "@/assets/empty-dining.jpg";

// Styles carousel
import styleJapandi from "@/assets/style-japandi.jpg";
import styleScandi from "@/assets/style-scandi.jpg";
import styleModern from "@/assets/style-modern.jpg";
import styleIndustrial from "@/assets/style-industrial.jpg";
import styleLuxo from "@/assets/style-luxo.jpg";
import styleNatural from "@/assets/style-natural.jpg";

// Featured before/after (dedicated pair)
import emptyBathroomSuite from "@/assets/empty-bathroom-suite.jpg";
import decoratedBathroomSuite from "@/assets/decorated-bathroom-suite.jpg";

// Result showcase (dedicated pair)
import emptyKitchenIsland from "@/assets/empty-kitchen-island.jpg";
import decoratedKitchenIsland from "@/assets/decorated-kitchen-island.jpg";

// Inspiration gallery
import decoratedLivingWarm from "@/assets/decorated-living-warm.jpg";
import decoratedBedroom from "@/assets/decorated-bedroom.jpg";
import decoratedDining from "@/assets/decorated-dining.jpg";
import galleryLoft from "@/assets/gallery-loft.jpg";
import galleryVaranda from "@/assets/gallery-varanda.jpg";
import galleryOffice from "@/assets/gallery-office.jpg";
import galleryClinic from "@/assets/gallery-clinic.jpg";
import floorplanApartment from "@/assets/floorplan-apartment.jpg";
import moodboardPro from "@/assets/moodboard-pro.jpg";

// Ranking / community picks
import rankMinimalBedroom from "@/assets/rank-minimal-bedroom.jpg";
// Reuse the bathroom-only-decorated render for a second ranking slot — it does
// not appear elsewhere on the page.
import decoratedBathroom from "@/assets/decorated-bathroom.jpg";
import decoratedKitchen from "@/assets/decorated-kitchen.jpg";

export type Room =
  | "sala"
  | "quarto"
  | "cozinha"
  | "banheiro"
  | "home-office"
  | "studio"
  | "jantar"
  | "varanda"
  | "loft"
  | "clinica"
  | "planta";

export type Style =
  | "japandi"
  | "escandinavo"
  | "moderno"
  | "industrial"
  | "luxo"
  | "natural"
  | "minimalista";

export type Section =
  | "hero"
  | "empty-carousel"
  | "style-carousel"
  | "featured-ba"
  | "showcase"
  | "gallery"
  | "ranking";

export type CatalogImage = {
  id: string;
  src: string;
  alt: string;
  section: Section;
  room?: Room;
  style?: Style;
  kind: "empty" | "decorated" | "style" | "plan" | "moodboard";
  /** Optional pairing id — `empty` + `decorated` of the same scene share it. */
  pairId?: string;
};

export const catalog: ReadonlyArray<CatalogImage> = [
  // ---- hero ----
  {
    id: "hero-living-empty",
    src: emptyLiving,
    alt: "Sala de estar vazia",
    section: "hero",
    room: "sala",
    kind: "empty",
    pairId: "hero-living",
  },
  {
    id: "hero-living-decorated",
    src: decoratedLiving,
    alt: "Sala de estar decorada",
    section: "hero",
    room: "sala",
    kind: "decorated",
    pairId: "hero-living",
    style: "moderno",
  },

  // ---- empty rooms carousel (all empties, no overlap with featured-ba/showcase) ----
  {
    id: "empty-bedroom",
    src: emptyBedroom,
    alt: "Quarto vazio",
    section: "empty-carousel",
    room: "quarto",
    kind: "empty",
  },
  {
    id: "empty-kitchen",
    src: emptyKitchen,
    alt: "Cozinha simples",
    section: "empty-carousel",
    room: "cozinha",
    kind: "empty",
  },
  {
    id: "empty-office",
    src: emptyOffice,
    alt: "Home office vazio",
    section: "empty-carousel",
    room: "home-office",
    kind: "empty",
  },
  {
    id: "empty-studio",
    src: emptyStudio,
    alt: "Studio compacto",
    section: "empty-carousel",
    room: "studio",
    kind: "empty",
  },
  {
    id: "empty-bathroom",
    src: emptyBathroom,
    alt: "Banheiro vazio",
    section: "empty-carousel",
    room: "banheiro",
    kind: "empty",
  },
  {
    id: "empty-dining",
    src: emptyDining,
    alt: "Sala de jantar vazia",
    section: "empty-carousel",
    room: "jantar",
    kind: "empty",
  },

  // ---- styles carousel ----
  {
    id: "style-japandi",
    src: styleJapandi,
    alt: "Estilo Japandi",
    section: "style-carousel",
    kind: "style",
    style: "japandi",
  },
  {
    id: "style-scandi",
    src: styleScandi,
    alt: "Estilo Escandinavo",
    section: "style-carousel",
    kind: "style",
    style: "escandinavo",
  },
  {
    id: "style-modern",
    src: styleModern,
    alt: "Estilo Contemporâneo",
    section: "style-carousel",
    kind: "style",
    style: "moderno",
  },
  {
    id: "style-industrial",
    src: styleIndustrial,
    alt: "Estilo Industrial",
    section: "style-carousel",
    kind: "style",
    style: "industrial",
  },
  {
    id: "style-luxo",
    src: styleLuxo,
    alt: "Estilo Luxo discreto",
    section: "style-carousel",
    kind: "style",
    style: "luxo",
  },
  {
    id: "style-natural",
    src: styleNatural,
    alt: "Estilo Natural",
    section: "style-carousel",
    kind: "style",
    style: "natural",
  },

  // ---- featured before/after (dedicated pair, NOT in carousel) ----
  {
    id: "ba-bathroom-empty",
    src: emptyBathroomSuite,
    alt: "Banheiro master vazio",
    section: "featured-ba",
    room: "banheiro",
    kind: "empty",
    pairId: "ba-bathroom",
  },
  {
    id: "ba-bathroom-decorated",
    src: decoratedBathroomSuite,
    alt: "Banheiro master decorado",
    section: "featured-ba",
    room: "banheiro",
    kind: "decorated",
    pairId: "ba-bathroom",
    style: "luxo",
  },

  // ---- result showcase (dedicated pair, NOT in carousel) ----
  {
    id: "show-kitchen-empty",
    src: emptyKitchenIsland,
    alt: "Cozinha com ilha vazia",
    section: "showcase",
    room: "cozinha",
    kind: "empty",
    pairId: "show-kitchen",
  },
  {
    id: "show-kitchen-decorated",
    src: decoratedKitchenIsland,
    alt: "Cozinha com ilha decorada",
    section: "showcase",
    room: "cozinha",
    kind: "decorated",
    pairId: "show-kitchen",
    style: "luxo",
  },

  // ---- inspiration gallery ----
  {
    id: "g-living-warm",
    src: decoratedLivingWarm,
    alt: "Sala moderna decorada",
    section: "gallery",
    room: "sala",
    kind: "decorated",
    style: "moderno",
  },
  {
    id: "g-bedroom",
    src: decoratedBedroom,
    alt: "Quarto japandi sereno",
    section: "gallery",
    room: "quarto",
    kind: "decorated",
    style: "japandi",
  },
  {
    id: "g-loft",
    src: galleryLoft,
    alt: "Loft industrial integrado",
    section: "gallery",
    room: "loft",
    kind: "decorated",
    style: "industrial",
  },
  {
    id: "g-varanda",
    src: galleryVaranda,
    alt: "Varanda urbana ao pôr do sol",
    section: "gallery",
    room: "varanda",
    kind: "decorated",
    style: "natural",
  },
  {
    id: "g-dining",
    src: decoratedDining,
    alt: "Sala de jantar com lista pronta",
    section: "gallery",
    room: "jantar",
    kind: "decorated",
    style: "luxo",
  },
  {
    id: "g-floorplan",
    src: floorplanApartment,
    alt: "Planta baixa de apartamento",
    section: "gallery",
    room: "planta",
    kind: "plan",
  },
  {
    id: "g-moodboard",
    src: moodboardPro,
    alt: "Moodboard arquitetônico",
    section: "gallery",
    kind: "moodboard",
  },
  {
    id: "g-office",
    src: galleryOffice,
    alt: "Home office natural",
    section: "gallery",
    room: "home-office",
    kind: "decorated",
    style: "natural",
  },
  {
    id: "g-clinic",
    src: galleryClinic,
    alt: "Consultório acolhedor",
    section: "gallery",
    room: "clinica",
    kind: "decorated",
    style: "moderno",
  },

  // ---- ranking (community picks) ----
  {
    id: "rank-minimal-bedroom",
    src: rankMinimalBedroom,
    alt: "Quarto minimalista (top da semana)",
    section: "ranking",
    room: "quarto",
    kind: "decorated",
    style: "minimalista",
  },
  {
    id: "rank-bathroom",
    src: decoratedBathroom,
    alt: "Banheiro travertino (top da semana)",
    section: "ranking",
    room: "banheiro",
    kind: "decorated",
    style: "luxo",
  },
  {
    id: "rank-kitchen",
    src: decoratedKitchen,
    alt: "Cozinha luxo discreto (top da semana)",
    section: "ranking",
    room: "cozinha",
    kind: "decorated",
    style: "luxo",
  },
];

/** Filter helper — get every image registered for a section, optionally narrowed by room/style. */
export function imagesFor(
  section: Section,
  opts: { room?: Room; style?: Style; kind?: CatalogImage["kind"] } = {},
): CatalogImage[] {
  return catalog.filter(
    (img) =>
      img.section === section &&
      (opts.room === undefined || img.room === opts.room) &&
      (opts.style === undefined || img.style === opts.style) &&
      (opts.kind === undefined || img.kind === opts.kind),
  );
}

/** Returns the empty/decorated pair declared under `pairId`. */
export function pair(pairId: string): { empty?: CatalogImage; decorated?: CatalogImage } {
  const matches = catalog.filter((img) => img.pairId === pairId);
  return {
    empty: matches.find((m) => m.kind === "empty"),
    decorated: matches.find((m) => m.kind === "decorated"),
  };
}

/** Returns the first image for a section by id (throws if missing — fail loud). */
export function img(id: string): CatalogImage {
  const found = catalog.find((c) => c.id === id);
  if (!found) throw new Error(`[image-catalog] Unknown image id: ${id}`);
  return found;
}

/**
 * Dev-only invariant: no image `src` should appear under two different
 * `section`s. We allow the same src to back two ranking slots, etc., as long
 * as they share a section. Pairs (empty + decorated) intentionally repeat
 * within the same section.
 */
function assertNoOverlap() {
  const seen = new Map<string, Section>();
  for (const item of catalog) {
    const prev = seen.get(item.src);
    if (prev && prev !== item.section) {
      // eslint-disable-next-line no-console
      console.warn(
        `[image-catalog] "${item.id}" reuses an asset already bound to section "${prev}" — move it to a unique image to keep sections distinct.`,
      );
    } else {
      seen.set(item.src, item.section);
    }
  }
}

if (import.meta.env?.DEV) assertNoOverlap();
