import { createFileRoute } from "@tanstack/react-router";
import { Building2, Layers, TrendingUp } from "lucide-react";
import {
  ProfessionalLanding,
  type ProfessionalPromise,
} from "@/components/landing/ProfessionalLanding";
import { faqPageJsonLd } from "@/lib/structured-data";

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
    scripts: [faqPageJsonLd(FAQ)],
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
      faq={FAQ}
      internalLinks={INTERNAL_LINKS}
      leadSource="para-imobiliarias"
      leadPlanInterest="pro"
      leadTitle="Solicitar Proposta Comercial"
    />
  );
}

/** FAQ específica de imobiliária. Foco em volume, portais e venda. */
const FAQ = [
  {
    q: "Funciona em imóvel vazio?",
    a: "Sim. O caso de uso principal é exatamente esse: foto de ambiente vazio entra, ambiente decorado sai. A IA preserva a geometria (paredes, janelas, piso) e adiciona mobília e decoração coerentes com o estilo escolhido.",
  },
  {
    q: "Posso processar uma carteira inteira de uma vez?",
    a: "O modo lote está sendo liberado pra equipes da lista de espera. Você sobe um pacote de fotos e recebe os ambientes decorados em fila, sem ter que processar um por um.",
  },
  {
    q: "As imagens saem no formato dos portais (Zap, OLX, ImovelWeb)?",
    a: "As imagens saem em 4:3, formato padrão dos principais portais imobiliários do Brasil. Você baixa direto e sobe no seu anúncio sem precisar cortar.",
  },
  {
    q: "Tem marca d'água da minha imobiliária?",
    a: "Sim, opcional. Você pode subir o seu logo e habilitar a marca d'água em todas as imagens geradas. Quem só quer a imagem limpa também pode desligar.",
  },
  {
    q: "Os móveis nas imagens existem no imóvel?",
    a: "Não. Por LGPD e transparência, recomendamos identificar no anúncio que a decoração é virtual staging, gerada por IA. Os móveis não estão fisicamente no imóvel.",
  },
  {
    q: "Quanto custa pra uma equipe de corretores?",
    a: "Tem plano individual no /pricing e proposta dedicada para equipes com volume. Use o formulário pra contar a quantidade de anúncios e a gente desenha pacote por imóvel ou licença por equipe.",
  },
  {
    q: "Vocês fazem retoque manual depois?",
    a: "Não. A entrega é 100% gerada por IA. Se precisar de retoque artístico ou produção fotográfica tradicional, recomendamos combinar com um fotógrafo especializado.",
  },
];

/** Cross-links pra distribuir PageRank. Foco em cômodos vendíveis e estilos populares. */
const INTERNAL_LINKS = [
  { label: "Arquitetos", to: "/para-arquitetos" },
  { label: "Designers", to: "/para-designers" },
  { label: "Sala", to: "/ambientes/sala" },
  { label: "Quarto", to: "/ambientes/quarto" },
  { label: "Cozinha", to: "/ambientes/cozinha" },
  { label: "Estilo Contemporâneo", to: "/estilos/contemporaneo" },
  { label: "Estilo Natural", to: "/estilos/natural" },
  { label: "Planos", to: "/pricing" },
];
