/**
 * AtelierHero — primeira dobra editorial da home (direção "Atelier Inteligente").
 *
 * Substitui o antigo Hero/HeroVisual. Estática por escolha de produto:
 * sem autoplay e sem carrossel — um único antes/depois protagonista.
 *
 * Paleta: usa os tokens globais do design system (bg-background marfim,
 * text-foreground grafite, text-accent terracota). O ÚNICO valor hardcoded
 * é o dourado queimado/champagne (GOLD), que não existe como token global —
 * fica escopado aqui até virar token (candidato a --gold em styles.css).
 *
 * CTAs e tracking são reaproveitados da home: o componente recebe os
 * handlers reais (onUpload, onBudget, onDropFile) e dispara os mesmos
 * eventos de funil do hero anterior (hero_upload_click, hero_see_projects_click,
 * download_budget_click).
 */

import { Camera, ArrowRight, Sparkles, Check, LayoutGrid, ShoppingBag, Calculator } from "lucide-react";
import { useTrack } from "@/lib/use-track";
import { useSmartAnchor } from "@/lib/use-smart-anchor";

import imgBefore from "@/assets/empty-living.jpg";
import imgAfter from "@/assets/decorated-living-warm.jpg";
import imgMoodboard from "@/assets/moodboard-pro.jpg";
import imgMateriais from "@/assets/style-natural.jpg";
import imgLista from "@/assets/decorated-kitchen-island.jpg";

// Dourado queimado / champagne escuro — único tom fora dos tokens globais.
// Usado só em trilhos, divisórias e bordas premium finas desta dobra.
const GOLD = "#9C7B48";
const GOLD_LIGHT = "#C4A96B";

const CHIPS = ["Japandi", "Orçamento R$ 8.000", "Preservar piso"];

const TRUST = ["3 gerações grátis", "Sem cartão", "Fotos privadas", "Resultado em segundos"];

const DELIVERABLES = [
  { icon: LayoutGrid, label: "Antes/depois realista" },
  { icon: ShoppingBag, label: "Lista de compras" },
  { icon: Calculator, label: "Orçamento guiado" },
];

type Props = {
  onUpload: () => void;
  onBudget: () => void;
  onDropFile: (file: File) => void;
};

export function AtelierHero({ onUpload, onBudget, onDropFile }: Props) {
  const track = useTrack();
  const smartAnchor = useSmartAnchor();

  const handleDropzoneUpload = () => {
    track("hero_upload_click", { source: "dropzone" });
    onUpload();
  };
  const handleSeeProjects = () => {
    track("hero_see_projects_click");
    smartAnchor("galeria")();
  };
  const handleBudget = () => {
    track("download_budget_click", { source: "hero" });
    onBudget();
  };

  // Cards de entregáveis — Estilo e Móveis reforçam o fluxo (abrem upload),
  // Lista de compras leva ao orçamento de exemplo (preserva onBudget).
  // Nomes honestos e aderentes ao produto (sem prometer entregável que não existe).
  const CARDS = [
    { label: "Estilo e paleta", sub: "Defina a direção visual do ambiente.", img: imgMoodboard, onClick: handleDropzoneUpload },
    { label: "Móveis e decoração", sub: "Veja peças e composições coerentes com o estilo.", img: imgMateriais, onClick: handleDropzoneUpload },
    { label: "Lista de compras", sub: "Organize referências para tirar o projeto do papel.", img: imgLista, onClick: handleBudget },
  ];

  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      {/* ── Hero principal ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-14 pb-10 grid lg:grid-cols-[0.78fr_1.5fr] gap-10 lg:gap-14 items-center">
        {/* Texto */}
        <div className="is-fade-up">
          {/* Headline com quebra editorial intencional */}
          <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.6rem] font-semibold leading-[1.04] tracking-[-0.03em]">
            <span className="block">Transforme seu</span>
            <span className="block">ambiente</span>
            <span className="block font-serif italic font-normal text-accent mt-1">
              antes de reformar
            </span>
          </h1>

          <p className="mt-6 text-[15px] sm:text-base text-muted-foreground max-w-sm leading-relaxed">
            IA, curadoria e orçamento para visualizar sua casa pronta com mais segurança.
          </p>

          {/* Dropzone primária — abre o fluxo de upload/criação atual */}
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
              const file = e.dataTransfer.files?.[0];
              if (file) onDropFile(file);
              handleDropzoneUpload();
            }}
            style={{ borderColor: `${GOLD_LIGHT}66` }}
            className="mt-7 w-full max-w-md border-2 border-dashed bg-card/40 hover:border-[color:var(--accent)] hover:bg-accent/5 data-[dragging=true]:bg-accent/10 data-[dragging=true]:border-solid rounded-2xl px-5 py-5 flex items-center gap-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Enviar foto do ambiente"
          >
            <div className="h-11 w-11 shrink-0 grid place-items-center rounded-xl bg-accent/15 text-accent">
              <Camera className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">Criar meu primeiro ambiente</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                ou clique para selecionar · JPG, PNG, WEBP
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
          </button>

          {/* CTA secundário — scroll suave pra galeria de antes/depois */}
          <button
            type="button"
            onClick={handleSeeProjects}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition underline-offset-4 hover:underline"
          >
            <Sparkles className="h-4 w-4" /> Ver antes/depois
          </button>

          {/* Trust horizontal */}
          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Imagem protagonista — moldura de galeria, antes/depois estático */}
        <div className="relative is-fade-up">
          <div
            style={{
              borderColor: `${GOLD}59`,
              boxShadow: "0 18px 50px -12px rgba(23,23,23,0.22)",
            }}
            className="rounded-2xl overflow-hidden border"
          >
            <div className="relative aspect-[16/11] flex">
                {/* Faixa "antes" */}
                <div
                  className="w-[30%] flex-shrink-0 relative overflow-hidden"
                  style={{ filter: "grayscale(22%) brightness(0.97)" }}
                >
                  <img
                    src={imgBefore}
                    alt="Ambiente antes da transformação"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: "right center" }}
                    loading="eager"
                  />
                  <span
                    style={{ borderColor: `${GOLD_LIGHT}66` }}
                    className="absolute bottom-3 left-3 text-[9px] font-medium uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border bg-background/90 text-foreground backdrop-blur-sm"
                  >
                    Antes
                  </span>
                </div>

                {/* Divisor dourado */}
                <div
                  className="w-[2px] flex-shrink-0 self-stretch z-10"
                  style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)` }}
                />

                {/* Imagem "depois" — protagonista */}
                <div className="flex-1 relative overflow-hidden">
                  <img
                    src={imgAfter}
                    alt="Mesmo ambiente transformado pela IA"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                  <span
                    style={{ borderColor: `${GOLD_LIGHT}66` }}
                    className="absolute bottom-3 right-3 text-[9px] font-medium uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border bg-background/90 text-foreground backdrop-blur-sm"
                  >
                    Depois
                  </span>
                </div>
              </div>
          </div>

          {/* Chips discretos sobre a imagem */}
          <div className="absolute top-5 right-5 flex flex-col gap-2.5 items-end">
            {CHIPS.map((label) => (
              <div
                key={label}
                style={{
                  borderColor: `${GOLD}66`,
                  boxShadow: "0 4px 16px -4px rgba(23,23,23,0.20)",
                }}
                className="border rounded-full pl-2.5 pr-3.5 py-1.5 text-[12.5px] font-medium tracking-tight flex items-center gap-2 bg-background/95 text-foreground backdrop-blur-sm"
              >
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ background: GOLD, boxShadow: `0 0 0 2px ${GOLD}33` }}
                />
                {label}
              </div>
            ))}
          </div>

          {/* Selos de entrega abaixo da imagem (reforço de conversão) */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 justify-center lg:justify-start">
            {DELIVERABLES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Icon className="h-4 w-4" style={{ color: GOLD }} strokeWidth={1.6} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cards de entregáveis — editoriais ──────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-9">
          {CARDS.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={card.onClick}
              className="group text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[14px]"
            >
              <div
                style={{
                  borderColor: `${GOLD_LIGHT}40`,
                  boxShadow: "0 10px 30px -16px rgba(23,23,23,0.20)",
                }}
                className="aspect-[4/3] overflow-hidden rounded-[14px] border"
              >
                <img
                  src={card.img}
                  alt={card.label}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[900ms] ease-out"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 pl-0.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-px w-6 flex-shrink-0" style={{ background: GOLD }} />
                  <span className="text-[15px] font-medium tracking-tight text-foreground">
                    {card.label}
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    style={{ color: GOLD }}
                  />
                </div>
                <div className="text-[12.5px] mt-1.5 pl-[34px] text-muted-foreground">
                  {card.sub}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
