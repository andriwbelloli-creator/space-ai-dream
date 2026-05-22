import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Calculator, Check, FileText } from "lucide-react";

const LeadFormModal = lazy(() =>
  import("@/components/LeadFormModal").then((m) => ({ default: m.LeadFormModal })),
);

/** Fallback leve enquanto o chunk do modal carrega sob demanda. */
const modalFallback = (
  <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
  </div>
);

const TITLE = "Simulador de Orçamento de Design de Interiores online — Ideal Space";
const DESCRIPTION =
  "Simule online e de graça o orçamento do seu projeto de design de interiores. Escolha o ambiente e o escopo e veja faixas de custo realistas em segundos.";

export const Route = createFileRoute("/orcamento-design-interiores")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://idealspace.com.br/orcamento-design-interiores" }],
  }),
  component: OrcamentoPage,
});

/** Faixas de custo base por ambiente, em reais (cenário "Decoração"). */
const ROOMS = [
  { id: "sala", label: "Sala de estar", min: 9000, max: 38000 },
  { id: "quarto", label: "Quarto", min: 7000, max: 30000 },
  { id: "cozinha", label: "Cozinha", min: 14000, max: 62000 },
  { id: "home-office", label: "Home office", min: 5000, max: 20000 },
  { id: "banheiro", label: "Banheiro", min: 8000, max: 42000 },
] as const;

/** Escopo do projeto — multiplica a faixa base do ambiente. */
const SCOPES = [
  {
    id: "decoracao",
    label: "Decoração e mobília",
    desc: "Móveis, têxteis e iluminação decorativa, sem obra.",
    factor: 1,
  },
  {
    id: "reforma-leve",
    label: "Reforma leve",
    desc: "Pintura, marcenaria pontual e troca de acabamentos.",
    factor: 1.6,
  },
  {
    id: "reforma-completa",
    label: "Reforma completa",
    desc: "Obra, revestimentos e infraestrutura nova.",
    factor: 2.7,
  },
] as const;

/** Teto da régua visual — mantém a barra comparável entre simulações. */
const SCALE_MAX = 180000;

/** Formata um valor em reais sem casas decimais. */
function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function OrcamentoPage() {
  const [leadOpen, setLeadOpen] = useState(false);
  // Monta o modal lazy só na 1ª abertura e o mantém montado (preserva animações).
  const [leadMounted, setLeadMounted] = useState(false);
  useEffect(() => {
    if (leadOpen) setLeadMounted(true);
  }, [leadOpen]);
  const [roomId, setRoomId] = useState<(typeof ROOMS)[number]["id"]>("sala");
  const [scopeId, setScopeId] = useState<(typeof SCOPES)[number]["id"]>("decoracao");

  // Faixa de custo dinâmica: base do ambiente × fator do escopo.
  const range = useMemo(() => {
    const room = ROOMS.find((r) => r.id === roomId)!;
    const scope = SCOPES.find((s) => s.id === scopeId)!;
    const min = Math.round((room.min * scope.factor) / 100) * 100;
    const max = Math.round((room.max * scope.factor) / 100) * 100;
    return {
      min,
      max,
      leftPct: Math.min(100, (min / SCALE_MAX) * 100),
      widthPct: Math.min(100, ((max - min) / SCALE_MAX) * 100),
    };
  }, [roomId, scopeId]);

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
      <section className="pt-16 sm:pt-24 pb-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Simulador gratuito
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] font-semibold leading-[1.05]">
            Simulador de{" "}
            <span className="font-serif italic font-normal text-accent">
              Orçamento de Interiores
            </span>{" "}
            com IA
          </h1>

          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Antes de pedir orçamento a profissionais, descubra quanto deve custar o seu projeto.
            Escolha o ambiente e o escopo da reforma e veja faixas de custo realistas na hora.
          </p>
        </div>
      </section>

      {/* Simulador — visualizador de faixas de custo dinâmico */}
      <section className="pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-3xl border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-accent">
              <Calculator className="h-3.5 w-3.5" />
              Simule a sua faixa de custo
            </div>

            {/* Seleção de ambiente */}
            <div className="mt-5">
              <span className="text-xs font-medium text-foreground">Qual ambiente?</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ROOMS.map((r) => {
                  const active = r.id === roomId;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRoomId(r.id)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? "border-accent bg-accent/10 ring-1 ring-accent text-foreground"
                          : "text-muted-foreground hover:bg-muted/60"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seleção de escopo */}
            <div className="mt-6">
              <span className="text-xs font-medium text-foreground">Qual o escopo do projeto?</span>
              <div className="mt-2 grid sm:grid-cols-3 gap-2">
                {SCOPES.map((s) => {
                  const active = s.id === scopeId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setScopeId(s.id)}
                      aria-pressed={active}
                      className={`text-left rounded-2xl border px-4 py-3 transition ${
                        active
                          ? "border-accent bg-accent/8 ring-1 ring-accent"
                          : "hover:bg-muted/60"
                      }`}
                    >
                      <div className="text-sm font-medium">{s.label}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resultado dinâmico */}
            <div className="mt-7 rounded-2xl bg-background border p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Faixa estimada de investimento
              </div>
              <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  {formatBRL(range.min)}
                </span>
                <span className="text-muted-foreground">até</span>
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  {formatBRL(range.max)}
                </span>
              </div>

              {/* Barra visual da faixa */}
              <div className="mt-4 h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ marginLeft: `${range.leftPct}%`, width: `${range.widthPct}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>{formatBRL(0)}</span>
                <span>{formatBRL(SCALE_MAX)}+</span>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Valores de referência para o mercado brasileiro, incluindo mobília e mão de obra. O
                orçamento real depende de medidas, acabamentos e da sua região.
              </p>
            </div>

            <Button
              onClick={() => setLeadOpen(true)}
              className="mt-6 h-12 w-full rounded-full px-8 text-base bg-accent text-accent-foreground hover:opacity-95"
            >
              Calcular Orçamento Grátis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-3xl border bg-foreground text-background p-8 sm:p-12 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="max-w-xl">
              <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
                Receber Orçamento e Proposta em PDF
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl tracking-[-0.02em] font-semibold">
                Do simulador ao projeto, com tudo no papel.
              </h2>
              <p className="mt-3 text-background/70 text-sm">
                Deixe os seus dados e a nossa equipe envia um orçamento detalhado e uma proposta em
                PDF, com lista de compras e faixas de preço por item.
              </p>
            </div>
            <ul className="space-y-2 text-sm shrink-0">
              {[
                "Orçamento detalhado por ambiente",
                "Lista de compras com faixas de preço",
                "Proposta em PDF pronta para usar",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-accent shrink-0" />
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
              Calcular Orçamento Grátis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-accent" />
              Sem compromisso e sem cartão de crédito.
            </p>
          </div>
        </div>
      </section>

      {leadMounted && (
        <Suspense fallback={modalFallback}>
          <LeadFormModal
            open={leadOpen}
            onOpenChange={setLeadOpen}
            source="orcamento-design-interiores"
            title="Receber Orçamento e Proposta em PDF"
          />
        </Suspense>
      )}
    </div>
  );
}
