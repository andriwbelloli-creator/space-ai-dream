import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SEO_ROOMS, type RoomSlug } from "@/lib/seo-rooms-data";
import { ArrowRight, Sparkles } from "lucide-react";

const LeadFormModal = lazy(() =>
  import("@/components/LeadFormModal").then((m) => ({ default: m.LeadFormModal })),
);

/** Fallback leve enquanto o chunk do modal carrega sob demanda. */
const modalFallback = (
  <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
  </div>
);

/** Type guard: o slug recebido é um cômodo conhecido do mapa de SEO. */
function isRoomSlug(slug: string): slug is RoomSlug {
  return Object.prototype.hasOwnProperty.call(SEO_ROOMS, slug);
}

/**
 * Renderiza o H1: o trecho entre `*asteriscos*` ganha o destaque serifado,
 * o resto fica como texto comum. Ex.: "Simule a *Decoração* com IA".
 */
function renderHeadline(text: string) {
  return text.split(/\*([^*]+)\*/g).map((segment, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-serif italic font-normal text-accent">
        {segment}
      </span>
    ) : (
      <span key={i}>{segment}</span>
    ),
  );
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
    };
  },
  component: AmbientePage,
});

function AmbientePage() {
  const { roomSlug } = Route.useLoaderData();
  const room = SEO_ROOMS[roomSlug];
  const [leadOpen, setLeadOpen] = useState(false);
  // Monta o modal lazy só na 1ª abertura e o mantém montado (preserva animações).
  const [leadMounted, setLeadMounted] = useState(false);
  useEffect(() => {
    if (leadOpen) setLeadMounted(true);
  }, [leadOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header — navegação padrão */}
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="h-7 w-7 rounded-xl bg-foreground text-background grid place-items-center text-xs">
              IS
            </span>
            Ideal Space
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition">
              Início
            </Link>
            <Link to="/pricing" className="hover:text-foreground transition">
              Planos
            </Link>
          </nav>
          <Link
            to="/"
            className="text-sm rounded-full border h-9 px-4 inline-flex items-center hover:bg-muted"
          >
            Voltar
          </Link>
        </div>
      </header>

      {/* Hero do ambiente */}
      <section className="pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Decoração com IA
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] font-semibold leading-[1.05]">
            {renderHeadline(room.h1)}
          </h1>

          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">{room.promise}</p>

          {/* CTA de destaque — responsivo */}
          <div className="mt-9">
            <Button
              onClick={() => setLeadOpen(true)}
              className="h-12 w-full sm:w-auto rounded-full px-8 text-base bg-accent text-accent-foreground hover:opacity-95"
            >
              {room.cta}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {leadMounted && (
        <Suspense fallback={modalFallback}>
          <LeadFormModal
            open={leadOpen}
            onOpenChange={setLeadOpen}
            source={`ambientes-${roomSlug}`}
            defaultRoomType={room.defaultRoomType}
          />
        </Suspense>
      )}
    </div>
  );
}
