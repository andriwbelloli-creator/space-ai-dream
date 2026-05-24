import { createFileRoute } from "@tanstack/react-router";
import { Building2, Layers, TrendingUp } from "lucide-react";
import {
  ProfessionalLanding,
  type ProfessionalPromise,
} from "@/components/landing/ProfessionalLanding";

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
const PROMISES: ProfessionalPromise[] = [
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
  return (
    <ProfessionalLanding
      heroKicker="Virtual Staging"
      heroHeading={
        <>
          Virtual Staging{" "}
          <span className="font-serif italic font-normal text-accent">Ultra-Rápido</span> para
          Imobiliárias
        </>
      }
      heroSubtitle="Imóvel vazio espanta comprador. Com o Ideal Space, a sua equipe transforma fotos de ambientes vazios em espaços decorados que vendem mais rápido, em lote, na escala da sua carteira de anúncios."
      ctaLabel="Contratar Staging em Lote"
      promisesKicker="Escala para a sua carteira"
      promisesHeading={
        <>
          Anúncios que <span className="font-serif italic font-normal">convertem mais</span>.
        </>
      }
      promises={PROMISES}
      finalKicker="Solicitar proposta comercial"
      finalHeading="Um plano de staging sob medida para a sua imobiliária."
      finalDescription="Conte o volume de anúncios da sua equipe e montamos uma proposta com pacote por imóvel ou licença por equipe."
      finalBullets={[
        "Staging rápido para portais",
        "Modo lote para vários cômodos",
        "Marca d'água da imobiliária opcional",
      ]}
      leadSource="para-imobiliarias"
      leadPlanInterest="pro"
      leadTitle="Solicitar Proposta Comercial"
    />
  );
}
