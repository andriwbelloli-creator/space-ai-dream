import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { Footer } from "@/components/Footer";
import { BeforeAfter } from "@/components/BeforeAfter";
import { AtelierHero } from "@/components/home/AtelierHero";
import { EditorialCollections } from "@/components/EditorialCollections";
import { AmbientesGrid } from "@/components/AmbientesGrid";
import { ObjetosTeaser } from "@/components/ObjetosTeaser";
import { AcessibilidadeTeaser } from "@/components/AcessibilidadeTeaser";
import { SectionHead } from "@/components/SectionHead";
import { Tipos2D5D } from "@/components/Tipos2D5D";
import { PremiumVerticalCard } from "@/components/ui/premium-cards";
import { PresentationModal } from "@/components/PresentationModal";
import { CourseModal } from "@/components/CourseModal";
import { RewardModal, type RewardKind } from "@/components/RewardModal";
import { generateBudgetPdf } from "@/lib/budget-pdf";
import { buildAffiliateLinks } from "@/lib/affiliate";
import { useTrack } from "@/lib/use-track";
import { useSmartAnchor } from "@/lib/use-smart-anchor";
import { checkAdminAccess } from "@/lib/admin";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
  Camera,
  Smartphone,
  BookmarkPlus,
  Gift,
  Layers,
  Ruler,
  LayoutGrid,
  Compass,
  Pencil,
  CreditCard,
} from "lucide-react";

// All marketing imagery — single source of truth, one image per section.
import { imagesFor, pair, img } from "@/lib/image-catalog";

// Assets adicionais pros 5 estilos novos (R2) que entram no StylesCarousel
// sem estar no image-catalog (que zela só pelas seções principais).
import styleBoho from "@/assets/moodboard-pro.jpg";
import styleMidCentury from "@/assets/decorated-living.jpg";
import styleMediterraneo from "@/assets/decorated-living-warm.jpg";
import styleArtDeco from "@/assets/decorated-bathroom-suite.jpg";
import styleMaximalista from "@/assets/decorated-dining.jpg";
// Assets dedicados pros 5 novos estilos (R6.1) — gerados via Imagen 4
// (imagen-4.0-generate-001) com prompts calibrados por estilo.
import styleTransicional from "@/assets/style-transicional.jpg";
import styleRusticoModerno from "@/assets/style-rustico-moderno.jpg";
import styleModernoOrganico from "@/assets/style-moderno-organico.jpg";
import styleClassico from "@/assets/style-classico.jpg";
import styleBrutalista from "@/assets/style-brutalista.jpg";

// Hero projects (R9.1) — 6 pares before/after que alimentam o carrossel
// clicável e a comparação central. Cada thumbnail troca a imagem central
// do BeforeAfter ao clicar. Reusa pares já curados em src/assets/ sem
// gerar imagem nova (regra inviolável: não regenerar via IA assets em uso).
import heroLivingBefore from "@/assets/empty-living.jpg";
import heroLivingAfter from "@/assets/decorated-living-warm.jpg";
import heroBedroomBefore from "@/assets/empty-bedroom.jpg";
import heroBedroomAfter from "@/assets/decorated-bedroom.jpg";
import heroOfficeBefore from "@/assets/empty-office.jpg";
import heroOfficeAfter from "@/assets/gallery-office.jpg";
import heroKitchenBefore from "@/assets/empty-kitchen.jpg";
import heroKitchenAfter from "@/assets/decorated-kitchen.jpg";
import heroDiningBefore from "@/assets/empty-dining.jpg";
import heroDiningAfter from "@/assets/decorated-dining.jpg";
import heroBathroomBefore from "@/assets/empty-bathroom.jpg";
import heroBathroomAfter from "@/assets/decorated-bathroom.jpg";

// Assets dedicados pros 6 cards de Profissionais (R7.1) — gerados via
// Imagen 4 (imagen-4.0-generate-001) com prompts calibrados por persona
// (designer/arquiteto/imobiliária/consultório/e-commerce/comparativo).
import proDesigners from "@/assets/pro-designers-studio.jpg";
import proArquitetos from "@/assets/pro-arquitetos-projeto.jpg";
import proImobiliarias from "@/assets/pro-imobiliarias-virtual-staging.jpg";
import proConsultorios from "@/assets/pro-consultorios-clinicas.jpg";
import proEcommerce from "@/assets/pro-ecommerce-afiliados.jpg";
import proPlanner5d from "@/assets/pro-planner-5d-comparison.jpg";

const heroPair = pair("hero-living");
const emptyLiving = heroPair.empty!.src;
const decoratedLiving = heroPair.decorated!.src;

/**
 * Hero projects (R9.1) — 6 pares curados que alimentam o carrossel
 * clicável do hero e a comparação central. Cada thumbnail no trilho
 * lateral troca a imagem central do BeforeAfter; o selo no topo central
 * é derivado de `style` + `room` do projeto selecionado.
 *
 * Pra trocar curadoria sem mexer no componente, edita aqui.
 */
type HeroProject = {
  id: string;
  label: string;
  style: string;
  room: string;
  beforeImage: string;
  afterImage: string;
  alt: string;
};

const heroProjects: ReadonlyArray<HeroProject> = [
  {
    id: "sala-japandi",
    label: "Sala Japandi",
    style: "Japandi",
    room: "Sala",
    beforeImage: heroLivingBefore,
    afterImage: heroLivingAfter,
    alt: "Sala vazia transformada em ambiente Japandi decorado",
  },
  {
    id: "quarto-organico",
    label: "Quarto Moderno Orgânico",
    style: "Moderno Orgânico",
    room: "Quarto",
    beforeImage: heroBedroomBefore,
    afterImage: heroBedroomAfter,
    alt: "Quarto vazio transformado em ambiente Moderno Orgânico",
  },
  {
    id: "office-minimal",
    label: "Home office Minimalista",
    style: "Minimalista",
    room: "Home office",
    beforeImage: heroOfficeBefore,
    afterImage: heroOfficeAfter,
    alt: "Home office vazio transformado em ambiente minimalista",
  },
  {
    id: "cozinha-contemporanea",
    label: "Cozinha Contemporânea",
    style: "Contemporâneo",
    room: "Cozinha",
    beforeImage: heroKitchenBefore,
    afterImage: heroKitchenAfter,
    alt: "Cozinha vazia transformada em ambiente contemporâneo",
  },
  {
    id: "jantar-luxo",
    label: "Sala de jantar Luxo",
    style: "Luxo discreto",
    room: "Sala de jantar",
    beforeImage: heroDiningBefore,
    afterImage: heroDiningAfter,
    alt: "Sala de jantar vazia transformada em ambiente luxuoso",
  },
  {
    id: "banheiro-natural",
    label: "Banheiro Natural",
    style: "Natural",
    room: "Banheiro",
    beforeImage: heroBathroomBefore,
    afterImage: heroBathroomAfter,
    alt: "Banheiro vazio transformado em ambiente natural",
  },
];

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

// Query param opcional `?upload=1` abre o UploadPhotoModal automaticamente
// no mount. Permite deeplink "comece um novo projeto" (ex.: /projetos "+ Novo
// projeto" → /?upload=1) sem precisar duplicar a montagem do modal aqui.
type IndexSearch = { upload?: "1" };

export const Route = createFileRoute("/")({
  validateSearch: (search): IndexSearch => ({
    upload: search.upload === "1" ? "1" : undefined,
  }),
  component: Index,
  head: () => ({
    meta: [
      { title: "Ideal Space | Design de interiores com IA, projeto 2D a partir de uma foto" },
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

const STYLE_META: Record<string, { name: string; sub: string; styleId: string; slug: string }> = {
  "style-japandi": {
    name: "Japandi",
    sub: "Calma, oak e linho",
    styleId: "japandi",
    slug: "japandi",
  },
  "style-scandi": {
    name: "Minimalista",
    sub: "Claro, leve, neutro",
    styleId: "minimal",
    slug: "minimalista",
  },
  "style-modern": {
    name: "Contemporâneo",
    sub: "Linhas suaves e arte",
    styleId: "modern",
    slug: "contemporaneo",
  },
  "style-industrial": {
    name: "Industrial",
    sub: "Tijolo, metal e couro",
    styleId: "industrial",
    slug: "industrial",
  },
  "style-luxo": {
    name: "Luxo discreto",
    sub: "Nobreza e brass",
    styleId: "luxe",
    slug: "luxo",
  },
  "style-natural": {
    name: "Natural",
    sub: "Fibras, plantas, cerâmica",
    styleId: "natural",
    slug: "natural",
  },
};

/** Styles do marquee — 6 originais do catalog + 5 novos (R2) com slug pra rota. */
const styles: ReadonlyArray<{
  img: string;
  name: string;
  sub: string;
  styleId: string;
  slug: string;
}> = [
  ...imagesFor("style-carousel").map((i) => ({
    img: i.src,
    name: STYLE_META[i.id]?.name ?? i.alt,
    sub: STYLE_META[i.id]?.sub ?? "",
    styleId: STYLE_META[i.id]?.styleId ?? "japandi",
    slug: STYLE_META[i.id]?.slug ?? "japandi",
  })),
  {
    img: styleBoho,
    name: "Boho chic",
    sub: "Camadas e tons quentes",
    styleId: "boho",
    slug: "boho-chic",
  },
  {
    img: styleMidCentury,
    name: "Mid-century",
    sub: "Linhas atemporais",
    styleId: "mid-century",
    slug: "mid-century",
  },
  {
    img: styleMediterraneo,
    name: "Mediterrâneo",
    sub: "Luz natural, cerâmica",
    styleId: "mediterraneo",
    slug: "mediterraneo",
  },
  {
    img: styleArtDeco,
    name: "Art déco",
    sub: "Geometria sofisticada",
    styleId: "art-deco",
    slug: "art-deco",
  },
  {
    img: styleMaximalista,
    name: "Maximalista",
    sub: "Camadas autorais",
    styleId: "maximalista",
    slug: "maximalista",
  },
  // 5 novos estilos (R6) com slug pra rota /estilos/<slug>.
  {
    img: styleTransicional,
    name: "Transicional",
    sub: "Clássico com leveza",
    styleId: "transicional",
    slug: "transicional",
  },
  {
    img: styleRusticoModerno,
    name: "Rústico moderno",
    sub: "Aconchego com metal preto",
    styleId: "rustico-moderno",
    slug: "rustico-moderno",
  },
  {
    img: styleModernoOrganico,
    name: "Moderno orgânico",
    sub: "Curvas e biofilia",
    styleId: "moderno-organico",
    slug: "moderno-organico",
  },
  {
    img: styleClassico,
    name: "Clássico",
    sub: "Simetria e boiseries",
    styleId: "classico",
    slug: "classico",
  },
  {
    img: styleBrutalista,
    name: "Brutalista",
    sub: "Concreto escultural",
    styleId: "brutalista",
    slug: "brutalista",
  },
];

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
    a: "Ainda não. Nesta etapa o uso é gratuito. Os planos pagos serão liberados no lançamento, sem cobrança agora.",
  },
];

/* ----------------------------- PAGE ----------------------------- */

function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [affiliateOpen, setAffiliateOpen] = useState<null | string>(null);
  const track = useTrack();
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [initialStyle, setInitialStyle] = useState<string | undefined>(undefined);
  // Arquivo capturado pelo drag-and-drop da dropzone do Hero. Encaminhado
  // pro UploadPhotoModal via prop initialFile pra processamento direto.
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [courseOpen, setCourseOpen] = useState(false);
  const [reward, setReward] = useState<RewardKind | null>(null);
  // Funil de leads: contexto do CTA de plano que abriu o modal comercial.
  const [lead, setLead] = useState<{
    planInterest?: string;
    title?: string;
    source?: string;
  } | null>(null);
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

  // Deeplink: /?upload=1 abre o modal de upload no mount e limpa o query
  // param (pra reload nao reabrir indefinidamente). Usado pelo botao
  // "+ Novo projeto" em /projetos pra evitar 1 clique extra na home.
  const search = Route.useSearch();
  useEffect(() => {
    if (search.upload === "1") {
      setUploadOpen(true);
      navigate({ to: "/", search: {}, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.upload]);

  const handlePresentation = (open: boolean) => {
    setPresentationOpen(open);
    if (open) {
      track("demo_viewed");
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
      <AtelierHero
        onUpload={openUpload}
        onBudget={() => openReward("budget")}
        onDropFile={setDroppedFile}
      />
      <HowItWorks onUpload={openUpload} />
      <StylesCarousel onUpload={openUpload} />
      <AmbientesGrid />
      <ObjetosTeaser />
      <Tipos2D5D />
      {/* Galeria #galeria — destino do menu "Ideias". Sub-CTAs no fim
          levam pras sections de Estilos e Ambientes. */}
      <InspirationGallery
        onUpload={openUpload}
        onPickStyle={openUploadWithStyle}
        onLead={(title) => setLead({ title, source: "galeria" })}
      />
      <EditorialCollections />
      <AcessibilidadeTeaser />
      <ResultShowcase
        onBudget={() => openReward("budget")}
        onAffiliate={setAffiliateOpen}
        onReward={openReward}
      />
      {/* Profissionais #pro — destino do menu "Profissionais". Cards
          sem rota dedicada (clínicas, e-commerce) viram lead capture. */}
      <Professionals
        onCourse={() => setCourseOpen(true)}
        onLead={(source) =>
          setLead({ source, title: "Fale com o time do Ideal Space" })
        }
      />
      <Pricing
        onReward={openReward}
        onLead={(planInterest) =>
          setLead({
            planInterest,
            title: planInterest === "pro" ? "Fale com vendas" : undefined,
          })
        }
      />
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
            onOpenChange={(o) => {
              setUploadOpen(o);
              // Limpa o arquivo capturado pelo drop quando o modal fecha
              // pra próximo arrasto começar do zero.
              if (!o) setDroppedFile(null);
            }}
            initialStyle={initialStyle}
            initialFile={droppedFile ?? undefined}
          />
        </Suspense>
      )}
      <CourseModal
        open={courseOpen}
        onOpenChange={setCourseOpen}
        onEnroll={() => {
          // Curso vira lista de espera: captura o lead via LeadFormModal
          // (source="curso" → submitLead → tabela leads), sem checkout.
          setCourseOpen(false);
          setLead({ source: "curso", title: "Lista de espera — Curso" });
        }}
      />

      <RewardModal
        open={!!reward}
        kind={reward}
        onOpenChange={(o) => !o && setReward(null)}
        onSuccess={(k) => handleReward(k)}
        // Alta intenção (budget/shopping_list): "Receber no WhatsApp" abre o
        // LeadFormModal existente via setLead, sem mexer no PDF nem no signup.
        onRequestContact={(k) => setLead({ source: `reward-${k}` })}
      />

      {leadMounted && (
        <Suspense fallback={modalFallback}>
          <LeadFormModal
            open={lead !== null}
            onOpenChange={(o) => !o && setLead(null)}
            // source identifica de onde o lead veio (home, pro_clinica,
            // pro_ecommerce, pro_general, plano X, etc) — vai pra coluna
            // `source` da tabela leads pra atribuição comercial.
            source={lead?.source ?? "home"}
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
                      track("affiliate_click", {
                        provider: m.id,
                        productName: affiliateOpen,
                        productUrl: m.url,
                        source: "home_buy_dialog",
                      });
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
                    track("affiliate_click", {
                      provider: "google_shopping",
                      productName: affiliateOpen,
                      source: "home_buy_dialog",
                    });
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
  const verifyAdmin = useServerFn(checkAdminAccess);
  // Smart anchor: scroll na home, navega pra "/" + hash em outras rotas.
  // Resolve o bug silencioso de clicar em #galeria/#pro fora da home.
  const smartAnchor = useSmartAnchor();
  const track = useTrack();
  // Anchor com tracking — dispara `nav_menu_click` antes do scroll/navigate.
  // Mesmo wrapper serve pros 4 anchors (#ambientes, #estilos, #galeria, #pro)
  // no desktop e no mobile sheet sem duplicação.
  const trackedAnchor = (anchor: string) => (e?: { preventDefault?: () => void }) => {
    track("nav_menu_click", { target: anchor, source: "header" });
    smartAnchor(anchor)(e);
  };
  // Demo (Guia modal) com tracking.
  const handleNavDemo = () => {
    track("nav_menu_click", { target: "guia", source: "header" });
    onDemo();
  };
  // CTA "Criar projeto com IA" no header — distingue de hero_upload_click.
  const handleHeaderUpload = () => {
    track("nav_menu_click", { target: "cta_upload", source: "header" });
    onUpload();
  };
  // Link "Planos" — registra nav + pricing_click pra funil de monetização.
  const handlePricingClick = () => {
    track("nav_menu_click", { target: "planos", source: "header" });
    track("pricing_click", { source: "header" });
  };
  // Acesso ao painel interno aparece no menu de perfil apenas pra admins.
  // Verificação server-side é a fonte da verdade — esta flag só controla a
  // visibilidade do link. Não-admins nem veem o atalho.
  const [isAdmin, setIsAdmin] = useState(false);
  // Display name e inicial: user_metadata.full_name/name (Google OAuth) →
  // fallback no local-part do e-mail. Computado fora do JSX pra não duplicar
  // entre o cluster desktop e a seção mobile.
  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const displayName = meta.full_name || meta.name || user?.email?.split("@")[0] || "Conta";
  const initial = (displayName || "?").trim().charAt(0).toUpperCase() || "?";

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    verifyAdmin({})
      .then((res) => {
        if (active) setIsAdmin(!!res?.isAdmin);
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      });
    return () => {
      active = false;
    };
  }, [user, verifyAdmin]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" aria-label="Ideal Space, página inicial">
          <IdealSpaceLogo />
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground min-w-0">
          <a
            className="hover:text-foreground transition"
            href="#ambientes"
            onClick={trackedAnchor("ambientes")}
          >
            Ambientes
          </a>
          <Link
            className="hover:text-foreground transition"
            to="/objetos"
          >
            Objetos
          </Link>
          <a
            className="hover:text-foreground transition"
            href="#pro"
            onClick={trackedAnchor("pro")}
          >
            Profissionais
          </a>
          <Link
            to="/pricing"
            onClick={handlePricingClick}
            className="hover:text-foreground transition"
          >
            Planos
          </Link>
        </nav>
        <div className="hidden lg:flex items-center gap-2 shrink-0">
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
                  <DropdownMenuItem asChild>
                    <Link to="/minha-conta">
                      <CreditCard className="h-4 w-4 mr-2" /> Minha assinatura
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin/insights">
                          <ShieldCheck className="h-4 w-4 mr-2" /> Painel admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void signOut()}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <Button
            onClick={handleHeaderUpload}
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 h-9 text-sm whitespace-nowrap"
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
                <Link to="/" aria-label="Ideal Space, página inicial">
                  <IdealSpaceLogo />
                </Link>
              </SheetTitle>
              <SheetDescription className="sr-only">
                Menu de navegação móvel do Ideal Space.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1 text-base">
              {[
                { l: "Guia", href: "#", onClick: handleNavDemo, target: "guia" },
                {
                  l: "Ambientes",
                  href: "#ambientes",
                  onClick: trackedAnchor("ambientes"),
                  target: "ambientes",
                },
                {
                  l: "Estilos",
                  href: "#estilos",
                  onClick: trackedAnchor("estilos"),
                  target: "estilos",
                },
                { l: "Objetos", href: "/objetos", target: "objetos" },
                { l: "Acessibilidade", href: "/acessibilidade", target: "acessibilidade" },
                {
                  l: "Ideias",
                  href: "#galeria",
                  onClick: trackedAnchor("galeria"),
                  target: "galeria",
                },
                {
                  l: "Profissionais",
                  href: "#pro",
                  onClick: trackedAnchor("pro"),
                  target: "pro",
                },
                { l: "Planos", href: "/pricing", target: "planos" },
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
                      : item.target === "planos"
                        ? () => handlePricingClick()
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
              onClick={handleHeaderUpload}
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
                <Button asChild variant="outline" className="mt-3 w-full h-11 rounded-xl">
                  <Link to="/minha-conta">
                    <CreditCard className="h-4 w-4 mr-2" /> Minha assinatura
                  </Link>
                </Button>
                {isAdmin && (
                  <Button asChild variant="outline" className="mt-3 w-full h-11 rounded-xl">
                    <Link to="/admin/insights">
                      <ShieldCheck className="h-4 w-4 mr-2" /> Painel admin
                    </Link>
                  </Button>
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
  onAffiliate: _onAffiliate,
  onDemo: _onDemo,
  onUpload,
  onDropFile,
}: {
  onBudget: () => void;
  onAffiliate: (s: string) => void;
  onDemo: () => void;
  onUpload: () => void;
  onDropFile: (file: File) => void;
}) {
  const track = useTrack();
  const smartAnchor = useSmartAnchor();
  // Wrappers que disparam o evento de funil ANTES de chamar o handler
  // original. Source distingue dropzone (afordância principal de entrada)
  // do CTA central do BeforeAfter — instrumentação separada em HeroVisual.
  const handleDropzoneUpload = () => {
    track("hero_upload_click", { source: "dropzone" });
    onUpload();
  };
  // CTA secundário: scroll suave pra galeria de inspirações na própria
  // home via useSmartAnchor (mesmo padrão usado em outros pontos do site).
  const handleSeeProjects = () => {
    track("hero_see_projects_click");
    smartAnchor("galeria")();
  };
  return (
    <section className="relative overflow-hidden">
      {/* Grid asymmetric 5/7: texto contido à esquerda, BeforeAfter
          ganha peso visual à direita (editorial magazine). `lg:items-start`
          (R9.2) alinha os topos pra eliminar o vazio acima do editorial
          que `items-center` criava quando a coluna visual era mais alta.
          Paddings reduzidos pra o hero caber melhor no primeiro viewport. */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-12 lg:pt-14 pb-6 sm:pb-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:items-start relative">
        <div className="lg:col-span-5 is-fade-up">
          {/* H1 editorial: serif italic dominante, escala maior. Misturado
              com sans pra ritmo. */}
          <h1 className="text-[2.6rem] sm:text-[3.5rem] lg:text-[5.25rem] leading-[1.02] tracking-[-0.025em] font-semibold text-balance">
            Veja seu ambiente virar um{" "}
            <span className="font-serif italic font-normal text-accent">projeto pronto</span>
          </h1>
          <p className="mt-5 text-[15px] sm:text-base text-muted-foreground max-w-md leading-relaxed">
            Suba uma foto e veja seu espaço transformado em vários estilos. Quando gostar do
            resultado, conecte com um profissional pra tirar do papel.
          </p>

          {/* Dropzone primária — abre UploadPhotoModal no click ou drop.
              É a única afordância de entrada agora (CTA "Criar projeto"
              duplicado foi removido pra evitar redundância). */}
          <button
            type="button"
            onClick={handleDropzoneUpload}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.dataset.dragging = "true";
            }}
            onDragLeave={(e) => {
              delete e.currentTarget.dataset.dragging;
            }}
            onDrop={(e) => {
              e.preventDefault();
              delete e.currentTarget.dataset.dragging;
              // Captura o arquivo arrastado e encaminha pro modal antes
              // de abri-lo. Modal processa via handleFile (mesma validação
              // MIME/tamanho do input file). Se não veio arquivo (drag
              // sem files), só abre o modal vazio como fallback.
              const file = e.dataTransfer.files?.[0];
              if (file) onDropFile(file);
              handleDropzoneUpload();
            }}
            className="mt-7 w-full max-w-md border-2 border-dashed border-border bg-card/30 hover:border-accent hover:bg-accent/5 data-[dragging=true]:border-accent data-[dragging=true]:bg-accent/10 data-[dragging=true]:border-solid rounded-2xl px-5 py-5 flex items-center gap-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Enviar foto do ambiente"
          >
            <div className="h-11 w-11 shrink-0 grid place-items-center rounded-xl bg-accent/15 text-accent">
              <Camera className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">Criar meu projeto</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                ou clique para selecionar · JPG, PNG, WEBP
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
          </button>

          {/* CTA secundário discreto — scroll suave pra galeria na própria home. */}
          <button
            type="button"
            onClick={handleSeeProjects}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition underline-offset-4 hover:underline"
          >
            <Sparkles className="h-4 w-4" /> Ver projetos prontos
          </button>

          {/* Trust horizontal — uma linha respirável em vez de grid 2x2. */}
          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {[
              "3 gerações grátis",
              "Sem cartão",
              "Fotos privadas",
              "Resultado em segundos",
            ].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual onBudget={onBudget} onUpload={onUpload} />
      </div>
    </section>
  );
}

/* ----------- HERO VISUAL (R9.1) — composição dinâmica antes/depois ----------- */

/**
 * Coluna visual do hero: trilhos verticais clicáveis + comparação
 * antes/depois central + selo de estilo + CTA dedicado.
 *
 * Estado local `selectedHeroId` controla qual projeto está em destaque.
 * Cada thumbnail nos trilhos (e na trilha horizontal mobile) é um
 * `<button>` acessível que troca a imagem central via `setSelectedHeroId`.
 *
 * Loop infinito: trilho replica `heroProjects` 3x — qualquer altura
 * de viewport realista cabe sem buraco. Trilho direito usa lista
 * invertida pra variedade visual (não duplica a esquerda).
 *
 * Selo de estilo posicionado no topo central pra não sobrepor os
 * labels "Antes" (top-left) e "Depois" (top-right) do BeforeAfter.
 *
 * Reduced motion: keyframes `is-rail-up/down` ficam pausados via CSS,
 * mas os botões continuam clicáveis (interação preservada).
 */
function HeroVisual({
  onBudget,
  onUpload,
}: {
  onBudget: () => void;
  onUpload: () => void;
}) {
  const [selectedHeroId, setSelectedHeroId] = useState<string>(heroProjects[0]!.id);
  const [paused, setPaused] = useState(false);
  const selected =
    heroProjects.find((p) => p.id === selectedHeroId) ?? heroProjects[0]!;
  const track = useTrack();

  // Duplicação (2x) + animação `-50%` → loop CSS perfeito: cada ciclo
  // desloca exatamente 1 cópia completa, o reset visual coincide com
  // o início da 2ª cópia (idêntica à 1ª). Triplicar quebra esse
  // alinhamento e cria vazio no fim do ciclo.
  const railLeftItems = [...heroProjects, ...heroProjects];
  const reversed = [...heroProjects].reverse();
  const railRightItems = [...reversed, ...reversed];

  // Auto-rotação a cada 10s: avança circular pelo heroProjects. A
  // dependência `selectedHeroId` faz o timer resetar a cada interação
  // manual (clique zera o ciclo, próximo tick acontece 10s depois do
  // clique). `paused` desliga em hover. `prefers-reduced-motion` cancela
  // o autoplay (interação manual permanece). Cada troca dispara
  // `hero_before_after_project_selected` com trigger=auto pra distinguir
  // de interação manual (trigger=manual no ThumbButton/mobile thumb).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      const idx = heroProjects.findIndex((p) => p.id === selectedHeroId);
      const next = heroProjects[(idx + 1) % heroProjects.length]!;
      track("hero_before_after_project_selected", {
        project_id: next.id,
        trigger: "auto",
      });
      setSelectedHeroId(next.id);
    }, 10000);
    return () => window.clearInterval(id);
  }, [selectedHeroId, paused, track]);

  // ThumbButton (R9.3) — aspect-square no próprio botão garante que
  // todos os thumbs tenham EXATAMENTE o mesmo tamanho, independente do
  // aspect intrínseco da foto (antes a `<img>` caía em intrinsic size
  // porque o botão não tinha altura definida).
  const ThumbButton = ({ project, src }: { project: HeroProject; src: string }) => {
    const isActive = project.id === selectedHeroId;
    return (
      <button
        type="button"
        onClick={() => {
          track("hero_before_after_project_selected", {
            project_id: project.id,
            trigger: "manual",
            source: "rail_desktop",
          });
          setSelectedHeroId(project.id);
        }}
        aria-label={`Selecionar projeto ${project.label}`}
        aria-pressed={isActive}
        data-active={isActive || undefined}
        className="group relative block aspect-square w-full shrink-0 overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card transition-shadow data-[active]:ring-2 data-[active]:ring-accent data-[active]:shadow-lg"
      >
        <img
          src={src}
          alt=""
          loading="lazy"
          className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06] group-data-[active]:scale-[1.04]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5 group-data-[active]:ring-0"
        />
      </button>
    );
  };

  return (
    <div
      className="lg:col-span-7 is-fade-up"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Grid de 3 colunas no desktop: trilho clicável ↑ | comparação
          central | trilho clicável ↓. Mobile: só a comparação, trilho
          horizontal logo abaixo (mantém clique sem sacrificar altura). */}
      <div className="grid grid-cols-1 lg:grid-cols-[96px_1fr_96px] gap-3 lg:gap-4 items-stretch">
        {/* Trilho esquerdo — sobe lentamente. Imagens "depois" (mais
            aspiracionais) pra puxar o clique. O `is-rail-up` está em
            `absolute inset-0` pra NÃO empurrar a altura do aside: assim
            o aside fica com a altura da row do grid (= altura do BA
            central via items-stretch) e a animação rola dentro. */}
        <aside className="hidden lg:block relative overflow-hidden rounded-2xl bg-card border">
          <div className="absolute inset-0">
            <div className="is-rail-up flex flex-col gap-3 p-2">
              {railLeftItems.map((p, i) => (
                <ThumbButton key={`rail-l-${i}`} project={p} src={p.afterImage} />
              ))}
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent"
          />
        </aside>

        {/* Centro — comparação antes/depois dinâmica + selo topo central
            + CTA principal. `key={selected.id}` força re-mount limpo da
            animação `auto` do slider sempre que o projeto muda. */}
        <div className="relative">
          {/* Selo topo central — NÃO sobrepõe "Antes" nem "Depois". Fundo
              claro translúcido + borda sutil + sombra leve, leitura
              premium. Atualiza com style + room do projeto selecionado. */}
          <div
            aria-live="polite"
            className="absolute left-1/2 top-4 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-black/10 bg-card/95 backdrop-blur px-3 py-1.5 text-[11px] text-foreground/80 shadow-sm"
          >
            <span className="uppercase tracking-widest text-muted-foreground mr-1.5">
              Estilo
            </span>
            {selected.style} · {selected.room}
          </div>

          <BeforeAfter
            key={selected.id}
            before={selected.beforeImage}
            after={selected.afterImage}
            auto
            priority
            alt={selected.alt}
            className="aspect-[4/5] sm:aspect-[5/6] lg:aspect-[6/7] w-full shadow-2xl shadow-black/10 ring-1 ring-black/5 rounded-3xl overflow-hidden"
          />

          {/* CTA principal — fica em todas as imagens centrais. Abre o
              fluxo de upload existente sem criar rota nova. Tracking
              `hero_before_after_cta_click` distingue do upload via dropzone
              (que dispara `hero_upload_click` source=dropzone). */}
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              onClick={() => {
                track("hero_before_after_cta_click", { project_id: selected.id });
                onUpload();
              }}
              className="h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 px-5 text-sm flex-1 sm:flex-none"
            >
              <Sparkles className="h-4 w-4 mr-1.5" /> Criar projeto parecido com IA
            </Button>
            <span className="text-[12px] text-muted-foreground text-center sm:text-left">
              Em segundos, com lista de compras e orçamento.
            </span>
          </div>
        </div>

        {/* Trilho direito — desce lentamente. Mostra "antes" pra criar
            contraste visual com o trilho esquerdo. Mesma técnica do
            trilho esquerdo: animação interna em `absolute inset-0` pra
            não vazar altura do aside. */}
        <aside className="hidden lg:block relative overflow-hidden rounded-2xl bg-card border">
          <div className="absolute inset-0">
            <div className="is-rail-down flex flex-col gap-3 p-2">
              {railRightItems.map((p, i) => (
                <ThumbButton key={`rail-r-${i}`} project={p} src={p.beforeImage} />
              ))}
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent"
          />
        </aside>
      </div>

      {/* Trilho horizontal mobile — substitui os trilhos verticais e
          mantém clique. Snap-mandatory pra deslizamento confortável. */}
      <div className="lg:hidden mt-4 -mx-4 px-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 snap-x snap-mandatory pb-2">
          {heroProjects.map((p) => {
            const isActive = p.id === selectedHeroId;
            return (
              <button
                key={`mobile-${p.id}`}
                type="button"
                onClick={() => {
                  track("hero_before_after_project_selected", {
                    project_id: p.id,
                    trigger: "manual",
                    source: "rail_mobile",
                  });
                  setSelectedHeroId(p.id);
                }}
                aria-label={`Selecionar projeto ${p.label}`}
                aria-pressed={isActive}
                data-active={isActive || undefined}
                className="snap-start shrink-0 block w-20 aspect-square overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent data-[active]:ring-2 data-[active]:ring-accent"
              >
                <img
                  src={p.afterImage}
                  alt=""
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA secundário discreto — preserva contrato onBudget original.
          Tracking `download_budget_click` mede interesse no orçamento. */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            track("download_budget_click", { source: "hero" });
            onBudget();
          }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition underline-offset-4 hover:underline"
        >
          <Download className="h-3.5 w-3.5" /> Baixar orçamento de exemplo
        </button>
      </div>
    </div>
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
// SectionHead vive em src/components/SectionHead.tsx para ser story-testado.

/* ----------------------------- EMPTY ROOMS ----------------------------- */

function EmptyRoomsCarousel({ onUpload }: { onUpload: () => void }) {
  return (
    <section id="ambientes" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Ambientes vazios"
            title={
              <>
                Escolha o <span className="italic font-normal text-[color:var(--gold-soft)]">cômodo</span> para
                transformar
              </>
            }
            sub="Quarto, cozinha, banheiro, home office, studio e jantar. Todos prontos para receber um projeto 2D em minutos."
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
                className="group snap-start shrink-0 w-[78%] sm:w-auto rounded-3xl overflow-hidden bg-card border hover:shadow-xl transition-shadow duration-500"
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
                    aria-label={`Criar projeto: ${r.title}`}
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

function StylesCarousel({ onUpload }: { onUpload: () => void }) {
  return (
    <section id="estilos" className="py-14 sm:py-20 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Estilos de decoração"
            title={
              <>
                Escolha um <span className="italic font-normal text-[color:var(--gold-soft)]">estilo</span> para seu
                projeto
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
        {/* Marquee — scroll fluido em loop. Cards duplicados pra fechar o
            loop seamlessly. 35s por ciclo (com tempo de leitura pros 11 estilos).
            Pausa em hover + focus-within. Em prefers-reduced-motion cai pra
            scroll manual com snap. Cada card linka pra /estilos/<slug>. */}
        <div className="overflow-hidden motion-reduce:overflow-x-auto motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-5 pl-4 sm:pl-6 pb-2 whitespace-nowrap will-change-transform [animation:is-marquee_35s_linear_infinite] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:[animation:none] motion-reduce:w-auto motion-reduce:pr-8 motion-reduce:sm:pr-12">
            {[...styles, ...styles].map((s, i) => (
              <Link
                key={`${s.styleId ?? "s"}-${i}`}
                to={`/estilos/${s.slug}`}
                aria-label={`Ver estilo ${s.name}`}
                className="group snap-start shrink-0 w-[78%] sm:w-[280px] lg:w-[320px] rounded-3xl overflow-hidden bg-card border hover:shadow-xl transition-shadow"
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
              </Link>
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

function HowItWorks({ onUpload }: { onUpload: () => void }) {
  // Smart anchor: scroll na home, navegação fora dela. CTA secundário
  // aponta pra #galeria (Ideias) — destino mais alinhado com "Ver ideias
  // de ambientes" do que o anchor #ambientes (grid).
  const smartAnchor = useSmartAnchor();
  const steps = [
    {
      n: "01",
      t: "Envie uma foto",
      d: "Use uma imagem real do seu ambiente vazio, antigo ou sem decoração.",
    },
    {
      n: "02",
      t: "Escolha o estilo",
      d: "Defina o tipo de ambiente e a estética desejada, do minimalista ao luxo discreto.",
    },
    {
      n: "03",
      t: "Gere a visualização",
      d: "A IA cria uma proposta decorada para você comparar possibilidades antes de decidir.",
    },
    {
      n: "04",
      t: "Evolua o projeto",
      d: "Veja referências, produtos sugeridos e caminhos para transformar a ideia em execução.",
    },
  ];
  return (
    <section id="criar" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Layout 5/7 editorial: pitch + CTAs à esquerda, grid 2x2 dos
            4 passos à direita. Mobile: empilha verticalmente. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <span className="is-kicker text-accent">Guia</span>
            <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Como o Ideal Space <span className="italic">transforma</span> seu ambiente
            </h2>
            <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base leading-relaxed">
              Envie uma foto, escolha o estilo e receba uma proposta visual com IA em poucos
              segundos, com ideias, produtos e próximos passos para tirar o projeto do papel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                onClick={onUpload}
                className="h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 px-5 text-sm"
              >
                <Camera className="h-4 w-4 mr-1.5" /> Criar projeto com IA
              </Button>
              <a
                href="#galeria"
                onClick={smartAnchor("galeria")}
                className="h-11 inline-flex items-center rounded-full border border-border bg-background hover:bg-muted px-5 text-sm text-foreground transition-colors"
              >
                Ver ideias de ambientes
              </a>
            </div>
          </div>

          {/* Cards 2x2 (lg). Mobile 1 col. Numeração serif italic discreta. */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-3xl border bg-card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="font-serif italic text-2xl text-accent/80">{s.n}</div>
                  <div className="mt-3 text-lg font-medium leading-tight">{s.t}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- EVOLUTION TIERS (2D / 5D / Planta) ----------------------------- */

/* ----------------------------- FEATURED BEFORE/AFTER ----------------------------- */

function FeaturedBeforeAfter() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <span className="is-kicker">Antes e depois em destaque</span>
          <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Um <span className="italic font-normal text-[color:var(--gold-soft)]">banheiro vazio</span> vira refúgio em
            segundos.
          </h2>
          <span aria-hidden className="mt-5 block h-px w-16 bg-[color:var(--gold-soft)]/60" />
          <p className="mt-4 text-muted-foreground max-w-md">
            Arraste o controle e veja a estrutura preservada, a iluminação trabalhada e o mobiliário
            sugerido pela IA, pronto para virar lista de compras e orçamento.
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
    <section className="py-14 sm:py-20 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          kicker="Tela de resultado"
          title={
            <>
              Seu projeto fica{" "}
              <span className="italic font-normal text-[color:var(--gold-soft)]">pronto em minutos</span>
            </>
          }
          sub="Imagem como protagonista, lista de compras ao lado e orçamento a um clique."
        />

        <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
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
  onLead,
}: {
  onUpload: () => void;
  onPickStyle: (styleId: string) => void;
  onLead: (title: string) => void;
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
    <section id="galeria" className="py-14 sm:py-20 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Galeria de inspirações"
            title={
              <>
                Projetos{" "}
                <span className="italic font-normal text-[color:var(--gold-soft)]">2D, 5D e planta baixa</span>
              </>
            }
            sub="Variações 2D reais geradas pela plataforma. 5D e planta baixa em breve. Filtre por tipo de projeto."
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
              className="group rounded-3xl overflow-hidden border bg-card hover:shadow-xl transition-shadow duration-500 flex flex-col"
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
                {g.soon ? (
                  <button
                    type="button"
                    onClick={() => onLead(`Acesso antecipado: ${g.title}`)}
                    aria-label={`Solicitar acesso antecipado para ${g.title}`}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-background text-foreground h-11 px-5 text-sm font-medium shadow-xl">
                      <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                      Solicitar Acesso
                    </span>
                  </button>
                ) : g.style ? (
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
                ) : null}
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
                  onClick={
                    g.soon
                      ? () => onLead(`Acesso antecipado: ${g.title}`)
                      : g.style
                        ? () => onPickStyle(g.style!)
                        : onUpload
                  }
                >
                  {g.cta} <ChevronRight className="h-3 w-3 ml-0.5" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Nada por aqui ainda. Novos projetos chegam toda semana.
          </p>
        )}

        {/* Sub-CTAs discretos: rotas alternativas pra explorar inspirações
            por outras dimensões (estilo ou cômodo) sem sair da home. */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a
            href="#estilos"
            className="hover:text-foreground transition inline-flex items-center gap-1"
          >
            Explorar por estilo <ChevronRight className="h-3.5 w-3.5" />
          </a>
          <span aria-hidden className="hidden sm:inline text-border">
            ·
          </span>
          <a
            href="#ambientes"
            className="hover:text-foreground transition inline-flex items-center gap-1"
          >
            Explorar por ambiente <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- RANKING ----------------------------- */

function RankingStrip({ onUpload }: { onUpload: () => void }) {
  return (
    <section id="ranking" className="py-14 sm:py-20 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Inspirações"
            title={
              <>
                Ambientes para <span className="italic font-normal text-[color:var(--gold-soft)]">se inspirar</span>
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
              className="group relative rounded-3xl overflow-hidden border bg-card hover:shadow-xl transition-shadow duration-500"
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

function Professionals({
  onCourse,
  onLead,
}: {
  onCourse: () => void;
  // Source vai pra coluna source da tabela leads — distingue origem
  // do lead pra atribuição comercial (pro_clinica, pro_ecommerce, etc).
  onLead: (source: string) => void;
}) {
  // Cards: imagem + kicker + título + descrição curta + CTA, no mesmo
  // padrão visual da seção Tipos2D5D (Visualizações). href OU onClick
  // mutuamente exclusivos: rota dedicada quando existe produto, captura
  // de lead quando ainda não há.
  const audiences: Array<{
    img: string;
    kicker: string;
    title: string;
    description: string;
    ctaLabel: string;
    href?: string;
    onClick?: () => void;
  }> = [
    {
      img: proDesigners,
      kicker: "Estúdios",
      title: "Designers",
      description:
        "Crie variações visuais com rapidez para apresentar a clientes. Múltiplas versões em minutos.",
      ctaLabel: "Conhecer recursos",
      href: "/para-designers",
    },
    {
      img: proArquitetos,
      kicker: "Profissionais",
      title: "Arquitetos",
      description:
        "Estudos iniciais e apresentações com antes e depois claro. Conceitos visuais por cliente.",
      ctaLabel: "Conhecer recursos",
      href: "/para-arquitetos",
    },
    {
      img: proImobiliarias,
      kicker: "Imóveis",
      title: "Imobiliárias",
      description:
        "Virtual staging para imóveis vazios em minutos. Disclaimer automático em cada imagem.",
      ctaLabel: "Conhecer recursos",
      href: "/para-imobiliarias",
    },
    {
      img: proConsultorios,
      kicker: "Saúde",
      title: "Consultórios & Clínicas",
      description:
        "Ambientes acolhedores que transmitem confiança ao paciente. Iluminação suave e privacidade.",
      ctaLabel: "Solicitar contato",
      onClick: () => onLead("pro_clinica"),
    },
    {
      img: proEcommerce,
      kicker: "Afiliados",
      title: "E-commerce & Afiliados",
      description:
        "Transforme projetos em listas de compras prontas, com produtos sugeridos e links de afiliado.",
      ctaLabel: "Solicitar contato",
      onClick: () => onLead("pro_ecommerce"),
    },
    {
      img: proPlanner5d,
      kicker: "Comparativo",
      title: "Comparar com Planner 5D",
      description:
        "Veja onde o Ideal Space encaixa no fluxo de quem já usa Planner 5D para planejar projetos.",
      ctaLabel: "Comparar",
      href: "/vs/planner-5d",
    },
  ];

  return (
    <section id="pro" className="bg-foreground text-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header com fundo escuro pra dar quebra editorial no ritmo da
            home. Cards PremiumVerticalCard mantêm fundo claro interno
            (contraste de revista). Texto e CTAs adaptados pra escuro. */}
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker text-accent">Para profissionais</span>
            <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-background sm:text-4xl md:text-5xl">
              Acelere estudos visuais e <span className="italic">apresentações</span>.
            </h2>
            <p className="mt-4 max-w-md text-sm text-background/70 sm:text-base">
              Use IA pra criar variações de ambiente em minutos, apresentar ideias a clientes e
              gerar orçamentos preliminares com lista de produtos.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => onLead("pro_general")}
              className="h-11 rounded-full bg-background text-foreground hover:bg-background/90 px-5 text-sm"
            >
              Conhecer recursos <ArrowRight className="ml-1.5 h-4 w-4" />
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

        {/* Grid: 1 col mobile, 2 sm, 3 lg — espelha o padrão dos cards
            de Visualizações pra dar consistência ao design system. */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {audiences.map((a) =>
            a.href ? (
              <PremiumVerticalCard
                key={a.title}
                src={a.img}
                alt={a.title}
                kicker={a.kicker}
                title={a.title}
                description={a.description}
                aspect="video"
                ctaLabel={a.ctaLabel}
                to={a.href}
              />
            ) : (
              <PremiumVerticalCard
                key={a.title}
                src={a.img}
                alt={a.title}
                kicker={a.kicker}
                title={a.title}
                description={a.description}
                aspect="video"
                ctaLabel={a.ctaLabel}
                onClick={a.onClick}
              />
            ),
          )}
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
    <section id="planos" className="py-14 sm:py-20 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="is-kicker">Assinatura</span>
          <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Planos para criar seus{" "}
            <span className="italic font-normal text-[color:var(--gold-soft)]">projetos com IA</span>.
          </h2>
          <span aria-hidden className="mx-auto mt-5 block h-px w-16 bg-[color:var(--gold-soft)]/60" />
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Comece grátis e evolua quando precisar, do 2D rápido aos recursos profissionais.
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

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
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
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          kicker="Segurança e privacidade"
          title={
            <>
              Suas fotos e dados com{" "}
              <span className="italic font-normal text-[color:var(--gold-soft)]">segurança</span>
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
    <section className="py-14 sm:py-20 bg-card/40 border-y border-border/60">
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
// Footer extraido pra src/components/Footer.tsx para ser reusado em landings
// programaticas (`/ambientes/$slug`, `/estilos/$slug`) sem duplicar markup.
// Import via barrel ao topo do arquivo.

/* ---------------------- MOBILE BOTTOM NAV ---------------------- */

function MobileBottomNav({
  onUpload,
  onShopping,
}: {
  onUpload: () => void;
  onShopping: () => void;
}) {
  // Smart anchor: na home faz scroll suave, fora da home navega pra "/"
  // com hash. Substitui o scrollTo local que silenciava em outras rotas.
  const smartAnchor = useSmartAnchor();
  const Item = ({
    icon: Icon,
    label,
    onClick,
    primary = false,
  }: {
    icon: React.ComponentType<{ className?: string }>;
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
          <Item icon={Sparkles} label="Estilos" onClick={smartAnchor("estilos")} />
          <Item icon={ImageIcon} label="Ideias" onClick={smartAnchor("galeria")} />
          <Item icon={Camera} label="Criar" onClick={onUpload} primary />
          <Item icon={ShoppingBag} label="Compras" onClick={onShopping} />
        </div>
      </div>
    </nav>
  );
}
