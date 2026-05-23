import { createFileRoute, redirect } from "@tanstack/react-router";
import { SEO_ROOMS, type RoomSlug } from "@/lib/seo-rooms-data";
import { ExpandedLanding } from "@/components/ExpandedLanding";

/** Type guard: o slug recebido é um cômodo conhecido do mapa de SEO. */
function isRoomSlug(slug: string): slug is RoomSlug {
  return Object.prototype.hasOwnProperty.call(SEO_ROOMS, slug);
}

/** Nome curto do cômodo para uso no breadcrumb estruturado (JSON-LD). */
function roomName(slug: RoomSlug): string {
  return slug === "home-office" ? "Home office" : slug.charAt(0).toUpperCase() + slug.slice(1);
}

export const Route = createFileRoute("/ambientes/$roomSlug")({
  // Slug desconhecido: redireciona pra Home antes de qualquer renderização.
  loader: ({ params }) => {
    if (!isRoomSlug(params.roomSlug)) {
      throw redirect({ to: "/" });
    }
    return { roomSlug: params.roomSlug };
  },
  // Metadados de SEO dinâmicos por cômodo.
  head: ({ params }) => {
    const slug = params.roomSlug;
    if (!isRoomSlug(slug)) return {};
    const room = SEO_ROOMS[slug];
    return {
      meta: [
        { title: room.title },
        { name: "description", content: room.description },
        { property: "og:title", content: room.title },
        { property: "og:description", content: room.description },
      ],
      links: [{ rel: "canonical", href: `https://idealspace.com.br/ambientes/${slug}` }],
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
              {
                "@type": "ListItem",
                position: 2,
                name: roomName(slug),
                item: `https://idealspace.com.br/ambientes/${slug}`,
              },
            ],
          }),
        },
      ],
    };
  },
  component: AmbientePage,
});

function AmbientePage() {
  const { roomSlug } = Route.useLoaderData();
  const room = SEO_ROOMS[roomSlug];

  return (
    <ExpandedLanding
      h1={room.h1}
      promise={room.promise}
      cta={room.cta}
      benefits={room.benefits}
      faq={room.faq}
      images={room.images}
      source={`ambientes-${roomSlug}`}
      defaultRoomType={room.defaultRoomType}
    />
  );
}
