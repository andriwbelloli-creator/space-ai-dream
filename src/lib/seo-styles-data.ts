/**
 * Dados de SEO e copy comercial das landing pages de estilos de decoração.
 *
 * Fonte única de verdade para as rotas `/estilos/$styleSlug`. Cada estilo tem
 * título e meta description otimizados para busca, um H1 com destaque em
 * markdown (`*trecho*`) e argumentos de venda específicos da estética.
 */

import type { LandingBenefit, LandingFaq, LandingImages } from "./seo-landing-shared";

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
  /** 4 bullets curtos de valor — exibidos abaixo do hero. */
  benefits: LandingBenefit[];
  /** 4 Q&A exibidos na secao de FAQ no fim da landing. */
  faq: LandingFaq[];
  /** Refs a imagens existentes (chaves no LANDING_IMAGES). */
  images: LandingImages;
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
    benefits: [
      "Madeira clara, linho e cerâmica artesanal em proporções equilibradas",
      "Paleta neutra que transmite calma sem deixar o ambiente impessoal",
      "Iluminação suave e pontual, com elementos naturais como referência",
      "Funciona em apartamentos pequenos e em projetos amplos",
    ],
    faq: [
      {
        q: "O que define um ambiente Japandi?",
        a: "É a junção do minimalismo japonês com o aconchego escandinavo. Espaços limpos, madeira clara, têxteis naturais, plantas e uma paleta de cores neutras que valorizam a luz natural.",
      },
      {
        q: "Preciso comprar móveis novos para ter um quarto Japandi?",
        a: "Não necessariamente. O Ideal Space mostra o resultado preservando a estrutura do seu ambiente — você decide quais peças trocar e em que ordem investir.",
      },
      {
        q: "Combina com quartos pequenos?",
        a: "Sim. O Japandi nasceu pensando em otimizar espaço. A IA propõe móveis de linhas limpas e organização eficiente que aproveitam cada metro.",
      },
      {
        q: "Posso testar variações antes de decidir?",
        a: "Sim. Gere quantas versões quiser, compare lado a lado e refine a composição até chegar no equilíbrio que faz sentido para você.",
      },
    ],
    images: {
      before: "empty-living",
      after: "decorated-living-warm",
      gallery: ["style-japandi", "gallery-varanda", "decorated-bedroom"],
    },
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
    benefits: [
      "Linhas suaves e paleta sóbria com pontos de cor bem escolhidos",
      "Mistura equilibrada de texturas, arte e mobiliário no ambiente",
      "Atemporal — sem riscos de virar moda passageira",
      "Funciona em apartamentos recém-entregues ou em reformas amplas",
    ],
    faq: [
      {
        q: "Qual a diferença entre contemporâneo e moderno?",
        a: "Moderno se refere a um movimento estético do século XX. Contemporâneo é o que faz sentido hoje: mistura referências atuais, materiais novos e composições mais soltas, sem a rigidez do modernismo.",
      },
      {
        q: "Esse estilo combina com famílias com crianças?",
        a: "Sim. O contemporâneo prioriza materiais práticos e versáteis. A IA propõe combinações resistentes ao uso diário sem perder em estética.",
      },
      {
        q: "Preciso reformar a casa toda?",
        a: "Não. O Ideal Space mostra o ambiente decorado com a mesma estrutura que você tem hoje. Você decide o que renovar e em que ordem.",
      },
      {
        q: "A lista de compras vem com preços?",
        a: "Sim. Cada produto sugerido vem com faixa de preço estimada para você comparar antes de comprar.",
      },
    ],
    images: {
      before: "empty-living",
      after: "decorated-living",
      gallery: ["style-modern", "gallery-loft", "decorated-dining"],
    },
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
    benefits: [
      "Poucos móveis bem escolhidos, cada um com função clara",
      "Paleta clara e linhas retas que maximizam a sensação de espaço",
      "Ideal para reduzir excessos e organizar a casa",
      "Composição que cresce com o tempo, sem virar moda passageira",
    ],
    faq: [
      {
        q: "Minimalismo significa ter pouca coisa?",
        a: "Significa ter o que você realmente usa. A IA propõe uma composição onde cada item tem propósito — você não fica com um ambiente vazio nem cheio demais.",
      },
      {
        q: "Combina com casa cheia de gente?",
        a: "Sim. O minimalismo prioriza organização. Móveis com armazenamento integrado e composições limpas funcionam bem em famílias.",
      },
      {
        q: "O ambiente minimalista parece frio?",
        a: "Depende da execução. A IA equilibra cores neutras com texturas e plantas para dar acolhimento sem encher o ambiente.",
      },
      {
        q: "Posso comparar com outros estilos?",
        a: "Sim. Gere versões em Japandi, natural ou contemporâneo a partir do mesmo cômodo e veja qual funciona melhor para você.",
      },
    ],
    images: {
      before: "empty-bedroom",
      after: "rank-minimal-bedroom",
      gallery: ["rank-minimal-bedroom", "moodboard-pro", "decorated-living"],
    },
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
    benefits: [
      "Madeira, rattan, juta e cerâmica trazendo o ar livre para dentro",
      "Tons terrosos que aquecem o ambiente sem pesar visualmente",
      "Plantas e vegetação como parte integrada do mobiliário",
      "Combina texturas naturais sem cair em rusticidade exagerada",
    ],
    faq: [
      {
        q: "Esse estilo é o mesmo que rústico?",
        a: "Não. O natural usa materiais orgânicos com acabamento contemporâneo. O rústico é mais cru. A IA propõe a versão refinada do estilo.",
      },
      {
        q: "Combina com apartamento?",
        a: "Sim. Funciona muito bem em espaços urbanos — trazer madeira, plantas e fibras quebra a rigidez de paredes brancas e piso liso.",
      },
      {
        q: "Plantas exigem cuidado constante?",
        a: "A IA pode sugerir plantas de fácil manutenção. Você pode pedir mais ou menos vegetação na composição conforme a sua rotina.",
      },
      {
        q: "Posso usar em ambientes pequenos?",
        a: "Sim. O Ideal Space adapta a proposta ao tamanho real do seu ambiente, preservando a perspectiva.",
      },
    ],
    images: {
      before: "empty-bedroom",
      after: "decorated-bedroom",
      gallery: ["style-natural", "gallery-varanda", "decorated-living-warm"],
    },
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
    benefits: [
      "Tijolo aparente, metal escovado, concreto e couro como elementos principais",
      "Paleta escura com personalidade marcante, sem cair em frieza",
      "Estrutura à mostra valorizada, não escondida pela decoração",
      "Equilíbrio entre crueza urbana e conforto residencial",
    ],
    faq: [
      {
        q: "Industrial fica frio?",
        a: "Pode ficar, se não for equilibrado. A IA combina materiais crus com têxteis, iluminação amarela e plantas para criar atmosfera — não galpão.",
      },
      {
        q: "Preciso quebrar parede para ter tijolo aparente?",
        a: "Não. Você pode usar revestimentos que imitam tijolo ou aplicar o estilo em outras peças e materiais visíveis do ambiente.",
      },
      {
        q: "Combina com pé direito baixo?",
        a: "Sim, mas a IA ajusta a proposta. Em pés direito altos, o estilo brilha; em apartamentos comuns, foca em mobília, cores e acabamentos.",
      },
      {
        q: "É um estilo marcado?",
        a: "Funciona em várias intensidades. A IA propõe variações mais soft ou mais densas conforme você quiser ajustar.",
      },
    ],
    images: {
      before: "empty-kitchen",
      after: "decorated-kitchen",
      gallery: ["style-industrial", "gallery-loft", "decorated-kitchen-island"],
    },
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
    benefits: [
      "Materiais nobres como mármore, latão e veludo aplicados com critério",
      "Iluminação pontual e dramática nos detalhes certos",
      "Paleta refinada — elegância sem cair em ostentação",
      "Mobiliário discreto, com presença pela qualidade dos acabamentos",
    ],
    faq: [
      {
        q: "Luxo discreto é caro?",
        a: "É um estilo, não um orçamento. A IA mostra a composição visual; você decide quanto investir em cada item. A lista de compras vem com faixas de preço para orientação.",
      },
      {
        q: "Combina com casa simples?",
        a: "Sim. O luxo discreto não depende do tamanho da casa — depende da escolha de poucos materiais nobres bem aplicados em pontos certos.",
      },
      {
        q: "Tem como aplicar gradualmente?",
        a: "Sim. Comece pelas peças com maior impacto visual: iluminação, móveis principais, depois detalhes. A lista de compras ajuda a priorizar.",
      },
      {
        q: "Posso ver comparações com outros estilos?",
        a: "Sim. Gere o mesmo ambiente em contemporâneo, natural ou minimalista para comparar antes de fechar uma direção.",
      },
    ],
    images: {
      before: "empty-bathroom-suite",
      after: "decorated-bathroom-suite",
      gallery: ["style-luxo", "decorated-living", "decorated-bathroom"],
    },
  },
};
