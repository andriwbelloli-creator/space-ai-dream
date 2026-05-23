/**
 * Dados de SEO e copy comercial das landing pages de ambientes.
 *
 * Fonte única de verdade para as rotas `/ambientes/$roomSlug`. Cada cômodo tem
 * título e meta description otimizados para busca, um H1 com destaque em
 * markdown (`*trecho*`) e argumentos de venda específicos do ambiente.
 */

import type {
  LandingBenefit,
  LandingFaq,
  LandingImages,
  LandingRelatedLink,
  LandingStep,
} from "./seo-landing-shared";

/** Slugs de cômodos com landing page dedicada. */
export type RoomSlug = "sala" | "quarto" | "cozinha" | "home-office" | "banheiro";

/** Conteúdo de SEO + copy de conversão de uma landing page de ambiente. */
export interface RoomSeoData {
  /** Título SEO (tag <title> e og:title). */
  title: string;
  /** Meta description focada em conversão. */
  description: string;
  /** Texto principal da página — usa `*trecho*` para o destaque visual. */
  h1: string;
  /** Parágrafo de venda detalhado e específico do cômodo. */
  promise: string;
  /** Texto comercial do botão de conversão (CTA primario do hero). */
  cta: string;
  /** Microcopy curto abaixo do CTA primario — sinal de confianca leve. */
  trustText?: string;
  /** Cômodo pré-selecionado no formulário de leads. */
  defaultRoomType: RoomSlug;
  /** 3-5 bullets curtos de valor — exibidos abaixo do hero. */
  benefits: LandingBenefit[];
  /** 3 passos do "Como funciona". */
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

/** Mapa estático de cada cômodo conhecido para o seu conteúdo de SEO. */
export const SEO_ROOMS: Record<RoomSlug, RoomSeoData> = {
  sala: {
    title: "Decorar Sala com Inteligência Artificial | Ideal Space",
    description:
      "Veja sua sala decorada com IA. Envie uma foto, escolha um estilo e receba uma inspiração visual com lista de compras sugerida.",
    h1: "Veja sua *sala* decorada com IA",
    promise:
      "Envie uma foto da sala como ela está hoje e veja como ela pode ficar mais aconchegante. Teste combinações de sofá, tapete, iluminação e mesa de centro, com sugestões de produtos para começar.",
    cta: "Ver minha sala decorada",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "sala",
    benefits: [
      "Teste combinações de sofá, tapete, mesa de centro e iluminação",
      "Visualize uma sala mais aconchegante antes de comprar móveis",
      "Encontre referências para aproveitar melhor o espaço",
      "Inspiração prática com sugestões de produtos para a sua casa",
    ],
    steps: [
      {
        t: "Envie uma foto da sala",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Japandi, contemporâneo, industrial, natural ou minimalista. Você decide a vibe.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
      },
    ],
    visualTitle: "Uma sala simples ganhando aconchego",
    visualDescription:
      "Exemplo de transformação visual de uma sala a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Preciso contratar um arquiteto?",
        a: "Não. A inspiração é um ponto de partida. Você pode usar sozinho ou levar para um profissional, se quiser aprofundar o projeto.",
      },
      {
        q: "A imagem gerada é um projeto técnico?",
        a: "Não. É uma inspiração visual gerada por IA, não um render arquitetônico nem um projeto pronto para obra.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível na imagem.",
      },
      {
        q: "Funciona com sala integrada à cozinha ou jantar?",
        a: "Sim. Envie a foto que mostre o espaço que você quer transformar. A IA preserva o layout real, mesmo com ambientes integrados.",
      },
    ],
    finalCta: "Criar uma inspiração para minha sala",
    relatedLinks: [
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Cozinha", to: "/ambientes/cozinha" },
      { label: "Japandi", to: "/estilos/japandi" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
    ],
    images: {
      before: "empty-living",
      after: "decorated-living",
      gallery: ["decorated-living-warm", "gallery-loft", "gallery-varanda"],
    },
  },
  quarto: {
    title: "Decorar Quarto com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu quarto decorado com IA. Envie uma foto, escolha um estilo e receba uma inspiração visual com lista de compras sugerida.",
    h1: "Veja seu *quarto* decorado com IA",
    promise:
      "Envie uma foto do quarto como ele está hoje e veja como ele pode ficar mais acolhedor. Cama, cabeceira, iluminação indireta, têxteis e tons relaxantes, com sugestões de produtos para começar.",
    cta: "Ver meu quarto decorado",
    trustText: "Em poucos passos, sem cadastro pra ver a primeira ideia.",
    defaultRoomType: "quarto",
    benefits: [
      "Sensação de descanso e acolhimento desde a primeira olhada",
      "Cabeceira, criados-mudo, têxteis e iluminação em harmonia",
      "Tons relaxantes e organização que ajudam a dormir melhor",
      "Funciona em quartos grandes, pequenos, de casal ou solteiro",
    ],
    steps: [
      {
        t: "Envie uma foto do quarto",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Japandi, natural, minimalista, escandinavo. Pense no clima que você quer.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
      },
    ],
    visualTitle: "Um quarto comum ganhando aconchego",
    visualDescription:
      "Exemplo de transformação visual de um quarto a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Preciso de um arquiteto pra usar?",
        a: "Não. Serve como ponto de partida visual. Você pode aplicar sozinho ou levar a inspiração para um profissional, se quiser aprofundar.",
      },
      {
        q: "É um projeto arquitetônico?",
        a: "Não. É uma inspiração visual gerada por IA, não um render técnico nem aprovação para obra.",
      },
      {
        q: "Quarto pequeno funciona?",
        a: "Sim. A IA adapta a proposta ao tamanho real, mantendo a perspectiva e o que cabe no espaço.",
      },
      {
        q: "Posso testar estilos diferentes no mesmo quarto?",
        a: "Sim. A mesma foto pode receber Japandi, minimalista, natural ou contemporâneo. Compare lado a lado.",
      },
    ],
    finalCta: "Criar uma inspiração para meu quarto",
    relatedLinks: [
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Home office", to: "/ambientes/home-office" },
      { label: "Japandi", to: "/estilos/japandi" },
      { label: "Minimalista", to: "/estilos/minimalista" },
    ],
    images: {
      before: "empty-bedroom",
      after: "decorated-bedroom",
      gallery: ["rank-minimal-bedroom", "gallery-loft", "decorated-living-warm"],
    },
  },
  cozinha: {
    title: "Decorar Cozinha com Inteligência Artificial | Ideal Space",
    description:
      "Veja sua cozinha decorada com IA. Envie uma foto e receba uma inspiração visual com sugestões de armários, bancada, iluminação e décor.",
    h1: "Veja sua *cozinha* decorada com IA",
    promise:
      "Envie uma foto da cozinha como ela está hoje e veja ideias para deixá-la mais bonita e funcional. Combinações de armários, bancada, iluminação e organização, com sugestões de produtos, sem precisar reformar tudo.",
    cta: "Ver minha cozinha decorada",
    trustText: "Em poucos passos, sem precisar de obra grande.",
    defaultRoomType: "cozinha",
    benefits: [
      "Ideias para deixar a cozinha mais bonita sem precisar reformar tudo",
      "Visualize combinações de armários, bancada e revestimentos",
      "Iluminação técnica e decorativa pensadas em conjunto",
      "Praticidade no dia a dia, com estética limpa",
    ],
    steps: [
      {
        t: "Envie uma foto da cozinha",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Industrial, contemporâneo, natural, minimalista. Pense na cozinha que faz sentido pra rotina.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
      },
    ],
    visualTitle: "Uma cozinha comum ganhando ar mais bonito",
    visualDescription:
      "Exemplo de transformação visual de uma cozinha a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Preciso reformar pra usar o resultado?",
        a: "Não. A inspiração serve para decidir o que mudar, e pode ser só décor, iluminação ou paleta, sem obra grande.",
      },
      {
        q: "É um projeto técnico para o marceneiro?",
        a: "Não. É uma inspiração visual gerada por IA, não um projeto executivo. Serve como referência para conversar com profissionais.",
      },
      {
        q: "Funciona com cozinha americana?",
        a: "Sim. Envie a foto que mostre a área que você quer transformar: corredor, ilha ou integrada com sala.",
      },
      {
        q: "A IA preserva fogão e geladeira no lugar?",
        a: "Sim. A IA respeita o layout existente da foto e propõe acabamentos, marcenaria visível e décor sobre essa base.",
      },
    ],
    finalCta: "Criar uma inspiração para minha cozinha",
    relatedLinks: [
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Banheiro", to: "/ambientes/banheiro" },
      { label: "Industrial", to: "/estilos/industrial" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
    ],
    images: {
      before: "empty-kitchen",
      after: "decorated-kitchen",
      gallery: ["empty-kitchen-island", "decorated-kitchen-island", "decorated-dining"],
    },
  },
  "home-office": {
    title: "Decorar Home Office com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu home office decorado com IA. Envie uma foto e receba uma inspiração visual com mesa, cadeira, iluminação e organização.",
    h1: "Veja seu *home office* decorado com IA",
    promise:
      "Envie uma foto do seu espaço de trabalho e veja como ele pode ficar mais bonito e produtivo. Mesa, cadeira, iluminação, monitor e organização de cabos, com sugestões de produtos pra investir só no que faz diferença.",
    cta: "Ver meu home office decorado",
    trustText: "Em poucos passos, a partir da foto que você já tem.",
    defaultRoomType: "home-office",
    benefits: [
      "Ambiente bonito para trabalhar, sem perder produtividade",
      "Mesa, cadeira ergonômica e iluminação pensadas em conjunto",
      "Organização inteligente: cabos, monitor, prateleiras",
      "Fundo agradável para reuniões e gravações em vídeo",
    ],
    steps: [
      {
        t: "Envie uma foto do espaço",
        d: "Use a foto que você já tem: canto da sala, quarto ou escritório dedicado.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Minimalista, natural, contemporâneo. Pense no clima de trabalho que você quer.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
      },
    ],
    visualTitle: "Um canto comum ganhando ar produtivo",
    visualDescription:
      "Exemplo de transformação visual de um home office a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Funciona em canto de sala ou quarto?",
        a: "Sim. Envie a foto do espaço que você usa. O resultado considera o ambiente real, não um escritório fictício.",
      },
      {
        q: "É um projeto técnico de ergonomia?",
        a: "Não. É uma inspiração visual gerada por IA. Serve como ponto de partida pra organizar o espaço e decidir o que comprar.",
      },
      {
        q: "Foto comum de celular funciona?",
        a: "Sim. Foto de celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "Sugere marca específica de cadeira ou mesa?",
        a: "A lista de compras sugere categorias e faixas de preço. Você escolhe a marca que combina com o seu orçamento.",
      },
    ],
    finalCta: "Criar uma inspiração para meu home office",
    relatedLinks: [
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Natural", to: "/estilos/natural" },
    ],
    images: {
      before: "empty-office",
      after: "gallery-office",
      gallery: ["moodboard-pro", "decorated-living", "rank-minimal-bedroom"],
    },
  },
  banheiro: {
    title: "Decorar Banheiro com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu banheiro decorado com IA. Envie uma foto e receba uma inspiração visual com revestimentos, espelhos, metais e décor.",
    h1: "Veja seu *banheiro* decorado com IA",
    promise:
      "Envie uma foto do banheiro como ele está hoje e veja ideias para deixá-lo mais bonito e prático. Iluminação, espelhos, metais e organização, com visual leve e sensação de hotel ou spa, sem prometer reforma garantida.",
    cta: "Ver meu banheiro decorado",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "banheiro",
    benefits: [
      "Sensação de limpeza e bem-estar em cada detalhe",
      "Iluminação, espelhos e metais coordenados",
      "Visual leve, com ar de hotel ou spa quando combina",
      "Ideias para deixar o banheiro mais bonito sem reforma completa",
    ],
    steps: [
      {
        t: "Envie uma foto do banheiro",
        d: "Use a foto que você já tem, do celular ou do computador.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Minimalista, natural, contemporâneo ou luxo discreto. Veja o que combina com o espaço.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual e sugestões de produtos como ponto de partida.",
      },
    ],
    visualTitle: "Um banheiro simples ganhando ar mais leve",
    visualDescription:
      "Exemplo de transformação visual de um banheiro a partir de uma foto comum. Arraste para comparar.",
    faq: [
      {
        q: "Preciso de obra para usar o resultado?",
        a: "Não. Muitos itens da inspiração (espelhos, metais, décor, iluminação) podem ser aplicados sem obra grande.",
      },
      {
        q: "É um projeto técnico de reforma?",
        a: "Não. É uma inspiração visual gerada por IA, não um projeto executivo nem orçamento de obra. Serve como referência.",
      },
      {
        q: "Funciona com banheiro pequeno?",
        a: "Sim. A IA adapta a proposta ao tamanho real. Banheiros compactos ganham muito com escolhas certas de luz e revestimento visível.",
      },
      {
        q: "Mostra com chuveiro e box no lugar?",
        a: "Sim. A IA preserva a estrutura visível da foto e propõe acabamentos, espelhos, metais e décor sobre essa base.",
      },
    ],
    finalCta: "Criar uma inspiração para meu banheiro",
    relatedLinks: [
      { label: "Cozinha", to: "/ambientes/cozinha" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
      { label: "Minimalista", to: "/estilos/minimalista" },
    ],
    images: {
      before: "empty-bathroom",
      after: "decorated-bathroom",
      gallery: ["empty-bathroom-suite", "decorated-bathroom-suite", "decorated-living"],
    },
  },
};
