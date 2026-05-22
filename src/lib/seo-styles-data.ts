/**
 * Dados de SEO e copy comercial das landing pages de estilos de decoração.
 *
 * Fonte única de verdade para as rotas `/estilos/$styleSlug`. Cada estilo tem
 * título e meta description otimizados para busca, um H1 com destaque em
 * markdown (`*trecho*`) e argumentos de venda específicos da estética.
 */

/** Slugs de estilos com landing page dedicada. */
export type StyleSlug =
  | "japandi"
  | "contemporaneo"
  | "minimalista"
  | "natural"
  | "industrial"
  | "luxo";

/** Conteúdo de SEO + copy de conversão de uma landing page de estilo. */
export interface StyleSeoData {
  /** Nome curto do estilo — usado em breadcrumb e navegação. */
  name: string;
  /** Título SEO (tag <title> e og:title). */
  title: string;
  /** Meta description focada em conversão. */
  description: string;
  /** Texto principal da página — usa `*trecho*` para o destaque visual. */
  h1: string;
  /** Parágrafo de venda detalhado e específico do estilo. */
  promise: string;
  /** Texto comercial do botão de conversão. */
  cta: string;
  /** Estilo pré-selecionado no formulário de leads. */
  defaultStyle: string;
}

/** Mapa estático de cada estilo conhecido para o seu conteúdo de SEO. */
export const SEO_STYLES: Record<StyleSlug, StyleSeoData> = {
  japandi: {
    name: "Japandi",
    title: "Decoração Japandi com Inteligência Artificial - Ideal Space",
    description:
      "Veja seu ambiente no estilo Japandi com IA. Envie uma foto e receba uma decoração que une o minimalismo japonês ao aconchego escandinavo em segundos.",
    h1: "Decore no estilo *Japandi* com IA",
    promise:
      "O Japandi une o minimalismo japonês ao aconchego escandinavo: madeira clara, linho, cerâmica artesanal, plantas e uma paleta neutra que transmite calma. Visualizar esse equilíbrio antes de comprar móveis é a parte difícil. Com o Ideal Space, você envia uma foto do ambiente como ele está hoje e a inteligência artificial preserva paredes, janelas e a perspectiva real, devolvendo um espaço Japandi completo — com mobiliário de linhas limpas, iluminação suave e têxteis naturais que combinam de verdade. Compare variações lado a lado e receba uma lista de compras com faixas de preço para tirar o projeto do papel.",
    cta: "Decorar no Estilo Japandi",
    defaultStyle: "japandi",
  },
  contemporaneo: {
    name: "Contemporâneo",
    title: "Decoração Contemporânea com Inteligência Artificial - Ideal Space",
    description:
      "Transforme seu ambiente no estilo contemporâneo com IA. Envie uma foto e veja linhas suaves, texturas e arte em uma decoração atual, em segundos.",
    h1: "Crie um ambiente *Contemporâneo* com IA",
    promise:
      "O estilo contemporâneo aposta em linhas suaves, mistura equilibrada de texturas, arte na parede e uma paleta sóbria com pontos de cor bem colocados — um visual atual, sem modismos passageiros. O desafio é imaginar esse conjunto pronto no seu espaço. O Ideal Space resolve isso: envie uma foto do ambiente atual e a inteligência artificial mantém a estrutura real e propõe mobiliário, iluminação e composição contemporâneos em segundos. Teste diferentes versões, ajuste os detalhes e leve para o seu projeto uma referência clara, acompanhada de uma lista de compras com faixas de preço.",
    cta: "Decorar no Estilo Contemporâneo",
    defaultStyle: "contemporaneo",
  },
  minimalista: {
    name: "Minimalista",
    title: "Decoração Minimalista com Inteligência Artificial - Ideal Space",
    description:
      "Decore seu espaço no estilo minimalista com IA. Envie uma foto e veja um ambiente limpo, funcional e sem excessos em segundos, antes de comprar.",
    h1: "Transforme seu espaço em *Minimalista* com IA",
    promise:
      "O estilo minimalista vive da ideia de que menos é mais: poucos móveis bem escolhidos, paleta clara, linhas retas e espaço para respirar. O risco de errar está no excesso — comprar peças que poluem o ambiente em vez de organizá-lo. Com o Ideal Space, você envia uma foto do seu cômodo e a inteligência artificial preserva a arquitetura real e devolve uma versão minimalista funcional, com cada elemento cumprindo um papel. Compare alternativas, refine a composição e receba uma lista de compras com faixas de preço para investir apenas no essencial.",
    cta: "Decorar no Estilo Minimalista",
    defaultStyle: "minimalista",
  },
  natural: {
    name: "Natural",
    title: "Decoração Natural com Inteligência Artificial - Ideal Space",
    description:
      "Veja seu ambiente no estilo natural com IA. Envie uma foto e receba uma decoração com madeira, fibras, plantas e tons terrosos em segundos.",
    h1: "Decore com o estilo *Natural* usando IA",
    promise:
      "O estilo natural traz o ar livre para dentro de casa: madeira, fibras como rattan e juta, plantas, cerâmica e uma paleta de tons terrosos que aquece o ambiente. Combinar todos esses materiais sem deixar o espaço pesado exige visão de projeto. O Ideal Space ajuda nessa etapa: envie uma foto do ambiente como ele está e a inteligência artificial mantém a perspectiva real e propõe mobiliário, texturas e vegetação em harmonia, em segundos. Compare as variações, ajuste o que quiser e receba uma lista de compras com faixas de preço para executar com segurança.",
    cta: "Decorar no Estilo Natural",
    defaultStyle: "natural",
  },
  industrial: {
    name: "Industrial",
    title: "Decoração Industrial com Inteligência Artificial - Ideal Space",
    description:
      "Dê um ar industrial ao seu ambiente com IA. Envie uma foto e veja tijolo, metal, concreto e couro em uma decoração urbana, em segundos.",
    h1: "Dê um ar *Industrial* ao seu ambiente com IA",
    promise:
      "O estilo industrial nasce dos antigos galpões urbanos: tijolo aparente, metal, concreto, couro e estrutura à mostra, numa paleta escura e cheia de personalidade. Equilibrar esses elementos para o espaço ficar marcante, e não frio, é o ponto sensível. Com o Ideal Space, você envia uma foto do ambiente atual e a inteligência artificial preserva paredes e layout reais, propondo mobiliário, iluminação e acabamentos industriais que conversam entre si. Teste versões mais claras ou mais densas, refine os detalhes e receba uma lista de compras com faixas de preço para colocar o projeto em prática.",
    cta: "Decorar no Estilo Industrial",
    defaultStyle: "industrial",
  },
  luxo: {
    name: "Luxo discreto",
    title: "Decoração de Luxo Discreto com Inteligência Artificial - Ideal Space",
    description:
      "Eleve seu ambiente com o estilo luxo discreto e IA. Envie uma foto e veja materiais nobres e acabamentos sofisticados em segundos.",
    h1: "Eleve seu espaço com *Luxo Discreto* e IA",
    promise:
      "O luxo discreto troca a ostentação pela sofisticação silenciosa: materiais nobres como mármore, latão e veludo, iluminação pontual e uma paleta refinada em que cada acabamento é escolhido com cuidado. Acertar esse refinamento sem exageros é o que separa o elegante do carregado. O Ideal Space mostra o caminho: envie uma foto do seu ambiente e a inteligência artificial mantém a estrutura real e propõe mobiliário, texturas e iluminação de alto padrão, em segundos. Compare as variações, ajuste o resultado e receba uma lista de compras com faixas de preço para investir com clareza.",
    cta: "Decorar no Estilo Luxo Discreto",
    defaultStyle: "luxo",
  },
};
