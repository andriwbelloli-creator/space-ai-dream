/**
 * Dados de SEO e copy comercial das landing pages de estilos de decoração.
 *
 * Fonte única de verdade para as rotas `/estilos/$styleSlug`. Cada estilo tem
 * título e meta description otimizados para busca, um H1 com destaque em
 * markdown (`*trecho*`) e argumentos de venda específicos da estética.
 */

import type {
  LandingBenefit,
  LandingFaq,
  LandingImages,
  LandingRelatedLink,
  LandingStep,
} from "./seo-landing-shared";

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
  /** Texto comercial do botão de conversão (CTA primario do hero). */
  cta: string;
  /** Microcopy curto abaixo do CTA primario — sinal de confianca leve. */
  trustText?: string;
  /** Estilo pré-selecionado no formulário de leads. */
  defaultStyle: string;
  /** 3-5 bullets curtos de valor — exibidos abaixo do hero. */
  benefits: LandingBenefit[];
  /** 3 passos do "Como funciona" — opcional, fallback pra default global. */
  steps?: LandingStep[];
  /** Titulo da secao visual (antes/depois ou galeria). */
  visualTitle?: string;
  /** Descricao breve da secao visual. */
  visualDescription?: string;
  /** 4 Q&A exibidos na secao de FAQ no fim da landing. */
  faq: LandingFaq[];
  /** CTA do sub-bloco final — frase diferente do hero, mesma intencao. */
  finalCta?: string;
  /** Links internos relacionados pra distribuir autoridade SEO. */
  relatedLinks?: LandingRelatedLink[];
  /** Refs a imagens existentes (chaves no LANDING_IMAGES). */
  images: LandingImages;
}

/** Mapa estático de cada estilo conhecido para o seu conteúdo de SEO. */
export const SEO_STYLES: Record<StyleSlug, StyleSeoData> = {
  japandi: {
    name: "Japandi",
    title: "Decoração Japandi com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu ambiente decorado no estilo Japandi. Envie uma foto, escolha o estilo e receba uma inspiração visual com lista de compras sugerida.",
    h1: "Veja seu ambiente no estilo *Japandi*",
    promise:
      "Madeira clara, linho, cerâmica artesanal e uma paleta calma. Envie uma foto do ambiente como ele está hoje e veja como ele pode ficar com toques Japandi: móveis e decoração que cabem no seu espaço, com uma lista de compras sugerida.",
    cta: "Testar Japandi no meu ambiente",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultStyle: "japandi",
    benefits: [
      "Combine madeira clara, tons neutros e poucos elementos com equilíbrio",
      "Crie uma estética calma, funcional e acolhedora",
      "Veja como reduzir excessos sem deixar o ambiente frio",
      "Funciona em apartamentos pequenos e em ambientes amplos",
    ],
    steps: [
      {
        t: "Envie uma foto do ambiente",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Aplicamos o estilo Japandi",
        d: "A IA mantém a estrutura real e propõe móveis, paleta e composição com toques Japandi.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
      },
    ],
    visualTitle: "Veja como uma sala simples pode ficar",
    visualDescription:
      "Exemplo de transformação visual no estilo Japandi a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Preciso contratar um arquiteto para usar?",
        a: "Não. O Ideal Space serve como ponto de partida visual. Você pode usar a inspiração sozinho ou levar para um profissional, se quiser aprofundar.",
      },
      {
        q: "A imagem gerada é um projeto técnico?",
        a: "Não. É uma inspiração visual, não um render técnico nem um projeto arquitetônico. Ajuda a decidir antes de comprar móveis e itens.",
      },
      {
        q: "Posso usar uma foto de celular?",
        a: "Sim. Foto comum de celular já funciona, desde que o ambiente esteja visível. Não precisa de equipamento especial.",
      },
      {
        q: "Posso testar outros estilos no mesmo ambiente?",
        a: "Sim. A mesma foto pode receber Japandi, natural, minimalista ou contemporâneo. Compare as versões e decida o que combina mais com você.",
      },
    ],
    finalCta: "Ver meu ambiente em Japandi",
    relatedLinks: [
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Natural", to: "/estilos/natural" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Quarto", to: "/ambientes/quarto" },
    ],
    images: {
      before: "empty-living",
      after: "decorated-living-warm",
      gallery: ["style-japandi", "gallery-varanda", "decorated-bedroom"],
    },
  },
  contemporaneo: {
    name: "Contemporâneo",
    title: "Decoração Contemporânea com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu ambiente decorado no estilo contemporâneo. Envie uma foto e receba uma inspiração visual com sugestões de móveis e lista de compras.",
    h1: "Veja seu ambiente no estilo *Contemporâneo*",
    promise:
      "Linhas atuais, mistura de texturas e equilíbrio entre conforto e sofisticação. Envie uma foto do seu ambiente e veja como ele pode ficar com toques contemporâneos: móveis elegantes, paleta sóbria e composição moderna sem exagero.",
    cta: "Testar Contemporâneo no meu ambiente",
    trustText: "Em poucos passos, com a foto que você já tem.",
    defaultStyle: "contemporaneo",
    benefits: [
      "Equilíbrio entre conforto e sofisticação no mesmo ambiente",
      "Linhas atuais e mistura de texturas em proporções harmônicas",
      "Móveis elegantes com presença sem virar moda passageira",
      "Visual moderno sem exagero, fácil de manter no dia a dia",
    ],
    steps: [
      {
        t: "Envie uma foto do ambiente",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Aplicamos o estilo Contemporâneo",
        d: "A IA mantém a estrutura real e propõe mobiliário, paleta e composição com cara contemporânea.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
      },
    ],
    visualTitle: "Uma sala simples ganhando ar contemporâneo",
    visualDescription:
      "Exemplo de transformação visual no estilo contemporâneo a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Preciso contratar um arquiteto?",
        a: "Não. A inspiração serve como ponto de partida. Você pode usar sozinho ou compartilhar com um profissional, se quiser aprofundar o projeto.",
      },
      {
        q: "É um projeto técnico ou render fiel?",
        a: "Não. É uma inspiração visual gerada por IA, não um render arquitetônico nem aprovação técnica. Use para decidir antes de comprar.",
      },
      {
        q: "Funciona em ambientes pequenos?",
        a: "Sim. A IA adapta a proposta ao tamanho real do ambiente, mantendo a perspectiva e a estrutura visível na foto.",
      },
      {
        q: "Posso testar outros estilos depois?",
        a: "Sim. A mesma foto pode ganhar versões em Japandi, minimalista, luxo discreto. Compare lado a lado.",
      },
    ],
    finalCta: "Ver meu ambiente em Contemporâneo",
    relatedLinks: [
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Quarto", to: "/ambientes/quarto" },
    ],
    images: {
      before: "empty-living",
      after: "decorated-living",
      gallery: ["style-modern", "gallery-loft", "decorated-dining"],
    },
  },
  minimalista: {
    name: "Minimalista",
    title: "Decoração Minimalista com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu ambiente decorado no estilo minimalista. Envie uma foto e receba uma inspiração visual com lista de compras sugerida.",
    h1: "Veja seu ambiente no estilo *Minimalista*",
    promise:
      "Linhas limpas, paleta neutra, poucos elementos e respiro visual. Envie uma foto do seu ambiente e veja como ele pode ficar com toques minimalistas: organização, funcionalidade e sugestões do que vale realmente comprar.",
    cta: "Testar Minimalista no meu ambiente",
    trustText: "Em poucos passos, sem precisar de cadastro pra ver a primeira ideia.",
    defaultStyle: "minimalista",
    benefits: [
      "Menos excesso visual, com cada item tendo um motivo claro",
      "Linhas limpas e paleta neutra que ampliam o espaço",
      "Organização e respiro visual no dia a dia",
      "Composição que envelhece bem, sem virar moda passageira",
    ],
    steps: [
      {
        t: "Envie uma foto do ambiente",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Aplicamos o estilo Minimalista",
        d: "A IA mantém a estrutura real e propõe poucos móveis bem escolhidos, com paleta clara.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos para investir só no essencial.",
      },
    ],
    visualTitle: "Um quarto comum ganhando ar minimalista",
    visualDescription:
      "Exemplo de transformação visual no estilo minimalista a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Minimalismo significa ficar com pouca coisa?",
        a: "Significa manter o que você de fato usa. A IA propõe uma composição onde cada item tem propósito, sem virar ambiente vazio.",
      },
      {
        q: "É um projeto arquitetônico?",
        a: "Não. É uma inspiração visual gerada por IA, não um render técnico nem um projeto pronto para obra.",
      },
      {
        q: "Foto de celular funciona?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "Posso ver o mesmo cômodo em outros estilos?",
        a: "Sim. A mesma foto pode receber Japandi, natural ou contemporâneo. Compare lado a lado antes de decidir.",
      },
    ],
    finalCta: "Ver meu ambiente em Minimalista",
    relatedLinks: [
      { label: "Japandi", to: "/estilos/japandi" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Home office", to: "/ambientes/home-office" },
    ],
    images: {
      before: "empty-bedroom",
      after: "rank-minimal-bedroom",
      gallery: ["rank-minimal-bedroom", "moodboard-pro", "decorated-living"],
    },
  },
  natural: {
    name: "Natural",
    title: "Decoração Natural com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu ambiente decorado no estilo natural. Envie uma foto e receba uma inspiração visual com madeira, fibras, plantas e tons claros.",
    h1: "Veja seu ambiente no estilo *Natural*",
    promise:
      "Madeira, fibras, plantas e tons claros que trazem leveza e bem-estar. Envie uma foto do seu ambiente e veja como ele pode ficar com toques naturais: composição leve, sensação acolhedora e sugestões de produtos.",
    cta: "Testar Natural no meu ambiente",
    trustText: "Em poucos passos, a partir da foto que você já tem.",
    defaultStyle: "natural",
    benefits: [
      "Fibras naturais, madeira e plantas trazendo o ar livre para dentro",
      "Tons claros que aquecem o ambiente sem deixar pesado",
      "Sensação de leveza e bem-estar no dia a dia",
      "Funciona em apartamentos e casas, mesmo sem reforma grande",
    ],
    steps: [
      {
        t: "Envie uma foto do ambiente",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Aplicamos o estilo Natural",
        d: "A IA mantém a estrutura real e propõe madeira, fibras, plantas e paleta clara.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
      },
    ],
    visualTitle: "Um ambiente comum ganhando textura e leveza",
    visualDescription:
      "Exemplo de transformação visual no estilo natural a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Esse estilo é o mesmo que rústico?",
        a: "Não. O natural usa materiais orgânicos com acabamento mais contemporâneo. Rústico é mais cru. A IA propõe a versão mais leve do estilo.",
      },
      {
        q: "Combina com apartamento?",
        a: "Sim. Funciona muito bem em espaços urbanos. Madeira, plantas e fibras quebram a rigidez de paredes brancas e piso liso.",
      },
      {
        q: "Preciso comprar muitas plantas?",
        a: "Não. Você pode pedir mais ou menos vegetação na composição. A inspiração se ajusta ao que você consegue manter no dia a dia.",
      },
      {
        q: "Posso ver outros estilos no mesmo cômodo?",
        a: "Sim. A mesma foto pode receber Japandi, minimalista ou contemporâneo. Use as variações para decidir o que combina mais.",
      },
    ],
    finalCta: "Ver meu ambiente em Natural",
    relatedLinks: [
      { label: "Japandi", to: "/estilos/japandi" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Quarto", to: "/ambientes/quarto" },
    ],
    images: {
      before: "empty-bedroom",
      after: "decorated-bedroom",
      gallery: ["style-natural", "gallery-varanda", "decorated-living-warm"],
    },
  },
  industrial: {
    name: "Industrial",
    title: "Decoração Industrial com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu ambiente decorado no estilo industrial. Envie uma foto e receba uma inspiração visual com metal, madeira escura e tijolo aparente.",
    h1: "Veja seu ambiente no estilo *Industrial*",
    promise:
      "Metal, madeira escura, concreto, tijolo aparente e iluminação marcante. Envie uma foto do ambiente e veja como ele pode ficar com um ar urbano: composição cheia de personalidade, sem virar galpão.",
    cta: "Testar Industrial no meu ambiente",
    trustText: "Em poucos passos, com a foto que você já tem.",
    defaultStyle: "industrial",
    benefits: [
      "Metal, madeira escura, concreto e tijolo aparente em equilíbrio",
      "Iluminação marcante que define o caráter do ambiente",
      "Visual urbano sem cair em frieza ou ar de galpão",
      "Personalidade forte que combina com sala, cozinha e home office",
    ],
    steps: [
      {
        t: "Envie uma foto do ambiente",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Aplicamos o estilo Industrial",
        d: "A IA mantém a estrutura real e propõe metal, madeira escura, paleta urbana e iluminação marcante.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
      },
    ],
    visualTitle: "Uma cozinha simples ganhando ar urbano",
    visualDescription:
      "Exemplo de transformação visual no estilo industrial a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Industrial fica frio?",
        a: "Pode ficar se não for equilibrado. A IA combina materiais crus com têxteis, iluminação amarela e detalhes que dão atmosfera, sem virar galpão.",
      },
      {
        q: "Preciso quebrar parede para ter tijolo aparente?",
        a: "Não. Você pode usar revestimentos que imitam tijolo ou aplicar o estilo em outros pontos do ambiente, sem reforma estrutural.",
      },
      {
        q: "Foto comum de celular funciona?",
        a: "Sim. Foto de celular já serve, desde que o ambiente esteja visível na imagem. Não precisa de equipamento especial.",
      },
      {
        q: "Posso suavizar o estilo?",
        a: "Sim. A IA propõe variações mais soft ou mais densas. Compare as versões e escolha a intensidade que combina com você.",
      },
    ],
    finalCta: "Ver meu ambiente em Industrial",
    relatedLinks: [
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
      { label: "Cozinha", to: "/ambientes/cozinha" },
      { label: "Home office", to: "/ambientes/home-office" },
    ],
    images: {
      before: "empty-kitchen",
      after: "decorated-kitchen",
      gallery: ["style-industrial", "gallery-loft", "decorated-kitchen-island"],
    },
  },
  luxo: {
    name: "Luxo discreto",
    title: "Decoração de Luxo Discreto com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu ambiente decorado no estilo luxo discreto. Envie uma foto e receba uma inspiração visual com materiais nobres e composição elegante.",
    h1: "Veja seu ambiente em *Luxo Discreto*",
    promise:
      "Materiais nobres, iluminação cuidadosa e composição elegante, sem exagero. Envie uma foto do seu ambiente e veja como ele pode ganhar um visual premium, com sugestões de produtos para decidir onde investir.",
    cta: "Testar Luxo Discreto no meu ambiente",
    trustText: "Em poucos passos, sem promessa de obra ou render técnico.",
    defaultStyle: "luxo",
    benefits: [
      "Composição elegante com materiais nobres aplicados com critério",
      "Iluminação pontual que valoriza os detalhes certos",
      "Visual premium sem cair em ostentação",
      "Cuidado para não parecer artificial, com refinamento na medida certa",
    ],
    steps: [
      {
        t: "Envie uma foto do ambiente",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Aplicamos o estilo Luxo Discreto",
        d: "A IA mantém a estrutura real e propõe materiais nobres, iluminação e composição refinada.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos para investir com clareza.",
      },
    ],
    visualTitle: "Um banheiro simples ganhando ar premium",
    visualDescription:
      "Exemplo de transformação visual em luxo discreto a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Preciso de um arquiteto pra usar?",
        a: "Não. Serve como ponto de partida visual. Você pode usar sozinho ou levar a inspiração para um profissional se quiser aprofundar.",
      },
      {
        q: "É um projeto técnico de obra?",
        a: "Não. É uma inspiração visual gerada por IA, não um render arquitetônico nem aprovação técnica. Ajuda a decidir antes de comprar.",
      },
      {
        q: "Luxo discreto exige orçamento alto?",
        a: "É um estilo, não um orçamento fixo. A lista de compras vem com sugestões em diferentes faixas, e você escolhe onde priorizar.",
      },
      {
        q: "Posso aplicar gradualmente?",
        a: "Sim. Comece pelos pontos com maior impacto visual: iluminação, móveis principais, depois acabamentos. A lista ajuda a ordenar.",
      },
    ],
    finalCta: "Ver meu ambiente em Luxo Discreto",
    relatedLinks: [
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Banheiro", to: "/ambientes/banheiro" },
    ],
    images: {
      before: "empty-bathroom-suite",
      after: "decorated-bathroom-suite",
      gallery: ["style-luxo", "decorated-living", "decorated-bathroom"],
    },
  },
};
