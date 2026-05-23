/**
 * Tipos compartilhados pelas landings programaticas (`/estilos/$slug` e
 * `/ambientes/$slug`) — ambas usam o mesmo componente <ExpandedLanding> e
 * por isso precisam expor a mesma forma de conteudo encarpado.
 */

/** Argumento de venda curto exibido em bullets na landing. */
export type LandingBenefit = string;

/** Pergunta/resposta da secao de FAQ no fim da landing. */
export type LandingFaq = { q: string; a: string };

/**
 * Imagens da landing — chaves referem a assets ja existentes em
 * `src/assets/`. O mapa key → URL importada vive em
 * `src/lib/seo-landing-images.ts` (pra evitar import de binario nos data
 * files puros). Sem `before/after` o BeforeAfter slider nao renderiza.
 */
export type LandingImages = {
  before?: string;
  after?: string;
  /** 1-4 imagens de inspiracao adicional. Vazio = secao nao renderiza. */
  gallery?: string[];
};
