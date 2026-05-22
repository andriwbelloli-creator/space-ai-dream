import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  Smartphone,
  BookmarkPlus,
  ShoppingBag,
  Gift,
  Tag,
  Sparkles,
  Check,
  X,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { z } from "zod";

export type RewardKind =
  | "budget" // 1. Baixar orçamento completo
  | "send_phone" // 2. Receber projeto no WhatsApp
  | "save_project" // 3. Salvar projeto
  | "shopping_list" // 4. Lista de compras completa
  | "extra_gen" // 5. Geração extra
  | "coupon" // 6. Cupom / ofertas
  | "compare"; // 7. Comparar estilos

type FieldKey = "email" | "phone";

type RewardConfig = {
  icon: React.ComponentType<{ className?: string }>;
  badge: string; // small uppercase chip
  title: string;
  subtitle: string;
  fields: FieldKey[];
  phoneOptional?: boolean;
  cta: string;
  successTitle: string;
  successBody: string;
  lgpdNote: string;
  marketingOptIn: boolean; // show optional marketing checkbox
  showGoogle?: boolean; // show "Continue with Google"
};

const CONFIGS: Record<RewardKind, RewardConfig> = {
  budget: {
    icon: Download,
    badge: "Recompensa",
    title: "Receba seu orçamento completo",
    subtitle: "Informe seus dados para baixar a estimativa do projeto e salvar suas recomendações.",
    fields: ["email", "phone"],
    cta: "Baixar orçamento",
    successTitle: "Orçamento enviado!",
    successBody: "Baixamos o PDF e enviamos uma cópia ao seu e-mail.",
    lgpdNote:
      "Seus dados são tratados conforme a LGPD. Você pode solicitar exclusão a qualquer momento.",
    marketingOptIn: true,
  },
  send_phone: {
    icon: Smartphone,
    badge: "Continue no celular",
    title: "Continue no celular",
    subtitle: "Receba o link deste projeto no seu WhatsApp para acessar depois.",
    fields: ["phone"],
    cta: "Enviar para meu celular",
    successTitle: "Link enviado!",
    successBody: "Confira seu WhatsApp em alguns segundos.",
    lgpdNote:
      "Usaremos seu telefone apenas para enviar este projeto, salvo se você autorizar comunicações futuras.",
    marketingOptIn: true,
  },
  save_project: {
    icon: BookmarkPlus,
    badge: "Salvar projeto",
    title: "Salve este projeto para acessar depois",
    subtitle: "Crie sua conta gratuita em segundos — sem cartão, sem complicação.",
    fields: ["email"],
    cta: "Salvar projeto",
    successTitle: "Projeto salvo!",
    successBody: "Você pode retomar de qualquer aparelho com este e-mail.",
    lgpdNote: "Usaremos seu e-mail para salvar e acessar seus projetos. Nada de spam.",
    marketingOptIn: false,
    showGoogle: true,
  },
  shopping_list: {
    icon: ShoppingBag,
    badge: "Lista completa",
    title: "Desbloqueie a lista completa de produtos",
    subtitle: "Receba todos os itens, faixas de preço e links de onde comprar.",
    fields: ["email", "phone"],
    phoneOptional: true,
    cta: "Desbloquear lista",
    successTitle: "Lista desbloqueada!",
    successBody: "Enviamos a lista completa por e-mail com os links das lojas.",
    lgpdNote: "Seus dados são usados para enviar a lista e melhorar suas recomendações.",
    marketingOptIn: true,
  },
  extra_gen: {
    icon: Gift,
    badge: "Bônus",
    title: "Ganhe uma geração extra",
    subtitle: "Crie sua conta gratuita para salvar projetos e ganhar +1 geração agora.",
    fields: ["email"],
    cta: "Criar conta grátis",
    successTitle: "Conta criada!",
    successBody: "Sua geração extra já está disponível.",
    lgpdNote: "Usaremos seu e-mail para sua conta. Você pode excluí-la quando quiser.",
    marketingOptIn: false,
    showGoogle: true,
  },
  coupon: {
    icon: Tag,
    badge: "Oferta",
    title: "Receba ofertas de produtos parecidos",
    subtitle: "Cupons e itens semelhantes para montar o ambiente — apenas quando fizer sentido.",
    fields: ["email", "phone"],
    phoneOptional: true,
    cta: "Quero receber ofertas",
    successTitle: "Pronto!",
    successBody: "Avisaremos quando aparecer algo perfeito pro seu ambiente.",
    lgpdNote: "Você pode cancelar o recebimento a qualquer momento em um clique.",
    marketingOptIn: true,
  },
  compare: {
    icon: Sparkles,
    badge: "Comparar estilos",
    title: "Receba 3 variações do mesmo ambiente",
    subtitle: "Gere o mesmo espaço em 3 estilos diferentes e compare lado a lado.",
    fields: ["email"],
    cta: "Gerar minhas variações",
    successTitle: "Variações na fila!",
    successBody: "Em alguns segundos suas 3 versões estarão prontas no seu painel.",
    lgpdNote: "Conta gratuita necessária. Sem cartão.",
    marketingOptIn: false,
    showGoogle: true,
  },
};

const emailSchema = z.string().trim().toLowerCase().email("E-mail inválido").max(254);
const phoneSchema = z
  .string()
  .trim()
  .min(10, "Telefone muito curto")
  .max(20, "Telefone muito longo")
  .regex(/^[+()\d\s-]+$/, "Apenas números e símbolos válidos");

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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string; lgpd?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setEmail("");
        setPhone("");
        setLgpd(false);
        setMarketing(false);
        setErrors({});
        setSubmitting(false);
        setDone(false);
      }, 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!cfg || !kind) return null;

  const needEmail = cfg.fields.includes("email");
  const needPhone = cfg.fields.includes("phone");
  const phoneRequired = needPhone && !cfg.phoneOptional;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (needEmail) {
      const r = emailSchema.safeParse(email);
      if (!r.success) next.email = r.error.issues[0].message;
    }
    if (needPhone && (phoneRequired || phone.trim())) {
      const r = phoneSchema.safeParse(phone);
      if (!r.success) next.phone = r.error.issues[0].message;
    }
    if (!lgpd) next.lgpd = "Você precisa aceitar para continuar.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      onSuccess?.(kind, {
        email: needEmail ? email.trim().toLowerCase() : undefined,
        phone: needPhone ? phone.trim() : undefined,
        marketing: cfg.marketingOptIn ? marketing : undefined,
      });
    }, 650);
  };

  const Icon = cfg.icon;

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

        {!done ? (
          <form onSubmit={submit} className="p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="inline-flex h-9 w-9 rounded-2xl bg-accent/15 text-accent items-center justify-center">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-accent">
                {cfg.badge}
              </span>
            </div>
            <h3 className="text-xl sm:text-[22px] font-semibold leading-tight tracking-[-0.01em]">
              {cfg.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{cfg.subtitle}</p>

            {cfg.showGoogle && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 w-full h-11 rounded-xl text-sm"
                  onClick={() => {
                    setLgpd(true);
                    setTimeout(() => {
                      setDone(true);
                      onSuccess?.(kind, {});
                    }, 400);
                  }}
                >
                  <GoogleG className="h-4 w-4 mr-2" /> Continuar com Google
                </Button>
                <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="h-px flex-1 bg-border" /> ou e-mail{" "}
                  <span className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <div className={cfg.showGoogle ? "space-y-2.5" : "mt-5 space-y-2.5"}>
              {needEmail && (
                <div>
                  <Input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-11 rounded-xl ${errors.email ? "border-destructive" : ""}`}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-destructive">{errors.email}</p>
                  )}
                </div>
              )}
              {needPhone && (
                <div>
                  <Input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={`WhatsApp com DDD${cfg.phoneOptional ? " (opcional)" : ""}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`h-11 rounded-xl ${errors.phone ? "border-destructive" : ""}`}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-destructive">{errors.phone}</p>
                  )}
                </div>
              )}
            </div>

            <label className="mt-3 flex gap-2 text-xs text-muted-foreground items-start">
              <Checkbox checked={lgpd} onCheckedChange={(v) => setLgpd(!!v)} className="mt-0.5" />
              <span>
                Li e aceito a{" "}
                <a href="#" className="underline">
                  Política de Privacidade
                </a>{" "}
                e autorizo o uso dos meus dados para receber este benefício.
              </span>
            </label>
            {errors.lgpd && <p className="mt-1 ml-6 text-[11px] text-destructive">{errors.lgpd}</p>}

            {cfg.marketingOptIn && (
              <label className="mt-2 flex gap-2 text-xs text-muted-foreground items-start">
                <Checkbox
                  checked={marketing}
                  onCheckedChange={(v) => setMarketing(!!v)}
                  className="mt-0.5"
                />
                <span>
                  Quero receber sugestões de produtos, ofertas e novidades sobre meu projeto.
                </span>
              </label>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              {submitting ? "Enviando…" : cfg.cta}
            </Button>

            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              {cfg.lgpdNote}
            </p>
          </form>
        ) : (
          <div className="p-7 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-accent/15 text-accent grid place-items-center mb-3">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-serif">{cfg.successTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1">{cfg.successBody}</p>
            {email && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground rounded-full border px-3 py-1">
                <Mail className="h-3 w-3" /> {email}
              </p>
            )}
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="mt-5 rounded-full h-10 px-5 text-sm"
            >
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.227c0-.71-.064-1.39-.182-2.045H12v3.866h5.387a4.605 4.605 0 0 1-1.997 3.023v2.51h3.231c1.89-1.74 2.979-4.305 2.979-7.354Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.963-.895 6.62-2.42l-3.23-2.51c-.896.6-2.04.957-3.39.957-2.605 0-4.81-1.76-5.6-4.125H3.066v2.59A9.997 9.997 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.902A6.014 6.014 0 0 1 6.084 12c0-.66.115-1.302.316-1.902V7.508H3.066A9.997 9.997 0 0 0 2 12c0 1.614.39 3.14 1.066 4.492L6.4 13.902Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.973c1.47 0 2.788.505 3.826 1.498l2.866-2.866C16.957 2.99 14.695 2 12 2A9.997 9.997 0 0 0 3.066 7.508L6.4 10.098C7.19 7.733 9.395 5.973 12 5.973Z"
      />
    </svg>
  );
}
