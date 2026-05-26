/**
 * Rota combinatória — Lote B SEO long-tail.
 *
 * Pattern: `/estilos/$styleSlug/$roomSlug`
 * Ex: /estilos/japandi/quarto, /estilos/luxo/banheiro, /estilos/minimalista/cozinha
 *
 * Combina 16 estilos × 11 ambientes = 176 landing pages combinatórias.
 * Cada uma reusa SEO_STYLES + SEO_ROOMS pra title/h1/promise/benefits/FAQ
 * customizados pro par específico.
 *
 * Schema.org: BreadcrumbList (Home > Estilos > Style > Room) + HowTo
 * (3 passos do "Como funciona") + FAQPage. Maximiza rich snippets.
 *
 * Cross-linking: cada combo lista 3 outros combos relacionados (mesmo
 * estilo em outros ambientes, mesmo ambiente em outros estilos) pra
 * distribuir autoridade SEO interna.
 */
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { SEO_STYLES, type StyleSlug } from "@/lib/seo-styles-data";
import { SEO_ROOMS, type RoomSlug } from "@/lib/seo-rooms-data";
import { ExpandedLanding } from "@/components/ExpandedLanding";
import { faqPageJsonLd } from "@/lib/structured-data";

function isStyleSlug(slug: string): slug is StyleSlug {
  return Object.prototype.hasOwnProperty.call(SEO_STYLES, slug);
}
function isRoomSlug(slug: string): slug is RoomSlug {
  return Object.prototype.hasOwnProperty.call(SEO_ROOMS, slug);
}

/** Nome legível do cômodo (deriva do slug). */
const ROOM_LABEL: Record<RoomSlug, string> = {
  sala: "sala",
  quarto: "quarto",
  cozinha: "cozinha",
  "home-office": "home office",
  banheiro: "banheiro",
  "sala-jantar": "sala de jantar",
  closet: "closet",
  "varanda-gourmet": "varanda gourmet",
  "quarto-infantil": "quarto infantil",
  lavabo: "lavabo",
  "sala-tv": "sala de TV",
};

export const Route = createFileRoute("/estilos/$styleSlug/$roomSlug")({
  loader: ({ params }) => {
    if (!isStyleSlug(params.styleSlug) || !isRoomSlug(params.roomSlug)) {
      throw redirect({ to: "/" });
    }
    return { styleSlug: params.styleSlug, roomSlug: params.roomSlug };
  },
  head: ({ params }) => {
    const sSlug = params.styleSlug;
    const rSlug = params.roomSlug;
    if (!isStyleSlug(sSlug) || !isRoomSlug(rSlug)) return {};

    const style = SEO_STYLES[sSlug];
    const room = SEO_ROOMS[rSlug];
    const roomLabel = ROOM_LABEL[rSlug];

    const url = `https://idealspace.com.br/estilos/${sSlug}/${rSlug}`;
    const title = `${style.name} para ${capitalize(roomLabel)} | Ideal Space`;
    const description = `Veja seu ${roomLabel} decorado no estilo ${style.name} com IA. Envie uma foto, escolha o estilo e receba inspiração visual com lista de compras e orçamento estimado.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        // 1. BreadcrumbList — Home > Estilos > [Style] > [Room]
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
              {
                "@type": "ListItem",
                position: 2,
                name: style.name,
                item: `https://idealspace.com.br/estilos/${sSlug}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: capitalize(roomLabel),
                item: url,
              },
            ],
          }),
        },
        // 2. HowTo — passos pro Google mostrar rich snippet "como decorar"
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `Como decorar ${roomLabel} no estilo ${style.name} com IA`,
            description,
            totalTime: "PT1M",
            step: [
              {
                "@type": "HowToStep",
                name: `Envie uma foto do seu ${roomLabel}`,
                text: `Use uma foto real do ${roomLabel} como ele está hoje. Iluminação natural ajuda no resultado.`,
                position: 1,
              },
              {
                "@type": "HowToStep",
                name: `Escolha o estilo ${style.name}`,
                text: `A IA mantém a estrutura real do ambiente e propõe móveis, paleta e composição com toques ${style.name}.`,
                position: 2,
              },
              {
                "@type": "HowToStep",
                name: "Veja antes/depois e lista de compras",
                text: "Receba uma inspiração visual com sugestões de produtos reais e faixa de preço estimada.",
                position: 3,
              },
            ],
          }),
        },
        // 3. FAQPage — mescla FAQ do estilo + FAQ do ambiente (até 6 itens)
        faqPageJsonLd([...style.faq.slice(0, 3), ...room.faq.slice(0, 3)]),
      ],
    };
  },
  component: EstiloComboPage,
});

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function EstiloComboPage() {
  const { styleSlug, roomSlug } = Route.useLoaderData();
  const style = SEO_STYLES[styleSlug];
  const room = SEO_ROOMS[roomSlug];
  const roomLabel = ROOM_LABEL[roomSlug];

  // Combinação de conteúdo: SEM duplicar copy 1:1. Mescla benefits e FAQ,
  // gera promise customizado, cross-link com outros combos relacionados.

  const h1 = `Veja seu *${roomLabel}* no estilo ${style.name}`;
  const promise = `${room.promise.slice(0, 200).trim()}. Aplicamos especificamente o estilo ${style.name}: ${style.promise.split(".")[1]?.trim() ?? style.promise.slice(0, 150)}.`;
  const cta = `Testar ${style.name} no meu ${roomLabel}`;

  // Mescla benefits: pega 3 do estilo + 3 do ambiente = 6 únicos
  const benefits = [...style.benefits.slice(0, 3), ...room.benefits.slice(0, 3)];

  // FAQ combinado (até 6)
  const faq = [...style.faq.slice(0, 3), ...room.faq.slice(0, 3)];

  // Cross-linking: mesmo estilo em outros 3 ambientes + mesmo ambiente em outros 3 estilos
  const otherRoomsForStyle: RoomSlug[] = (Object.keys(SEO_ROOMS) as RoomSlug[])
    .filter((r) => r !== roomSlug)
    .slice(0, 3);
  const otherStylesForRoom: StyleSlug[] = (Object.keys(SEO_STYLES) as StyleSlug[])
    .filter((s) => s !== styleSlug)
    .slice(0, 3);

  const relatedLinks = [
    ...otherRoomsForStyle.map((r) => ({
      href: `/estilos/${styleSlug}/${r}`,
      label: `${style.name} para ${ROOM_LABEL[r]}`,
    })),
    ...otherStylesForRoom.map((s) => ({
      href: `/estilos/${s}/${roomSlug}`,
      label: `${SEO_STYLES[s].name} no ${roomLabel}`,
    })),
  ];

  return (
    <>
      <ExpandedLanding
        h1={h1}
        promise={promise}
        cta={cta}
        trustText={`Sem cartão. Inspiração visual + lista de compras pro seu ${roomLabel}.`}
        benefits={benefits}
        steps={style.steps ?? room.steps}
        visualTitle={`${capitalize(roomLabel)} no estilo ${style.name}: veja a transformação`}
        visualDescription={`Exemplo de ${roomLabel} decorado no estilo ${style.name}. Arraste para comparar antes e depois.`}
        faq={faq}
        images={style.images}
        finalCta={`Aplicar ${style.name} no meu ${roomLabel}`}
        relatedLinks={relatedLinks}
        whyChoose={style.whyChoose}
        whyChooseTitle={
          <>
            Por que <span className="font-serif italic font-normal">{style.name}</span> combina com {roomLabel}
          </>
        }
        source={`estilos-${styleSlug}-${roomSlug}`}
        defaultStyle={style.defaultStyle}
        defaultRoomType={room.defaultRoomType}
      />

      {/* Cross-linking adicional — bloco discreto pra distribuir PageRank
          interno entre combos. Aparece após o final da landing.
          Listas independentes pra Google entender "este combo se relaciona
          com X e Y". */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-border/60">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {style.name} em outros ambientes
            </h2>
            <ul className="space-y-2">
              {otherRoomsForStyle.map((r) => (
                <li key={r}>
                  <Link
                    to="/estilos/$styleSlug/$roomSlug"
                    params={{ styleSlug, roomSlug: r }}
                    className="text-sm text-foreground hover:text-accent underline-offset-4 hover:underline"
                  >
                    {style.name} para {ROOM_LABEL[r]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/estilos/$styleSlug"
                  params={{ styleSlug }}
                  className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  Ver todos os ambientes com {style.name} →
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {capitalize(roomLabel)} em outros estilos
            </h2>
            <ul className="space-y-2">
              {otherStylesForRoom.map((s) => (
                <li key={s}>
                  <Link
                    to="/estilos/$styleSlug/$roomSlug"
                    params={{ styleSlug: s, roomSlug }}
                    className="text-sm text-foreground hover:text-accent underline-offset-4 hover:underline"
                  >
                    {SEO_STYLES[s].name} no {roomLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/ambientes/$roomSlug"
                  params={{ roomSlug }}
                  className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  Ver todos os estilos pra {roomLabel} →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
