/**
 * Mapa key → URL das imagens usadas pelas landings programaticas
 * (`/estilos/$slug`, `/ambientes/$slug`). Centralizado aqui pra que os
 * data files (`seo-styles-data.ts`, `seo-rooms-data.ts`) sejam dados puros
 * e o ExpandedLanding faca lookup pela string-key.
 *
 * Todas as imagens ja existem em `src/assets/` — nao criamos nada novo.
 */

import decoratedBathroomSuite from "@/assets/decorated-bathroom-suite.jpg";
import decoratedBathroom from "@/assets/decorated-bathroom.jpg";
import decoratedBedroom from "@/assets/decorated-bedroom.jpg";
import decoratedDining from "@/assets/decorated-dining.jpg";
import decoratedKitchenIsland from "@/assets/decorated-kitchen-island.jpg";
import decoratedKitchen from "@/assets/decorated-kitchen.jpg";
import decoratedLivingWarm from "@/assets/decorated-living-warm.jpg";
import decoratedLiving from "@/assets/decorated-living.jpg";
import emptyBathroomSuite from "@/assets/empty-bathroom-suite.jpg";
import emptyBathroom from "@/assets/empty-bathroom.jpg";
import emptyBedroom from "@/assets/empty-bedroom.jpg";
import emptyKitchenIsland from "@/assets/empty-kitchen-island.jpg";
import emptyKitchen from "@/assets/empty-kitchen.jpg";
import emptyLiving from "@/assets/empty-living.jpg";
import emptyOffice from "@/assets/empty-office.jpg";
import galleryLoft from "@/assets/gallery-loft.jpg";
import galleryOffice from "@/assets/gallery-office.jpg";
import galleryVaranda from "@/assets/gallery-varanda.jpg";
import moodboardPro from "@/assets/moodboard-pro.jpg";
import rankMinimalBedroom from "@/assets/rank-minimal-bedroom.jpg";
import styleIndustrial from "@/assets/style-industrial.jpg";
import styleJapandi from "@/assets/style-japandi.jpg";
import styleLuxo from "@/assets/style-luxo.jpg";
import styleModern from "@/assets/style-modern.jpg";
import styleNatural from "@/assets/style-natural.jpg";

/**
 * Lookup string-key → URL absoluta da imagem (resolvida pelo Vite no build).
 * Cada chave deve corresponder ao nome do arquivo sem extensao.
 */
export const LANDING_IMAGES: Record<string, string> = {
  "decorated-bathroom-suite": decoratedBathroomSuite,
  "decorated-bathroom": decoratedBathroom,
  "decorated-bedroom": decoratedBedroom,
  "decorated-dining": decoratedDining,
  "decorated-kitchen-island": decoratedKitchenIsland,
  "decorated-kitchen": decoratedKitchen,
  "decorated-living-warm": decoratedLivingWarm,
  "decorated-living": decoratedLiving,
  "empty-bathroom-suite": emptyBathroomSuite,
  "empty-bathroom": emptyBathroom,
  "empty-bedroom": emptyBedroom,
  "empty-kitchen-island": emptyKitchenIsland,
  "empty-kitchen": emptyKitchen,
  "empty-living": emptyLiving,
  "empty-office": emptyOffice,
  "gallery-loft": galleryLoft,
  "gallery-office": galleryOffice,
  "gallery-varanda": galleryVaranda,
  "moodboard-pro": moodboardPro,
  "rank-minimal-bedroom": rankMinimalBedroom,
  "style-industrial": styleIndustrial,
  "style-japandi": styleJapandi,
  "style-luxo": styleLuxo,
  "style-modern": styleModern,
  "style-natural": styleNatural,
};

/** Resolve uma chave de imagem; retorna `null` se a chave nao existe. */
export function resolveLandingImage(key?: string): string | null {
  if (!key) return null;
  return LANDING_IMAGES[key] ?? null;
}
