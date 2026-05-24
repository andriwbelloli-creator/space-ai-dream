import { createFileRoute } from "@tanstack/react-router";
import { Palette, Layers, FileText } from "lucide-react";
import {
  ProfessionalLanding,
  type ProfessionalPromise,
} from "@/components/landing/ProfessionalLanding";

const TITLE = "Estúdio de IA para Designers de Interiores | Ideal Space";
const DESCRIPTION =
  "O copiloto de IA para designers de interiores: gere moodboards, variações de estilo e propostas em PDF com a sua marca. Estúdio do Designer do Ideal Space.";

export const Route = createFileRoute("/para-designers")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://idealspace.com.br/para-designers" }],
  }),
  component: ParaDesignersPage,
});

/** Pilares de venda do módulo — moodboards e propostas com a marca do designer. */
const PROMISES: ProfessionalPromise[] = [
  {
    icon: Palette,
    title: "Moodboards automáticos",
    desc: "Envie uma foto do ambiente e a IA monta moodboards de paleta, materiais e mobília coerentes, prontos para o seu olhar autoral refinar.",
  },
  {
    icon: Layers,
    title: "Variações de estilo lado a lado",
    desc: "Gere cenários A/B em minutos e apresente caminhos diferentes para o mesmo cômodo, com o slider antes e depois para o cliente comparar.",
  },
  {
    icon: FileText,
    title: "Propostas com a sua marca",
    desc: "Exporte propostas em PDF com o seu logo, as suas cores e a sua lista de compras. Uma entrega profissional que valoriza o seu trabalho.",
  },
];

function ParaDesignersPage() {
  return (
    <ProfessionalLanding
      heroKicker="Estúdio do Designer"
      heroHeading={
        <>
          O <span className="font-serif italic font-normal text-accent">Copiloto Perfeito</span>{" "}
          para Designers de Interiores
        </>
      }
      heroSubtitle="A IA do Ideal Space não substitui o seu olhar. Ela acelera a parte repetitiva. Crie moodboards, teste estilos e entregue propostas com a sua marca para conquistar o cliente na primeira reunião."
      ctaLabel="Testar Estúdio do Designer"
      promisesKicker="Feito para o seu portfólio"
      promisesHeading={
        <>
          Mais tempo para o conceito,{" "}
          <span className="font-serif italic font-normal">menos para o operacional</span>.
        </>
      }
      promises={PROMISES}
      finalKicker="Acessar Estúdio do Designer"
      finalHeading="Apresente cenários incríveis em minutos."
      finalDescription="Conte sobre os seus projetos e liberamos um acesso ao Estúdio do Designer para você experimentar com clientes reais."
      finalBullets={[
        "Moodboards automáticos por projeto",
        "Variações 2D por estilo e paleta",
        "PDF de proposta com a sua marca",
      ]}
      leadSource="para-designers"
      leadPlanInterest="premium"
      leadTitle="Acessar Estúdio do Designer"
    />
  );
}
