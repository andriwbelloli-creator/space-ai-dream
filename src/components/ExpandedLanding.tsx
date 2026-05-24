import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, ChevronDown, Camera, Upload, Wand2 } from "lucide-react";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Footer } from "@/components/Footer";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { resolveLandingImage } from "@/lib/seo-landing-images";
import type {
  LandingBenefit,
  LandingFaq,
  LandingImages,
  LandingRelatedLink,
  LandingStep,
} from "@/lib/seo-landing-shared";

const LeadFormModal = lazy(() =>
  import("@/components/LeadFormModal").then((m) => ({ default: m.LeadFormModal })),
);
const UploadPhotoModal = lazy(() =>
  import("@/components/UploadPhotoModal").then((m) => ({ default: m.UploadPhotoModal })),
);

const modalFallback = (
  <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
  </div>
);

/** Steps default — usado quando a landing nao define `steps` proprio. */
const DEFAULT_STEPS: LandingStep[] = [
  {
    t: "Envie uma foto do ambiente",
    d: "Use a foto que você já tem, do celular ou do computador.",
  },
  {
    t: "Escolha um estilo ou proposta",
    d: "A IA aplica a estética escolhida ao seu espaço, mantendo a estrutura real.",
  },
  {
    t: "Veja antes/depois e lista de compras",
    d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
  },
];

type Props = {
  /** Kicker pequeno acima do H1 (ex: "Decoração com IA"). */
  kicker?: string;
  /** Headline principal — pode usar `*trecho*` para destaque serif. */
  h1: string;
  /** Parágrafo de venda no hero. */
  promise: string;
  /** Texto do CTA primário (LeadFormModal). */
  cta: string;
  /** Microcopy curto abaixo do CTA primario. */
  trustText?: string;
  /** Bullets de benefícios — render como cards com check icon. */
  benefits: LandingBenefit[];
  /** Passos do "Como funciona" — fallback pra DEFAULT_STEPS se ausente. */
  steps?: LandingStep[];
  /** Titulo do bloco visual. */
  visualTitle?: string;
  /** Descricao breve do bloco visual. */
  visualDescription?: string;
  /** Q&A no fim da landing. */
  faq: LandingFaq[];
  /** Imagens (before/after + galeria). */
  images: LandingImages;
  /** CTA do sub-bloco final. */
  finalCta?: string;
  /** Links internos relacionados. */
  relatedLinks?: LandingRelatedLink[];
  /** Bullets de "Por que escolher", exibidos depois da galeria. */
  whyChoose?: string[];
  /** Title customizado da seção whyChoose. Default genérico se ausente. */
  whyChooseTitle?: ReactNode;
  /** Source pro LeadFormModal (`estilos-japandi`, `ambientes-sala` etc.). */
  source: string;
  /** Estilo default opcional pro LeadFormModal. */
  defaultStyle?: string;
  /** Cômodo default opcional pro LeadFormModal. */
  defaultRoomType?: string;
};

/** Renderiza `*trecho*` como `<span class="font-serif italic...">`. */
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

/**
 * Layout expandido das landings programaticas. Substitui o single-screen
 * anterior (so hero) por estrutura completa: hero + bullets + como funciona
 * + antes/depois + galeria + FAQ + sub-CTA + related links + Footer.
 *
 * Usado em /estilos/$slug e /ambientes/$slug. Imagens reutilizam assets
 * existentes em src/assets/ via mapa lookup (LANDING_IMAGES). CTA primario
 * abre LeadFormModal; sub-CTA leva direto pro fluxo de geracao via deeplink
 * /?upload=1.
 */
export function ExpandedLanding({
  kicker = "Decoração com IA",
  h1,
  promise,
  cta,
  trustText,
  benefits,
  steps = DEFAULT_STEPS,
  visualTitle,
  visualDescription,
  faq,
  images,
  finalCta,
  relatedLinks,
  whyChoose,
  whyChooseTitle,
  source,
  defaultStyle,
  defaultRoomType,
}: Props) {
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadMounted, setLeadMounted] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadMounted, setUploadMounted] = useState(false);
  useEffect(() => {
    if (leadOpen) setLeadMounted(true);
  }, [leadOpen]);
  useEffect(() => {
    if (uploadOpen) setUploadMounted(true);
  }, [uploadOpen]);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const beforeUrl = resolveLandingImage(images.before);
  const afterUrl = resolveLandingImage(images.after);
  const galleryUrls = (images.gallery ?? [])
    .map((k) => resolveLandingImage(k))
    .filter((u): u is string => !!u);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header simplificado — sem o menu completo da Home pra manter foco. */}
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <IdealSpaceLogo />
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

      {/* HERO — kicker + h1 + parágrafo + CTA primário + trust microcopy */}
      <section className="pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            {kicker}
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] font-semibold leading-[1.05]">
            {renderHeadline(h1)}
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">{promise}</p>
          <div className="mt-9 flex flex-col items-center gap-3">
            {/* CTA primário acima da dobra: abre o fluxo de upload com o
                ambiente/estilo da rota pré-selecionado. */}
            <Button
              onClick={() => setUploadOpen(true)}
              className="h-12 w-full sm:w-auto rounded-full px-8 text-base bg-accent text-accent-foreground hover:opacity-95"
            >
              <Camera className="h-4 w-4 mr-2" /> {cta}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            {/* CTA secundário discreto pra quem prefere receber proposta
                por email em vez de uploadar foto agora. */}
            <button
              type="button"
              onClick={() => setLeadOpen(true)}
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition"
            >
              Receber ideias por e-mail
            </button>
          </div>
          {trustText && <p className="mt-3 text-xs text-muted-foreground">{trustText}</p>}
        </div>
      </section>

      {/* BENEFITS — 3-5 cards com check icon */}
      <section className="py-12 sm:py-16 border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-accent text-center">
            O que você vai ver
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div
                key={b}
                className="flex items-start gap-3 rounded-2xl bg-background border border-border/60 p-5"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA — 3 passos */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Como funciona</div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold">
              Em <span className="font-serif italic font-normal">3 passos</span>, da foto à
              inspiração
            </h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {steps.map((step, idx) => {
              const Icon = idx === 0 ? Upload : idx === 1 ? Wand2 : Sparkles;
              return (
                <div
                  key={step.t}
                  className="relative rounded-3xl border border-border/60 bg-card/40 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent grid place-items-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="font-serif text-3xl text-muted-foreground/60">{idx + 1}</div>
                  </div>
                  <div className="mt-5 text-base font-medium leading-tight">{step.t}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER — só renderiza se temos os 2 assets */}
      {beforeUrl && afterUrl && (
        <section className="py-16 sm:py-20 border-t border-border/60 bg-card/40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
                Antes e depois
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold">
                {visualTitle ?? (
                  <>
                    Arraste para <span className="font-serif italic font-normal">comparar</span>
                  </>
                )}
              </h2>
              {visualDescription && (
                <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
                  {visualDescription}
                </p>
              )}
            </div>
            <div className="mt-10">
              <BeforeAfter
                before={beforeUrl}
                after={afterUrl}
                alt="Exemplo de antes e depois"
                className="aspect-[5/4] w-full shadow-xl shadow-black/5 ring-1 ring-black/5"
              />
            </div>
          </div>
        </section>
      )}

      {/* GALERIA — 3 imagens de inspiração relacionadas */}
      {galleryUrls.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
                Inspiração visual
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold">
                Referências para o seu projeto
              </h2>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryUrls.slice(0, 3).map((url, idx) => (
                <div
                  key={url}
                  className="relative aspect-[4/5] overflow-hidden rounded-3xl border bg-background"
                >
                  <img
                    src={url}
                    alt={`Referência ${idx + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* POR QUE ESCOLHER — bloco de bullets com argumentos extras de venda */}
      {whyChoose && whyChoose.length > 0 && (
        <section className="py-16 sm:py-20 border-t border-border/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
                Por que vale
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold">
                {whyChooseTitle ?? (
                  <>
                    Razões para <span className="font-serif italic font-normal">testar agora</span>
                  </>
                )}
              </h2>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {whyChoose.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/85">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ — accordion simples */}
      <section className="py-16 sm:py-20 border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Perguntas</div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold">
              Tire suas <span className="font-serif italic font-normal">dúvidas</span>
            </h2>
          </div>
          <div className="mt-10 divide-y divide-border/60">
            {faq.map((item, idx) => {
              const open = openFaqIdx === idx;
              return (
                <div key={item.q} className="py-1">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(open ? null : idx)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left hover:text-foreground transition"
                  >
                    <span className="text-base font-medium">{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="pb-5 -mt-1">
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SUB-CTA — fundo escuro, fecha o funil */}
      <section className="py-16 sm:py-20 border-t border-border/60 bg-foreground text-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold leading-tight">
            Comece pela{" "}
            <span className="font-serif italic font-normal text-accent">foto do seu ambiente</span>
          </h2>
          <p className="mt-4 text-background/70 text-sm sm:text-base leading-relaxed">
            Use a IA como ponto de partida para decidir melhor. Sem cadastro pra ver a primeira
            ideia.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* Sub-CTA primário (escuro) — mesmo destino do CTA da dobra:
                abre upload com style/room pré-selecionado. */}
            <Button
              onClick={() => setUploadOpen(true)}
              className="h-12 rounded-full px-8 text-base bg-accent text-accent-foreground hover:opacity-95"
            >
              <Camera className="h-4 w-4 mr-2" /> {finalCta ?? cta}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            {/* Secundário discreto — captura lead pra quem não vai uploadar. */}
            <button
              type="button"
              onClick={() => setLeadOpen(true)}
              className="text-sm text-background/70 hover:text-background underline-offset-4 hover:underline transition"
            >
              Receber ideias por e-mail
            </button>
          </div>
        </div>
      </section>

      {/* RELATED LINKS — distribui autoridade SEO entre landings irmãs */}
      {relatedLinks && relatedLinks.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
              Explore também
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {relatedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center rounded-full border border-border/60 bg-card px-4 h-9 text-sm hover:bg-muted transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {uploadMounted && (
        <Suspense fallback={modalFallback}>
          <UploadPhotoModal
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            initialStyle={defaultStyle}
            initialRoom={defaultRoomType}
          />
        </Suspense>
      )}
      {leadMounted && (
        <Suspense fallback={modalFallback}>
          <LeadFormModal
            open={leadOpen}
            onOpenChange={setLeadOpen}
            source={source}
            defaultStyle={defaultStyle}
            defaultRoomType={defaultRoomType}
          />
        </Suspense>
      )}
    </div>
  );
}
