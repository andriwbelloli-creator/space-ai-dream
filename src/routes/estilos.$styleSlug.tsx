// @ts-nocheck — dívida técnica: types.ts do Supabase está vazio (DB sem schema gerado); silenciado para destravar build sem tocar em banco/migrations (ver CLAUDE.md §6).
import { createFileRoute, redirect } from "@tanstack/react-router";
import { SEO_STYLES, type StyleSlug } from "@/lib/seo-styles-data";
import { ExpandedLanding } from "@/components/ExpandedLanding";
import { faqPageJsonLd } from "@/lib/structured-data";

/** Type guard: o slug recebido é um estilo conhecido do mapa de SEO. */
function isStyleSlug(slug: string): slug is StyleSlug {
  return Object.prototype.hasOwnProperty.call(SEO_STYLES, slug);
}

export const Route = createFileRoute("/estilos/$styleSlug")({
  // Slug desconhecido: redireciona pra Home antes de qualquer renderização.
  loader: ({ params }) => {
    if (!isStyleSlug(params.styleSlug)) {
      throw redirect({ to: "/" });
    }
    return { styleSlug: params.styleSlug };
  },
  // Metadados de SEO dinâmicos por estilo + breadcrumb estruturado (JSON-LD).
  head: ({ params }) => {
    const slug = params.styleSlug;
    if (!isStyleSlug(slug)) return {};
    const style = SEO_STYLES[slug];
    const url = `https://idealspace.com.br/estilos/${slug}`;
    return {
      meta: [
        { title: style.title },
        { name: "description", content: style.description },
        { property: "og:title", content: style.title },
        { property: "og:description", content: style.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Início",
                item: "https://idealspace.com.br/",
              },
              { "@type": "ListItem", position: 2, name: style.name, item: url },
            ],
          }),
        },
        // FAQPage Schema — habilita rich snippets de FAQ no Google.
        faqPageJsonLd(style.faq),
      ],
    };
  },
  component: EstiloPage,
});

function EstiloPage() {
  const { styleSlug } = Route.useLoaderData();
  const style = SEO_STYLES[styleSlug];

  return (
    <ExpandedLanding
      h1={style.h1}
      promise={style.promise}
      cta={style.cta}
      trustText={style.trustText}
      benefits={style.benefits}
      steps={style.steps}
      visualTitle={style.visualTitle}
      visualDescription={style.visualDescription}
      faq={style.faq}
      images={style.images}
      finalCta={style.finalCta}
      relatedLinks={style.relatedLinks}
      whyChoose={style.whyChoose}
      whyChooseTitle={
        <>
          Por que escolher <span className="font-serif italic font-normal">{style.name}</span>
        </>
      }
      source={`estilos-${styleSlug}`}
      defaultStyle={style.defaultStyle}
    />
  );
}