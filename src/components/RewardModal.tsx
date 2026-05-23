import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Download,
  Smartphone,
  BookmarkPlus,
  ShoppingBag,
  Gift,
  Tag,
  Sparkles,
  X,
  ShieldCheck,
} from "lucide-react";

export type RewardKind =
  | "budget" // 1. Baixar orçamento completo
  | "send_phone" // 2. Receber projeto no WhatsApp
  | "save_project" // 3. Salvar projeto
  | "shopping_list" // 4. Lista de compras completa
  | "extra_gen" // 5. Geração extra
  | "coupon" // 6. Cupom / ofertas
  | "compare"; // 7. Comparar estilos

type RewardConfig = {
  icon: React.ComponentType<{ className?: string }>;
  badge: string; // small uppercase chip
  title: string;
  subtitle: string;
};

// MVP: o RewardModal não coleta e-mail/telefone (não havia persistência real).
// Cada entrada descreve o valor de forma honesta — sem prometer envio por
// e-mail/WhatsApp. O orçamento sai como PDF client-side; o resto leva ao cadastro.
const CONFIGS: Record<RewardKind, RewardConfig> = {
  budget: {
    icon: Download,
    badge: "Orçamento",
    title: "Baixe o orçamento do seu projeto",
    subtitle: "Geramos uma estimativa em PDF com a lista de itens e faixas de preço.",
  },
  send_phone: {
    icon: Smartphone,
    badge: "Continue no celular",
    title: "Continue no celular",
    subtitle: "Crie sua conta gratuita para acessar este projeto de qualquer aparelho.",
  },
  save_project: {
    icon: BookmarkPlus,
    badge: "Salvar projeto",
    title: "Salve este projeto para acessar depois",
    subtitle: "Crie sua conta gratuita em segundos. Sem cartão, sem complicação.",
  },
  shopping_list: {
    icon: ShoppingBag,
    badge: "Lista completa",
    title: "Veja a lista completa de produtos",
    subtitle: "Crie sua conta gratuita para acompanhar os itens e faixas de preço do ambiente.",
  },
  extra_gen: {
    icon: Gift,
    badge: "Bônus",
    title: "Ganhe mais gerações",
    subtitle: "Crie sua conta gratuita para salvar projetos e gerar novas versões.",
  },
  coupon: {
    icon: Tag,
    badge: "Ofertas",
    title: "Acompanhe ofertas de produtos",
    subtitle: "Crie sua conta gratuita para acompanhar itens semelhantes ao seu ambiente.",
  },
  compare: {
    icon: Sparkles,
    badge: "Comparar estilos",
    title: "Compare estilos do mesmo ambiente",
    subtitle: "Crie sua conta gratuita para gerar e comparar variações lado a lado.",
  },
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: RewardKind | null;
  onSuccess?: (
    kind: RewardKind,
    data: { email?: string; phone?: string; marketing?: boolean },
  ) => void;
};

export function RewardModal({ open, onOpenChange, kind, onSuccess }: Props) {
  const cfg = kind ? CONFIGS[kind] : null;
  if (!cfg || !kind) return null;

  const Icon = cfg.icon;
  const isBudget = kind === "budget";

  // Orçamento é gerado client-side (jsPDF). onSuccess dispara o generateBudgetPdf
  // no componente pai — nada é enviado a servidor.
  const handleDownload = () => {
    onSuccess?.(kind, {});
    onOpenChange(false);
  };

  const goToSignup = () => {
    window.location.href = "/login?mode=signup";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-md rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
        <DialogTitle className="sr-only">{cfg.title}</DialogTitle>
        <DialogDescription className="sr-only">{cfg.subtitle}</DialogDescription>
        <button
          aria-label="Fechar"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-background/85 backdrop-blur grid place-items-center hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="inline-flex h-9 w-9 rounded-2xl bg-accent/15 text-accent items-center justify-center">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">{cfg.badge}</span>
          </div>
          <h3 className="text-xl sm:text-[22px] font-semibold leading-tight tracking-[-0.01em]">
            {cfg.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{cfg.subtitle}</p>

          <p className="mt-4 text-sm text-muted-foreground">
            {isBudget
              ? "Seu orçamento será gerado como uma estimativa em PDF, direto no seu navegador. Para salvar seus projetos e acompanhar novas versões, crie sua conta gratuita."
              : "Crie sua conta gratuita para salvar seus projetos, gerar novas versões e acompanhar tudo em um só lugar."}
          </p>

          {isBudget && (
            <Button
              type="button"
              onClick={handleDownload}
              className="mt-5 w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              <Download className="h-4 w-4 mr-2" /> Baixar orçamento em PDF
            </Button>
          )}

          <Button
            type="button"
            variant={isBudget ? "outline" : "default"}
            onClick={goToSignup}
            className={
              isBudget
                ? "mt-2 w-full h-11 rounded-xl"
                : "mt-5 w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
            }
          >
            Criar conta gratuita
          </Button>

          <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              Não coletamos e-mail ou telefone nesta etapa. Veja a{" "}
              <a href="/legal#privacidade" className="underline">
                Política de Privacidade
              </a>
              .
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
