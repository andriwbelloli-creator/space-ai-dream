import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2, Check, AlertCircle, Sparkles, ShieldCheck, MapPin } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitLead, type LeadInterest, type LeadFormPayload } from "@/lib/leads";
import { useTrack } from "@/lib/use-track";
import { useCepLookup, maskCep } from "@/lib/useCepLookup";
import { notifyExecutarProjetoLead } from "@/lib/notifyLead.server";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Origem do lead — ex.: "pricing", "home", "shopping-list", "executar-projeto". */
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
  /** Usuário logado (variante executar-projeto vincula o lead ao user). */
  userId?: string;
  /** Projeto que originou o lead (variante executar-projeto). */
  projectId?: string;
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

/** Faixas de investimento — variante executar-projeto. */
const INVESTMENT_OPTIONS: { value: string; label: string; sub: string }[] = [
  { value: "ate_3k", label: "Até R$ 3 mil", sub: "Refresh com decoração" },
  { value: "3k_10k", label: "R$ 3-10 mil", sub: "Mobília nova" },
  { value: "10k_30k", label: "R$ 10-30 mil", sub: "Projeto completo de um cômodo" },
  { value: "30k_100k", label: "R$ 30-100 mil", sub: "Reforma parcial" },
  { value: "acima_100k", label: "Acima de R$ 100 mil", sub: "Reforma estrutural" },
];

/** Quando começar — variante executar-projeto. */
const TIMING_OPTIONS: { value: string; label: string }[] = [
  { value: "agora", label: "Agora" },
  { value: "proximo_mes", label: "Próximo mês" },
  { value: "2_3_meses", label: "Em 2-3 meses" },
  { value: "explorando", label: "Só explorando" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SELECT_CLASS =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground " +
  "shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

/**
 * Texto contextualizado por origem do lead. Cada source recebe heading,
 * subheading, CTA e mensagem de sucesso próprios, calibrados pra promessa
 * que o usuário viu na tela que abriu o modal. Não usa em-dash em nada
 * visível pro usuário (regra interna de copy).
 */
type SourceCopy = {
  heading: string;
  subheading: string;
  ctaLabel: string;
  successHeading: string;
  successBody: string;
};

const DEFAULT_COPY: SourceCopy = {
  heading: "Receba ideias e proposta no seu e-mail",
  subheading:
    "Deixe seus dados e a nossa equipe envia inspirações decorativas pro seu ambiente, com lista de compras e faixas de preço.",
  ctaLabel: "Quero receber",
  successHeading: "Tudo certo!",
  successBody:
    "Você vai receber as ideias no e-mail em até 1 dia útil. Se preencheu o celular, também enviamos pelo WhatsApp.",
};

function getSourceCopy(source: string | undefined): SourceCopy {
  const key = (source ?? "").toLowerCase();

  // Lista de compras (vem da galeria de variações do UploadPhotoModal)
  if (key === "shopping-list" || key === "shopping_list") {
    return {
      heading: "Receba a lista completa por WhatsApp",
      subheading:
        "A nossa equipe envia o orçamento detalhado e a lista de compras completa do ambiente direto no seu WhatsApp.",
      ctaLabel: "Receber lista por WhatsApp",
      successHeading: "Lista a caminho!",
      successBody:
        "Em até 1 dia útil você recebe a lista detalhada por WhatsApp e e-mail, com faixas de preço e links das lojas parceiras.",
    };
  }

  // Upsell de download HD pra usuário Free
  if (key === "hd-download-upsell" || key === "hd_download_upsell") {
    return {
      heading: "Desbloquear download em HD",
      subheading:
        "Faça upgrade pra um plano pago e salve suas imagens em alta resolução, com lista de compras e suporte da nossa equipe.",
      ctaLabel: "Quero fazer upgrade",
      successHeading: "Recebemos seu pedido!",
      successBody:
        "Vamos enviar a opção de plano que melhor se encaixa no que você precisa. Resposta em até 1 dia útil.",
    };
  }

  // Simulador de orçamento (rota /orcamento-design-interiores)
  if (key === "orcamento-design-interiores" || key === "orcamento" || key.startsWith("orcamento")) {
    return {
      heading: "Receber orçamento e proposta em PDF",
      subheading:
        "A nossa equipe envia um orçamento detalhado e uma proposta em PDF, com lista de compras e faixas de preço por item.",
      ctaLabel: "Receber proposta em PDF",
      successHeading: "Pedido recebido!",
      successBody:
        "Em até 2 dias úteis você recebe a proposta em PDF no e-mail informado, com tudo separado por ambiente.",
    };
  }

  // Página de planos
  if (key === "pricing") {
    return {
      heading: "Falar com a equipe de vendas",
      subheading:
        "Conte um pouco sobre o seu uso e indicamos o plano ideal, com condições especiais pra times e empresas.",
      ctaLabel: "Quero falar com vendas",
      successHeading: "Recebemos seu contato!",
      successBody:
        "A nossa equipe comercial entra em contato em até 1 dia útil pra entender melhor o seu uso.",
    };
  }

  // Landings de profissionais (pro_clinica, pro_ecommerce, pro_general)
  if (key.startsWith("pro_") || key.startsWith("pro-")) {
    return {
      heading: "Conhecer a solução pro seu negócio",
      subheading:
        "A nossa equipe envia exemplos do seu segmento e indica o melhor caminho pra usar o Ideal Space na sua operação.",
      ctaLabel: "Quero conhecer",
      successHeading: "Recebemos seu contato!",
      successBody:
        "Em até 1 dia útil você recebe exemplos do seu segmento no e-mail, com opções de plano pra times.",
    };
  }

  // Landings combinatórias de SEO (estilos-X-Y, ambientes-Y, estilos-X)
  if (key.startsWith("estilos-") || key.startsWith("ambientes-")) {
    return {
      heading: "Receber ideias por e-mail",
      subheading:
        "A nossa equipe envia inspirações decorativas calibradas pro estilo e ambiente que você escolheu, com lista de compras.",
      ctaLabel: "Quero receber ideias",
      successHeading: "Ideias a caminho!",
      successBody:
        "Em até 1 dia útil você recebe as inspirações no e-mail, com lista de compras e faixas de preço.",
    };
  }

  // Variante executar-projeto: pós-geração, conecta com arquiteto.
  if (key === "executar-projeto") {
    return {
      heading: "Quero executar este projeto",
      subheading:
        "Um arquiteto vai falar com você no WhatsApp em até 4h úteis pra tirar o projeto do papel.",
      ctaLabel: "Falar com um arquiteto",
      successHeading: "Pedido recebido!",
      successBody:
        "Um arquiteto vai te chamar no WhatsApp em até 4h úteis pra entender o projeto e os próximos passos.",
    };
  }

  return DEFAULT_COPY;
}

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
  userId,
  projectId,
}: Props) {
  // Flag de variante — gateia campos novos sem afetar nenhum callsite legado.
  const isExecutarProjeto = source === "executar-projeto";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<LeadInterest | "">("");
  const [roomType, setRoomType] = useState("");
  const [budget, setBudget] = useState("");
  const [styleField, setStyleField] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  // Campos novos — variante executar-projeto.
  const [cep, setCep] = useState("");
  const [investmentRange, setInvestmentRange] = useState("");
  const [startTiming, setStartTiming] = useState("");
  const cepLookup = useCepLookup(cep);
  // Server fn wrapper — só dispara na variante executar-projeto.
  const notifyLead = useServerFn(notifyExecutarProjetoLead);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    interest?: string;
    consent?: string;
    cep?: string;
    investmentRange?: string;
    startTiming?: string;
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
        setCep("");
        setInvestmentRange("");
        setStartTiming("");
        setErrors({});
        setStatus("idle");
        setSubmitError(null);
      }, 220);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const sourceCopy = getSourceCopy(source);
  const heading = title?.trim() || sourceCopy.heading;
  const subheading = description?.trim() || sourceCopy.subheading;
  const ctaLabel = sourceCopy.ctaLabel;
  const successHeading = sourceCopy.successHeading;
  const successBody = sourceCopy.successBody;

  /**
   * Valida um campo específico (usado no onBlur). Retorna a string de erro
   * ou undefined. Mantém o critério usado também no submit pra evitar
   * surpresa de "passou no blur mas falhou no submit".
   */
  const validateField = (
    field: "name" | "email" | "phone" | "interest" | "consent" | "cep" | "investmentRange" | "startTiming",
  ): string | undefined => {
    switch (field) {
      case "name":
        if (name.trim().length < 2)
          return "Digite o seu nome completo pra personalizarmos o contato.";
        return undefined;
      case "email":
        // Na variante executar-projeto o e-mail é opcional: só valida formato
        // se o usuário preencheu. Nas demais variantes o e-mail é obrigatório.
        if (isExecutarProjeto && email.trim().length === 0) return undefined;
        if (!EMAIL_RE.test(email.trim()))
          return "Confira se o e-mail tem @ e domínio (ex.: nome@dominio.com).";
        return undefined;
      case "phone": {
        const digits = phone.replace(/\D/g, "");
        if (digits.length < 10 || digits.length > 11)
          return "Use o formato (DDD) 9XXXX-XXXX, com DDD de 2 dígitos.";
        return undefined;
      }
      case "interest":
        // Variante executar-projeto não pede perfil — usa default "pessoal"
        // automático no submit pra não pedir extra ao usuário.
        if (isExecutarProjeto) return undefined;
        if (!interest) return "Escolha o perfil que melhor descreve o seu uso.";
        return undefined;
      case "consent":
        if (!consent) return "Confirme o aceite pra podermos entrar em contato.";
        return undefined;
      case "cep": {
        const digits = cep.replace(/\D/g, "");
        if (digits.length !== 8) return "Informe o CEP com 8 dígitos (formato XXXXX-XXX).";
        return undefined;
      }
      case "investmentRange":
        if (!investmentRange) return "Escolha uma faixa de investimento.";
        return undefined;
      case "startTiming":
        if (!startTiming) return "Diga quando você quer começar.";
        return undefined;
    }
  };

  const validate = () => {
    const e: typeof errors = {};
    const baseFields: Array<"name" | "email" | "phone" | "interest" | "consent"> = [
      "name",
      "email",
      "phone",
      "interest",
      "consent",
    ];
    const executarFields: Array<"cep" | "investmentRange" | "startTiming"> = [
      "cep",
      "investmentRange",
      "startTiming",
    ];
    for (const f of baseFields) {
      const msg = validateField(f);
      if (msg) e[f] = msg;
    }
    if (isExecutarProjeto) {
      for (const f of executarFields) {
        const msg = validateField(f);
        if (msg) e[f] = msg;
      }
    }
    return e;
  };

  /** Handler de blur que só seta erro se o campo já tem conteúdo (evita
   *  irritar usuário que clicou e saiu sem digitar). Consent não tem blur. */
  const handleBlur = (field: "name" | "email" | "phone" | "cep") => () => {
    const fieldValue =
      field === "name" ? name : field === "email" ? email : field === "phone" ? phone : cep;
    if (fieldValue.trim().length === 0) return;
    const msg = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: msg }));
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

    // Na variante executar-projeto o interest não é perguntado: usamos
    // default "pessoal" pra satisfazer schema. Flag de tracking distingue
    // leads com perfil escolhido manualmente vs default automático.
    const effectiveInterest: LeadInterest = isExecutarProjeto
      ? "pessoal"
      : (interest as LeadInterest);

    const payload: LeadFormPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      interest: effectiveInterest,
      consent_lgpd: consent,
      room_type: roomType || undefined,
      plan_interest: planInterest || undefined,
      budget_range: budget || undefined,
      style: styleField || undefined,
      message: message.trim() || undefined,
      source: source || undefined,
      cep: isExecutarProjeto ? cep.trim() || undefined : undefined,
      investment_range: isExecutarProjeto ? investmentRange || undefined : undefined,
      start_timing: isExecutarProjeto ? startTiming || undefined : undefined,
      user_id: userId || undefined,
      project_id: projectId || undefined,
    };

    const res = await submitLead(payload);
    if (res.ok) {
      setStatus("success");
      // NUNCA enviar name/email/phone pro tracking — só metadados de funil.
      track("lead_form_submitted", {
        source: source ?? "unknown",
        plan_interest: planInterest,
        interest: effectiveInterest,
        // Flag distingue leads de executar-projeto (interest auto) dos demais
        // (interest escolhido pelo user). Vital pra atribuição comercial.
        interest_source: isExecutarProjeto ? "auto_from_executar_projeto" : "user_selected",
      });

      // Notificação WhatsApp via CallMeBot — fire-and-forget. Só dispara
      // na variante executar-projeto pra Andriw acionar arquiteto dentro do
      // SLA de 4h. Falha de notificação NUNCA quebra a UX (lead já salvo).
      if (isExecutarProjeto) {
        void notifyLead({
          data: {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
            cep: cep.trim() || undefined,
            city:
              cepLookup.status === "success"
                ? `${cepLookup.data.localidade}/${cepLookup.data.uf}`
                : undefined,
            investment_range: investmentRange || undefined,
            start_timing: startTiming || undefined,
          },
        }).catch(() => {
          // Best-effort: notify é informativo, lead já está persistido.
        });
      }
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
              {(() => {
                const firstName = name.trim().split(/\s+/)[0];
                return firstName ? `${successHeading} ${firstName}` : successHeading;
              })()}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              {successBody}
            </DialogDescription>

            {/* Reforço visual de canais e prazo, com ícone discreto. Sem
                em-dash (regra de copy). */}
            <div className="mt-5 mx-auto max-w-xs rounded-xl border border-border/60 bg-card px-4 py-3 text-left text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                <span>
                  Vamos enviar pro e-mail <span className="text-foreground">{email}</span>.
                </span>
              </div>
              {phone && (
                <div className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                  <span>
                    Confirme o número <span className="text-foreground">{phone}</span> no WhatsApp.
                  </span>
                </div>
              )}
            </div>

            <Button
              onClick={() => onOpenChange(false)}
              className="mt-6 h-11 rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
            >
              Continuar navegando
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
                  onBlur={handleBlur("name")}
                  className={`mt-1 h-11 rounded-xl ${errors.name ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "lead-name-error" : undefined}
                />
                {errors.name && (
                  <p id="lead-name-error" className="mt-1 text-[11px] text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lead-email" className="text-xs font-medium text-foreground">
                  {isExecutarProjeto ? "E-mail (opcional)" : "E-mail*"}
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
                  onBlur={handleBlur("email")}
                  className={`mt-1 h-11 rounded-xl ${errors.email ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "lead-email-error" : undefined}
                />
                {errors.email && (
                  <p id="lead-email-error" className="mt-1 text-[11px] text-destructive">
                    {errors.email}
                  </p>
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
                  onBlur={handleBlur("phone")}
                  className={`mt-1 h-11 rounded-xl ${errors.phone ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "lead-phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="lead-phone-error" className="mt-1 text-[11px] text-destructive">
                    {errors.phone}
                  </p>
                )}
              </div>

              {!isExecutarProjeto && (
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
              )}
            </div>

            {/* Campos opcionais sobre o projeto. Escondidos na variante
                executar-projeto pra manter o form em ~5 campos (~30s). */}
            {!isExecutarProjeto && (
              <>
            <div className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> Opcional, ajuda na proposta
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
              </>
            )}

            {/* Bloco novo — variante executar-projeto. CEP com lookup ViaCEP,
                faixa de investimento e quando começar (5 + 4 opções). */}
            {isExecutarProjeto && (
              <div className="mt-5 space-y-3">
                <div>
                  <label htmlFor="lead-cep" className="text-xs font-medium text-foreground">
                    CEP*
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="lead-cep"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => {
                        setCep(maskCep(e.target.value));
                        if (errors.cep) setErrors((p) => ({ ...p, cep: undefined }));
                      }}
                      onBlur={handleBlur("cep")}
                      className={`h-11 rounded-xl pr-9 ${errors.cep ? "border-destructive" : ""}`}
                      aria-invalid={!!errors.cep}
                      aria-describedby={errors.cep ? "lead-cep-error" : undefined}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      {cepLookup.status === "loading" && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {cepLookup.status === "success" && (
                        <Check className="h-4 w-4 text-accent" />
                      )}
                      {cepLookup.status === "error" && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      {cepLookup.status === "idle" && <MapPin className="h-4 w-4" />}
                    </div>
                  </div>
                  {errors.cep && (
                    <p id="lead-cep-error" className="mt-1 text-[11px] text-destructive">
                      {errors.cep}
                    </p>
                  )}
                  {cepLookup.status === "success" && !errors.cep && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {cepLookup.data.logradouro && `${cepLookup.data.logradouro}, `}
                      {cepLookup.data.bairro && `${cepLookup.data.bairro}, `}
                      {cepLookup.data.localidade}/{cepLookup.data.uf}
                    </p>
                  )}
                  {cepLookup.status === "error" && !errors.cep && (
                    <p className="mt-1 text-[11px] text-destructive">{cepLookup.error}</p>
                  )}
                </div>

                <div>
                  <span className="text-xs font-medium text-foreground">
                    Faixa de investimento*
                  </span>
                  <div
                    role="radiogroup"
                    aria-label="Faixa de investimento"
                    className="mt-1.5 space-y-2"
                  >
                    {INVESTMENT_OPTIONS.map((o) => {
                      const active = investmentRange === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setInvestmentRange(o.value);
                            if (errors.investmentRange)
                              setErrors((p) => ({ ...p, investmentRange: undefined }));
                          }}
                          className={`w-full text-left rounded-xl border px-3 py-2 transition ${
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
                  {errors.investmentRange && (
                    <p className="mt-1 text-[11px] text-destructive">{errors.investmentRange}</p>
                  )}
                </div>

                <div>
                  <span className="text-xs font-medium text-foreground">
                    Quando quer começar?*
                  </span>
                  <div
                    role="radiogroup"
                    aria-label="Quando quer começar"
                    className="mt-1.5 grid grid-cols-2 gap-2"
                  >
                    {TIMING_OPTIONS.map((o) => {
                      const active = startTiming === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setStartTiming(o.value);
                            if (errors.startTiming)
                              setErrors((p) => ({ ...p, startTiming: undefined }));
                          }}
                          className={`text-left rounded-xl border px-3 py-2 transition ${
                            active
                              ? "border-accent bg-accent/8 ring-1 ring-accent"
                              : "hover:bg-muted/60"
                          }`}
                        >
                          <div className="text-sm font-medium">{o.label}</div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.startTiming && (
                    <p className="mt-1 text-[11px] text-destructive">{errors.startTiming}</p>
                  )}
                </div>
              </div>
            )}

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
                ctaLabel
              )}
            </Button>

            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              Seus dados ficam protegidos pela LGPD e são usados só pra este contato. Você pode
              pedir a exclusão quando quiser.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
