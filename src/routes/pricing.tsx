import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PLANS, formatPlanPrice } from "@/lib/plans";
import { useAuth } from "@/lib/auth";
import {
  Check,
  ArrowRight,
  Sparkles,
  Compass,
  Building2,
  Ruler,
  Layers,
  FileText,
  Crown,
  Users,
  Zap,
  BadgeCheck,
  ShieldCheck,
  Briefcase,
  Palette,
  Image as ImageIcon,
} from "lucide-react";

const LeadFormModal = lazy(() =>
  import("@/components/LeadFormModal").then((m) => ({ default: m.LeadFormModal })),
);

/** Fallback leve enquanto o chunk do modal carrega sob demanda. */
const modalFallback = (
  <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
  </div>
);

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Planos e módulos profissionais — Ideal Space" },
      {
        name: "description",
        content:
          "Planos para criar projetos 2D, 5D e planta baixa com IA. Módulos profissionais para designers de interiores, arquitetos e imobiliárias.",
      },
      {
        property: "og:title",
        content: "Planos Ideal Space — IA para projetos 2D, 5D e planta baixa",
      },
      {
        property: "og:description",
        content:
          "Comece grátis. Evolua para Premium ou Pro com módulos dedicados a designers, arquitetos e imobiliárias.",
      },
    ],
    links: [{ rel: "canonical", href: "https://idealspace.com.br/pricing" }],
  }),
  component: PricingPage,
});

type Cycle = "monthly" | "annual";

// Tipos e dados dos planos: src/lib/plans.ts (fonte única — /pricing + home)

const MODULES = [
  {
    icon: Palette,
    audience: "Designer de interiores",
    title: "Studio do Designer",
    desc: "Crie moodboards, variações de estilo e propostas com a sua identidade visual. Apresente cenários ao cliente em minutos.",
    bullets: [
      "Moodboards automáticos por projeto",
      "Variações 2D por estilo e paleta",
      "PDF de proposta com sua marca",
      "Comentários e aprovação do cliente",
    ],
    differentials: [
      "Apresentação de cenários A/B com slider antes/depois",
      "Biblioteca de estilos compartilhada com sua equipe",
    ],
  },
  {
    icon: Ruler,
    audience: "Arquiteto",
    title: "Arquitetônico 5D + Planta baixa",
    desc: "Conecta o projeto 2D à planta baixa, estudo de layout e referências arquitetônicas. Pensado para anteprojetos rápidos.",
    bullets: [
      "Importar planta baixa e gerar variações",
      "Estudo de layout e circulação",
      "Materiais e acabamentos sugeridos",
      "Caderno técnico em PDF",
    ],
    differentials: [
      "Camadas 2D, 5D e planta baixa em um único projeto",
      "Exportação compatível com seu fluxo CAD",
    ],
    soon: true,
  },
  {
    icon: Building2,
    audience: "Imobiliária e corretor",
    title: "Virtual Staging para anúncios",
    desc: "Transforme fotos de imóveis vazios em ambientes decorados que vendem mais rápido. Pacotes por anúncio ou ilimitado.",
    bullets: [
      "Staging em segundos para portais",
      "Estilos pensados para venda e locação",
      "Marca d'água da imobiliária opcional",
      "Pacotes por imóvel ou por equipe",
    ],
    differentials: [
      "Otimizado para fotos de portais (1600×1067, 4:3)",
      "Modo lote para múltiplos cômodos do mesmo imóvel",
    ],
  },
];

const DIFFERENTIALS = [
  {
    icon: Sparkles,
    t: "IA dedicada a interiores",
    d: "Modelo afinado para preservar a estrutura real do ambiente — paredes, janelas, perspectiva.",
  },
  {
    icon: Zap,
    t: "Geração em segundos",
    d: "Pipeline otimizado para foto de celular: comprimimos antes de enviar, geramos em alta qualidade.",
  },
  {
    icon: Layers,
    t: "2D, 5D e planta baixa",
    d: "Um único projeto que evolui do antes/depois até planejamento técnico (5D e planta em breve).",
  },
  {
    icon: FileText,
    t: "PDF profissional",
    d: "Orçamento, moodboard e proposta com a sua marca, prontos para enviar ao cliente.",
  },
  {
    icon: Users,
    t: "Múltiplos clientes",
    d: "Organize projetos por cliente, com permissões e link de compartilhamento.",
  },
  {
    icon: ShieldCheck,
    t: "Privacidade e LGPD",
    d: "Fotos privadas por padrão. Você decide o que aparece em galeria pública.",
  },
];

const FAQ = [
  {
    q: "Posso trocar de plano a qualquer momento?",
    a: "Sim. Você pode subir ou descer de plano quando quiser — cobramos apenas a diferença proporcional.",
  },
  {
    q: "As gerações não usadas acumulam?",
    a: "As gerações são mensais e renovam todo mês. No plano anual, oferecemos um bônus inicial de gerações.",
  },
  {
    q: "O plano Pro tem nota fiscal?",
    a: "Sim. Emitimos NF-e para todos os planos pagos, com CNPJ ou CPF.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim, sem multa. Você mantém o acesso até o fim do ciclo já pago.",
  },
  {
    q: "Como funciona o módulo para imobiliárias?",
    a: "Oferecemos pacotes por anúncio ou licença por equipe. Fale com vendas para um plano sob medida.",
  },
];

/** Microcopy curto de público-alvo por plano — só exibição, não altera plans.ts. */
const PLAN_AUDIENCE: Record<string, string> = {
  free: "Para testar a IA",
  starter: "Para um ambiente",
  premium: "Para a casa toda",
  pro: "Para clientes e equipes",
};

function PricingPage() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const isAnnual = cycle === "annual";
  // Funil de leads: `lead` aberto guarda o contexto do CTA que disparou o modal.
  const [lead, setLead] = useState<{ planInterest?: string; title?: string } | null>(null);
  // Monta o modal lazy só na 1ª abertura e o mantém montado (preserva animações).
  const [leadMounted, setLeadMounted] = useState(false);
  useEffect(() => {
    if (lead !== null) setLeadMounted(true);
  }, [lead]);

  // Usuário autenticado controla a exibição do link "Meus Projetos" no header.
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
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
            <Link to="/pricing" className="text-foreground font-medium">
              Planos
            </Link>
            {user && (
              <Link to="/projetos" className="hover:text-foreground transition">
                Meus Projetos
              </Link>
            )}
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
      <section className="pt-16 sm:pt-24 pb-12 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
            Planos e módulos profissionais
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] font-semibold leading-[1.05]">
            Do antes e depois ao{" "}
            <span className="font-serif italic font-normal">projeto completo</span>.
          </h1>
          <p className="mt-5 text-muted-foreground text-lg max-w-2xl mx-auto">
            Escolha o plano certo para você — pessoa, designer, arquiteto ou imobiliária. Sem
            fidelidade.
          </p>

          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-muted-foreground">
            Os planos pagos estão <span className="font-medium text-foreground">em breve</span>.
            Nesta etapa não há cobrança — crie sua conta para garantir acesso antecipado.
          </div>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center rounded-full border bg-card p-1 text-sm">
            <button
              onClick={() => setCycle("monthly")}
              className={`rounded-full px-4 py-1.5 transition ${cycle === "monthly" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Mensal
            </button>
            <button
              onClick={() => setCycle("annual")}
              className={`rounded-full px-4 py-1.5 transition inline-flex items-center gap-2 ${cycle === "annual" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Anual
              <span className="text-[10px] uppercase tracking-widest rounded-full bg-accent text-accent-foreground px-1.5 py-0.5">
                −25%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {PLANS.map((p) => {
              const price = isAnnual ? p.annual : p.monthly;
              return (
                <div
                  key={p.id}
                  className={`relative rounded-3xl p-7 flex flex-col border bg-card transition ${p.highlight ? "ring-2 ring-accent shadow-2xl bg-accent/[0.04] lg:-translate-y-2" : ""}`}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold uppercase tracking-widest px-3 py-1 shadow-lg">
                      ★ Mais escolhido
                    </span>
                  )}
                  <div className="text-[10px] uppercase tracking-[0.18em] text-accent">
                    {PLAN_AUDIENCE[p.id]}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                    {p.id === "pro" && <Crown className="h-4 w-4 text-accent" />}
                    {p.name}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight">
                      {formatPlanPrice(price)}
                    </span>
                    {price > 0 && <span className="text-sm text-muted-foreground">/mês</span>}
                  </div>
                  {isAnnual && price > 0 && (
                    <div className="mt-1 text-[11px] text-accent">
                      cobrado anualmente · economize 25%
                    </div>
                  )}
                  <p className="mt-3 text-sm text-muted-foreground">{p.tagline}</p>

                  <ul className="mt-6 space-y-2.5 text-sm flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {p.notIncluded?.map((f) => (
                      <li key={f} className="flex gap-2 text-muted-foreground/70">
                        <span className="h-4 w-4 mt-0.5 shrink-0 grid place-items-center">×</span>
                        <span className="line-through">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild={p.id !== "pro"}
                    onClick={
                      p.id === "pro"
                        ? () => setLead({ planInterest: p.id, title: "Fale com vendas" })
                        : undefined
                    }
                    className={`mt-7 h-11 rounded-xl ${
                      p.highlight
                        ? "bg-accent text-accent-foreground hover:opacity-95"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    {p.id === "pro" ? p.cta : <Link to={p.ctaHref}>{p.cta}</Link>}
                  </Button>
                  {p.footnote && (
                    <div className="mt-2 text-[11px] text-muted-foreground text-center">
                      {p.footnote}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reforço de valor — microcopy de conversão dos planos */}
          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, t: "Sem marca d'água nos planos pagos" },
              { icon: Sparkles, t: "Mais gerações para testar estilos" },
              { icon: Zap, t: "Troque de plano quando quiser, sem fidelidade" },
            ].map((v) => (
              <div
                key={v.t}
                className="flex items-center gap-2.5 rounded-2xl border bg-card px-4 py-3 text-sm"
              >
                <v.icon className="h-4 w-4 text-accent shrink-0" />
                <span>{v.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-20 bg-card/40 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
              Por que Ideal Space
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl tracking-[-0.02em] font-semibold">
              Não é só um gerador de imagens.{" "}
              <span className="font-serif italic font-normal">É um estúdio.</span>
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIFFERENTIALS.map((d) => (
              <div key={d.t} className="rounded-3xl border bg-background p-6">
                <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent grid place-items-center">
                  <d.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-medium">{d.t}</div>
                <div className="text-sm text-muted-foreground mt-1">{d.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Modules */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div className="max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
                Módulos profissionais
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl tracking-[-0.02em] font-semibold">
                Pensados para{" "}
                <span className="font-serif italic font-normal">
                  designers, arquitetos e imobiliárias
                </span>
                .
              </h2>
              <p className="mt-3 text-muted-foreground">
                Inclusos no plano Pro. Você pode contratar módulos avulsos para sua equipe.
              </p>
            </div>
            <a
              href="#contato"
              className="text-sm inline-flex items-center gap-1 text-accent hover:underline"
            >
              Falar com vendas <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-5">
            {MODULES.map((m) => (
              <div key={m.title} className="rounded-3xl border bg-card p-7 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-2xl bg-foreground text-background grid place-items-center">
                    <m.icon className="h-5 w-5" />
                  </div>
                  {m.soon && (
                    <span className="text-[10px] uppercase tracking-widest rounded-full bg-muted px-2 py-1">
                      Em breve
                    </span>
                  )}
                </div>
                <div className="mt-5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {m.audience}
                </div>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>

                <ul className="mt-5 space-y-2 text-sm">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-2xl bg-accent/8 border border-accent/30 p-4">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-accent">
                    <BadgeCheck className="h-3.5 w-3.5" /> Diferencial
                  </div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {m.differentials.map((d) => (
                      <li key={d} className="flex gap-2">
                        <Sparkles className="h-3.5 w-3.5 mt-1 text-accent shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-card/40 border-y border-border/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
              Comparativo rápido
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl tracking-[-0.02em] font-semibold">
              O que muda em cada plano.
            </h2>
          </div>
          <div className="mt-10 overflow-x-auto rounded-3xl border bg-background">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-card/60 text-left">
                  <th className="p-4 font-medium">Recurso</th>
                  <th className="p-4 font-medium text-center">Grátis</th>
                  <th className="p-4 font-medium text-center">Starter</th>
                  <th className="p-4 font-medium text-center text-accent">Premium</th>
                  <th className="p-4 font-medium text-center">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Gerações 2D / mês", "3", "15", "50", "200"],
                  ["Sem marca d'água", "—", "✓", "✓", "✓"],
                  ["Resolução de download", "Padrão", "Alta", "Alta", "Máxima"],
                  ["Lista de compras", "3 produtos", "Completa", "Com preços", "Com sua marca"],
                  ["Orçamento em PDF", "—", "—", "✓", "✓"],
                  ["Variações da IA", "—", "—", "✓", "✓"],
                  ["Histórico na nuvem", "—", "10 projetos", "Ilimitado", "Ilimitado"],
                  ["Fila prioritária", "—", "—", "—", "✓"],
                  ["Organização por cliente", "—", "—", "—", "✓"],
                  ["Virtual staging", "—", "—", "—", "✓"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border/60">
                    <td className="p-4">{row[0]}</td>
                    {row.slice(1).map((c, i) => (
                      <td key={i} className={`p-4 text-center ${i === 2 ? "bg-accent/5" : ""}`}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
              Dúvidas frequentes
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl tracking-[-0.02em] font-semibold">
              Antes de assinar.
            </h2>
          </div>
          <div className="mt-10 divide-y divide-border/60 border-y">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="font-medium">{f.q}</span>
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contato" className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-3xl border bg-foreground text-background p-8 sm:p-12 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="max-w-xl">
              <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
                Pronto para começar
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl tracking-[-0.02em] font-semibold">
                Crie sua primeira proposta hoje.
              </h2>
              <p className="mt-3 text-background/70 text-sm">
                Comece grátis em segundos. Para equipes e imobiliárias, montamos um plano sob
                medida.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center rounded-full bg-accent text-accent-foreground h-11 px-5 text-sm font-medium hover:opacity-90"
              >
                Começar grátis <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <button
                type="button"
                onClick={() => setLead({ title: "Fale com vendas" })}
                className="inline-flex items-center rounded-full border border-background/30 h-11 px-5 text-sm hover:bg-background/10"
              >
                <Briefcase className="h-4 w-4 mr-1.5" /> Falar com vendas
              </button>
            </div>
          </div>
        </div>
      </section>

      {leadMounted && (
        <Suspense fallback={modalFallback}>
          <LeadFormModal
            open={lead !== null}
            onOpenChange={(o) => !o && setLead(null)}
            source="pricing"
            planInterest={lead?.planInterest}
            title={lead?.title}
          />
        </Suspense>
      )}
    </div>
  );
}
