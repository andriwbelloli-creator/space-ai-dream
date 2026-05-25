/**
 * PresentationModal (Guia) — onboarding premium do Ideal Space.
 *
 * Acionado por:
 *  - link "Guia" no header desktop/mobile (`onDemo` → `handlePresentation`);
 *  - link "Ver demonstração" no hero da home.
 *
 * Cumpre a função de explicar o produto em <10s, mostrar o valor da IA e
 * direcionar pra ações reais. CTAs:
 *  - Criar projeto com IA  → abre UploadPhotoModal (`onCreate`)
 *  - Ver ideias prontas    → fecha + navega pra `#galeria` (smart anchor)
 *  - Conhecer planos       → fecha + navega pra `/pricing`
 *  - Sou profissional      → fecha + navega pra `#pro` (smart anchor)
 *
 * API mantida igual à versão anterior pra não quebrar callers existentes
 * (`Index` em `routes/index.tsx`).
 */
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BeforeAfter } from "@/components/BeforeAfter";
import { useNavigate } from "@tanstack/react-router";
import { useSmartAnchor } from "@/lib/use-smart-anchor";
import {
  ArrowRight,
  Camera,
  Wand2,
  Sparkles,
  ShoppingBag,
  Save,
  X,
  BookmarkPlus,
  CreditCard,
  Briefcase,
} from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  before: string;
  after: string;
  /** Abre o fluxo de criação a partir do CTA primário do guia. */
  onCreate?: () => void;
};

type Step = {
  icon: React.ReactNode;
  num: string;
  title: string;
  description: string;
  micro: string;
};

const STEPS: ReadonlyArray<Step> = [
  {
    icon: <Camera className="h-4 w-4" />,
    num: "01",
    title: "Envie uma foto",
    description: "Use uma imagem real do ambiente que você quer transformar.",
    micro: "A IA usa seu próprio espaço como base, não um modelo genérico.",
  },
  {
    icon: <Wand2 className="h-4 w-4" />,
    num: "02",
    title: "Escolha o estilo",
    description:
      "Defina o tipo de espaço e a estética: Japandi, Contemporâneo, Minimalista, Natural, Luxo discreto, Moderno Orgânico e outros.",
    micro: "Você direciona a estética antes da geração.",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    num: "03",
    title: "Veja a transformação",
    description:
      "O Ideal Space cria uma visualização decorada com móveis, iluminação e composição alinhada ao estilo escolhido.",
    micro: "Compare possibilidades antes de comprar, reformar ou contratar.",
  },
  {
    icon: <ShoppingBag className="h-4 w-4" />,
    num: "04",
    title: "Planeje os itens",
    description: "Explore produtos sugeridos, referências e orçamento estimado.",
    micro: "A inspiração vira um plano mais prático.",
  },
  {
    icon: <Save className="h-4 w-4" />,
    num: "05",
    title: "Use como projeto",
    description: "Salve, refine ou apresente a ideia com mais segurança.",
    micro: "Funciona para moradores, arquitetos, designers, imobiliárias e profissionais.",
  },
];

export function PresentationModal({ open, onOpenChange, before, after, onCreate }: Props) {
  const navigate = useNavigate();
  const smartAnchor = useSmartAnchor();

  // Fecha o modal antes de navegar pra evitar transição com o modal aberto.
  const closeThen = (fn: () => void) => () => {
    onOpenChange(false);
    fn();
  };

  const goIdeas = closeThen(() => smartAnchor("galeria")());
  const goPro = closeThen(() => smartAnchor("pro")());
  const goPlans = closeThen(() => {
    void navigate({ to: "/pricing" });
  });
  const goCreate = closeThen(() => {
    onCreate?.();
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[calc(100vw-1.5rem)] sm:max-w-4xl rounded-3xl p-0 overflow-hidden border-0 shadow-2xl max-h-[92vh] overflow-y-auto"
        onInteractOutside={() => onOpenChange(false)}
      >
        <DialogTitle className="sr-only">Como o Ideal Space funciona</DialogTitle>
        <DialogDescription className="sr-only">
          Guia em cinco passos: envie uma foto, escolha o estilo, veja a transformação, planeje
          os itens com orçamento estimado e use como projeto.
        </DialogDescription>

        <button
          aria-label="Fechar"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-background/80 backdrop-blur grid place-items-center hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid sm:grid-cols-[1.05fr_1fr]">
          {/* Visual antes/depois — peça âncora da explicação. Mantém o
              `auto` slider pra demonstrar o efeito sem o usuário precisar
              interagir. Mobile: aspect mais paisagem pra não ocupar tela. */}
          <div className="relative bg-muted/40 p-3 sm:p-5">
            <BeforeAfter
              before={before}
              after={after}
              auto
              alt="Antes e depois: ambiente decorado pela IA do Ideal Space"
              className="aspect-[5/4] sm:aspect-[4/5] w-full ring-1 ring-black/5"
            />
            {/* Microcopy contextual no canto inferior do visual — só
                desktop pra não competir com o conteúdo no mobile. */}
            <div className="hidden sm:block absolute bottom-7 left-7 right-7 sm:left-8 sm:right-8 rounded-2xl bg-background/85 backdrop-blur border p-3 text-[11px] text-muted-foreground">
              Arraste o controle para comparar o antes e depois da IA.
            </div>
          </div>

          {/* Conteúdo principal: header + 5 etapas + CTAs */}
          <div className="p-5 sm:p-8 flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent">Guia</div>
            <h3 className="mt-2 text-xl sm:text-3xl font-semibold leading-tight tracking-[-0.01em]">
              Como o <span className="font-serif italic font-normal">Ideal Space</span> funciona
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Envie uma foto, escolha o estilo e veja a IA transformar seu ambiente em uma
              proposta decorada com produtos e orçamento estimado.
            </p>

            <ol className="mt-5 space-y-3.5">
              {STEPS.map((s) => (
                <li key={s.num} className="flex gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-accent/12 text-accent grid place-items-center">
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
                        {s.num}
                      </span>
                      <div className="text-sm font-medium">{s.title}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {s.description}
                    </div>
                    <div className="text-[11px] text-accent/80 mt-1 italic">{s.micro}</div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Bloco de CTAs: primário em destaque, 3 secundários discretos
                em linha. Todos fecham o modal antes de navegar. */}
            <div className="mt-auto pt-6 flex flex-col gap-3">
              <Button
                onClick={goCreate}
                className="h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 px-5 text-sm w-full"
              >
                Criar projeto com IA <ArrowRight className="ml-1 h-4 w-4" />
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
                <button
                  type="button"
                  onClick={goIdeas}
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition underline-offset-4 hover:underline"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" /> Ver ideias prontas
                </button>
                <span className="text-border" aria-hidden>
                  ·
                </span>
                <button
                  type="button"
                  onClick={goPlans}
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition underline-offset-4 hover:underline"
                >
                  <CreditCard className="h-3.5 w-3.5" /> Conhecer planos
                </button>
                <span className="text-border" aria-hidden>
                  ·
                </span>
                <button
                  type="button"
                  onClick={goPro}
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition underline-offset-4 hover:underline"
                >
                  <Briefcase className="h-3.5 w-3.5" /> Sou profissional
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
