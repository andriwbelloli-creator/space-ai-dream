import { createFileRoute } from "@tanstack/react-router";
import { Ruler, Layers, FileText } from "lucide-react";
import {
  ProfessionalLanding,
  type ProfessionalPromise,
} from "@/components/landing/ProfessionalLanding";

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
      leadSource="para-arquitetos"
      leadPlanInterest="pro"
      leadTitle="Fale com nosso time de Projetos"
    />
  );
}
