import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Check,
  ChevronDown,
  ShieldCheck,
  ShoppingBag,
  Info,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";

const LeadFormModal = lazy(() =>
  import("@/components/LeadFormModal").then((m) => ({ default: m.LeadFormModal })),
);

/** Fallback leve enquanto o chunk do modal carrega sob demanda. */
const modalFallback = (
  <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
  </div>
);

/**
 * Card de promessa exibido na seção central. O `icon` é um componente
 * lucide-react (ex: Ruler, Palette) que será renderizado com tamanho fixo.
 */
export type ProfessionalPromise = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

/** Pergunta + resposta exibida no accordion de FAQ. */
export type ProfessionalLandingFaq = { q: string; a: string };

/** Link interno exibido na seção "Veja também". */
export type ProfessionalLandingLink = { label: string; to: string };

/**
 * Bloco de transparência exibido em todas as landings profissionais. Cobre
 * 4 pontos: o que está disponível hoje (2D), como tratar a lista de
 * produtos, o que a IA é (proposta visual) e o que a IA NÃO substitui
 * (projeto técnico), e privacidade/LGPD.
 *
 * Conteúdo igual em todas as 3 landings — repetir é um sinal pra Google
 * que estes 4 pontos são parte estável do produto, não promessa solta.
 */
const TRUST_ITEMS = [
  {
    icon: Sparkles,
    title: "2D disponível agora",
    desc: "Geramos hoje a versão 2D do ambiente, com lista de compras e estimativa de orçamento. Render 5D e planta baixa estão em desenvolvimento como acesso antecipado.",
  },
  {
    icon: ShoppingBag,
    title: "Produtos como referência",
    desc: "A lista de compras sugere produtos aproximados pelo estilo, sem garantia de produto idêntico ou disponibilidade no marketplace.",
  },
  {
    icon: Info,
    title: "Proposta visual, não projeto técnico",
    desc: "Os resultados são propostas visuais geradas por IA. Não substituem projeto executivo de arquitetura, ART/RRT ou aprovação de obra.",
  },
  {
    icon: ShieldCheck,
    title: "Privacidade e LGPD",
    desc: "As fotos enviadas ficam privadas por padrão. Você decide quando, e se, compartilhar cada projeto.",
  },
];

/**
 * Props do template usado pelas 3 landings de perfis profissionais:
 * /para-arquitetos, /para-designers, /para-imobiliarias.
 *
 * Os headings aceitam `React.ReactNode` porque cada landing usa um trecho
 * em itálico serif accent dentro do H1/H2 (ex: "Acelerador de
 * <em>Estudos Preliminares</em>").
 *
 * Trust block (transparência 2D/produtos/IA/LGPD) é shared — não vem como
 * prop, é renderizado igual nas 3 páginas.
 */
export type ProfessionalLandingProps = {
  /** Texto curto exibido como chip do hero (com ícone Sparkles). */
  heroKicker: string;
  /** H1 principal — pode conter <span> com font-serif italic accent. */
  heroHeading: React.ReactNode;
  /** Parágrafo abaixo do H1. */
  heroSubtitle: string;
  /** Texto do botão principal (hero + CTA final). */
  ctaLabel: string;
  /** Kicker da seção central de promessas. */
  promisesKicker: string;
  /** Heading da seção central de promessas. */
  promisesHeading: React.ReactNode;
  /** 3 cards de promessa exibidos em grid. */
  promises: ProfessionalPromise[];
  /** Perguntas frequentes específicas do perfil (accordion). */
  faq: ProfessionalLandingFaq[];
  /** Links internos pra outras landings relacionadas. */
  internalLinks: ProfessionalLandingLink[];
  /** Kicker do bloco preto de CTA final. */
  finalKicker: string;
  /** Heading do bloco preto de CTA final. */
  finalHeading: string;
  /** Parágrafo de detalhe do CTA final. */
  finalDescription: string;
  /** Bullets do CTA final (lateral direita). */
  finalBullets: string[];
  /** Identifica origem do lead no back-end (LeadFormModal source). */
  leadSource: string;
  /** Plano pré-selecionado no LeadFormModal. */
  leadPlanInterest: string;
  /** Título do LeadFormModal. */
  leadTitle: string;
};

/**
 * Template visual das landings profissionais — header padrão, hero,
 * promessas, CTA final, lead modal. Comportamento e estilo idênticos
 * às páginas antes do refactor. Cada landing fornece props específicos.
 */
export function ProfessionalLanding({
  heroKicker,
  heroHeading,
  heroSubtitle,
  ctaLabel,
  promisesKicker,
  promisesHeading,
  promises,
  faq,
  internalLinks,
  finalKicker,
  finalHeading,
  finalDescription,
  finalBullets,
  leadSource,
  leadPlanInterest,
  leadTitle,
}: ProfessionalLandingProps) {
  const [leadOpen, setLeadOpen] = useState(false);
  // Monta o modal lazy só na 1ª abertura e o mantém montado (preserva animações).
  const [leadMounted, setLeadMounted] = useState(false);
  useEffect(() => {
    if (leadOpen) setLeadMounted(true);
  }, [leadOpen]);
  // Accordion da FAQ — apenas 1 item aberto por vez. null = todos fechados.
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header — padrao editorial (creme + logo serif + CTA terracota). */}
      <EditorialHeader onCtaClick={() => setLeadOpen(true)} ctaLabel={ctaLabel} />

      {/* Hero — H1 serif gigante, kicker terracota, CTA preto. Match com a home. */}
      <section className="pt-16 sm:pt-20 pb-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            {heroKicker}
          </div>

          <h1 className="mt-5 font-serif text-5xl font-normal leading-[1.04] tracking-[-0.01em] text-foreground sm:text-6xl lg:text-7xl">
            {heroHeading}
          </h1>

          <p className="mt-7 text-base text-muted-foreground leading-relaxed">{heroSubtitle}</p>

          <div className="mt-9">
            <Button
              onClick={() => setLeadOpen(true)}
              className="h-12 w-full sm:w-auto rounded-full px-8 text-base bg-foreground text-background hover:bg-foreground/90"
            >
              {ctaLabel}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Promessas */}
      <section className="py-16 sm:py-20 bg-card/40 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
              {promisesKicker}
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl tracking-[-0.02em] font-semibold">
              {promisesHeading}
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promises.map((p) => (
              <div key={p.title} className="rounded-3xl border bg-background p-6">
                <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent grid place-items-center">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-medium">{p.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Disclaimers — shared em todas as landings profissionais */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Transparência</div>
            <h2 className="mt-3 text-2xl sm:text-3xl tracking-[-0.02em] font-semibold">
              Sobre o nosso <span className="font-serif italic font-normal">jeito de entregar</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              O que está disponível hoje, o que vem em breve e o que esperar de cada entrega.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="rounded-3xl border bg-card/40 p-5 flex gap-4">
                <span className="h-10 w-10 shrink-0 rounded-xl bg-accent/15 text-accent grid place-items-center">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="font-medium text-sm">{item.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — accordion específico do perfil */}
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
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
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

      {/* Internal links — distribui PageRank pra outras landings */}
      <section className="py-12 border-t border-border/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-accent text-center">
            Veja também
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl tracking-[-0.02em] font-semibold text-center">
            Outras páginas que podem interessar
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {internalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex h-9 items-center rounded-full border border-border bg-background px-4 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-3xl border bg-foreground text-background p-8 sm:p-12 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="max-w-xl">
              <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
                {finalKicker}
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl tracking-[-0.02em] font-semibold">
                {finalHeading}
              </h2>
              <p className="mt-3 text-background/70 text-sm">{finalDescription}</p>
            </div>
            <ul className="space-y-2 text-sm shrink-0">
              {finalBullets.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 text-center">
            <Button
              onClick={() => setLeadOpen(true)}
              className="h-12 w-full sm:w-auto rounded-full px-8 text-base bg-accent text-accent-foreground hover:opacity-95"
            >
              {ctaLabel}
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
            source={leadSource}
            planInterest={leadPlanInterest}
            title={leadTitle}
          />
        </Suspense>
      )}
    </div>
  );
}
