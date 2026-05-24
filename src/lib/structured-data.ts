// Helpers para gerar Schema.org JSON-LD usado nas landings de SEO.
// Cada função retorna um objeto pronto pra colocar em `head().scripts`.

/** Pergunta + resposta usada em qualquer landing com FAQ. */
export type FaqEntry = { q: string; a: string };

/**
 * Gera o script JSON-LD do tipo FAQPage do Schema.org.
 * Quando uma landing tem 4+ perguntas e respostas visíveis na página, o
 * Google pode exibir as perguntas como rich snippet nos resultados.
 *
 * Requisitos do Google pra qualificar pro snippet:
 * - A pergunta e a resposta visíveis na página devem bater com o JSON-LD.
 * - Não usar marcação em conteúdo promocional ou pago.
 * - Sem perguntas múltiplas por entrada.
 *
 * Uso:
 *   head: () => ({
 *     scripts: [faqPageJsonLd(FAQ_LIST)],
 *   })
 */
export function faqPageJsonLd(faq: ReadonlyArray<FaqEntry>): {
  type: "application/ld+json";
  children: string;
} {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    }),
  };
}
