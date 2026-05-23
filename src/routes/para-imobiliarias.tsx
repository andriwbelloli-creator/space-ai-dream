import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Building2, Layers, TrendingUp, Check } from "lucide-react";

const LeadFormModal = lazy(() =>
  import("@/components/LeadFormModal").then((m) => ({ default: m.LeadFormModal })),
);

/** Fallback leve enquanto o chunk do modal carrega sob demanda. */
const modalFallback = (
  <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
  </div>
);

const TITLE = "Virtual Staging com IA para Anúncios Imobiliários | Ideal Space";
const DESCRIPTION =
  "Virtual staging ultra-rápido com IA para imobiliárias: decore imóveis vazios em lote e aumente as visualizações dos seus anúncios nos portais.";

export const Route = createFileRoute("/para-imobiliarias")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://idealspace.com.br/para-imobiliarias" }],
  }),
  component: ParaImobiliariasPage,
});

/** Pilares de venda do módulo — staging em lote e mais visualização nos portais. */
const PROMISES = [
  {
    icon: Layers,
    title: "Decoração em lote",
    desc: "Suba as fotos de todos os cômodos de um imóvel, ou de uma carteira inteira, e receba os ambientes decorados em segundos, sem fila.",
  },
  {
    icon: TrendingUp,
    title: "Mais visualizações nos portais",
    desc: "Anúncios com ambientes decorados chamam mais atenção e recebem mais cliques nos portais imobiliários do que fotos de imóvel vazio.",
  },
  {
    icon: Building2,
    title: "Estilos que vendem",
    desc: "Estilos pensados para venda e locação, no formato 4:3 dos portais, com a marca d'água da imobiliária opcional em cada imagem.",
  },
];

function ParaImobiliariasPage() {
  const [leadOpen, setLeadOpen] = useState(false);
  // Monta o modal lazy só na 1ª abertura e o mantém montado (preserva animações).
  const [leadMounted, setLeadMounted] = useState(false);
  useEffect(() => {
    if (leadOpen) setLeadMounted(true);
  }, [leadOpen]);

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
      <section className="pt-16 sm:pt-24 pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Virtual Staging
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] font-semibold leading-[1.05]">
            Virtual Staging{" "}
            <span className="font-serif italic font-normal text-accent">Ultra-Rápido</span> para
            Imobiliárias
          </h1>

          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Imóvel vazio espanta comprador. Com o Ideal Space, a sua equipe transforma fotos de
            ambientes vazios em espaços decorados que vendem mais rápido, em lote, na escala da sua
            carteira de anúncios.
          </p>

          <div className="mt-9">
            <Button
              onClick={() => setLeadOpen(true)}
              className="h-12 w-full sm:w-auto rounded-full px-8 text-base bg-accent text-accent-foreground hover:opacity-95"
            >
              Contratar Staging em Lote
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Promessas — staging em lote e mais visualização nos portais */}
      <section className="py-16 sm:py-20 bg-card/40 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
              Escala para a sua carteira
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl tracking-[-0.02em] font-semibold">
              Anúncios que <span className="font-serif italic font-normal">convertem mais</span>.
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROMISES.map((p) => (
              <div key={p.title} className="rounded-3xl border bg-background p-6">
                <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent grid place-items-center">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-medium">{p.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-3xl border bg-foreground text-background p-8 sm:p-12 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="max-w-xl">
              <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
                Solicitar proposta comercial
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl tracking-[-0.02em] font-semibold">
                Um plano de staging sob medida para a sua imobiliária.
              </h2>
              <p className="mt-3 text-background/70 text-sm">
                Conte o volume de anúncios da sua equipe e montamos uma proposta com pacote por
                imóvel ou licença por equipe.
              </p>
            </div>
            <ul className="space-y-2 text-sm shrink-0">
              {[
                "Staging rápido para portais",
                "Modo lote para vários cômodos",
                "Marca d'água da imobiliária opcional",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
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
              Contratar Staging em Lote
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {leadMounted && (
        <Suspense fallback={modalFallback}>
          <LeadFormModal
            open={leadOpen}
            onOpenChange={setLeadOpen}
            source="para-imobiliarias"
            planInterest="pro"
            title="Solicitar Proposta Comercial"
          />
        </Suspense>
      )}
    </div>
  );
}
