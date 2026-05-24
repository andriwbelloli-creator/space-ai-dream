import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Check, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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

/**
 * Props do template usado pelas 3 landings de perfis profissionais:
 * /para-arquitetos, /para-designers, /para-imobiliarias.
 *
 * Os headings aceitam `React.ReactNode` porque cada landing usa um trecho
 * em itálico serif accent dentro do H1/H2 (ex: "Acelerador de
 * <em>Estudos Preliminares</em>").
 *
 * Não inclui FAQ, trust block, internal links nem disclaimer 2D — esses
 * blocos vêm no Lote SEO Engine Fase B.
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

      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            {heroKicker}
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] font-semibold leading-[1.05]">
            {heroHeading}
          </h1>

          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">{heroSubtitle}</p>

          <div className="mt-9">
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
