import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { BeforeAfter } from "@/components/BeforeAfter";
import { PresentationModal } from "@/components/PresentationModal";
import { CourseModal } from "@/components/CourseModal";
import { RewardModal, type RewardKind } from "@/components/RewardModal";
import { generateBudgetPdf } from "@/lib/budget-pdf";
import { buildAffiliateLinks } from "@/lib/affiliate";
import { logEvent } from "@/lib/tracking.functions";
import { PLANS, formatPlanPrice } from "@/lib/plans";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/hooks/use-credits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Check,
  Lock,
  Image as ImageIcon,
  Wand2,
  ShoppingBag,
  Download,
  Menu,
  ShieldCheck,
  FileText,
  Building2,
  Briefcase,
  HomeIcon,
  Stethoscope,
  ChevronDown,
  ChevronRight,
  Zap,
  PlayCircle,
  Camera,
  Smartphone,
  BookmarkPlus,
  Gift,
  Layers,
  Ruler,
  LayoutGrid,
  Compass,
  Pencil,
} from "lucide-react";

// All marketing imagery — single source of truth, one image per section.
import { imagesFor, pair, img } from "@/lib/image-catalog";

const heroPair = pair("hero-living");
const emptyLiving = heroPair.empty!.src;
const decoratedLiving = heroPair.decorated!.src;

const featuredBaPair = pair("ba-bathroom");
const showcasePair = pair("show-kitchen");

// Modais pesados carregados sob demanda — reduz o JS inicial e melhora o LCP.
/** Import isolado do modal de upload — permite pré-carregar o chunk. */
const loadUploadModal = () => import("@/components/UploadPhotoModal");
const UploadPhotoModal = lazy(() =>
  loadUploadModal().then((m) => ({ default: m.UploadPhotoModal })),
);
const LeadFormModal = lazy(() =>
  import("@/components/LeadFormModal").then((m) => ({ default: m.LeadFormModal })),
);

/** Fallback leve enquanto o chunk do modal carrega sob demanda. */
const modalFallback = (
  <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
  </div>
);

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ideal Space — Design de interiores com IA, projeto 2D, 5D e planta baixa" },
      {
        name: "description",
        content:
          "Plataforma de design de interiores com IA: gere ambientes decorados em 2D, evolua para planejamento 5D com orçamento e lista de compras, e veja recursos de planta baixa e projeto arquitetônico para designers, arquitetos e imobiliárias.",
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

/* ----------------------------- DATA ----------------------------- */

/**
 * Rooms + styles consume the catalog. Copy lives next to the image id so the
 * marketing strings travel with their visual, but the asset itself is owned
 * by `src/lib/image-catalog.ts` — guaranteeing no overlap across sections.
 */
const ROOM_META: Record<string, { badge: string; sub: string; title?: string }> = {
  "empty-bedroom": { badge: "Aconchegante", sub: "Sono, descanso e estilo", title: "Quarto vazio" },
  "empty-kitchen": { badge: "Premium", sub: "Funcional e bonita", title: "Cozinha simples" },
  "empty-office": {
    badge: "Profissional",
    sub: "Foco, conforto e estética",
    title: "Home office vazio",
  },
  "empty-studio": {
    badge: "Espaço pequeno",
    sub: "Aproveite cada metro",
    title: "Studio compacto",
  },
  "empty-bathroom": {
    badge: "Reforma virtual",
    sub: "Visualize antes de comprar",
    title: "Banheiro vazio",
  },
  "empty-dining": {
    badge: "Receber bem",
    sub: "Convívio e personalidade",
    title: "Sala de jantar",
  },
};
const emptyRooms = imagesFor("empty-carousel").map((i) => ({
  img: i.src,
  title: ROOM_META[i.id]?.title ?? i.alt,
  badge: ROOM_META[i.id]?.badge ?? "Ambiente",
  sub: ROOM_META[i.id]?.sub ?? "",
}));

const STYLE_META: Record<string, { name: string; sub: string; styleId: string }> = {
  "style-japandi": { name: "Japandi", sub: "Calma, oak e linho", styleId: "japandi" },
  "style-scandi": { name: "Escandinavo", sub: "Claro, leve, neutro", styleId: "minimal" },
  "style-modern": { name: "Contemporâneo", sub: "Linhas suaves e arte", styleId: "modern" },
  "style-industrial": { name: "Industrial", sub: "Tijolo, metal e couro", styleId: "industrial" },
  "style-luxo": { name: "Luxo discreto", sub: "Nobreza e brass", styleId: "luxe" },
  "style-natural": { name: "Natural", sub: "Fibras, plantas, cerâmica", styleId: "natural" },
};
const styles = imagesFor("style-carousel").map((i) => ({
  img: i.src,
  name: STYLE_META[i.id]?.name ?? i.alt,
  sub: STYLE_META[i.id]?.sub ?? "",
  styleId: STYLE_META[i.id]?.styleId ?? "japandi",
}));

const shoppingList = [
  { tag: "Essencial", name: "Sofá 3 lugares", cat: "Móveis principais", price: "R$ 1.200–3.500" },
  { tag: "Essencial", name: "Mesa de centro oval", cat: "Móveis principais", price: "R$ 300–900" },
  { tag: "Recomendado", name: "Luminária de piso", cat: "Iluminação", price: "R$ 180–600" },
  { tag: "Recomendado", name: "Poltrona linho", cat: "Móveis", price: "R$ 700–1.800" },
  { tag: "Opcional", name: "Tapete neutro 2x3", cat: "Decoração", price: "R$ 250–900" },
  { tag: "Opcional", name: "Vaso + planta grande", cat: "Decoração", price: "R$ 120–450" },
  { tag: "Opcional", name: "Quadro emoldurado", cat: "Arte", price: "R$ 90–350" },
] as const;

type GalleryBadge = "2D IA" | "5D" | "Planta baixa" | "Arquitetônico" | "Virtual staging";
type GalleryFilter = "Todos" | "2D" | "5D" | "Planta baixa" | "Arquitetônico" | "Profissional";

const GALLERY_META: Record<
  string,
  {
    title: string;
    badge: GalleryBadge;
    tags: ReadonlyArray<GalleryFilter>;
    cta: string;
    soon?: boolean;
  }
> = {
  "g-living-warm": {
    title: "Sala moderna decorada",
    badge: "2D IA",
    tags: ["2D"],
    cta: "Gerar parecido",
  },
  "g-bedroom": {
    title: "Quarto japandi sereno",
    badge: "2D IA",
    tags: ["2D"],
    cta: "Gerar parecido",
  },
  "g-loft": {
    title: "Loft industrial integrado",
    badge: "Virtual staging",
    tags: ["2D", "Profissional"],
    cta: "Ver projeto",
  },
  "g-varanda": {
    title: "Varanda urbana ao pôr do sol",
    badge: "2D IA",
    tags: ["2D"],
    cta: "Gerar parecido",
  },
  "g-dining": {
    title: "Projeto completo com orçamento",
    badge: "5D",
    tags: ["5D"],
    cta: "Ver projeto",
    soon: true,
  },
  "g-floorplan": {
    title: "Layout de apartamento compacto",
    badge: "Planta baixa",
    tags: ["Planta baixa", "Profissional"],
    cta: "Ver layout",
    soon: true,
  },
  "g-moodboard": {
    title: "Moodboard arquitetônico",
    badge: "Arquitetônico",
    tags: ["Arquitetônico", "Profissional"],
    cta: "Explorar",
    soon: true,
  },
  "g-office": {
    title: "Home office natural",
    badge: "2D IA",
    tags: ["2D", "Profissional"],
    cta: "Gerar parecido",
  },
  "g-clinic": {
    title: "Consultório acolhedor",
    badge: "Virtual staging",
    tags: ["2D", "Profissional"],
    cta: "Gerar parecido",
  },
};

/** Mapeia o nome PT dos estilos do image-catalog para o id en usado no
 * UploadPhotoModal (props.initialStyle / state `style`). */
const STYLE_NAME_TO_ID: Record<string, string> = {
  moderno: "modern",
  japandi: "japandi",
  industrial: "industrial",
  natural: "natural",
  luxo: "luxe",
  minimalista: "minimal",
  escandinavo: "minimal",
};

const gallery: ReadonlyArray<{
  img: string;
  title: string;
  badge: GalleryBadge;
  tags: ReadonlyArray<GalleryFilter>;
  cta: string;
  soon?: boolean;
  style?: string;
}> = imagesFor("gallery").map((i) => {
  const meta = GALLERY_META[i.id];
  if (!meta) throw new Error(`[index] Missing gallery meta for ${i.id}`);
  const styleId = i.style ? STYLE_NAME_TO_ID[i.style] : undefined;
  return { img: i.src, ...meta, style: styleId };
});

const RANKING_META: Record<string, { title: string; sub: string }> = {
  "rank-minimal-bedroom": {
    title: "Quarto minimalista",
    sub: "Estilo Minimalista",
  },
  "rank-bathroom": { title: "Banheiro travertino", sub: "Estilo Luxo discreto" },
  "rank-kitchen": { title: "Cozinha quiet luxury", sub: "Estilo Luxo discreto" },
};
const ranking = imagesFor("ranking").map((i, idx) => ({
  pos: idx + 1,
  img: i.src,
  alt: i.alt,
  title: RANKING_META[i.id]?.title ?? i.alt,
  sub: RANKING_META[i.id]?.sub ?? "",
  room: i.room,
  style: i.style,
}));

const filterList: ReadonlyArray<GalleryFilter> = [
  "Todos",
  "2D",
  "5D",
  "Planta baixa",
  "Arquitetônico",
  "Profissional",
];

// Planos: src/lib/plans.ts (fonte única — /pricing + home)

const faqs = [
  {
    q: "Como funciona a geração 2D com IA?",
    a: "Você envia uma foto do ambiente vazio, escolhe um estilo e a IA gera uma versão decorada preservando a estrutura do espaço.",
  },
  {
    q: "O que é o planejamento 5D?",
    a: "É a evolução do projeto 2D que conecta a imagem decorada à lista de compras, produtos sugeridos e orçamento. Alguns recursos estão em evolução.",
  },
  {
    q: "Vocês têm planta baixa?",
    a: "A visualização básica de planta baixa e estudo de layout está em desenvolvimento e ficará disponível no plano Pro.",
  },
  {
    q: "As medidas e produtos são reais?",
    a: "As imagens são ilustrativas. Os produtos sugeridos têm faixas de preço estimadas e podem variar conforme loja e disponibilidade.",
  },
  {
    q: "Minhas fotos ficam públicas?",
    a: "Não. Suas fotos são privadas e nunca são publicadas sem sua autorização explícita.",
  },
  {
    q: "Já existe cobrança ou assinatura paga?",
    a: "Ainda não. Nesta etapa o uso é gratuito — os planos pagos serão liberados no lançamento, sem cobrança agora.",
  },
];

/* ----------------------------- PAGE ----------------------------- */

function Index() {
  const { user } = useAuth();
  const [affiliateOpen, setAffiliateOpen] = useState<null | string>(null);
  const track = useServerFn(logEvent);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [initialStyle, setInitialStyle] = useState<string | undefined>(undefined);
  const [courseOpen, setCourseOpen] = useState(false);
  const [reward, setReward] = useState<RewardKind | null>(null);
  // Funil de leads: contexto do CTA de plano que abriu o modal comercial.
  const [lead, setLead] = useState<{ planInterest?: string; title?: string } | null>(null);
  // Monta cada modal lazy só na 1ª abertura e o mantém montado (preserva animações).
  const [uploadMounted, setUploadMounted] = useState(false);
  const [leadMounted, setLeadMounted] = useState(false);
  useEffect(() => {
    if (uploadOpen) setUploadMounted(true);
  }, [uploadOpen]);
  useEffect(() => {
    if (lead !== null) setLeadMounted(true);
  }, [lead]);

  // Pré-carrega o chunk do modal de upload após o load — assim o primeiro
  // clique no CTA "Criar projeto com IA" abre o modal na hora.
  useEffect(() => {
    const t = window.setTimeout(() => {
      void loadUploadModal();
    }, 1200);
    return () => window.clearTimeout(t);
  }, []);

  const handlePresentation = (open: boolean) => {
    setPresentationOpen(open);
    if (open) {
      void track({ data: { event: "demo_viewed" } }).catch(() => {});
    }
    if (!open) {
      try {
        window.localStorage.setItem("is_presentation_seen", "1");
      } catch {
        /* ignore */
      }
    }
  };

  const openReward = (k: RewardKind) => setReward(k);
  const handleReward = (k: RewardKind) => {
    if (k === "budget") {
      generateBudgetPdf({
        project: "Sala de estar · Luxo discreto",
        items: shoppingList,
        estimate: "R$ 3.000 – 8.000",
      });
    }
  };

  const openUpload = () => {
    setInitialStyle(undefined);
    setUploadOpen(true);
  };
  const openUploadWithStyle = (styleId: string) => {
    setInitialStyle(styleId);
    setUploadOpen(true);
  };

  // Retoma o fluxo de criação após login: se o usuário foi mandado ao /login
  // pelo muro de geração, reabrimos o modal de upload quando ele volta logado.
  useEffect(() => {
    if (!user) return;
    let flag: string | null = null;
    try {
      flag = window.sessionStorage.getItem("is_resume_create");
    } catch {
      /* ignore */
    }
    if (flag === "1") {
      try {
        window.sessionStorage.removeItem("is_resume_create");
      } catch {
        /* ignore */
      }
      openUpload();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onDemo={() => handlePresentation(true)} onUpload={openUpload} />
      <Hero
        onBudget={() => openReward("budget")}
        onAffiliate={setAffiliateOpen}
        onDemo={() => handlePresentation(true)}
        onUpload={openUpload}
      />
      <Marquee />
      <EmptyRoomsCarousel onUpload={openUpload} />
      <StylesCarousel onPickStyle={openUploadWithStyle} onUpload={openUpload} />
      <HowItWorks onDemo={() => handlePresentation(true)} />
      <FeaturedBeforeAfter />
      <ResultShowcase
        onBudget={() => openReward("budget")}
        onAffiliate={setAffiliateOpen}
        onReward={openReward}
      />
      <InspirationGallery onUpload={openUpload} onPickStyle={openUploadWithStyle} />
      <RankingStrip onUpload={openUpload} />
      <Professionals onUpload={openUpload} onCourse={() => setCourseOpen(true)} />
      <Pricing
        onReward={openReward}
        onLead={(planInterest) =>
          setLead({
            planInterest,
            title: planInterest === "pro" ? "Fale com vendas" : undefined,
          })
        }
      />
      <Trust />
      <FAQ />
      <Footer />

      <MobileBottomNav onUpload={openUpload} onShopping={() => openReward("budget")} />

      <PresentationModal
        open={presentationOpen}
        onOpenChange={handlePresentation}
        onCreate={openUpload}
        before={emptyLiving}
        after={decoratedLiving}
      />
      {uploadMounted && (
        <Suspense fallback={modalFallback}>
          <UploadPhotoModal
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            initialStyle={initialStyle}
          />
        </Suspense>
      )}
      <CourseModal
        open={courseOpen}
        onOpenChange={setCourseOpen}
        onEnroll={() => {
          setCourseOpen(false);
          openReward("budget");
        }}
      />

      <RewardModal
        open={!!reward}
        kind={reward}
        onOpenChange={(o) => !o && setReward(null)}
        onSuccess={(k) => handleReward(k)}
      />

      {leadMounted && (
        <Suspense fallback={modalFallback}>
          <LeadFormModal
            open={lead !== null}
            onOpenChange={(o) => !o && setLead(null)}
            source="home"
            planInterest={lead?.planInterest}
            title={lead?.title}
          />
        </Suspense>
      )}

      <Dialog open={!!affiliateOpen} onOpenChange={(o) => !o && setAffiliateOpen(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Escolha onde comprar</DialogTitle>
            <DialogDescription>
              Opções parecidas em lojas parceiras e marketplaces.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border bg-muted/40 p-4">
            <div className="text-sm font-medium">{affiliateOpen ?? "Item"}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Buscamos esse item nas lojas parceiras.
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {affiliateOpen &&
              buildAffiliateLinks(affiliateOpen).map((m) => (
                <Button
                  key={m.id}
                  asChild
                  variant="outline"
                  className="h-11 rounded-xl justify-between"
                >
                  <a
                    href={m.url}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    onClick={() => {
                      void track({
                        data: {
                          event: "affiliate_click",
                          props: {
                            provider: m.id,
                            productName: affiliateOpen,
                            productUrl: m.url,
                            source: "home_buy_dialog",
                          },
                        },
                      }).catch(() => {});
                    }}
                  >
                    <span>Ver na {m.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            {affiliateOpen && (
              <Button
                asChild
                variant="ghost"
                className="h-11 rounded-xl justify-between text-muted-foreground"
              >
                <a
                  href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(affiliateOpen)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    void track({
                      data: {
                        event: "affiliate_click",
                        props: {
                          provider: "google_shopping",
                          productName: affiliateOpen,
                          source: "home_buy_dialog",
                        },
                      },
                    }).catch(() => {});
                  }}
                >
                  <span>Buscar no Google Shopping</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Alguns links podem gerar comissão para o Ideal Space, sem custo adicional para você. Os
            preços e disponibilidade podem variar.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ----------------------------- HEADER ----------------------------- */

function Header({ onDemo, onUpload }: { onDemo: () => void; onUpload: () => void }) {
  const { user, signOut } = useAuth();
  const { credits } = useCredits();
  // Display name e inicial: user_metadata.full_name/name (Google OAuth) →
  // fallback no local-part do e-mail. Computado fora do JSX pra não duplicar
  // entre o cluster desktop e a seção mobile.
  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const displayName = meta.full_name || meta.name || user?.email?.split("@")[0] || "Conta";
  const initial = (displayName || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" aria-label="Ideal Space — página inicial">
          <IdealSpaceLogo />
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
          <button onClick={onDemo} className="hover:text-foreground transition">
            Como funciona
          </button>
          <a className="hover:text-foreground transition" href="#ambientes">
            Ambientes
          </a>
          <a className="hover:text-foreground transition" href="#estilos">
            Estilos
          </a>
          <a className="hover:text-foreground transition" href="#galeria">
            Galeria
          </a>
          <a className="hover:text-foreground transition" href="#pro">
            Para profissionais
          </a>
          <Link to="/pricing" className="hover:text-foreground transition">
            Planos
          </Link>
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          {!user && (
            <Button asChild variant="ghost" className="text-sm">
              <Link to="/login">Entrar</Link>
            </Button>
          )}
          {user && (
            <>
              <Link
                to="/projetos"
                className="text-sm text-muted-foreground hover:text-foreground transition px-2"
              >
                Meus Projetos
              </Link>
              {credits && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground whitespace-nowrap">
                  {credits.unlimited
                    ? "Ilimitado"
                    : `${credits.balance} ${credits.balance === 1 ? "crédito" : "créditos"}`}
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 h-9 pl-1 pr-2 rounded-full hover:bg-muted/60 transition"
                    aria-label="Menu do usuário"
                  >
                    <span className="inline-flex h-7 w-7 rounded-full bg-accent text-accent-foreground items-center justify-center text-xs font-semibold">
                      {initial}
                    </span>
                    <span className="text-sm text-foreground max-w-[140px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[220px]">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void signOut()}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <Button
            onClick={onUpload}
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 h-9 text-sm"
          >
            <Camera className="h-4 w-4 mr-1.5" /> Criar projeto com IA
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86%] sm:w-[380px]">
            <SheetHeader>
              <SheetTitle>
                <Link to="/" aria-label="Ideal Space — página inicial">
                  <IdealSpaceLogo />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1 text-base">
              {[
                { l: "Como funciona", href: "#", onClick: onDemo },
                { l: "Ambientes", href: "#ambientes" },
                { l: "Estilos", href: "#estilos" },
                { l: "Galeria", href: "#galeria" },
                { l: "Para profissionais", href: "#pro" },
                { l: "Planos", href: "/pricing" },
              ].map((item) => (
                <a
                  key={item.l}
                  href={item.href}
                  onClick={
                    item.onClick
                      ? (e) => {
                          e.preventDefault();
                          item.onClick!();
                        }
                      : undefined
                  }
                  className="py-3 border-b border-border/60"
                >
                  {item.l}
                </a>
              ))}
              {user && (
                <a href="/projetos" className="py-3 border-b border-border/60">
                  Meus Projetos
                </a>
              )}
            </div>
            <Button
              onClick={onUpload}
              className="mt-6 w-full h-11 rounded-xl bg-foreground text-background"
            >
              Criar projeto com IA
            </Button>
            {!user && (
              <Button asChild variant="outline" className="mt-2 w-full h-11 rounded-xl">
                <Link to="/login">Entrar</Link>
              </Button>
            )}
            {user && (
              <div className="mt-6 border-t border-border/60 pt-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 shrink-0 rounded-full bg-accent text-accent-foreground items-center justify-center text-sm font-semibold">
                    {initial}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{displayName}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                  </div>
                </div>
                {credits && (
                  <div className="mt-3 inline-flex text-xs px-2.5 py-1 rounded-full bg-muted text-foreground">
                    {credits.unlimited
                      ? "Plano ilimitado"
                      : `${credits.balance} ${credits.balance === 1 ? "crédito" : "créditos"}`}
                  </div>
                )}
                <Button
                  onClick={() => void signOut()}
                  variant="outline"
                  className="mt-3 w-full h-11 rounded-xl"
                >
                  Sair
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

/* ----------------------------- HERO ----------------------------- */

function Hero({
  onBudget,
  onAffiliate,
  onDemo,
  onUpload,
}: {
  onBudget: () => void;
  onAffiliate: (s: string) => void;
  onDemo: () => void;
  onUpload: () => void;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-50"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.13 55 / 0.35), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.13 55 / 0.25), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-20 pb-20 sm:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative">
        <div className="lg:col-span-6 is-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" /> Design de
            interiores com IA · decoração comprável
          </div>
          <h1 className="mt-5 text-[2.4rem] sm:text-5xl lg:text-[68px] leading-[1.04] tracking-[-0.02em] font-semibold">
            Transforme espaços vazios em{" "}
            <span className="font-serif italic font-normal text-accent">ambientes decorados</span>{" "}
            com IA.
          </h1>
          <p className="mt-4 text-[15px] sm:text-lg text-muted-foreground max-w-xl">
            Envie a foto do seu ambiente, escolha um estilo e veja a IA decorar em segundos — com
            lista de compras e orçamento estimado de produtos reais para comprar.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onUpload}
              className="h-12 rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 text-sm w-full sm:w-auto"
            >
              <Camera className="mr-2 h-4 w-4" /> Criar projeto com IA
            </Button>
            <Button
              onClick={onDemo}
              variant="outline"
              className="h-12 rounded-full px-6 text-sm w-full sm:w-auto"
            >
              <PlayCircle className="mr-2 h-4 w-4" /> Ver demonstração
            </Button>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground max-w-md">
            {[
              "1 geração grátis",
              "Sem cartão no início",
              "Fotos privadas",
              "Resultado em segundos",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-accent" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="relative is-fade-up">
            <BeforeAfter
              before={emptyLiving}
              after={decoratedLiving}
              auto
              priority
              alt="Antes e depois — sala decorada com IA"
              className="aspect-[5/4] w-full shadow-2xl shadow-black/10 ring-1 ring-black/5"
            />

            <div className="absolute left-3 sm:left-4 top-4 sm:top-6 bg-card/95 backdrop-blur rounded-2xl shadow-xl border p-2.5 sm:p-3 pr-3 sm:pr-4 flex items-center gap-2.5 sm:gap-3 is-float">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/15 text-accent grid place-items-center">
                <Wand2 className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Estilo aplicado
                </div>
                <div className="text-xs sm:text-sm font-medium">Japandi · Sala</div>
              </div>
            </div>

            <div
              className="absolute right-3 sm:-right-4 bottom-6 w-[200px] sm:w-[240px] bg-card/95 backdrop-blur rounded-2xl shadow-xl border p-3 sm:p-4 is-float"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Lista de compras
                </div>
                <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {shoppingList.slice(0, 3).map((i) => (
                  <div key={i.name} className="flex items-center justify-between text-xs">
                    <span className="truncate pr-2">{i.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">
                      {i.price.split("–")[0]}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onAffiliate("Sofá 3 lugares")}
                className="mt-3 w-full text-[11px] font-medium text-foreground/80 hover:text-foreground inline-flex items-center justify-between border-t pt-2"
              >
                Ver lista completa <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <button
              onClick={onBudget}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground text-xs font-medium px-4 py-2 shadow-lg hover:opacity-95"
            >
              <Download className="h-3.5 w-3.5" /> Baixar orçamento
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- MARQUEE ----------------------------- */

function Marquee() {
  const items = [
    "Design 2D com IA",
    "Planejamento 5D",
    "Planta baixa",
    "Layout de ambientes",
    "Virtual staging",
    "Antes/depois",
    "Orçamento estimado",
    "Para arquitetos",
    "Para designers",
    "Para imobiliárias",
    "Residencial",
    "Profissional",
  ];
  return (
    <div className="border-y border-border/60 bg-card/40 overflow-hidden">
      <div className="is-pause-hover py-4">
        <div className="flex gap-10 is-marquee whitespace-nowrap text-sm text-muted-foreground">
          {[...items, ...items, ...items].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-accent" /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- SECTION HEAD ----------------------------- */

function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-[11px] uppercase tracking-[0.22em] text-accent">{kicker}</div>
      <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] font-semibold leading-tight">
        {title}
      </h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}

/* ----------------------------- EMPTY ROOMS ----------------------------- */

function EmptyRoomsCarousel({ onUpload }: { onUpload: () => void }) {
  return (
    <section id="ambientes" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Ambientes vazios"
            title={
              <>
                Escolha o <span className="font-serif italic font-normal">cômodo</span> para
                transformar
              </>
            }
            sub="Quarto, cozinha, banheiro, home office, studio e jantar — todos prontos para receber um projeto 2D em segundos."
          />
          <Button
            onClick={onUpload}
            variant="outline"
            className="rounded-full h-11 px-5 text-sm hidden sm:inline-flex"
          >
            <Camera className="h-4 w-4 mr-1.5" /> Enviar minha foto
          </Button>
        </div>

        <div className="mt-10 -mx-4 sm:mx-0 overflow-x-auto sm:overflow-visible">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4 sm:px-0 snap-x snap-mandatory">
            {emptyRooms.map((r) => (
              <article
                key={r.title}
                className="group snap-start shrink-0 w-[78%] sm:w-auto rounded-3xl overflow-hidden bg-card border hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.title}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms]"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-background/85 backdrop-blur text-[10px] uppercase tracking-widest px-2.5 py-1">
                    {r.badge}
                  </span>
                  <button
                    onClick={onUpload}
                    aria-label={`Criar projeto — ${r.title}`}
                    className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-foreground text-background grid place-items-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.sub}</div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs" onClick={onUpload}>
                    Criar aqui
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- STYLES ----------------------------- */

function StylesCarousel({
  onPickStyle,
  onUpload,
}: {
  onPickStyle: (styleId: string) => void;
  onUpload: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  // Pausa o auto-scroll quando o usuario interage e retoma apos 6s de
  // inatividade. clearTimeout em todo trigger pra nao acumular timers.
  const pauseForUser = () => {
    setPaused(true);
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => setPaused(false), 6000);
  };

  // Auto-scroll discreto: avanca 1 card a cada 5s enquanto idle.
  // Respeita prefers-reduced-motion e pausa quando paused === true.
  useEffect(() => {
    if (paused) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const node = scrollerRef.current;
      if (!node) return;
      const maxScroll = node.scrollWidth - node.clientWidth;
      if (maxScroll <= 4) return;
      const card = node.querySelector("[data-style-card]") as HTMLElement | null;
      const step = (card?.offsetWidth ?? 280) + 20; // 20px = gap-5
      if (node.scrollLeft >= maxScroll - 8) {
        node.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        node.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused]);

  // Cleanup do resume timer no unmount.
  useEffect(
    () => () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    },
    [],
  );

  return (
    <section id="estilos" className="py-20 sm:py-28 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Estilos"
            title={
              <>
                Defina a <span className="font-serif italic font-normal">estética</span> do projeto
              </>
            }
            sub="A IA aplica o estilo escolhido ao ambiente, preservando proporção e estrutura."
          />
          <Button onClick={onUpload} variant="outline" className="rounded-full h-11 px-5 text-sm">
            <Camera className="h-4 w-4 mr-1.5" /> Enviar minha foto
          </Button>
        </div>
      </div>

      <div className="relative mt-10 -mx-4 sm:mx-0">
        {/* Scroll horizontal nativo com snap — mobile-friendly via touch, sem
            JS extra. Tamanho dos cards casado com o EmptyRoomsCarousel:
            no mobile cada card ocupa 78% da viewport (snap decisivo, sensacao
            de carrossel "encorpado"); no desktop card maior pra ter presenca
            editorial sem ficar magrinho. */}
        <div
          ref={scrollerRef}
          onPointerEnter={pauseForUser}
          onPointerDown={pauseForUser}
          onWheel={pauseForUser}
          onFocusCapture={pauseForUser}
          className="overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-5 px-4 sm:px-6 pr-8 sm:pr-12 pb-2">
            {styles.map((s, i) => (
              <button
                key={s.styleId ?? i}
                data-style-card
                type="button"
                onClick={() => onPickStyle(s.styleId)}
                aria-label={`Aplicar estilo ${s.name}`}
                className="group snap-start shrink-0 w-[78%] sm:w-[280px] lg:w-[320px] rounded-3xl overflow-hidden bg-card border text-left hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-background/90 backdrop-blur text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium">
                    {s.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Fades laterais — so desktop, deixam claro que ha mais conteudo. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-background to-transparent sm:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-background to-transparent sm:block"
        />
      </div>
    </section>
  );
}

/* ----------------------------- HOW IT WORKS ----------------------------- */

function HowItWorks({ onDemo }: { onDemo: () => void }) {
  const steps = [
    {
      n: "01",
      icon: <ImageIcon className="h-5 w-5" />,
      t: "Escolha o ambiente",
      d: "Selecione um exemplo ou envie a foto do seu espaço.",
    },
    {
      n: "02",
      icon: <Wand2 className="h-5 w-5" />,
      t: "Escolha o estilo",
      d: "Japandi, Moderno, Industrial, Luxo discreto, Natural e mais.",
    },
    {
      n: "03",
      icon: <Sparkles className="h-5 w-5" />,
      t: "A IA decora",
      d: "Geração 2D em segundos preservando a estrutura.",
    },
    {
      n: "04",
      icon: <ShoppingBag className="h-5 w-5" />,
      t: "Lista + orçamento",
      d: "Itens sugeridos por categoria e PDF do projeto.",
    },
  ];
  return (
    <section id="criar" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Como funciona"
            title={
              <>
                Do <span className="font-serif italic font-normal">espaço vazio</span> ao projeto,
                em 4 passos
              </>
            }
          />
          <Button
            onClick={onDemo}
            variant="outline"
            className="rounded-full h-11 px-5 text-sm hidden sm:inline-flex"
          >
            <PlayCircle className="h-4 w-4 mr-1.5" /> Ver demonstração
          </Button>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-3xl border bg-card p-6 hover:-translate-y-0.5 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent grid place-items-center">
                  {s.icon}
                </div>
                <div className="font-serif text-3xl text-muted-foreground/60">{s.n}</div>
              </div>
              <div className="mt-5 text-lg font-medium">{s.t}</div>
              <div className="mt-1.5 text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- EVOLUTION TIERS (2D / 5D / Planta) ----------------------------- */

/* ----------------------------- FEATURED BEFORE/AFTER ----------------------------- */

function FeaturedBeforeAfter() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
            Antes e depois em destaque
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] font-semibold leading-tight">
            Um <span className="font-serif italic font-normal">banheiro vazio</span> vira refúgio em
            segundos.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Arraste o controle e veja a estrutura preservada, a iluminação trabalhada e o mobiliário
            sugerido pela IA — pronto para virar lista de compras e orçamento.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {[
              "Estrutura, janelas e proporção preservadas",
              "Paleta travertino, oak e brass",
              "Sugestões coerentes com o cômodo",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-muted-foreground">
                <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2">
          <BeforeAfter
            before={featuredBaPair.empty!.src}
            after={featuredBaPair.decorated!.src}
            className="aspect-[5/4] w-full shadow-2xl shadow-black/10 ring-1 ring-black/5"
          />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- RESULT SHOWCASE ----------------------------- */

function ResultShowcase({
  onBudget,
  onAffiliate,
  onReward,
}: {
  onBudget: () => void;
  onAffiliate: (s: string) => void;
  onReward: (k: RewardKind) => void;
}) {
  return (
    <section className="py-20 sm:py-28 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          kicker="Tela de resultado"
          title={
            <>
              Seu projeto fica{" "}
              <span className="font-serif italic font-normal">pronto em segundos</span>
            </>
          }
          sub="Imagem como protagonista, lista de compras ao lado e orçamento a um clique."
        />

        <div className="mt-12 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="rounded-3xl overflow-hidden border bg-card">
            <div className="p-3 sm:p-4 flex items-center gap-2 border-b flex-wrap">
              <Badge
                variant="secondary"
                className="rounded-full text-[10px] uppercase tracking-wider"
              >
                Sala de estar · Luxo discreto
              </Badge>
              <span className="text-xs text-muted-foreground">
                12 itens · estimativa R$ 3.000–8.000
              </span>
              <div className="ml-auto flex gap-1 sm:gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onReward("save_project")}
                  className="text-xs"
                >
                  <BookmarkPlus className="h-3.5 w-3.5 mr-1" /> Salvar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onReward("send_phone")}
                  className="text-xs"
                >
                  <Smartphone className="h-3.5 w-3.5 mr-1" /> Enviar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onReward("compare")}
                  className="text-xs"
                >
                  <Zap className="h-3.5 w-3.5 mr-1" /> Variação
                </Button>
              </div>
            </div>
            <BeforeAfter
              before={showcasePair.empty!.src}
              after={showcasePair.decorated!.src}
              className="aspect-[5/3.4]"
            />
          </div>

          <aside className="rounded-3xl border bg-card p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-base font-medium">Lista de compras</div>
                <div className="text-xs text-muted-foreground">
                  Itens sugeridos para esse ambiente
                </div>
              </div>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 rounded-xl bg-muted/60 p-3">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Estimativa total
              </div>
              <div className="text-lg font-medium">R$ 3.000 – 8.000</div>
              <div className="text-xs text-muted-foreground">12 itens sugeridos</div>
            </div>

            <ul className="mt-4 divide-y">
              {shoppingList.map((it) => (
                <li key={it.name} className="py-3 flex items-start gap-3">
                  <TagBadge tag={it.tag} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{it.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {it.cat} · {it.price}
                    </div>
                  </div>
                  <button
                    onClick={() => onAffiliate(it.name)}
                    className="text-[11px] font-medium text-foreground/70 hover:text-foreground whitespace-nowrap"
                  >
                    Ver opções →
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onReward("shopping_list")}
              className="mt-3 w-full rounded-xl border border-dashed border-accent/40 bg-accent/5 px-3 py-2.5 text-left hover:bg-accent/10 transition"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-accent">
                <Lock className="h-3.5 w-3.5" /> Ver os 5 itens restantes
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Desbloqueie a lista completa com links das lojas.
              </div>
            </button>

            <Button
              onClick={onBudget}
              className="mt-4 w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              <Download className="h-4 w-4 mr-2" /> Baixar orçamento
            </Button>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Alguns links podem gerar comissão para o Ideal Space, sem custo adicional para você.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function TagBadge({ tag }: { tag: string }) {
  const map: Record<string, string> = {
    Essencial: "bg-accent/15 text-accent",
    Recomendado: "bg-foreground/8 text-foreground",
    Opcional: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`mt-0.5 inline-flex h-5 items-center rounded-full px-2 text-[10px] uppercase tracking-wider ${map[tag] ?? ""}`}
    >
      {tag}
    </span>
  );
}

/* ----------------------------- INSPIRATION GALLERY ----------------------------- */

function InspirationGallery({
  onUpload,
  onPickStyle,
}: {
  onUpload: () => void;
  onPickStyle: (styleId: string) => void;
}) {
  const [active, setActive] = useState<GalleryFilter>("Todos");
  const visible = active === "Todos" ? gallery : gallery.filter((g) => g.tags.includes(active));

  const badgeColor: Record<GalleryBadge, string> = {
    "2D IA": "bg-accent text-accent-foreground",
    "5D": "bg-foreground text-background",
    "Planta baixa": "bg-background text-foreground border border-foreground/20",
    Arquitetônico: "bg-background text-foreground border border-foreground/20",
    "Virtual staging": "bg-background/90 backdrop-blur text-foreground",
  };

  return (
    <section id="galeria" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Galeria de inspirações"
            title={
              <>
                Projetos{" "}
                <span className="font-serif italic font-normal">2D, 5D e planta baixa</span>
              </>
            }
            sub="Variações reais geradas pela plataforma — filtre por tipo de projeto."
          />
          <Button
            onClick={onUpload}
            className="rounded-full h-11 px-5 text-sm hidden sm:inline-flex bg-foreground text-background hover:bg-foreground/90"
          >
            <Camera className="h-4 w-4 mr-1.5" /> Criar o meu
          </Button>
        </div>

        <div className="mt-8 -mx-4 sm:mx-0 overflow-x-auto sm:overflow-visible">
          <div className="flex gap-2 px-4 sm:px-0 whitespace-nowrap">
            {filterList.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={[
                  "px-3.5 py-1.5 rounded-full text-xs transition border",
                  active === f
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((g) => (
            <article
              key={g.title}
              className="group rounded-3xl overflow-hidden border bg-card hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={g.img}
                  alt={g.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms]"
                />
                <span
                  className={`absolute top-3 left-3 rounded-full text-[10px] uppercase tracking-widest px-2.5 py-1 ${badgeColor[g.badge]}`}
                >
                  {g.badge}
                </span>
                {g.soon && (
                  <span className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur text-[10px] uppercase tracking-widest px-2.5 py-1 text-muted-foreground">
                    Em breve
                  </span>
                )}
                {g.style && !g.soon && (
                  <button
                    type="button"
                    onClick={() => onPickStyle(g.style!)}
                    aria-label={`Gerar projeto parecido com ${g.title}`}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-background text-foreground h-11 px-5 text-sm font-medium shadow-xl">
                      <Wand2 className="h-4 w-4 text-accent" />
                      Gerar parecido
                    </span>
                  </button>
                )}
              </div>
              <div className="p-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-base font-medium truncate">{g.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {g.tags.join(" · ")}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs shrink-0"
                  onClick={g.soon ? undefined : onUpload}
                  disabled={g.soon}
                >
                  {g.cta} <ChevronRight className="h-3 w-3 ml-0.5" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Nada por aqui ainda — novos projetos chegam toda semana.
          </p>
        )}
      </div>
    </section>
  );
}

/* ----------------------------- RANKING ----------------------------- */

function RankingStrip({ onUpload }: { onUpload: () => void }) {
  return (
    <section id="ranking" className="py-20 sm:py-28 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Inspirações"
            title={
              <>
                Ambientes para <span className="font-serif italic font-normal">se inspirar</span>
              </>
            }
            sub="Exemplos de transformações criadas com IA na plataforma."
          />
          <Button
            onClick={onUpload}
            variant="outline"
            className="rounded-full h-11 px-5 text-sm hidden sm:inline-flex"
          >
            <Sparkles className="h-4 w-4 mr-1.5" /> Criar o meu projeto
          </Button>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ranking.map((r) => (
            <article
              key={r.title}
              className="group relative rounded-3xl overflow-hidden border bg-card hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={r.img}
                  alt={r.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms]"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-foreground text-background text-[10px] uppercase tracking-widest px-2.5 py-1">
                  {r.room ?? "ambiente"}
                </span>
                {r.style && (
                  <span className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur text-[10px] uppercase tracking-widest px-2.5 py-1 text-foreground">
                    {r.style}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="text-base font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.sub}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- PROFESSIONALS ----------------------------- */

function Professionals({ onUpload, onCourse }: { onUpload: () => void; onCourse: () => void }) {
  const audiences = [
    {
      icon: <Pencil className="h-4 w-4" />,
      t: "Designers",
      d: "Crie variações visuais em segundos para apresentar a clientes.",
      bullets: ["Múltiplas versões", "Galeria de referências", "Exportação de projeto"],
    },
    {
      icon: <Compass className="h-4 w-4" />,
      t: "Arquitetos",
      d: "Estudos iniciais e apresentações com antes/depois claro.",
      bullets: ["Conceitos visuais", "Organização por cliente", "Observações técnicas"],
    },
    {
      icon: <Building2 className="h-4 w-4" />,
      t: "Imobiliárias",
      d: "Virtual staging para imóveis vazios em minutos.",
      bullets: ["Staging rápido", "Pacotes por imagem", "Disclaimer automático"],
    },
    {
      icon: <Stethoscope className="h-4 w-4" />,
      t: "Consultórios & Clínicas",
      d: "Ambientes acolhedores que transmitem confiança ao paciente.",
      bullets: ["Iluminação suave", "Privacidade visual", "Lista de itens"],
    },
    {
      icon: <ShoppingBag className="h-4 w-4" />,
      t: "E-commerce & Afiliados",
      d: "Transforme projetos em listas de compras prontas.",
      bullets: ["Produtos sugeridos", "Links afiliados", "Orçamento PDF"],
    },
  ];

  return (
    <section id="pro" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 rounded-[2rem] bg-foreground text-background p-8 sm:p-14 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full blur-3xl opacity-30"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.13 55 / 0.7), transparent 60%)",
          }}
        />

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-start relative">
          {/* Left column: pitch + CTAs */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
              Para profissionais
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl tracking-[-0.02em] font-semibold leading-tight font-serif">
              Acelere estudos visuais e apresentações de projeto
            </h2>
            <p className="mt-4 text-background/70 max-w-md text-sm sm:text-base leading-relaxed">
              Use IA para criar variações de ambiente em minutos, apresentar ideias a clientes e
              gerar orçamentos preliminares com lista de produtos.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                onClick={onUpload}
                className="h-11 rounded-full bg-background text-foreground hover:bg-background/90 px-5 text-sm"
              >
                Conhecer recursos profissionais <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button
                onClick={onCourse}
                variant="outline"
                className="h-11 rounded-full px-5 text-sm bg-white/5 border-white/20 text-background hover:bg-white/10 hover:text-background"
              >
                Conhecer o curso
              </Button>
            </div>
          </div>

          {/* Right column: 5 audience cards */}
          <div className="grid sm:grid-cols-2 gap-3">
            {audiences.map((a) => (
              <div
                key={a.t}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-5 hover:bg-white/10 transition flex flex-col"
              >
                <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center text-accent">
                  {a.icon}
                </div>
                <div className="mt-4 font-medium font-serif text-lg leading-tight">{a.t}</div>
                <p className="mt-1.5 text-sm text-background/70 leading-relaxed">{a.d}</p>
                <ul className="mt-4 pt-4 border-t border-white/10 space-y-1.5">
                  {a.bullets.map((b) => (
                    <li key={b} className="text-[12px] text-background/65 leading-relaxed">
                      · {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- PRICING ----------------------------- */

function Pricing({
  onReward,
  onLead,
}: {
  onReward: (k: RewardKind) => void;
  onLead: (planInterest: string) => void;
}) {
  return (
    <section id="planos" className="py-20 sm:py-28 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Assinatura</div>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] font-semibold">
            Planos para criar seus{" "}
            <span className="font-serif italic font-normal">projetos com IA</span>.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Comece grátis e evolua quando precisar — do 2D rápido aos recursos profissionais.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Planos a partir de R$ 29,90/mês
          </div>
        </div>

        {/* Reforço visual de monetização — iscas de conversão */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Wand2, t: "Transforme seu ambiente em minutos" },
            { icon: Gift, t: "3 gerações grátis para testar" },
            { icon: ShieldCheck, t: "Sem marca d'água nos planos pagos" },
            { icon: ShoppingBag, t: "Receba orçamento completo pelo WhatsApp" },
          ].map((v) => (
            <div
              key={v.t}
              className="flex items-start gap-2.5 rounded-2xl border bg-card px-4 py-3.5"
            >
              <v.icon className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm leading-snug">{v.t}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-3xl p-7 flex flex-col border bg-card ${p.highlight ? "ring-2 ring-accent shadow-2xl" : ""}`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent text-accent-foreground text-[10px] uppercase tracking-widest px-3 py-1">
                  Mais escolhido
                </span>
              )}
              <div className="text-sm text-muted-foreground">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {formatPlanPrice(p.monthly)}
                </span>
                {p.monthly > 0 && <span className="text-sm text-muted-foreground">/mês</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>

              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
                {p.notIncluded?.map((f) => (
                  <li key={f} className="flex gap-2 text-muted-foreground/70">
                    <span className="h-4 w-4 mt-0.5 shrink-0 grid place-items-center">×</span>
                    <span className="line-through">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild={p.id !== "pro"}
                onClick={p.id === "pro" ? () => onLead(p.id) : undefined}
                className={`mt-7 h-11 rounded-xl ${
                  p.highlight
                    ? "bg-accent text-accent-foreground hover:opacity-95"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                {p.id === "pro" ? p.cta : <Link to={p.ctaHref}>{p.cta}</Link>}
              </Button>
            </div>
          ))}
        </div>

        {/* Faixa curta de trial — não é um segundo bloco de pricing */}
        <div className="mt-8 rounded-3xl border bg-card p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-accent/15 text-accent grid place-items-center shrink-0">
              <Gift className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium">
                Crie sua conta grátis e comece a gerar ambientes com IA.
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Sem cartão de crédito.</div>
            </div>
          </div>
          <Button
            onClick={() => onReward("extra_gen")}
            variant="outline"
            className="rounded-full h-11 px-5 text-sm"
          >
            Criar conta grátis <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- TRUST ----------------------------- */

function Trust() {
  const items = [
    {
      icon: <Lock className="h-5 w-5" />,
      t: "Fotos privadas",
      d: "Suas fotos não são publicadas sem autorização.",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      t: "IA ilustrativa",
      d: "Imagens geradas são sugestões visuais e podem variar.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      t: "LGPD",
      d: "Tratamos seus dados conforme a LGPD.",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      t: "Afiliados transparentes",
      d: "Comissões sem custo adicional para você.",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          kicker="Segurança e privacidade"
          title={
            <>
              Suas fotos e dados com{" "}
              <span className="font-serif italic font-normal">segurança</span>
            </>
          }
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((i) => (
            <div key={i.t} className="rounded-3xl border bg-card p-6">
              <div className="h-10 w-10 rounded-xl bg-muted text-foreground grid place-items-center">
                {i.icon}
              </div>
              <div className="mt-4 font-medium">{i.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{i.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- FAQ ----------------------------- */

function FAQ() {
  return (
    <section className="py-20 sm:py-28 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead kicker="Perguntas frequentes" title={<>FAQ</>} />
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`} className="border-b">
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ----------------------------- FOOTER ----------------------------- */

function Footer() {
  const cols = [
    {
      t: "Produto",
      l: [
        { label: "Criar com IA", href: "/" },
        { label: "Ambientes", href: "#ambientes" },
        { label: "Estilos", href: "#estilos" },
        { label: "Galeria", href: "#galeria" },
        { label: "Planos", href: "/pricing" },
      ],
    },
    {
      t: "Recursos",
      l: [
        { label: "Design 2D", href: "/pricing" },
        { label: "Planejamento 5D", href: "/pricing" },
        { label: "Planta baixa", href: "/pricing" },
        { label: "Virtual staging", href: "#galeria" },
        { label: "Lista de compras", href: "#galeria" },
      ],
    },
    {
      t: "Profissionais",
      l: [
        { label: "Designers", href: "#pro" },
        { label: "Arquitetos", href: "#pro" },
        { label: "Imobiliárias", href: "#pro" },
        { label: "Clínicas", href: "#pro" },
        { label: "Corretores", href: "#pro" },
      ],
    },
    {
      t: "Legal",
      l: [
        { label: "Termos de Uso", href: "/legal#termos" },
        { label: "Política de Privacidade", href: "/legal#privacidade" },
        { label: "Política de Imagens", href: "/legal#imagens" },
        { label: "LGPD", href: "/legal#lgpd" },
        { label: "Afiliados", href: "/legal#afiliados" },
        { label: "Aviso sobre IA", href: "/legal#aviso-ia" },
      ],
    },
  ];
  // Landing pages programáticas — um link interno por ambiente e por estilo,
  // para que os crawlers descubram e distribuam autoridade para essas páginas.
  const roomLinks = [
    { slug: "sala", label: "Sala" },
    { slug: "quarto", label: "Quarto" },
    { slug: "cozinha", label: "Cozinha" },
    { slug: "home-office", label: "Home office" },
    { slug: "banheiro", label: "Banheiro" },
  ];
  const styleLinks = [
    { slug: "japandi", label: "Japandi" },
    { slug: "contemporaneo", label: "Contemporâneo" },
    { slug: "minimalista", label: "Minimalista" },
    { slug: "natural", label: "Natural" },
    { slug: "industrial", label: "Industrial" },
    { slug: "luxo", label: "Luxo discreto" },
  ];
  return (
    <footer className="bg-foreground text-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 pb-28 lg:pb-16">
        <div className="grid lg:grid-cols-[1.4fr_3fr] gap-10">
          <div>
            <div className="text-background">
              <Link to="/" aria-label="Ideal Space — página inicial">
                <IdealSpaceLogo />
              </Link>
            </div>
            <p className="mt-5 text-sm text-background/60 max-w-sm">
              Plataforma de design de interiores com IA. Geração 2D rápida, planejamento 5D e
              recursos de planta baixa para projetos residenciais e profissionais.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            {cols.map((c) => (
              <div key={c.t}>
                <div className="text-background text-xs uppercase tracking-widest">{c.t}</div>
                <ul className="mt-4 space-y-2">
                  {c.l.map((x) => (
                    <li key={x.label}>
                      <a className="hover:text-background transition" href={x.href}>
                        {x.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Landing pages por ambiente e estilo — links internos para SEO. */}
        <div className="mt-12 pt-8 border-t border-white/10 space-y-4 text-sm">
          <nav aria-label="Decorar por ambiente">
            <span className="text-background text-xs uppercase tracking-widest">
              Decorar por ambiente
            </span>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-background/55">
              {roomLinks.map((r) => (
                <a
                  key={r.slug}
                  href={`/ambientes/${r.slug}`}
                  className="hover:text-background transition"
                >
                  {r.label}
                </a>
              ))}
            </div>
          </nav>
          <nav aria-label="Decorar por estilo">
            <span className="text-background text-xs uppercase tracking-widest">
              Decorar por estilo
            </span>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-background/55">
              {styleLinks.map((s) => (
                <a
                  key={s.slug}
                  href={`/estilos/${s.slug}`}
                  className="hover:text-background transition"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between text-xs text-background/50">
          <div>© {new Date().getFullYear()} Ideal Space. Todos os direitos reservados.</div>
          <div className="max-w-2xl">
            Ideal Space usa IA para gerar ideias visuais de ambientes. As imagens são ilustrativas e
            os produtos sugeridos podem conter links de afiliados.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------- MOBILE BOTTOM NAV ---------------------- */

function MobileBottomNav({
  onUpload,
  onShopping,
}: {
  onUpload: () => void;
  onShopping: () => void;
}) {
  const scrollTo = (id: string) => {
    if (typeof document === "undefined") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const Item = ({
    icon: Icon,
    label,
    onClick,
    primary = false,
  }: {
    icon: typeof Camera;
    label: string;
    onClick: () => void;
    primary?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={[
        "flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl transition",
        primary
          ? "bg-foreground text-background -mt-5 mx-1 shadow-lg shadow-foreground/20 py-2.5"
          : "text-muted-foreground hover:text-foreground active:bg-muted/60",
      ].join(" ")}
    >
      <Icon className={primary ? "h-5 w-5" : "h-[18px] w-[18px]"} />
      <span className={primary ? "text-[10px] font-medium" : "text-[10px]"}>{label}</span>
    </button>
  );
  return (
    <nav
      aria-label="Navegação rápida"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none"
    >
      <div className="pointer-events-auto mx-2 mb-[max(env(safe-area-inset-bottom),0.5rem)] rounded-3xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl">
        <div className="flex items-stretch px-1 py-1">
          <Item icon={Camera} label="Criar" onClick={onUpload} primary />
          <Item icon={Sparkles} label="Estilos" onClick={() => scrollTo("estilos")} />
          <Item icon={ImageIcon} label="Galeria" onClick={() => scrollTo("galeria")} />
          <Item icon={ShoppingBag} label="Compras" onClick={onShopping} />
        </div>
      </div>
    </nav>
  );
}
