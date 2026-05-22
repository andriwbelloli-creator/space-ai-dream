import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "@/components/LeadFormModal";
import { ArrowRight, Sparkles, Ruler, Layers, FileText, Check } from "lucide-react";

const TITLE = "Módulo de Inteligência Artificial para Arquitetos — Ideal Space";
const DESCRIPTION =
  "Acelere estudos preliminares com IA: do briefing ao anteprojeto compatível com CAD/BIM e render 5D para o cliente aprovar. Módulo do Arquiteto do Ideal Space.";

export const Route = createFileRoute("/para-arquitetos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://idealspace.com.br/para-arquitetos" }],
  }),
  component: ParaArquitetosPage,
});

/** Pilares de venda do módulo — anteprojetos CAD/BIM e render 5D. */
const PROMISES = [
  {
    icon: Ruler,
    title: "Anteprojetos em minutos",
    desc: "Do briefing ao estudo volumétrico: a IA propõe layout, circulação e partido arquitetônico para você validar antes de abrir o software.",
  },
  {
    icon: Layers,
    title: "Compatível com CAD e BIM",
    desc: "Gere referências e estudos que conversam com o seu fluxo de trabalho em CAD/BIM, prontos para detalhar no projeto executivo.",
  },
  {
    icon: FileText,
    title: "Render 5D para aprovar",
    desc: "Apresente acabamentos, iluminação e estimativa de custo num render 5D — o cliente decide mais rápido e o anteprojeto avança sem retrabalho.",
  },
];

function ParaArquitetosPage() {
  const [leadOpen, setLeadOpen] = useState(false);

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
            Módulo do Arquiteto
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] font-semibold leading-[1.05]">
            Acelerador de{" "}
            <span className="font-serif italic font-normal text-accent">Estudos Preliminares</span>{" "}
            para Arquitetos
          </h1>

          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Transforme uma foto ou planta do terreno em estudos preliminares em segundos. A IA do
            Ideal Space cuida do partido inicial, do estudo de layout e da apresentação 5D para que
            você dedique o seu tempo ao que importa: o projeto executivo.
          </p>

          <div className="mt-9">
            <Button
              onClick={() => setLeadOpen(true)}
              className="h-12 w-full sm:w-auto rounded-full px-8 text-base bg-accent text-accent-foreground hover:opacity-95"
            >
              Solicitar Módulo do Arquiteto
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Promessas — anteprojetos CAD/BIM e render 5D */}
      <section className="py-16 sm:py-20 bg-card/40 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">
              Pensado para o escritório
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl tracking-[-0.02em] font-semibold">
              Do briefing ao anteprojeto,{" "}
              <span className="font-serif italic font-normal">sem retrabalho</span>.
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
                Fale com nosso time de Projetos
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl tracking-[-0.02em] font-semibold">
                Leve a IA para o seu escritório de arquitetura.
              </h2>
              <p className="mt-3 text-background/70 text-sm">
                Conte sobre os seus projetos e montamos uma demonstração do Módulo do Arquiteto sob
                medida para a sua rotina.
              </p>
            </div>
            <ul className="space-y-2 text-sm shrink-0">
              {[
                "Estudo de layout assistido",
                "Exportação amigável a CAD/BIM",
                "Render 5D com estimativa de custo",
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
              Solicitar Módulo do Arquiteto
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <LeadFormModal
        open={leadOpen}
        onOpenChange={setLeadOpen}
        source="para-arquitetos"
        planInterest="pro"
        title="Fale com nosso time de Projetos"
      />
    </div>
  );
}
