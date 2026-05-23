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
  /** 4-6 bullets de "Por que escolher" exibidos depois da galeria. Opcional. */
  whyChoose?: string[];
}

/** Mapa estático de cada estilo conhecido para o seu conteúdo de SEO. */
export const SEO_STYLES: Record<StyleSlug, StyleSeoData> = {
  japandi: {
    name: "Japandi",
    title: "Decoração Japandi com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu ambiente decorado no estilo Japandi. Envie uma foto, escolha o estilo e receba uma inspiração visual com lista de compras sugerida e orçamento estimado.",
    h1: "Veja seu ambiente no estilo *Japandi*",
    promise:
      "Madeira clara, linho, cerâmica artesanal e uma paleta calma. Envie uma foto do ambiente como ele está hoje e veja como ele pode ficar com toques Japandi: móveis e decoração que cabem no seu espaço real, sem virar showroom frio nem caricatura do estilo. Recebe uma lista de compras sugerida para começar.",
    cta: "Testar Japandi no meu ambiente",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultStyle: "japandi",
    benefits: [
      "Combine madeira clara, tons neutros e poucos elementos com equilíbrio",
      "Crie uma estética calma, funcional e acolhedora ao mesmo tempo",
      "Veja como reduzir excessos visuais sem deixar o ambiente frio",
      "Funciona em apartamentos pequenos e em ambientes amplos",
      "Texturas naturais: linho, cerâmica, ratan, madeira clara, tatame",
      "Paleta serena: bege, off-white, taupe, com toques pontuais escuros",
      "Mobiliário baixo e proporcional, ar acolhedor sem virar minimalismo extremo",
      "Lista de compras com itens reais, do tapete à luminária",
    ],
    steps: [
      {
        t: "Envie uma foto do ambiente",
        d: "Use a foto que você já tem, do celular ou do computador. Iluminação natural ajuda.",
      },
      {
        t: "Aplicamos o estilo Japandi",
        d: "A IA mantém a estrutura real e propõe móveis, paleta e composição com toques Japandi.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Veja como uma sala simples pode ficar",
    visualDescription:
      "Exemplo de transformação visual no estilo Japandi a partir de uma foto comum. Arraste para comparar antes e depois.",
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
        a: "Sim. Foto comum de celular já funciona, desde que o ambiente esteja visível e razoavelmente iluminado. Sem app, sem equipamento.",
      },
      {
        q: "Posso testar outros estilos no mesmo ambiente?",
        a: "Sim. A mesma foto pode receber Japandi, natural, minimalista, contemporâneo ou luxo discreto. Compare as versões e decida o que combina mais.",
      },
      {
        q: "Qual a diferença entre Japandi e minimalista puro?",
        a: "O Japandi tem mais calor (texturas naturais, cerâmica artesanal, linho) e menos sterilidade. Minimalista puro é mais branco e geométrico. Use a IA para comparar.",
      },
      {
        q: "Funciona em ambiente já mobiliado?",
        a: "Sim. A IA preserva a estrutura visível e propõe substituições ou complementos. Você decide o que vale trocar e o que mantém.",
      },
      {
        q: "Combina com clima brasileiro?",
        a: "Sim. A leveza, ventilação visual e cores claras do Japandi funcionam muito bem em clima tropical. Plantas e fibras naturais reforçam a sensação.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito para começar.",
      },
    ],
    finalCta: "Ver meu ambiente em Japandi",
    relatedLinks: [
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Natural", to: "/estilos/natural" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Home office", to: "/ambientes/home-office" },
    ],
    whyChoose: [
      "Equilíbrio raro: tem a calma japonesa e o aconchego escandinavo na mesma proposta",
      "Estética que envelhece bem, não vira moda passageira em 2 anos",
      "Funciona em apartamento alugado, sala compartilhada, casa nova ou quarto único",
      "A IA respeita a estrutura real, propõe Japandi viável para o seu espaço",
      "Sugestões de produtos por categoria (madeira clara, linho, cerâmica) com faixa de preço",
      "Sem cadastro para ver a primeira ideia, sem cartão para começar",
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
      "Veja seu ambiente decorado no estilo contemporâneo. Envie uma foto e receba uma inspiração visual com sugestões de móveis, paleta e lista de compras estimada.",
    h1: "Veja seu ambiente no estilo *Contemporâneo*",
    promise:
      "Linhas atuais, mistura de texturas e equilíbrio entre conforto e sofisticação. Envie uma foto do seu ambiente e veja como ele pode ficar com toques contemporâneos: móveis elegantes, paleta sóbria, composição moderna sem exagero. Estilo que envelhece bem e funciona em casa de família, ambiente de trabalho ou imóvel para mostrar.",
    cta: "Testar Contemporâneo no meu ambiente",
    trustText: "Em poucos passos, com a foto que você já tem.",
    defaultStyle: "contemporaneo",
    benefits: [
      "Equilíbrio entre conforto e sofisticação no mesmo ambiente",
      "Linhas atuais e mistura de texturas em proporções harmônicas",
      "Móveis elegantes com presença, sem virar moda passageira",
      "Visual moderno sem exagero, fácil de manter no dia a dia",
      "Paleta sóbria que aceita acentos pontuais de cor ou metal",
      "Funciona em sala, quarto, home office e ambientes integrados",
      "Mistura de materiais: madeira, tecido, metal, pedra com critério",
      "Lista de compras com itens reais e faixas de preço acessíveis",
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
        d: "Receba a inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Uma sala simples ganhando ar contemporâneo",
    visualDescription:
      "Exemplo de transformação visual no estilo contemporâneo a partir de uma foto comum. Arraste para comparar antes e depois.",
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
        a: "Sim. A mesma foto pode ganhar versões em Japandi, minimalista, natural, luxo discreto ou industrial. Compare lado a lado e decida.",
      },
      {
        q: "Qual a diferença entre contemporâneo e moderno?",
        a: "Moderno se refere ao movimento do século XX (linhas retas, funcionalismo). Contemporâneo é o que acontece agora, mais flexível e quente. A IA propõe um contemporâneo brasileiro e acessível.",
      },
      {
        q: "Combina com casa de família com crianças?",
        a: "Sim. A IA pode propor variações com tecidos mais resistentes, paleta menos sensível a marcas e mobília robusta. Você pede a versão que faz sentido.",
      },
      {
        q: "Posso usar em imóvel para venda ou aluguel?",
        a: "Sim. O contemporâneo neutro e elegante funciona bem em virtual staging de portais imobiliários. Para anúncios em escala, veja o módulo para imobiliárias.",
      },
      {
        q: "É grátis para testar?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito para começar.",
      },
    ],
    finalCta: "Ver meu ambiente em Contemporâneo",
    relatedLinks: [
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
      { label: "Japandi", to: "/estilos/japandi" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Home office", to: "/ambientes/home-office" },
    ],
    whyChoose: [
      "Estilo flexível, casa bem com personalidade própria, fotos de família e itens herdados",
      "Funciona tanto para casa de morar quanto para imóvel mostrar ou anunciar",
      "Não exige reforma grande: paleta, têxteis e mobília principal já transformam",
      "A IA propõe uma versão equilibrada do contemporâneo, sem virar revista fria",
      "Sugestões de produtos por categoria com faixa de preço para guiar o orçamento",
      "Compare com Japandi ou luxo discreto na mesma foto, decida o que combina com você",
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
      "Veja seu ambiente decorado no estilo minimalista. Envie uma foto e receba uma inspiração visual com poucos elementos, paleta clara e lista de compras estimada.",
    h1: "Veja seu ambiente no estilo *Minimalista*",
    promise:
      "Linhas limpas, paleta neutra, poucos elementos e respiro visual. Envie uma foto do seu ambiente e veja como ele pode ficar com toques minimalistas: organização, funcionalidade e sugestões do que realmente vale comprar. Estilo que ajuda quem quer ambiente calmo e menos coisa para limpar.",
    cta: "Testar Minimalista no meu ambiente",
    trustText: "Em poucos passos, sem precisar de cadastro para ver a primeira ideia.",
    defaultStyle: "minimalista",
    benefits: [
      "Menos excesso visual, com cada item tendo um motivo claro",
      "Linhas limpas e paleta neutra que ampliam o espaço",
      "Organização e respiro visual no dia a dia",
      "Composição que envelhece bem, sem virar moda passageira",
      "Funciona em apartamentos pequenos, onde respiro vale ouro",
      "Ajuda quem tem dificuldade com excesso visual ou ansiedade do bagunçado",
      "Mobília multifuncional e proporcionalmente bem escolhida",
      "Lista de compras focada no essencial, sem itens que viram poeira",
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
        d: "Receba a inspiração visual com sugestões de produtos para investir só no essencial.",
      },
    ],
    visualTitle: "Um quarto comum ganhando ar minimalista",
    visualDescription:
      "Exemplo de transformação visual no estilo minimalista a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Minimalismo significa ficar com pouca coisa?",
        a: "Significa manter o que você de fato usa. A IA propõe uma composição onde cada item tem propósito, sem virar ambiente vazio ou esterilizado.",
      },
      {
        q: "É um projeto arquitetônico?",
        a: "Não. É uma inspiração visual gerada por IA, não um render técnico nem um projeto pronto para obra. Serve para decidir antes de gastar.",
      },
      {
        q: "Foto de celular funciona?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado. Não precisa de equipamento especial.",
      },
      {
        q: "Posso ver o mesmo cômodo em outros estilos?",
        a: "Sim. A mesma foto pode receber Japandi, natural, contemporâneo ou luxo discreto. Compare lado a lado antes de decidir.",
      },
      {
        q: "Combina com quem tem família e crianças?",
        a: "Sim. O minimalismo doméstico não é o mesmo do feed do Instagram. A IA propõe versões com móveis robustos, tecidos práticos e organização visual, sem perder funcionalidade.",
      },
      {
        q: "Vou ter que jogar fora as minhas coisas?",
        a: "Não. A inspiração é visual. Você decide o que entra e sai. A IA serve como referência, não como manual de descarte.",
      },
      {
        q: "Funciona em ambiente já bagunçado?",
        a: "Sim. A IA mostra como o mesmo ambiente fica organizado, com paleta limpa e poucos itens visíveis. Boa para inspirar a organização do que você já tem.",
      },
      {
        q: "Tem custo para testar?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito para começar.",
      },
    ],
    finalCta: "Ver meu ambiente em Minimalista",
    relatedLinks: [
      { label: "Japandi", to: "/estilos/japandi" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Natural", to: "/estilos/natural" },
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Home office", to: "/ambientes/home-office" },
      { label: "Sala", to: "/ambientes/sala" },
    ],
    whyChoose: [
      "Visualize seu cômodo sem o excesso atual, ajuda a decidir o que sai e o que fica",
      "Estilo que combina com vida prática, casas com crianças e rotina apertada",
      "Reduz o impulso de comprar décor que não acrescenta no dia a dia",
      "A IA mostra o minimalismo viável para a sua casa, não o do feed inalcançável",
      "Sugestões priorizando o que ocupa pouco espaço visual e cumpre mais função",
      "Compare com Japandi ou natural se sentir frieza, decida o ponto certo",
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
      "Veja seu ambiente decorado no estilo natural. Envie uma foto e receba uma inspiração visual com madeira, fibras, plantas, tons claros e lista de compras estimada.",
    h1: "Veja seu ambiente no estilo *Natural*",
    promise:
      "Madeira, fibras, plantas e tons claros que trazem leveza e bem-estar. Envie uma foto do seu ambiente e veja como ele pode ficar com toques naturais: composição leve, sensação acolhedora, ar livre dentro de casa. Funciona muito bem em apartamento urbano, casa de praia, varanda ou quarto.",
    cta: "Testar Natural no meu ambiente",
    trustText: "Em poucos passos, a partir da foto que você já tem.",
    defaultStyle: "natural",
    benefits: [
      "Fibras naturais, madeira e plantas trazendo o ar livre para dentro",
      "Tons claros que aquecem o ambiente sem deixar pesado",
      "Sensação de leveza e bem-estar no dia a dia",
      "Funciona em apartamentos e casas, mesmo sem reforma grande",
      "Combina com clima tropical e quente, ajuda na ventilação visual",
      "Texturas naturais: ratan, palha, juta, linho, madeira clara",
      "Plantas em proporção realista, do vaso pequeno ao destaque grande",
      "Lista de compras com itens reais, de tapete a luminária de fibra",
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
        d: "Receba a inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um ambiente comum ganhando textura e leveza",
    visualDescription:
      "Exemplo de transformação visual no estilo natural a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Esse estilo é o mesmo que rústico?",
        a: "Não. O natural usa materiais orgânicos com acabamento mais contemporâneo. Rústico é mais cru, com madeira de demolição e tijolo aparente. A IA propõe a versão mais leve do estilo.",
      },
      {
        q: "Combina com apartamento urbano?",
        a: "Sim. Funciona muito bem em espaços urbanos. Madeira, plantas e fibras quebram a rigidez de paredes brancas e piso liso, sem precisar de varanda gourmet.",
      },
      {
        q: "Preciso comprar muitas plantas?",
        a: "Não. Você pode pedir mais ou menos vegetação na composição. A inspiração se ajusta ao que você consegue manter, do mini vaso ao destaque grande.",
      },
      {
        q: "Posso ver outros estilos no mesmo cômodo?",
        a: "Sim. A mesma foto pode receber Japandi, minimalista, contemporâneo ou industrial. Use as variações para decidir o que combina mais com você.",
      },
      {
        q: "É o mesmo que estilo boho?",
        a: "Não. Boho é mais colorido, com camadas de têxteis e décor étnico. Natural é mais sereno, foco nas texturas neutras e na vegetação. A IA propõe a versão calma.",
      },
      {
        q: "Funciona em quarto e home office?",
        a: "Sim. Quarto natural ajuda no relaxamento. Home office natural reduz a frieza da tela e do escritório formal. Texturas e plantas combinam muito bem nos dois.",
      },
      {
        q: "Combina com mobília que eu já tenho?",
        a: "Sim. A IA preserva o que está visível na foto e propõe complementos. Madeira clara, ratan e plantas costumam casar bem com mobília existente.",
      },
      {
        q: "É grátis para testar?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito para começar.",
      },
    ],
    finalCta: "Ver meu ambiente em Natural",
    relatedLinks: [
      { label: "Japandi", to: "/estilos/japandi" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Home office", to: "/ambientes/home-office" },
    ],
    whyChoose: [
      "Traz a sensação de ar livre para dentro do apartamento ou casa, sem reforma",
      "Estilo que combina muito bem com clima brasileiro, ventilação visual e cores claras",
      "Compre menos vasos: a IA mostra plantas em proporção realista, do que você consegue cuidar",
      "Funciona em quase qualquer cômodo: sala, quarto, home office, banheiro, varanda",
      "Sugestões de produtos por categoria (fibra natural, madeira clara, vegetação) com faixa de preço",
      "Compare com Japandi se quiser ar mais minimalista, ou natural puro se quiser camadas",
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
      "Veja seu ambiente decorado no estilo industrial. Envie uma foto e receba uma inspiração visual com metal, madeira escura, tijolo aparente e lista de compras estimada.",
    h1: "Veja seu ambiente no estilo *Industrial*",
    promise:
      "Metal, madeira escura, concreto, tijolo aparente e iluminação marcante. Envie uma foto do ambiente e veja como ele pode ficar com um ar urbano: composição cheia de personalidade, sem virar galpão frio nem cenário de bar temático. Funciona muito bem em cozinha, sala, home office e loft.",
    cta: "Testar Industrial no meu ambiente",
    trustText: "Em poucos passos, com a foto que você já tem.",
    defaultStyle: "industrial",
    benefits: [
      "Metal, madeira escura, concreto e tijolo aparente em equilíbrio",
      "Iluminação marcante que define o caráter do ambiente",
      "Visual urbano sem cair em frieza ou ar de galpão",
      "Personalidade forte que combina com sala, cozinha e home office",
      "Combina muito bem com pé-direito alto, loft ou cobertura",
      "Pode ser suavizado com têxteis quentes e iluminação amarela",
      "Sugestões de luminárias pendentes Edison e arandelas pretas",
      "Lista de compras separando estrutural (metal, madeira) e décor (têxtil, luz)",
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
        d: "Receba a inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Uma cozinha simples ganhando ar urbano",
    visualDescription:
      "Exemplo de transformação visual no estilo industrial a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Industrial fica frio?",
        a: "Pode ficar se não for equilibrado. A IA combina materiais crus com têxteis, iluminação amarela e detalhes quentes, sem virar galpão sem alma.",
      },
      {
        q: "Preciso quebrar parede para ter tijolo aparente?",
        a: "Não. Você pode usar revestimentos que imitam tijolo, papel de parede ou aplicar o estilo em outros pontos do ambiente, sem reforma estrutural.",
      },
      {
        q: "Foto comum de celular funciona?",
        a: "Sim. Foto de celular já serve, desde que o ambiente esteja visível na imagem. Não precisa de equipamento especial.",
      },
      {
        q: "Posso suavizar o estilo?",
        a: "Sim. A IA propõe variações mais soft ou mais densas. Compare as versões e escolha a intensidade que combina com a sua rotina.",
      },
      {
        q: "Funciona em apartamento padrão, sem pé-direito alto?",
        a: "Sim. A IA adapta a proposta ao espaço real. Em pé-direito normal, o estilo aparece pelos materiais (metal, madeira escura, luminária), não pela altura.",
      },
      {
        q: "Combina com cozinha integrada à sala?",
        a: "Sim. Industrial funciona muito bem em cozinha americana. A IA propõe paleta coerente entre os dois ambientes, sem destoar.",
      },
      {
        q: "Tem ar masculino demais?",
        a: "Não precisa ter. A IA pode propor versões com mais plantas, têxteis claros e madeira clara para equilibrar a paleta. Você pede o ajuste.",
      },
      {
        q: "Tem custo para testar?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito para começar.",
      },
    ],
    finalCta: "Ver meu ambiente em Industrial",
    relatedLinks: [
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Cozinha", to: "/ambientes/cozinha" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Home office", to: "/ambientes/home-office" },
    ],
    whyChoose: [
      "Estilo com personalidade forte para quem quer fugir do branco-bege padrão",
      "Funciona em cozinha americana, sala social, home office e loft, especialmente em pé-direito alto",
      "Você decide a intensidade: industrial soft com madeira clara ou denso com concreto e metal",
      "A IA equilibra os materiais crus com têxteis e iluminação quente, sem virar galpão",
      "Sugestões de luminárias pendentes Edison, arandelas pretas e décor metálico",
      "Compare com contemporâneo ou luxo discreto na mesma foto, decida a intensidade certa",
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
      "Veja seu ambiente decorado no estilo luxo discreto. Envie uma foto e receba uma inspiração visual com materiais nobres, composição elegante e lista de compras estimada.",
    h1: "Veja seu ambiente em *Luxo Discreto*",
    promise:
      "Materiais nobres, iluminação cuidadosa e composição elegante, sem exagero. Envie uma foto do seu ambiente e veja como ele pode ganhar um visual premium e atemporal, com sugestões de produtos para decidir onde investir. Estilo que combina com quem prefere sofisticação calma a brilho de ostentação.",
    cta: "Testar Luxo Discreto no meu ambiente",
    trustText: "Em poucos passos, sem promessa de obra ou render técnico.",
    defaultStyle: "luxo",
    benefits: [
      "Composição elegante com materiais nobres aplicados com critério",
      "Iluminação pontual que valoriza os detalhes certos",
      "Visual premium sem cair em ostentação",
      "Cuidado para não parecer artificial, com refinamento na medida certa",
      "Texturas marcantes: mármore, veludo, latão escovado, madeira nobre",
      "Paleta neutra escura ou clara, com acentos pontuais metálicos",
      "Funciona em sala, banheiro, quarto principal e closet",
      "Lista de compras priorizando o que tem mais impacto visual",
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
        d: "Receba a inspiração visual com sugestões de produtos para investir com clareza.",
      },
    ],
    visualTitle: "Um banheiro simples ganhando ar premium",
    visualDescription:
      "Exemplo de transformação visual em luxo discreto a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Preciso de um arquiteto para usar?",
        a: "Não. Serve como ponto de partida visual. Você pode usar sozinho ou levar a inspiração para um profissional se quiser aprofundar o projeto.",
      },
      {
        q: "É um projeto técnico de obra?",
        a: "Não. É uma inspiração visual gerada por IA, não um render arquitetônico nem aprovação técnica. Ajuda a decidir antes de comprar.",
      },
      {
        q: "Luxo discreto exige orçamento alto?",
        a: "É um estilo, não um orçamento fixo. A lista de compras vem com sugestões em diferentes faixas, e você escolhe onde priorizar. Dá para começar pela iluminação, que costuma ter o maior impacto.",
      },
      {
        q: "Posso aplicar gradualmente?",
        a: "Sim. Comece pelos pontos com maior impacto visual: iluminação, móveis principais, depois acabamentos. A lista ajuda a ordenar por prioridade.",
      },
      {
        q: "Funciona em apartamento padrão?",
        a: "Sim. O luxo discreto é estética, não tamanho do imóvel. A IA propõe versões que cabem em sala média, sem precisar de pé-direito alto nem metragem nobre.",
      },
      {
        q: "Combina com casa de família com crianças?",
        a: "Sim. A IA pode propor versões com tecidos resistentes (linho misto, microfibra) e paleta menos sensível, mantendo o ar refinado.",
      },
      {
        q: "Como diferenciar luxo discreto de luxo clássico?",
        a: "O discreto evita ouro brilhante, lustres pomposos e estampas pesadas. Foca em materialidade, iluminação calma e composição limpa. A IA propõe a versão contemporânea.",
      },
      {
        q: "É grátis para testar?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito para começar.",
      },
    ],
    finalCta: "Ver meu ambiente em Luxo Discreto",
    relatedLinks: [
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Industrial", to: "/estilos/industrial" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Banheiro", to: "/ambientes/banheiro" },
    ],
    whyChoose: [
      "Sofisticação calma, sem brilho de ostentação nem caricatura de luxo",
      "Funciona em apartamento padrão, não exige imóvel grande nem pé-direito nobre",
      "Compare uma versão clara mais leve e uma escura mais densa na mesma foto",
      "Sugestões de produtos em diferentes faixas, dá para começar pela iluminação e ir somando",
      "A IA prioriza materialidade e composição, não preço de etiqueta nem marca de grife",
      "Estilo que envelhece bem, não vira datado em poucos anos",
    ],
    images: {
      before: "empty-bathroom-suite",
      after: "decorated-bathroom-suite",
      gallery: ["style-luxo", "decorated-living", "decorated-bathroom"],
    },
  },
};
