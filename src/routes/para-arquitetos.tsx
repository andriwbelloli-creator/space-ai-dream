import { createFileRoute } from "@tanstack/react-router";
import { Ruler, Layers, FileText } from "lucide-react";
import {
  ProfessionalLanding,
  type ProfessionalPromise,
} from "@/components/landing/ProfessionalLanding";
import { faqPageJsonLd } from "@/lib/structured-data";

const TITLE = "IA Visual para Estudos de Pré-Projeto | Ideal Space para Arquitetos";
const DESCRIPTION =
  "Transforme fotos, briefings e referências em estudos visuais para apresentar possibilidades ao cliente antes do detalhamento. Apoio ao pré-projeto: validação técnica, medidas e execução continuam com o profissional.";

export const Route = createFileRoute("/para-arquitetos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://idealspace.com.br/para-arquitetos" }],
    scripts: [faqPageJsonLd(FAQ)],
  }),
  component: ParaArquitetosPage,
});

/** Pilares de venda do módulo — estudos visuais e apresentação de conceito. */
const PROMISES: ProfessionalPromise[] = [
  {
    icon: Ruler,
    title: "Estudos de conceito em minutos",
    desc: "Envie uma foto do ambiente e receba estudos visuais de paleta, estilo e mobília para alinhar a direção com o cliente antes de abrir o software.",
  },
  {
    icon: Layers,
    title: "Variações para apresentar",
    desc: "Gere caminhos A/B e apresente possibilidades diferentes para o mesmo espaço. O cliente decide a direção; você aprofunda no projeto executivo.",
  },
  {
    icon: FileText,
    title: "Pré-projeto visual com lista de referências",
    desc: "Exporte um estudo visual com imagem conceitual e lista de referências de produtos. Apoio ao briefing — validação técnica e execução continuam com o profissional.",
  },
];

function ParaArquitetosPage() {
  return (
    <ProfessionalLanding
      heroKicker="Módulo do Arquiteto"
      heroHeading={
        <>
          IA Visual para{" "}
          <span className="font-serif italic font-normal text-accent">Pré-Projeto</span>{" "}
          e Apresentação Profissional
        </>
      }
      heroSubtitle="Transforme fotos, briefings e referências em estudos visuais para apresentar possibilidades ao cliente antes do detalhamento. A tecnologia acelera caminhos; a decisão permanece com o profissional."
      ctaLabel="Solicitar Módulo do Arquiteto"
      promisesKicker="Pensado para o escritório"
      promisesHeading={
        <>
          Do briefing ao estudo visual,{" "}
          <span className="font-serif italic font-normal">antes do detalhamento</span>.
        </>
      }
      promises={PROMISES}
      finalKicker="Fale com nosso time de Projetos"
      finalHeading="Leve o pré-projeto visual para o seu escritório."
      finalDescription="Conte sobre os seus projetos e montamos uma demonstração sob medida para a sua rotina de briefing e apresentação a clientes."
      finalBullets={[
        "Estudos visuais de conceito por ambiente",
        "Variações A/B para alinhar com o cliente",
        "Lista de referências com estimativa de orçamento",
      ]}
      faq={FAQ}
      internalLinks={INTERNAL_LINKS}
      leadSource="para-arquitetos"
      leadPlanInterest="pro"
      leadTitle="Fale com nosso time de Projetos"
    />
  );
}

/** FAQ específica do perfil arquiteto. Foco em pré-projeto visual, ART, executivo. */
const FAQ = [
  {
    q: "O Ideal Space substitui o projeto executivo?",
    a: "Não. A IA gera propostas visuais e estudos preliminares que aceleram a fase de concepção. O projeto executivo, a memória de cálculo, ART/RRT e aprovação na prefeitura continuam sendo do arquiteto responsável.",
  },
  {
    q: "Os estudos visuais substituem o projeto executivo?",
    a: "Não. O Ideal Space gera propostas visuais conceituais para apoiar briefing e apresentação ao cliente. Projeto executivo, memorial descritivo, ART/RRT e aprovações de obra continuam sendo responsabilidade do profissional.",
  },
  {
    q: "Que tipo de imóvel funciona melhor?",
    a: "Residencial unifamiliar, apartamentos, salas comerciais e pequenos varejos. A IA lê o ambiente a partir de uma foto ou planta, então qualquer espaço com referência visual clara funciona.",
  },
  {
    q: "Posso aprovar o anteprojeto com o cliente direto na plataforma?",
    a: "Sim. Cada projeto pode virar uma página pública compartilhável, com o antes e depois e a lista de produtos sugerida. Você manda o link para o cliente decidir antes de seguir para o executivo.",
  },
  {
    q: "Que tipo de entrega eu consigo hoje?",
    a: "Hoje: estudo visual 2D do ambiente com estilo aplicado, slider antes/depois para apresentar ao cliente e lista de referências de produtos com estimativa de orçamento. Render 5D e integração com CAD/BIM são visão futura.",
  },
  {
    q: "Quanto custa pra escritórios?",
    a: "Existe plano individual no /pricing e proposta dedicada para escritórios com volume. Use o formulário pra contar sobre a sua rotina e a gente desenha o pacote.",
  },
];

/** Cross-links pra distribuir PageRank. Mistura outras profissionais + ambientes/estilos. */
const INTERNAL_LINKS = [
  { label: "Designers", to: "/para-designers" },
  { label: "Imobiliárias", to: "/para-imobiliarias" },
  { label: "Orçamento estimado", to: "/orcamento-design-interiores" },
  { label: "Sala", to: "/ambientes/sala" },
  { label: "Home office", to: "/ambientes/home-office" },
  { label: "Estilo Contemporâneo", to: "/estilos/contemporaneo" },
  { label: "Estilo Minimalista", to: "/estilos/minimalista" },
  { label: "Planos", to: "/pricing" },
];
