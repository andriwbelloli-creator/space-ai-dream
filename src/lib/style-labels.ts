/**
 * Fonte única de rótulos de estilo para exibição em projetos (página pública
 * /p/:id, dashboard do usuário e admin).
 *
 * Mapa leve hardcoded: NÃO deriva de SEO_STYLES em runtime, para não puxar o
 * arquivo grande de copy de SEO pros bundles dessas rotas (a /p/:id em especial
 * é a vitrine pública compartilhada com o cliente).
 *
 * Cobre os 16 estilos canônicos (nomes espelham seo-styles-data.ts) mais os
 * slugs legados persistidos em projetos antigos, antes da canonicalização.
 */
const STYLE_LABELS: Record<string, string> = {
  // Canônicos (16)
  japandi: "Japandi",
  contemporaneo: "Contemporâneo",
  minimalista: "Minimalista",
  natural: "Natural",
  industrial: "Industrial",
  luxo: "Luxo discreto",
  "boho-chic": "Boho chic",
  "mid-century": "Mid-century modern",
  mediterraneo: "Mediterrâneo",
  "art-deco": "Art déco",
  maximalista: "Maximalista elegante",
  transicional: "Transicional",
  "rustico-moderno": "Rústico moderno",
  "moderno-organico": "Moderno orgânico",
  classico: "Clássico",
  brutalista: "Brutalista",
  // Legados (projetos antigos, antes da canonicalização)
  modern: "Contemporâneo",
  minimal: "Minimalista",
  luxe: "Luxo discreto",
  escandinavo: "Escandinavo",
};

/**
 * Converte um slug de estilo num rótulo legível.
 * Slug nulo, indefinido ou vazio retorna `fallback`.
 * Slug desconhecido capitaliza a primeira letra (nunca exibe o slug cru sem tratamento).
 */
export function styleLabel(
  slug: string | null | undefined,
  fallback = "Estilo personalizado",
): string {
  if (!slug) return fallback;
  return STYLE_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}
