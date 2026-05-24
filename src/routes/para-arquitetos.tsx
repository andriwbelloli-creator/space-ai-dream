import { createFileRoute } from "@tanstack/react-router";
import { Ruler, Layers, FileText } from "lucide-react";
import {
  ProfessionalLanding,
  type ProfessionalPromise,
} from "@/components/landing/ProfessionalLanding";
import { faqPageJsonLd } from "@/lib/structured-data";

const TITLE = "Módulo de Inteligência Artificial para Arquitetos | Ideal Space";
const DESCRIPTION =
  "Módulo do Arquiteto do Ideal Space, em desenvolvimento: anteprojeto compatível com CAD/BIM e render 5D para o cliente aprovar. Cadastre-se na lista de espera para acessar quando estiver disponível.";

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

/** Pilares de venda do módulo — anteprojetos CAD/BIM e render 5D. */
const PROMISES: ProfessionalPromise[] = [
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
    desc: "Apresente acabamentos, iluminação e estimativa de custo num render 5D. O cliente decide mais rápido e o anteprojeto avança sem retrabalho.",
  },
];

function ParaArquitetosPage() {
  return (
    <ProfessionalLanding
      heroKicker="Módulo do Arquiteto"
      heroHeading={
        <>
          Acelerador de{" "}
          <span className="font-serif italic font-normal text-accent">Estudos Preliminares</span>{" "}
          para Arquitetos
        </>
      }
      heroSubtitle="Transforme uma foto ou planta do terreno em estudos preliminares com rapidez. A IA do Ideal Space cuida do partido inicial, do estudo de layout e da apresentação 5D para que você dedique o seu tempo ao que importa: o projeto executivo."
      ctaLabel="Solicitar Módulo do Arquiteto"
      promisesKicker="Pensado para o escritório"
      promisesHeading={
        <>
          Do briefing ao anteprojeto,{" "}
          <span className="font-serif italic font-normal">sem retrabalho</span>.
        </>
      }
      promises={PROMISES}
      finalKicker="Fale com nosso time de Projetos"
      finalHeading="Leve a IA para o seu escritório de arquitetura."
      finalDescription="Conte sobre os seus projetos e montamos uma demonstração do Módulo do Arquiteto sob medida para a sua rotina."
      finalBullets={[
        "Estudo de layout assistido",
        "Exportação amigável a CAD/BIM",
        "Render 5D com estimativa de custo",
      ]}
      faq={FAQ}
      internalLinks={INTERNAL_LINKS}
      leadSource="para-arquitetos"
      leadPlanInterest="pro"
      leadTitle="Fale com nosso time de Projetos"
    />
  );
}

/** FAQ específica do perfil arquiteto. Foco em CAD/BIM, ART, executivo. */
const FAQ = [
  {
    q: "O Ideal Space substitui o projeto executivo?",
    a: "Não. A IA gera propostas visuais e estudos preliminares que aceleram a fase de concepção. O projeto executivo, a memória de cálculo, ART/RRT e aprovação na prefeitura continuam sendo do arquiteto responsável.",
  },
  {
    q: "Os estudos saem compatíveis com AutoCAD ou Revit?",
    a: "O Módulo do Arquiteto está em desenvolvimento como acesso antecipado. A entrega prevista são referências visuais e layouts que você usa de base no seu fluxo CAD/BIM, sem importação direta de arquivos DWG ou RVT por enquanto.",
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
    q: "Quando o render 5D fica disponível?",
    a: "Estamos liberando o render 5D em ondas para arquitetos da lista de espera. Quem se cadastra agora entra na próxima rodada e ajuda a calibrar o que ainda é prioridade.",
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
