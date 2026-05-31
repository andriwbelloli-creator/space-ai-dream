import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  SquareSplitHorizontal,
  ShoppingBag,
  Calculator,
} from "lucide-react";

import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { HeroBeforeAfter } from "@/components/editorial/HeroBeforeAfter";
import { EditorialCardsRow } from "@/components/editorial/EditorialCardsRow";
import { PlansBlock } from "@/components/editorial/PlansBlock";
import { Footer } from "@/components/Footer";

// Assets — par before/after da Sala Japandi (mockup) + 3 imagens dos cards.
import emptyLiving from "@/assets/empty-living.jpg";
import decoratedLiving from "@/assets/decorated-living-warm.jpg";
import moodboardImg from "@/assets/moodboard-pro.jpg";
import materiaisImg from "@/assets/decorated-living.jpg";
import listaComprasImg from "@/assets/decorated-bedroom.jpg";

// Modais carregados sob demanda — preserva ?upload=1 deeplink usado por
// /_authenticated/projetos e LeadFormModal pra captura via CTAs.
const UploadPhotoModal = lazy(() =>
  import("@/components/UploadPhotoModal").then((m) => ({ default: m.UploadPhotoModal })),
);
const LeadFormModal = lazy(() =>
  import("@/components/LeadFormModal").then((m) => ({ default: m.LeadFormModal })),
);

const modalFallback = (
  <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
  </div>
);

// Query param opcional `?upload=1` abre o UploadPhotoModal automaticamente
// no mount. Mantido pra preservar o deeplink "+ Novo projeto" vindo de
// /projetos -> /?upload=1 sem precisar de pagina dedicada.
type IndexSearch = { upload?: "1" };

export const Route = createFileRoute("/")({
  validateSearch: (search): IndexSearch => ({
    upload: search.upload === "1" ? "1" : undefined,
  }),
  component: Index,
  head: () => ({
    meta: [
      { title: "Ideal Space | Design de interiores com IA, projeto 2D, 5D e planta baixa" },
      {
        name: "description",
        content:
          "Design de interiores com IA. Gere ambientes decorados em 2D a partir de uma foto, com lista de compras e orçamento estimado. Recursos de planejamento 5D e planta baixa em breve.",
      },
      {
        name: "keywords",
        content:
          "design de interiores com IA, projeto 2D com IA, projeto 5D de interiores, planta baixa com IA, layout de ambientes com IA, decoração com IA, virtual staging, planejamento de interiores, IA para arquitetos, IA para designers de interiores",
      },
    ],
    links: [{ rel: "canonical", href: "https://idealspace.com.br/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://idealspace.com.br/#organization",
              name: "Ideal Space",
              url: "https://idealspace.com.br",
              logo: "https://idealspace.com.br/icon-512.png",
            },
            {
              "@type": "WebSite",
              "@id": "https://idealspace.com.br/#website",
              name: "Ideal Space",
              url: "https://idealspace.com.br",
              inLanguage: "pt-BR",
              publisher: { "@id": "https://idealspace.com.br/#organization" },
            },
          ],
        }),
      },
    ],
  }),
});

function Index() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  // Upload modal — abre via CTA primário ou via ?upload=1.
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadMounted, setUploadMounted] = useState(false);
  // Lead modal — usado pelo header CTA + secondary CTA opcional.
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadMounted, setLeadMounted] = useState(false);

  useEffect(() => {
    if (uploadOpen) setUploadMounted(true);
  }, [uploadOpen]);
  useEffect(() => {
    if (leadOpen) setLeadMounted(true);
  }, [leadOpen]);

  // ?upload=1 → abre upload uma vez e limpa o query param.
  useEffect(() => {
    if (search.upload === "1") {
      setUploadOpen(true);
      navigate({ to: "/", search: {}, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.upload]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorialHeader onCtaClick={() => setUploadOpen(true)} />

      <HeroBeforeAfter
        heading={
          <>
            Transforme seu ambiente antes de reformar
          </>
        }
        subtitle="IA, curadoria e orçamento para visualizar sua casa pronta com segurança."
        primaryCta="Criar meu primeiro ambiente"
        onPrimaryClick={() => setUploadOpen(true)}
        secondaryCta="Ver antes/depois"
        onSecondaryClick={() => {
          const el = document.getElementById("cards-editoriais");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        beforeImage={emptyLiving}
        afterImage={decoratedLiving}
        alt="Sala vazia transformada em ambiente Japandi"
        features={[
          { icon: SquareSplitHorizontal, title: "Antes/depois realista" },
          { icon: ShoppingBag, title: "Lista de compras" },
          { icon: Calculator, title: "Orçamento guiado" },
        ]}
      />

      <div id="cards-editoriais" />
      <EditorialCardsRow
        cards={[
          {
            image: moodboardImg,
            alt: "Moodboard com paleta de cores e materiais",
            title: "Moodboard",
            meta: (
              <div className="flex items-center gap-1.5">
                {["#e8dccb", "#f0e6d6", "#7a8a72", "#b8694b", "#5a4438"].map((c) => (
                  <span
                    key={c}
                    className="h-4 w-4 rounded-full ring-1 ring-border/60"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            ),
            to: "/estilos/japandi",
          },
          {
            image: materiaisImg,
            alt: "Amostras de materiais — madeira, tecido e metal",
            title: "Materiais",
            meta: (
              <div className="space-y-1.5">
                <div className="h-1.5 w-20 rounded-full bg-border/70" />
                <div className="h-1.5 w-16 rounded-full bg-border/50" />
              </div>
            ),
            to: "/ambientes/sala",
          },
          {
            image: listaComprasImg,
            alt: "Lista de compras com itens, quantidade e preço",
            title: "Lista de compras",
            meta: (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  <span>Item</span>
                  <span>Qtd.</span>
                  <span>Preço</span>
                </div>
                <div className="h-px w-full bg-border/60" />
              </div>
            ),
            to: "/pricing",
          },
        ]}
      />

      <PlansBlock />

      <Footer />

      {uploadMounted && (
        <Suspense fallback={modalFallback}>
          <UploadPhotoModal open={uploadOpen} onOpenChange={setUploadOpen} />
        </Suspense>
      )}
      {leadMounted && (
        <Suspense fallback={modalFallback}>
          <LeadFormModal
            open={leadOpen}
            onOpenChange={setLeadOpen}
            source="home-editorial"
          />
        </Suspense>
      )}
    </div>
  );
}
