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
  /** 4-6 bullets de "Por que decorar com IA" exibidos depois da galeria. Opcional. */
  whyChoose?: string[];
}

/** Mapa estático de cada cômodo conhecido para o seu conteúdo de SEO. */
export const SEO_ROOMS: Record<RoomSlug, RoomSeoData> = {
  sala: {
    title: "Decorar Sala com Inteligência Artificial | Ideal Space",
    description:
      "Veja sua sala decorada com IA em diferentes estilos. Envie uma foto comum, escolha o clima e receba uma inspiração visual com lista de compras sugerida e orçamento estimado.",
    h1: "Veja sua *sala* decorada com IA",
    promise:
      "Envie uma foto da sala como ela está hoje e veja como ela pode ficar mais aconchegante. Teste combinações de sofá, tapete, iluminação e mesa de centro em diferentes estilos. Você recebe sugestões de produtos reais para começar a montar a sua, sem depender só de pranchas do Pinterest.",
    cta: "Ver minha sala decorada",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "sala",
    benefits: [
      "Teste combinações de sofá, poltrona, tapete, mesa de centro e iluminação",
      "Visualize uma sala mais aconchegante antes de comprar móveis",
      "Compare versões em Japandi, contemporâneo, natural e luxo discreto",
      "Inspiração específica para salas integradas à cozinha ou ao jantar",
      "Sugestões de iluminação ambiente e ponto, sem virar showroom frio",
      "Lista de compras com sugestões de produtos reais e faixa de preço",
      "Funciona para sala alugada, sala de casa nova ou sala pra renovar",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
    ],
    steps: [
      {
        t: "Envie uma foto da sala",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Japandi, contemporâneo, industrial, natural, minimalista ou luxo discreto. Você decide a vibe.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual junto com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Uma sala simples ganhando aconchego",
    visualDescription:
      "Exemplo de transformação visual de uma sala a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Preciso contratar um arquiteto?",
        a: "Não. A inspiração é um ponto de partida. Você pode usar sozinho para guiar suas compras ou levar a referência para um profissional aprofundar o projeto.",
      },
      {
        q: "A imagem gerada é um projeto técnico?",
        a: "Não. É uma inspiração visual gerada por IA, não um render arquitetônico nem um projeto pronto para obra. Serve para decidir antes de gastar.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado. Não precisa de equipamento especial nem app.",
      },
      {
        q: "Funciona com sala integrada à cozinha ou ao jantar?",
        a: "Sim. Envie a foto que mostre o espaço que você quer transformar. A IA preserva o layout real, mesmo com ambientes integrados.",
      },
      {
        q: "A lista de compras tem preços confiáveis?",
        a: "A lista vem com faixas de preço estimadas em reais, organizadas por categoria. Os valores são referência inicial. Confirme sempre na loja antes de comprar.",
      },
      {
        q: "Posso testar vários estilos na mesma sala?",
        a: "Sim. A mesma foto pode receber versões em Japandi, contemporâneo, natural, industrial ou luxo discreto. Compare lado a lado e escolha o que faz sentido para você.",
      },
      {
        q: "Quanto custa para gerar a primeira inspiração?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito para começar.",
      },
      {
        q: "As minhas fotos ficam públicas?",
        a: "Não. Suas fotos são privadas e nunca são publicadas sem a sua autorização explícita. Veja a política completa em /legal.",
      },
    ],
    finalCta: "Criar uma inspiração para minha sala",
    relatedLinks: [
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Cozinha", to: "/ambientes/cozinha" },
      { label: "Home office", to: "/ambientes/home-office" },
      { label: "Banheiro", to: "/ambientes/banheiro" },
      { label: "Japandi", to: "/estilos/japandi" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
    ],
    whyChoose: [
      "Você decide antes de gastar, evita comprar móvel errado ou tapete fora de proporção",
      "A IA preserva a estrutura real da sua sala: paredes, janelas, layout e o que já está no lugar",
      "Compare vários estilos com a mesma foto, sem precisar refazer pranchas manualmente",
      "Sugestões de produtos reais com faixa de preço, ponto de partida para a sua lista de compras",
      "Útil tanto para mudança nova quanto para renovar a sala que você já tem",
      "Sem cadastro para ver a primeira ideia, sem cartão para começar",
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
      "Veja seu quarto decorado com IA em vários estilos. Envie uma foto, escolha o clima e receba uma inspiração visual com lista de compras sugerida e orçamento estimado.",
    h1: "Veja seu *quarto* decorado com IA",
    promise:
      "Envie uma foto do quarto como ele está hoje e veja como ele pode ficar mais acolhedor. Cama, cabeceira, iluminação indireta, têxteis, cortinas e tons relaxantes. Receba sugestões de produtos reais para começar a montar o ambiente que ajuda a dormir melhor.",
    cta: "Ver meu quarto decorado",
    trustText: "Em poucos passos, sem cadastro para ver a primeira ideia.",
    defaultRoomType: "quarto",
    benefits: [
      "Sensação de descanso e acolhimento desde a primeira olhada",
      "Cabeceira, criados-mudo, têxteis e iluminação em harmonia",
      "Tons relaxantes e organização que ajudam a dormir melhor",
      "Funciona em quartos grandes, pequenos, de casal ou solteiro",
      "Ideias para quartos de aluguel, sem precisar furar parede",
      "Sugestões de luz indireta, cortina e tapete adequados ao espaço real",
      "Lista de compras com faixas de preço para investir aos poucos",
      "Veja como aproveitar melhor closet pequeno ou ausência dele",
    ],
    steps: [
      {
        t: "Envie uma foto do quarto",
        d: "Use a foto que você já tem, do celular ou do computador. De preferência com luz natural.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Japandi, natural, minimalista, contemporâneo ou luxo discreto. Pense no clima que você quer.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba a inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um quarto comum ganhando aconchego",
    visualDescription:
      "Exemplo de transformação visual de um quarto a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Preciso de um arquiteto para usar?",
        a: "Não. Serve como ponto de partida visual. Você pode aplicar sozinho ou levar a inspiração para um profissional, se quiser aprofundar o projeto.",
      },
      {
        q: "É um projeto arquitetônico?",
        a: "Não. É uma inspiração visual gerada por IA, não um render técnico nem aprovação para obra. Use como referência para decidir.",
      },
      {
        q: "Quarto pequeno funciona bem?",
        a: "Sim. A IA adapta a proposta ao tamanho real do ambiente, mantendo perspectiva e o que cabe no espaço. Quartos pequenos ganham muito com boas escolhas de luz e tons.",
      },
      {
        q: "Posso testar estilos diferentes no mesmo quarto?",
        a: "Sim. A mesma foto pode receber Japandi, minimalista, natural, contemporâneo ou luxo discreto. Compare lado a lado e escolha o que combina com você.",
      },
      {
        q: "Funciona em quarto de aluguel?",
        a: "Sim. As sugestões priorizam decoração e itens removíveis. Você consegue aplicar boa parte sem furar parede ou alterar instalações.",
      },
      {
        q: "A IA sugere cama, colchão e roupa de cama específicos?",
        a: "A lista de compras vem com categorias (cama box, cabeceira, roupa de cama, cortinas, luminárias) e faixas de preço. Você escolhe a marca e modelo dentro do seu orçamento.",
      },
      {
        q: "Posso usar várias gerações grátis?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Dá para testar estilos diferentes ou pedir variações da mesma proposta sem cadastrar cartão.",
      },
      {
        q: "Minhas fotos ficam privadas?",
        a: "Sim. As fotos não são publicadas sem a sua autorização. Veja a política completa em /legal.",
      },
    ],
    finalCta: "Criar uma inspiração para meu quarto",
    relatedLinks: [
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Home office", to: "/ambientes/home-office" },
      { label: "Banheiro", to: "/ambientes/banheiro" },
      { label: "Japandi", to: "/estilos/japandi" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Natural", to: "/estilos/natural" },
    ],
    whyChoose: [
      "Decida texturas e tons antes de pintar parede ou comprar roupa de cama nova",
      "A IA respeita a estrutura real do seu quarto, janela e porta no mesmo lugar",
      "Veja várias propostas de iluminação e descubra o que combina com o seu hábito de sono",
      "Sugestões realistas, com itens removíveis, ideais para imóvel alugado",
      "Lista de compras priorizando o que tem mais impacto visual e funcional",
      "Sem cadastro para ver a primeira ideia, sem cartão para começar",
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
      "Veja sua cozinha decorada com IA em vários estilos. Envie uma foto e receba uma inspiração visual com sugestões de armários, bancada, iluminação, décor e lista de compras estimada.",
    h1: "Veja sua *cozinha* decorada com IA",
    promise:
      "Envie uma foto da cozinha como ela está hoje e veja ideias para deixá-la mais bonita e funcional. Combinações de armários, bancada, revestimentos, iluminação técnica e organização, com sugestões de produtos. Use como ponto de partida para conversar com marceneiro ou para decidir só os pequenos toques.",
    cta: "Ver minha cozinha decorada",
    trustText: "Em poucos passos, sem precisar de obra grande.",
    defaultRoomType: "cozinha",
    benefits: [
      "Ideias para deixar a cozinha mais bonita sem precisar reformar tudo",
      "Visualize combinações de armários, bancada e revestimentos",
      "Iluminação técnica e decorativa pensadas em conjunto",
      "Praticidade no dia a dia, com estética limpa",
      "Soluções para cozinha pequena, corredor ou ilha integrada",
      "Inspiração para cozinha americana, gourmet ou planejada",
      "Sugestões de paleta, da clássica madeira clara ao contraste preto",
      "Lista de compras com faixas de preço para utensílios e décor",
    ],
    steps: [
      {
        t: "Envie uma foto da cozinha",
        d: "Use a foto que você já tem, do celular ou do computador. Mostre o ângulo que você quer transformar.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Industrial, contemporâneo, natural, minimalista, japandi ou luxo discreto. Pense na cozinha que faz sentido para a rotina.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Uma cozinha comum ganhando ar mais bonito",
    visualDescription:
      "Exemplo de transformação visual de uma cozinha a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Preciso reformar para usar o resultado?",
        a: "Não. A inspiração serve para decidir o que mudar. Pode ser só décor, iluminação, paleta ou marcenaria de embutir nova, sem obra grande estrutural.",
      },
      {
        q: "É um projeto técnico para o marceneiro?",
        a: "Não. É uma inspiração visual gerada por IA, não um projeto executivo com cotas e medidas. Serve como referência para conversar com profissionais e definir direção estética.",
      },
      {
        q: "Funciona com cozinha americana ou integrada à sala?",
        a: "Sim. Envie a foto que mostre a área que você quer transformar: corredor, ilha, americana ou integrada. A IA preserva o layout real.",
      },
      {
        q: "A IA preserva fogão, geladeira e pia no lugar?",
        a: "Sim. A IA respeita o layout existente da foto. Propõe acabamentos, marcenaria visível, paleta e décor sobre essa base, sem mover eletrodomésticos.",
      },
      {
        q: "Funciona para cozinha de aluguel?",
        a: "Sim. As sugestões priorizam itens removíveis e décor. Você consegue aplicar pintura, papel de parede, iluminação e organização sem mexer no que é fixo.",
      },
      {
        q: "Posso usar a inspiração para conversar com a marcenaria?",
        a: "Sim. A imagem antes e depois ajuda a comunicar a estética que você quer. O marceneiro usa como referência para o projeto técnico real.",
      },
      {
        q: "A lista de compras inclui eletrodomésticos?",
        a: "A lista foca em itens visíveis na decoração: bancada, organizadores, utensílios visíveis, luminária, plantas e décor. Eletro grande você escolhe em separado.",
      },
      {
        q: "Quanto custa testar?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito para começar.",
      },
    ],
    finalCta: "Criar uma inspiração para minha cozinha",
    relatedLinks: [
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Banheiro", to: "/ambientes/banheiro" },
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Industrial", to: "/estilos/industrial" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Natural", to: "/estilos/natural" },
    ],
    whyChoose: [
      "Veja a cozinha com nova paleta antes de pintar, encomendar marcenaria ou trocar revestimento",
      "Compare estilos lado a lado, do industrial urbano ao natural com madeira clara",
      "Ideias para deixar mais bonita sem reforma completa: pintura, papel de parede, luz, organização",
      "A IA preserva fogão, pia e geladeira onde estão, propõe só o que dá para mudar",
      "Sugestões de produtos reais e faixa de preço para guiar o orçamento",
      "Útil para conversar com marceneiro ou arquiteto, com referência visual clara",
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
      "Veja seu home office decorado com IA. Envie uma foto e receba uma inspiração visual com mesa, cadeira, iluminação, organização de cabos e lista de compras estimada.",
    h1: "Veja seu *home office* decorado com IA",
    promise:
      "Envie uma foto do seu espaço de trabalho e veja como ele pode ficar mais bonito e produtivo. Mesa, cadeira, iluminação de tarefa, monitor, organização de cabos e fundo agradável para chamadas de vídeo. Sugestões de produtos para investir só no que faz diferença na sua rotina.",
    cta: "Ver meu home office decorado",
    trustText: "Em poucos passos, a partir da foto que você já tem.",
    defaultRoomType: "home-office",
    benefits: [
      "Ambiente bonito para trabalhar, sem perder produtividade",
      "Mesa, cadeira ergonômica e iluminação pensadas em conjunto",
      "Organização inteligente para cabos, monitor e prateleiras",
      "Fundo agradável para reuniões e gravações em vídeo",
      "Funciona em canto de sala, quarto ou escritório dedicado",
      "Soluções para apartamento pequeno, sem precisar de cômodo inteiro",
      "Sugestões de iluminação de tarefa para reduzir cansaço visual",
      "Lista de compras separando o essencial do que dá para esperar",
    ],
    steps: [
      {
        t: "Envie uma foto do espaço",
        d: "Use a foto que você já tem: canto da sala, quarto ou escritório dedicado.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Minimalista, natural, contemporâneo, japandi. Pense no clima de trabalho que você quer.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba a inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um canto comum ganhando ar produtivo",
    visualDescription:
      "Exemplo de transformação visual de um home office a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Funciona em canto de sala ou quarto?",
        a: "Sim. Envie a foto do espaço que você usa de verdade. O resultado considera o ambiente real, não um escritório fictício.",
      },
      {
        q: "É um projeto técnico de ergonomia?",
        a: "Não. É uma inspiração visual gerada por IA. Serve como ponto de partida para organizar o espaço e decidir o que comprar. Para ergonomia clínica, consulte um profissional.",
      },
      {
        q: "Foto comum de celular funciona?",
        a: "Sim. Foto de celular já serve, desde que o ambiente esteja visível e iluminado. Quanto mais clara a foto, melhor o resultado.",
      },
      {
        q: "Sugere marca específica de cadeira ou mesa?",
        a: "A lista de compras sugere categorias (cadeira ergonômica, mesa, iluminação de tarefa, monitor arm) e faixas de preço. Você escolhe a marca dentro do seu orçamento.",
      },
      {
        q: "Combina com ambiente compartilhado, com outra pessoa morando junto?",
        a: "Sim. A IA respeita o que já está no ambiente. Você pode pedir variações mais discretas para não destoar do resto do cômodo.",
      },
      {
        q: "Posso testar várias paletas para o fundo de calls?",
        a: "Sim. Gere versões em estilos diferentes e veja qual visual ajuda mais nas suas reuniões. Compare lado a lado.",
      },
      {
        q: "A IA inclui sugestão de plantas e décor?",
        a: "Sim. A composição costuma incluir plantas, livros, prateleiras e décor proporcionais ao espaço. Você pode pedir versões mais minimalistas se preferir.",
      },
      {
        q: "Quanto custa para começar?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
    ],
    finalCta: "Criar uma inspiração para meu home office",
    relatedLinks: [
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Cozinha", to: "/ambientes/cozinha" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Natural", to: "/estilos/natural" },
      { label: "Japandi", to: "/estilos/japandi" },
    ],
    whyChoose: [
      "Veja o seu cantinho de trabalho como ele poderia ficar, antes de comprar mesa nova ou cadeira",
      "Decida o fundo das suas reuniões pelo visual, não no improviso",
      "Sugestões de iluminação de tarefa, fundamental para quem fica horas em frente à tela",
      "Organização de cabos, monitor e prateleiras pensada para foto e para uso real",
      "Funciona com qualquer canto, do escritório dedicado ao canto da sala compartilhada",
      "Lista de compras separando o essencial (cadeira, luz) do que pode esperar",
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
      "Veja seu banheiro decorado com IA. Envie uma foto e receba uma inspiração visual com revestimentos, espelhos, metais, décor e lista de compras estimada.",
    h1: "Veja seu *banheiro* decorado com IA",
    promise:
      "Envie uma foto do banheiro como ele está hoje e veja ideias para deixá-lo mais bonito e prático. Iluminação, espelhos, metais, paleta e organização. Visual leve, com sensação de hotel ou spa quando combina, sem prometer reforma garantida nem render técnico.",
    cta: "Ver meu banheiro decorado",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "banheiro",
    benefits: [
      "Sensação de limpeza e bem-estar em cada detalhe",
      "Iluminação, espelhos e metais coordenados na mesma proposta",
      "Visual leve, com ar de hotel ou spa quando combina com o espaço",
      "Ideias para deixar mais bonito sem reforma completa estrutural",
      "Soluções para banheiro pequeno, sem perder funcionalidade",
      "Compare visual minimalista, natural, contemporâneo ou luxo discreto",
      "Sugestões de paleta, do branco clean ao escuro premium",
      "Lista de compras com faixa de preço, do espelho à toalha",
    ],
    steps: [
      {
        t: "Envie uma foto do banheiro",
        d: "Use a foto que você já tem, do celular ou do computador. Iluminação natural ajuda.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Minimalista, natural, contemporâneo, japandi ou luxo discreto. Veja o que combina com o espaço.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba a inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um banheiro simples ganhando ar mais leve",
    visualDescription:
      "Exemplo de transformação visual de um banheiro a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Preciso de obra para usar o resultado?",
        a: "Não. Muitos itens da inspiração (espelhos, metais, décor, iluminação, papel de parede impermeável, tapete) podem ser aplicados sem obra grande estrutural.",
      },
      {
        q: "É um projeto técnico de reforma?",
        a: "Não. É uma inspiração visual gerada por IA, não um projeto executivo nem orçamento de reforma. Serve como referência para conversar com profissionais.",
      },
      {
        q: "Funciona com banheiro pequeno?",
        a: "Sim. A IA adapta a proposta ao tamanho real. Banheiros compactos ganham muito com escolhas certas de luz, espelho amplo e revestimento visível.",
      },
      {
        q: "Mostra com chuveiro e box no lugar?",
        a: "Sim. A IA preserva a estrutura visível da foto (vaso, pia, box) e propõe acabamentos, espelhos, metais e décor sobre essa base.",
      },
      {
        q: "Funciona para banheiro de aluguel?",
        a: "Sim. As sugestões priorizam itens removíveis: espelho, luminária, tapete, organizadores, papel de parede impermeável. Você consegue aplicar muita coisa sem obra.",
      },
      {
        q: "Posso usar como referência para conversar com a reforma?",
        a: "Sim. A imagem antes e depois ajuda a comunicar a estética. O profissional da reforma usa como referência para o projeto técnico real.",
      },
      {
        q: "A IA sugere revestimento de parede e piso?",
        a: "Sim. A composição costuma incluir sugestão de paleta, textura e cor de revestimento visível. Valide sempre com loja antes de comprar.",
      },
      {
        q: "Quanto custa para gerar a primeira?",
        a: "Você tem 3 gerações grátis por mês no plano gratuito. Sem cartão de crédito para começar.",
      },
    ],
    finalCta: "Criar uma inspiração para meu banheiro",
    relatedLinks: [
      { label: "Cozinha", to: "/ambientes/cozinha" },
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Natural", to: "/estilos/natural" },
    ],
    whyChoose: [
      "Visualize o banheiro renovado antes de comprar metal, espelho ou luminária",
      "Compare uma versão minimalista clara e outra mais premium escura na mesma foto",
      "Ideias para banheiro pequeno parecer maior, com escolhas certas de luz e espelho",
      "A IA preserva o que é fixo (vaso, pia, box), você decide o resto",
      "Sugestões de produtos reais e faixa de preço, ponto de partida para o orçamento",
      "Útil mesmo se a meta for só refrescar, sem reforma grande",
    ],
    images: {
      before: "empty-bathroom",
      after: "decorated-bathroom",
      gallery: ["empty-bathroom-suite", "decorated-bathroom-suite", "decorated-living"],
    },
  },
};
