import { createFileRoute, redirect } from "@tanstack/react-router";
import { SEO_STYLES, type StyleSlug } from "@/lib/seo-styles-data";
import { ExpandedLanding } from "@/components/ExpandedLanding";

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
      benefits={style.benefits}
      faq={style.faq}
      images={style.images}
      source={`estilos-${styleSlug}`}
      defaultStyle={style.defaultStyle}
    />
  );
}
