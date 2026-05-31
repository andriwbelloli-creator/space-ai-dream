import { Button } from "@/components/ui/button";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Leaf, Coins, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Chip flutuante sobre a imagem after — mostra "decisões aplicadas"
 * pelo projeto (estilo, orçamento, restrição). Posicionamento absoluto
 * controlado pelo container do hero.
 */
type FloatingChip = {
  icon: LucideIcon;
  label: string;
  /** Linha secundária opcional, exibida abaixo do label em negrito. */
  value?: string;
};

const DEFAULT_CHIPS: FloatingChip[] = [
  { icon: Leaf, label: "Japandi" },
  { icon: Coins, label: "Orçamento", value: "R$ 8.000" },
  { icon: Layers, label: "Preservar piso" },
];

type Feature = {
  icon: LucideIcon;
  title: string;
};

type Props = {
  /** H1 — aceita ReactNode pra permitir trechos serif italicos. */
  heading: React.ReactNode;
  /** Subtitulo curto abaixo do H1. */
  subtitle: string;
  /** Label do CTA primario (preto). */
  primaryCta: string;
  /** Click handler do CTA primario. */
  onPrimaryClick: () => void;
  /** Label do CTA secundario (outline). */
  secondaryCta?: string;
  /** Click handler do CTA secundario. */
  onSecondaryClick?: () => void;
  /** Imagem "antes". */
  beforeImage: string;
  /** Imagem "depois". */
  afterImage: string;
  /** Alt da imagem before/after. */
  alt?: string;
  /** Chips flutuantes. Default = Japandi / Orçamento / Preservar piso. */
  chips?: FloatingChip[];
  /** 3 features no rodapé do hero (mockup mostra antes/depois, lista, orçamento). */
  features?: Feature[];
};

/**
 * Hero principal do novo layout editorial: H1 serif XL + subtitle + 2 CTAs
 * à esquerda, BeforeAfter interativo à direita com chips flutuantes sobre
 * a imagem after, e 3 features no rodapé esquerdo.
 *
 * Reusa o `<BeforeAfter>` existente — não duplica lógica de slider.
 */
export function HeroBeforeAfter({
  heading,
  subtitle,
  primaryCta,
  onPrimaryClick,
  secondaryCta,
  onSecondaryClick,
  beforeImage,
  afterImage,
  alt = "Antes e depois do ambiente",
  chips = DEFAULT_CHIPS,
  features,
}: Props) {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pt-16">
        {/* Esquerda — H1, subtitle, CTAs, features */}
        <div className="flex flex-col">
          <h1 className="font-serif text-5xl font-normal leading-[1.02] tracking-[-0.01em] text-foreground sm:text-6xl lg:text-[5.5rem]">
            {heading}
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              onClick={onPrimaryClick}
              className="h-12 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90"
            >
              {primaryCta}
            </Button>
            {secondaryCta && (
              <Button
                onClick={onSecondaryClick}
                variant="outline"
                className="h-12 rounded-full border-border bg-card px-7 text-sm font-medium text-foreground hover:bg-muted"
              >
                {secondaryCta}
              </Button>
            )}
          </div>

          {features && features.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 px-4 py-3"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-background text-accent">
                    <f.icon className="h-4 w-4" />
                  </span>
                  <span className="max-w-[8rem] text-xs leading-tight text-foreground">
                    {f.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Direita — BeforeAfter com chips flutuantes */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-editorial-lg)] ring-1 ring-border/60">
            <BeforeAfter
              before={beforeImage}
              after={afterImage}
              alt={alt}
              className="aspect-[4/3] w-full"
              priority
            />
          </div>

          {/* Chips flutuantes — empilhados verticalmente do lado direito */}
          <div className="pointer-events-none absolute right-3 top-6 hidden flex-col gap-3 sm:right-5 sm:top-10 sm:flex">
            {chips.map((chip) => (
              <div
                key={chip.label}
                className="pointer-events-auto flex min-w-[8.5rem] items-center gap-2.5 rounded-2xl bg-card/95 px-3.5 py-2.5 shadow-[var(--shadow-editorial-md)] ring-1 ring-border/60 backdrop-blur"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-accent">
                  <chip.icon className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {chip.label}
                  </div>
                  {chip.value && (
                    <div className="text-sm font-medium text-foreground">{chip.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
