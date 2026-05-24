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
      faq={FAQ}
      internalLinks={INTERNAL_LINKS}
      leadSource="para-designers"
      leadPlanInterest="premium"
      leadTitle="Acessar Estúdio do Designer"
    />
  );
}

/** FAQ específica do designer. Foco em autoria, branding e cliente final. */
const FAQ = [
  {
    q: "A IA decide o estilo no meu lugar?",
    a: "Não. Você escolhe o estilo, o cômodo e o orçamento; a IA propõe variações dentro do escopo. O olhar autoral e a curadoria final continuam sendo seus.",
  },
  {
    q: "Posso editar antes de mandar pro cliente?",
    a: "Sim. A versão 2D é o ponto de partida. Você pode gerar variações, salvar projetos, montar moodboards e exportar PDF com a sua identidade visual antes de apresentar.",
  },
  {
    q: "O PDF leva o meu logo e as minhas cores?",
    a: "Sim. O PDF de proposta inclui o seu logo, paleta e descrição. A entrega chega no cliente com a sua marca, não com a marca do Ideal Space.",
  },
  {
    q: "Funciona pra projetos comerciais e residenciais?",
    a: "Funciona em ambos. Residencial é o foco principal, mas pequenos comerciais como cafés, salas de espera e consultórios também rodam bem por usar a mesma lógica de cômodo + estilo.",
  },
  {
    q: "Os produtos sugeridos são reais?",
    a: "São aproximações pelo estilo escolhido, sem garantia de produto idêntico ou disponibilidade. Use como referência de orçamento e ponto de partida pra curadoria do seu fornecedor.",
  },
  {
    q: "Quantas variações eu posso gerar?",
    a: "Depende do plano. O plano free traz 3 gerações grátis por mês; o premium libera volume e variações lado a lado pra apresentação A/B.",
  },
  {
    q: "A IA substitui meu papel de designer?",
    a: "Não. A IA cuida da parte repetitiva (moodboard inicial, paleta, lista de compras de referência) pra você dedicar tempo à conceituação, especificação e relacionamento com o cliente.",
  },
];

/** Cross-links pra distribuir PageRank. Foco em estilos populares e perfis vizinhos. */
const INTERNAL_LINKS = [
  { label: "Arquitetos", to: "/para-arquitetos" },
  { label: "Imobiliárias", to: "/para-imobiliarias" },
  { label: "Estilo Japandi", to: "/estilos/japandi" },
  { label: "Estilo Minimalista", to: "/estilos/minimalista" },
  { label: "Estilo Natural", to: "/estilos/natural" },
  { label: "Sala", to: "/ambientes/sala" },
  { label: "Quarto", to: "/ambientes/quarto" },
  { label: "Planos", to: "/pricing" },
];
