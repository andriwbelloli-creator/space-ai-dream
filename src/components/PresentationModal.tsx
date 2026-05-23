import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BeforeAfter } from "@/components/BeforeAfter";
import { ArrowRight, ImageIcon, Wand2, Sparkles, X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  before: string;
  after: string;
  /** Abre o fluxo de criação a partir do CTA primário da demo. */
  onCreate?: () => void;
};

export function PresentationModal({ open, onOpenChange, before, after, onCreate }: Props) {
  const steps = [
    {
      icon: <ImageIcon className="h-4 w-4" />,
      t: "Escolha o ambiente",
      d: "Use uma foto vazia ou selecione um exemplo da galeria.",
    },
    {
      icon: <Wand2 className="h-4 w-4" />,
      t: "Escolha o estilo",
      d: "Moderno, minimalista, premium, aconchegante e muito mais.",
    },
    {
      icon: <Sparkles className="h-4 w-4" />,
      t: "Veja o resultado",
      d: "Compare antes e depois, baixe o orçamento e veja a lista de produtos.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[calc(100vw-1.5rem)] sm:max-w-3xl rounded-3xl p-0 overflow-hidden border-0 shadow-2xl max-h-[92vh] overflow-y-auto"
        onInteractOutside={() => onOpenChange(false)}
      >
        <DialogTitle className="sr-only">Demonstração do Ideal Space</DialogTitle>
        <DialogDescription className="sr-only">
          Veja em três passos como o Ideal Space transforma a foto de um ambiente em um projeto
          decorado.
        </DialogDescription>
        <button
          aria-label="Fechar"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-background/80 backdrop-blur grid place-items-center hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid sm:grid-cols-[1.05fr_1fr]">
          <div className="relative bg-muted/40 p-3 sm:p-5">
            <BeforeAfter
              before={before}
              after={after}
              auto
              className="aspect-[5/4] w-full ring-1 ring-black/5"
            />
            <div className="hidden sm:block absolute bottom-7 left-7 right-7 sm:left-8 sm:right-8 rounded-2xl bg-background/85 backdrop-blur border p-3 text-[11px] text-muted-foreground">
              Arraste o controle para comparar o antes e depois da IA.
            </div>
          </div>

          <div className="p-5 sm:p-8 flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent">Demonstração</div>
            <h3 className="mt-2 text-xl sm:text-3xl font-semibold leading-tight tracking-[-0.01em]">
              Veja como o <span className="font-serif italic font-normal">Ideal Space</span>{" "}
              funciona
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Escolha um ambiente vazio, selecione um estilo e veja a IA criar uma versão decorada
              em poucos minutos.
            </p>

            <ol className="mt-5 space-y-3.5">
              {steps.map((s, i) => (
                <li key={s.t} className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-xl bg-accent/12 text-accent grid place-items-center">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      <span className="text-muted-foreground mr-1.5">0{i + 1}.</span>
                      {s.t}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {s.d}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onCreate?.();
                }}
                className="h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 px-5 text-sm flex-1"
              >
                Criar meu primeiro projeto <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 rounded-full px-5 text-sm"
              >
                Ver exemplos
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
