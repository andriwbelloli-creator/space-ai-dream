/**
 * /vs/planner-5d — comparativo honesto entre Ideal Space e Planner 5D.
 *
 * Objetivo: SEO de comparação (intent alto de compra) e clarear quando
 * cada ferramenta atende. Mantém tom factual, sem inflar nem atacar.
 *
 * Dados de Planner 5D foram coletados em maio/2026 da página pública
 * (planner5d.com e planner5d.com/pricing). Preço USD convertido pela
 * cotação ~R$ 5,10. Revisar trimestralmente.
 *
 * Pricing Ideal Space ainda PLACEHOLDER ("A definir") — atualizar antes
 * de tornar a página pública.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X as XIcon, Camera, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";

const UploadPhotoModal = lazy(() =>
  import("@/components/UploadPhotoModal").then((m) => ({ default: m.UploadPhotoModal })),
);

const modalFallback = (
  <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
  </div>
);

const TITLE = "Ideal Space para profissionais que usam Planner 5D | IA para propostas visuais";
// Curto (<160 chars), alinhado ao posicionamento "complemento profissional".
const DESC =
  "Compare Planner 5D e Ideal Space no fluxo de profissionais de interiores. Use 3D para projetar e IA com foto real para acelerar propostas.";
const URL = "https://idealspace.com.br/vs/planner-5d";

export const Route = createFileRoute("/vs/planner-5d")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      // Página ainda contém placeholder de preço Ideal Space ("Em definição
      // para o Brasil"). Mantém noindex até pricing estar resolvido pra não
      // expor placeholder em search. follow continua passando equity de link.
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Início",
              item: "https://idealspace.com.br/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Ideal Space vs Planner 5D",
              item: URL,
            },
          ],
        }),
      },
    ],
  }),
  component: VsPlanner5D,
});

type Cell = { value: string; positive?: boolean; negative?: boolean };
type Row = { dimension: string; idealSpace: Cell; planner5d: Cell };

// Tabela voltada pra profissional. Sem competição visual (sem checks/X de
// "ganhador"): cada coluna descreve o papel da ferramenta no fluxo, não
// quem é melhor em quê.
const ROWS: ReadonlyArray<Row> = [
  {
    dimension: "Melhor uso",
    idealSpace: { value: "Gerar conceito visual rápido a partir de foto real" },
    planner5d: { value: "Criar projeto técnico e editável em 2D ou 3D" },
  },
  {
    dimension: "Papel no fluxo",
    idealSpace: { value: "Pré-projeto, moodboard, apresentação inicial e apoio à venda" },
    planner5d: { value: "Planejamento, modelagem, layout e detalhamento" },
  },
  {
    dimension: "Entrada",
    idealSpace: { value: "Foto real do ambiente do cliente" },
    planner5d: { value: "Planta, layout, projeto 2D ou 3D, ou foto" },
  },
  {
    dimension: "Resultado",
    idealSpace: { value: "Antes e depois decorado, ideias de estilo e produtos similares" },
    planner5d: { value: "Modelo editável, renderizações, planta e visualização imersiva" },
  },
  {
    dimension: "Perfil",
    idealSpace: {
      value:
        "Arquitetos, designers, decoradores e consultores que querem acelerar propostas",
    },
    planner5d: { value: "Profissionais e usuários avançados que querem controle detalhado" },
  },
  {
    dimension: "Curva de aprendizado",
    idealSpace: { value: "Baixa" },
    planner5d: { value: "Média a alta" },
  },
  {
    dimension: "Nível de controle",
    idealSpace: { value: "Menor controle técnico, maior velocidade visual" },
    planner5d: { value: "Maior controle técnico e precisão" },
  },
  {
    dimension: "Lista de compras",
    idealSpace: { value: "Produtos similares com foco em varejo brasileiro" },
    planner5d: { value: "Catálogo e orçamento próprios da plataforma" },
  },
  {
    dimension: "Quando usar",
    idealSpace: { value: "Antes da reunião, durante briefing ou para validar direção estética" },
    planner5d: { value: "Depois da direção aprovada, para detalhar e apresentar projeto" },
  },
  {
    dimension: "Substitui o outro?",
    idealSpace: { value: "Não. Complementa o fluxo profissional" },
    planner5d: { value: "Não. Complementa ferramentas de inspiração, briefing e venda" },
  },
];

function VsPlanner5D() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadMounted, setUploadMounted] = useState(false);
  useEffect(() => {
    if (uploadOpen) setUploadMounted(true);
  }, [uploadOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header simplificado, consistente com ExpandedLanding. */}
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <IdealSpaceLogo />
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

      {/* HERO — posicionado pra profissionais de interiores. */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Para profissionais de interiores
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] font-semibold leading-[1.05]">
            Ideal Space para profissionais que usam{" "}
            <span className="font-serif italic font-normal text-accent">Planner 5D</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Planner 5D é uma ferramenta robusta para criar plantas, ambientes 2D e 3D e projetos
            editáveis. O Ideal Space não substitui esse fluxo técnico. Ele funciona como uma
            camada rápida de IA para transformar fotos reais em propostas visuais, testar
            estilos, gerar inspiração para o cliente e conectar ideias a produtos compráveis no
            Brasil.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <Button
              onClick={() => setUploadOpen(true)}
              className="h-12 w-full sm:w-auto rounded-full px-8 text-base bg-accent text-accent-foreground hover:opacity-95"
            >
              <Camera className="h-4 w-4 mr-2" /> Testar com uma foto de cliente
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <a
              href="/#ambientes"
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition"
            >
              Ver exemplos de ambientes
            </a>
          </div>
        </div>
      </section>

      {/* TESE — bloco de posicionamento curto, ancora a leitura da tabela. */}
      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6 sm:p-8 text-center">
            <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
              <span className="font-serif italic text-accent">
                Planner 5D ajuda a projetar. Ideal Space ajuda a vender a ideia mais rápido.
              </span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Use o Planner 5D para detalhar o projeto. Use o Ideal Space para acelerar o
              primeiro impacto visual.
            </p>
          </div>
        </div>
      </section>

      {/* TABELA COMPARATIVA */}
      <section className="py-12 sm:py-16 border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Lado a lado</div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold">
              Comparação direta
            </h2>
          </div>

          {/* overflow-x em mobile preserva legibilidade sem quebrar células. */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-2xl border border-border/60 bg-background">
            <table className="w-full min-w-[640px] sm:min-w-0 text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="py-3 px-4 text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium w-1/3">
                    Dimensão
                  </th>
                  <th className="py-3 px-4 text-xs uppercase tracking-[0.18em] text-accent font-medium w-1/3">
                    Ideal Space
                  </th>
                  <th className="py-3 px-4 text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium w-1/3">
                    Planner 5D
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.dimension} className="border-b border-border/40 last:border-b-0">
                    <td className="py-4 px-4 font-medium text-foreground/90 align-top">
                      {row.dimension}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <CellDisplay cell={row.idealSpace} />
                    </td>
                    <td className="py-4 px-4 align-top">
                      <CellDisplay cell={row.planner5d} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Informações consultadas em maio de 2026. Preços, recursos e disponibilidade podem
            variar por país, plataforma, câmbio, promoções e atualizações do fornecedor.
          </p>
        </div>
      </section>

      {/* QUANDO ESCOLHER CADA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Qual usar</div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold">
              Cada um no seu momento do fluxo
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-3xl border border-accent/40 bg-accent/5 p-6">
              <h3 className="text-lg font-semibold mb-3">
                Ideal Space para profissionais que querem
              </h3>
              <ul className="space-y-3 text-sm text-foreground/85">
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  Criar uma primeira proposta visual em minutos
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  Testar estilos diferentes com a foto real do cliente
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  Usar antes e depois para explicar melhor uma ideia
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  Acelerar moodboards e apresentações comerciais
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  Transformar inspiração em lista preliminar de produtos
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  Gerar mais valor antes de entrar no detalhamento técnico
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border/60 bg-card/40 p-6">
              <h3 className="text-lg font-semibold mb-3">
                Planner 5D para profissionais que querem
              </h3>
              <ul className="space-y-3 text-sm text-foreground/85">
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                  Criar plantas e layouts editáveis
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                  Controlar medidas, paredes, circulação e posicionamento
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                  Modelar ambientes em 2D e 3D
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                  Criar renderizações e apresentações mais técnicas
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                  Trabalhar com um fluxo completo de projeto visual
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SUB-CTA fundo escuro, fecha o funil. */}
      <section className="py-16 sm:py-20 border-t border-border/60 bg-foreground text-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold leading-tight">
            Comece pela{" "}
            <span className="font-serif italic font-normal text-accent">
              foto de um cliente real
            </span>
          </h2>
          <p className="mt-4 text-background/70 text-sm sm:text-base leading-relaxed">
            Veja se a IA ajuda no seu fluxo antes de levar pro projeto técnico.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Button
              onClick={() => setUploadOpen(true)}
              className="h-12 rounded-full px-8 text-base bg-accent text-accent-foreground hover:opacity-95"
            >
              <Camera className="h-4 w-4 mr-2" /> Testar com uma foto de cliente
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <a
              href="/#ambientes"
              className="text-sm text-background/70 hover:text-background underline-offset-4 hover:underline transition"
            >
              Ver exemplos de ambientes
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {uploadMounted && (
        <Suspense fallback={modalFallback}>
          <UploadPhotoModal open={uploadOpen} onOpenChange={setUploadOpen} />
        </Suspense>
      )}
    </div>
  );
}

function CellDisplay({ cell }: { cell: Cell }) {
  const Icon = cell.positive ? Check : cell.negative ? XIcon : null;
  const color = cell.positive
    ? "text-accent"
    : cell.negative
      ? "text-muted-foreground/70"
      : "text-foreground/85";
  return (
    <div className={`flex items-start gap-2 ${color}`}>
      {Icon && <Icon className="h-4 w-4 shrink-0 mt-0.5" />}
      <span className="leading-relaxed">{cell.value}</span>
    </div>
  );
}
