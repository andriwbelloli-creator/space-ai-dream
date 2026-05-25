import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2, Check, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import { submitLead, type LeadInterest, type LeadFormPayload } from "@/lib/leads";
import { useTrack } from "@/lib/use-track";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Origem do lead — ex.: "pricing", "home", "shopping-list". */
  source?: string;
  /** Id do plano de interesse quando o lead vem de um CTA de plano. */
  planInterest?: string;
  /** Pré-seleciona o ambiente (ex.: cômodo da variação gerada). */
  defaultRoomType?: string;
  /** Pré-seleciona o estilo decorativo ativo. */
  defaultStyle?: string;
  /** Sobrescreve o título do modal (ex.: "Fale com vendas"). */
  title?: string;
  /** Sobrescreve a descrição do modal. */
  description?: string;
};

type Status = "idle" | "loading" | "success" | "error";

const INTEREST_OPTIONS: { value: LeadInterest; label: string; sub: string }[] = [
  { value: "pessoal", label: "Uso pessoal", sub: "Decorar a minha casa" },
  { value: "designer", label: "Designer", sub: "Design de interiores" },
  { value: "arquiteto", label: "Arquiteto(a)", sub: "Projetos de arquitetura" },
  { value: "imobiliaria", label: "Imobiliária", sub: "Corretor ou imobiliária" },
  { value: "empresa", label: "Empresa", sub: "Equipe ou negócio" },
];

const ROOM_OPTIONS = [
  { value: "sala", label: "Sala" },
  { value: "quarto", label: "Quarto" },
  { value: "cozinha", label: "Cozinha" },
  { value: "home-office", label: "Home office" },
  { value: "banheiro", label: "Banheiro" },
  { value: "outro", label: "Outro" },
];

const BUDGET_OPTIONS = [
  { value: "ate-5k", label: "Até R$ 5 mil" },
  { value: "5k-15k", label: "R$ 5 mil a R$ 15 mil" },
  { value: "15k-30k", label: "R$ 15 mil a R$ 30 mil" },
  { value: "acima-30k", label: "Acima de R$ 30 mil" },
  { value: "nao-sei", label: "Ainda não sei" },
];

const STYLE_OPTIONS = [
  { value: "minimalista", label: "Minimalista" },
  { value: "japandi", label: "Japandi" },
  { value: "moderno", label: "Moderno" },
  { value: "industrial", label: "Industrial" },
  { value: "classico", label: "Clássico" },
  { value: "escandinavo", label: "Escandinavo" },
  { value: "outro", label: "Outro" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SELECT_CLASS =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground " +
  "shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

/** Aplica a máscara brasileira "(99) 99999-9999" durante a digitação. */
function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Mapeia um cômodo recebido por prop para uma opção conhecida do select. */
function normalizeRoom(v?: string): string {
  if (!v) return "";
  const t = v.toLowerCase().trim();
  if (ROOM_OPTIONS.some((o) => o.value === t)) return t;
  if (/quarto|bed|dorm/.test(t)) return "quarto";
  if (/cozinha|kitchen/.test(t)) return "cozinha";
  if (/banheiro|bath|lavabo/.test(t)) return "banheiro";
  if (/office|escrit|trabalho/.test(t)) return "home-office";
  if (/sala|living|jantar|dining|estar/.test(t)) return "sala";
  return "outro";
}

/** Mapeia um estilo recebido por prop para uma opção conhecida do select. */
function normalizeStyle(v?: string): string {
  if (!v) return "";
  const t = v.toLowerCase().trim();
  if (STYLE_OPTIONS.some((o) => o.value === t)) return t;
  if (/minimal/.test(t)) return "minimalista";
  if (/japandi/.test(t)) return "japandi";
  if (/modern|contempor/.test(t)) return "moderno";
  if (/industrial/.test(t)) return "industrial";
  if (/scandi|escandin/.test(t)) return "escandinavo";
  if (/class|cláss/.test(t)) return "classico";
  return "outro";
}

export function LeadFormModal({
  open,
  onOpenChange,
  source,
  planInterest,
  defaultRoomType,
  defaultStyle,
  title,
  description,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<LeadInterest | "">("");
  const [roomType, setRoomType] = useState("");
  const [budget, setBudget] = useState("");
  const [styleField, setStyleField] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    interest?: string;
    consent?: string;
  }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const track = useTrack();

  // Tracking de abertura do formulário — granulariza por source (home,
  // pricing, pro_clinica, etc) e plan_interest pra atribuição.
  useEffect(() => {
    if (open) {
      track("lead_form_opened", { source: source ?? "unknown", plan_interest: planInterest });
    }
  }, [open, source, planInterest, track]);

  // Ao abrir: pré-preenche os campos opcionais a partir das props.
  // Ao fechar: limpa tudo (após a transição de saída do diálogo).
  useEffect(() => {
    if (open) {
      setRoomType(normalizeRoom(defaultRoomType));
      setStyleField(normalizeStyle(defaultStyle));
    } else {
      const t = setTimeout(() => {
        setName("");
        setEmail("");
        setPhone("");
        setInterest("");
        setRoomType("");
        setBudget("");
        setStyleField("");
        setMessage("");
        setConsent(false);
        setErrors({});
        setStatus("idle");
        setSubmitError(null);
      }, 220);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const heading = title?.trim() || "Receba uma proposta personalizada";
  const subheading =
    description?.trim() ||
    "Deixe seus dados e a nossa equipe entra em contato para entender o seu projeto e indicar o melhor caminho.";

  const validate = () => {
    const e: typeof errors = {};
    if (name.trim().length < 2) e.name = "Informe o seu nome.";
    if (!EMAIL_RE.test(email.trim())) e.email = "Informe um e-mail válido.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) e.phone = "Informe um celular válido com DDD.";
    if (!interest) e.interest = "Selecione uma opção.";
    if (!consent) e.consent = "Você precisa aceitar para continuar.";
    return e;
  };

  const loading = status === "loading";

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (loading) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("error");
      setSubmitError(null);
      return;
    }

    setStatus("loading");
    setSubmitError(null);

    const payload: LeadFormPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      interest: interest as LeadInterest,
      consent_lgpd: consent,
      room_type: roomType || undefined,
      plan_interest: planInterest || undefined,
      budget_range: budget || undefined,
      style: styleField || undefined,
      message: message.trim() || undefined,
      source: source || undefined,
    };

    const res = await submitLead(payload);
    if (res.ok) {
      setStatus("success");
      // NUNCA enviar name/email/phone pro tracking — só metadados de funil.
      track("lead_form_submitted", {
        source: source ?? "unknown",
        plan_interest: planInterest,
        interest,
      });
    } else {
      // Não limpamos os dados — o usuário pode corrigir e reenviar.
      setStatus("error");
      setSubmitError(res.error ?? "Não foi possível enviar agora. Tente novamente.");
      track("lead_form_error", {
        source: source ?? "unknown",
        plan_interest: planInterest,
        reason: res.error ? "server_error" : "unknown",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-lg rounded-3xl p-0 overflow-hidden border-0 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Brilho decorativo — glassmorphism suave */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full blur-3xl opacity-60"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.13 55 / 0.22), transparent 60%)",
          }}
        />
        <button
          aria-label="Fechar"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-background/85 backdrop-blur grid place-items-center hover:bg-background transition"
        >
          <X className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="relative p-7 sm:p-9 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-accent/15 text-accent grid place-items-center">
              <Check className="h-7 w-7" />
            </div>
            <DialogTitle className="mt-4 text-xl sm:text-2xl font-semibold tracking-[-0.01em]">
              Recebemos o seu contato!
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              Nossa equipe vai falar com você em breve para entender o seu projeto e indicar o
              melhor caminho. Obrigado pelo interesse no Ideal Space.
            </DialogDescription>
            <Button
              onClick={() => onOpenChange(false)}
              className="mt-6 h-11 rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
            >
              Fechar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex h-9 w-9 rounded-2xl bg-accent/15 text-accent items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-accent">
                Fale com a gente
              </span>
            </div>
            <DialogTitle className="text-xl sm:text-[22px] font-semibold leading-tight tracking-[-0.01em]">
              {heading}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {subheading}
            </DialogDescription>

            {/* Campos obrigatórios */}
            <div className="mt-5 space-y-3">
              <div>
                <label htmlFor="lead-name" className="text-xs font-medium text-foreground">
                  Nome completo*
                </label>
                <Input
                  id="lead-name"
                  autoComplete="name"
                  placeholder="Como podemos te chamar?"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  className={`mt-1 h-11 rounded-xl ${errors.name ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="mt-1 text-[11px] text-destructive">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="lead-email" className="text-xs font-medium text-foreground">
                  E-mail*
                </label>
                <Input
                  id="lead-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  className={`mt-1 h-11 rounded-xl ${errors.email ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-destructive">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="lead-phone" className="text-xs font-medium text-foreground">
                  Celular / WhatsApp*
                </label>
                <Input
                  id="lead-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => {
                    setPhone(maskPhone(e.target.value));
                    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  className={`mt-1 h-11 rounded-xl ${errors.phone ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="mt-1 text-[11px] text-destructive">{errors.phone}</p>
                )}
              </div>

              <div>
                <span className="text-xs font-medium text-foreground">Qual é o seu perfil?*</span>
                <div
                  role="radiogroup"
                  aria-label="Perfil de interesse"
                  className="mt-1.5 grid grid-cols-2 gap-2"
                >
                  {INTEREST_OPTIONS.map((o) => {
                    const active = interest === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setInterest(o.value);
                          if (errors.interest) setErrors((p) => ({ ...p, interest: undefined }));
                        }}
                        className={`text-left rounded-xl border px-3 py-2 transition ${
                          active
                            ? "border-accent bg-accent/8 ring-1 ring-accent"
                            : "hover:bg-muted/60"
                        }`}
                      >
                        <div className="text-sm font-medium">{o.label}</div>
                        <div className="text-[11px] text-muted-foreground">{o.sub}</div>
                      </button>
                    );
                  })}
                </div>
                {errors.interest && (
                  <p className="mt-1 text-[11px] text-destructive">{errors.interest}</p>
                )}
              </div>
            </div>

            {/* Campos opcionais sobre o projeto */}
            <div className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> Sobre o projeto · opcional
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="lead-room" className="text-xs font-medium text-foreground">
                  Ambiente
                </label>
                <select
                  id="lead-room"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className={`mt-1 ${SELECT_CLASS}`}
                >
                  <option value="">Selecione…</option>
                  {ROOM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="lead-budget" className="text-xs font-medium text-foreground">
                  Faixa de orçamento
                </label>
                <select
                  id="lead-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={`mt-1 ${SELECT_CLASS}`}
                >
                  <option value="">Selecione…</option>
                  {BUDGET_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="lead-style" className="text-xs font-medium text-foreground">
                  Estilo preferido
                </label>
                <select
                  id="lead-style"
                  value={styleField}
                  onChange={(e) => setStyleField(e.target.value)}
                  className={`mt-1 ${SELECT_CLASS}`}
                >
                  <option value="">Selecione…</option>
                  {STYLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="lead-message" className="text-xs font-medium text-foreground">
                  Mensagem
                </label>
                <Textarea
                  id="lead-message"
                  placeholder="Conte um pouco sobre o que você procura (opcional)."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="mt-1 rounded-xl resize-none"
                />
              </div>
            </div>

            {/* Consentimento LGPD */}
            <label className="mt-4 flex gap-2 text-xs text-muted-foreground items-start cursor-pointer">
              <Checkbox
                checked={consent}
                onCheckedChange={(v) => {
                  setConsent(!!v);
                  if (errors.consent) setErrors((p) => ({ ...p, consent: undefined }));
                }}
                className="mt-0.5"
                aria-invalid={!!errors.consent}
              />
              <span>
                Li e aceito a{" "}
                <a
                  href="/legal#privacidade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium text-foreground hover:text-accent"
                >
                  Política de Privacidade
                </a>{" "}
                e autorizo o contato sobre o meu projeto.*
              </span>
            </label>
            {errors.consent && (
              <p className="mt-1 ml-6 text-[11px] text-destructive">{errors.consent}</p>
            )}

            {submitError && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-5 w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando…
                </>
              ) : (
                "Quero falar com a equipe"
              )}
            </Button>

            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              Seus dados são tratados conforme a LGPD e usados apenas para este contato. Você pode
              solicitar a exclusão quando quiser.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
