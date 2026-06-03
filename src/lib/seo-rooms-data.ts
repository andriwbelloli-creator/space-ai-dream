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
export type RoomSlug =
  | "sala"
  | "quarto"
  | "cozinha"
  | "home-office"
  | "banheiro"
  | "sala-jantar"
  | "closet"
  | "varanda-gourmet"
  | "quarto-infantil"
  | "lavabo"
  | "sala-tv"
  | "quarto-bebe"
  | "home-theater"
  | "area-pet";

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
  "sala-jantar": {
    title: "Decorar Sala de Jantar com Inteligência Artificial | Ideal Space",
    description:
      "Veja sua sala de jantar decorada com IA. Envie uma foto, escolha o estilo e receba uma inspiração visual com mesa, iluminação, paleta e lista de compras.",
    h1: "Veja sua *sala de jantar* decorada com IA",
    promise:
      "Envie uma foto da sala de jantar como ela está hoje e veja como ela pode ficar mais convidativa. Teste mesas, cadeiras, iluminação central e paletas em diferentes estilos. Recebe sugestões de produtos reais para montar a sua, sem depender só de inspirações genéricas de Pinterest.",
    cta: "Ver minha sala de jantar decorada",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "sala-jantar",
    benefits: [
      "Teste mesas redondas, retangulares, ovais e proporção pra cadeiras",
      "Visualize a iluminação central (pendente, lustre) antes de comprar",
      "Compare versões em contemporâneo, mid-century, japandi e luxo discreto",
      "Funciona em sala de jantar integrada ou em ambiente dedicado",
      "Paleta e materiais coerentes com o resto da casa",
      "Lista de compras com sugestões de produtos reais e faixa de preço",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
      "Ponto de partida visual antes de gastar com móvel, mesa ou iluminação",
    ],
    steps: [
      {
        t: "Envie uma foto da sala de jantar",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Contemporâneo, mid-century, japandi, art déco, natural ou maximalista. Você decide a vibe.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Uma sala de jantar simples ganhando intenção",
    visualDescription:
      "Exemplo de transformação de uma sala de jantar a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "A imagem gerada é um projeto técnico?",
        a: "Não. É uma inspiração visual gerada por IA, não um render arquitetônico nem um projeto pronto para obra.",
      },
      {
        q: "Funciona com sala de jantar integrada à sala de estar?",
        a: "Sim. Envie a foto que mostre o espaço integrado. A IA respeita o layout real e propõe uma proposta coerente entre os dois ambientes.",
      },
      {
        q: "Posso testar mesas de tamanhos diferentes?",
        a: "Sim. Gere variações com mesa para 4, 6 ou 8 lugares. A IA propõe proporções consistentes com o ambiente.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "A lista de compras inclui iluminação central?",
        a: "Sim. Pendentes, lustres e luminárias entram na lista quando fazem parte da proposta visual.",
      },
      {
        q: "Funciona em apartamento pequeno?",
        a: "Funciona. A IA propõe mesa proporcional e iluminação que valoriza o ambiente compacto sem encher o espaço.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
      {
        q: "Posso comparar vários estilos na mesma sala de jantar?",
        a: "Sim. A mesma foto pode receber versões em diferentes estilos. Compare lado a lado e decida.",
      },
    ],
    finalCta: "Ver minha sala de jantar decorada",
    relatedLinks: [
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Cozinha", to: "/ambientes/cozinha" },
      { label: "Mid-century modern", to: "/estilos/mid-century" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Art déco", to: "/estilos/art-deco" },
      { label: "Maximalista elegante", to: "/estilos/maximalista" },
    ],
    whyChoose: [
      "Visualize a sala de jantar pronta antes de comprar mesa, cadeira ou pendente",
      "Compare uma versão sóbria contemporânea e uma mid-century na mesma foto",
      "Ideias para integrar sala de jantar à sala de estar sem brigar visualmente",
      "A IA preserva o layout real, você decide o que entra e o que sai",
      "Sugestões de produtos com faixa de preço, ponto de partida pro orçamento",
      "Útil mesmo se a meta for só renovar (mesa nova, pendente novo)",
    ],
    images: {
      before: "empty-living",
      after: "decorated-dining",
      gallery: ["decorated-dining", "decorated-living-warm", "gallery-loft"],
    },
  },
  closet: {
    title: "Decorar Closet com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu closet decorado com IA. Envie uma foto, escolha o estilo e receba uma inspiração visual com organização, iluminação e lista de compras estimada.",
    h1: "Veja seu *closet* decorado com IA",
    promise:
      "Envie uma foto do closet como ele está hoje e veja como ele pode ficar mais funcional e bonito. Teste organização modular, iluminação, espelho e acabamentos em diferentes estilos. Recebe sugestões de produtos reais para começar a montar o seu, sem virar showroom frio.",
    cta: "Ver meu closet decorado",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "closet",
    benefits: [
      "Visualize organização modular antes de comprar prateleiras e cabideiros",
      "Teste iluminação direta e indireta sem instalar nada ainda",
      "Compare versões em luxo discreto, contemporâneo e minimalista",
      "Funciona em closet aberto (vestidor) ou em closet fechado",
      "Espelho, banqueta e acabamentos com critério, sem ostentação",
      "Lista de compras com sugestões reais e faixa de preço",
      "Funciona em closet de apartamento padrão, não só mansão",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
    ],
    steps: [
      {
        t: "Envie uma foto do closet",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Luxo discreto, contemporâneo, minimalista ou natural. Você decide a vibe.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um closet simples ganhando organização",
    visualDescription:
      "Exemplo de transformação de um closet a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Preciso ter um closet grande?",
        a: "Não. A IA propõe organização proporcional ao seu espaço. Funciona em closet aberto pequeno, vestidor médio ou closet grande.",
      },
      {
        q: "Funciona em closet aberto (vestidor)?",
        a: "Sim. Envie a foto do espaço como está hoje. A IA propõe organização, iluminação e acabamento coerentes com closet aberto ou fechado.",
      },
      {
        q: "A IA propõe marcenaria sob medida?",
        a: "A inspiração mostra como uma marcenaria sob medida ficaria. Você leva a referência pra um marceneiro orçar e executar, se for o caso.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "A lista inclui iluminação?",
        a: "Sim. Pendentes, plafons e fitas LED entram quando fazem parte da proposta visual.",
      },
      {
        q: "Funciona em apartamento alugado?",
        a: "Funciona. A IA pode propor versão sem obra (cabideiros móveis, prateleiras independentes) que vão com você quando sair.",
      },
      {
        q: "Posso comparar vários estilos no mesmo closet?",
        a: "Sim. A mesma foto pode receber versões em diferentes estilos. Compare lado a lado.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
    ],
    finalCta: "Ver meu closet decorado",
    relatedLinks: [
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Banheiro", to: "/ambientes/banheiro" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Natural", to: "/estilos/natural" },
    ],
    whyChoose: [
      "Visualize o closet organizado antes de comprar marcenaria ou prateleiras",
      "Compare uma versão luxo discreto e uma minimalista na mesma foto",
      "Ideias para closet pequeno parecer maior, com iluminação e espelho certos",
      "A IA respeita a estrutura real, você decide o que entra no orçamento",
      "Sugestões de produtos com faixa de preço, ponto de partida realista",
      "Útil mesmo se a meta for só refrescar, sem obra grande",
    ],
    images: {
      before: "empty-bedroom",
      after: "decorated-closet",
      gallery: ["decorated-closet", "rank-minimal-bedroom", "decorated-bathroom-suite"],
    },
  },
  "varanda-gourmet": {
    title: "Decorar Varanda Gourmet com IA | Ideal Space",
    description:
      "Veja sua varanda gourmet decorada com IA. Envie uma foto, escolha o estilo e receba uma inspiração visual com mesa, churrasqueira, plantas e lista de compras.",
    h1: "Veja sua *varanda gourmet* decorada com IA",
    promise:
      "Envie uma foto da varanda como ela está hoje e veja como ela pode virar um ambiente de receber. Teste mesa, churrasqueira, iluminação, plantas e paleta em diferentes estilos. Recebe sugestões de produtos reais para começar a montar a sua, do mais econômico ao mais sofisticado.",
    cta: "Ver minha varanda decorada",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "varanda-gourmet",
    benefits: [
      "Teste mesa, cadeiras, sofá de varanda e proporção pra receber",
      "Visualize iluminação ambiente e ponto sem instalar nada ainda",
      "Compare versões em mediterrâneo, contemporâneo, natural e boho chic",
      "Plantas como protagonistas, sem virar selva visual",
      "Funciona em varanda pequena, média ou ampla",
      "Materiais resistentes a sol e chuva quando o ambiente exige",
      "Lista de compras com sugestões reais e faixa de preço",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
    ],
    steps: [
      {
        t: "Envie uma foto da varanda",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Mediterrâneo, natural, boho chic, contemporâneo ou luxo discreto. Você decide a vibe.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Uma varanda simples virando ambiente de receber",
    visualDescription:
      "Exemplo de transformação de uma varanda gourmet a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Funciona em varanda pequena?",
        a: "Sim. A IA propõe escala proporcional: mesa compacta, plantas estratégicas, iluminação que valoriza o ambiente sem encher o espaço.",
      },
      {
        q: "A IA sugere materiais resistentes a sol e chuva?",
        a: "Sim, quando o ambiente é aberto. A lista de compras pode incluir tecidos impermeáveis, madeira tratada e plantas tolerantes ao sol.",
      },
      {
        q: "Posso ter churrasqueira na proposta?",
        a: "Sim. Você pode pedir a versão com bancada de churrasqueira. A IA propõe layout e acabamento coerentes.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "Funciona em varanda fechada com vidro?",
        a: "Funciona. A IA propõe layout, paleta e plantas adequadas ao ambiente fechado, com luz natural mas sem exposição direta.",
      },
      {
        q: "A lista inclui plantas?",
        a: "Sim, com sugestões de espécies tolerantes ao tipo de exposição (sol pleno, meia-sombra, sombra) e tamanho do vaso.",
      },
      {
        q: "Posso comparar vários estilos na mesma varanda?",
        a: "Sim. A mesma foto pode receber versões em diferentes estilos. Compare lado a lado.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
    ],
    finalCta: "Ver minha varanda gourmet decorada",
    relatedLinks: [
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Cozinha", to: "/ambientes/cozinha" },
      { label: "Mediterrâneo", to: "/estilos/mediterraneo" },
      { label: "Natural", to: "/estilos/natural" },
      { label: "Boho chic", to: "/estilos/boho-chic" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
    ],
    whyChoose: [
      "Visualize a varanda pronta antes de comprar mesa, sofá ou churrasqueira",
      "Compare uma versão mediterrânea clara e uma natural verde na mesma foto",
      "Ideias para varanda pequena virar ambiente de receber sem perder espaço",
      "A IA propõe escala proporcional, não enche o ambiente de móvel",
      "Sugestões de plantas tolerantes ao tipo de exposição da sua varanda",
      "Útil pra estimar orçamento antes de fechar com marceneiro ou loja",
    ],
    images: {
      before: "empty-living",
      after: "gallery-varanda",
      gallery: ["gallery-varanda", "decorated-dining", "gallery-loft"],
    },
  },
  "quarto-infantil": {
    title: "Decorar Quarto Infantil com IA | Ideal Space",
    description:
      "Veja o quarto infantil decorado com IA. Envie uma foto, escolha o estilo e receba uma inspiração visual com cama, organização, paleta e lista de compras.",
    h1: "Veja o *quarto infantil* decorado com IA",
    promise:
      "Envie uma foto do quarto da criança como ele está hoje e veja como ele pode ficar mais funcional e divertido sem virar quarto de tema. Teste cama, organização, paleta e acabamentos em diferentes estilos. Recebe sugestões de produtos reais para começar a montar.",
    cta: "Ver quarto infantil decorado",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "quarto-infantil",
    benefits: [
      "Teste cama, mesa de estudo, organização e paleta antes de comprar",
      "Visualize ambiente funcional pra dormir, brincar e estudar",
      "Compare versões neutras (envelhece bem) e versões mais lúdicas",
      "Materiais seguros e acabamentos resistentes ao uso de criança",
      "Funciona em quarto pequeno, compartilhado ou ambiente único",
      "Lista de compras com sugestões reais e faixa de preço",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
      "Ponto de partida visual antes de gastar com móveis infantis",
    ],
    steps: [
      {
        t: "Envie uma foto do quarto",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Natural, escandinavo, minimalista ou contemporâneo. Versão neutra que cresce com a criança.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um quarto infantil simples virando funcional",
    visualDescription:
      "Exemplo de transformação de um quarto infantil a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Vocês sugerem tema infantil (princesa, super-herói)?",
        a: "A IA prioriza propostas que envelhecem bem (paleta neutra com acentos coloridos). Tema temático específico fica por conta da decoração final que você escolher.",
      },
      {
        q: "Funciona em quarto compartilhado entre irmãos?",
        a: "Sim. A IA propõe organização e mobiliário pra quarto compartilhado, com camas paralelas ou beliche e zonas individuais.",
      },
      {
        q: "Os móveis sugeridos são seguros pra criança?",
        a: "A lista organiza sugestões. Você confirma critérios de segurança (cantos arredondados, materiais sem componente tóxico) na loja antes de comprar.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "Posso pedir versão pra bebê?",
        a: "Sim. A IA propõe layout com berço, trocador, poltrona de amamentação e organização proporcional ao quarto.",
      },
      {
        q: "Funciona pra quarto de adolescente?",
        a: "Funciona. Versão mais sóbria com mesa de estudo grande, paleta neutra e zona de descanso clara.",
      },
      {
        q: "Posso comparar vários estilos no mesmo quarto?",
        a: "Sim. A mesma foto pode receber versões em diferentes estilos. Compare lado a lado.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
    ],
    finalCta: "Ver o quarto infantil decorado",
    relatedLinks: [
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Home office", to: "/ambientes/home-office" },
      { label: "Natural", to: "/estilos/natural" },
      { label: "Minimalista", to: "/estilos/minimalista" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Boho chic", to: "/estilos/boho-chic" },
    ],
    whyChoose: [
      "Visualize o quarto pronto antes de comprar cama, mesa ou organização",
      "Compare uma versão neutra (cresce com a criança) e uma lúdica na mesma foto",
      "Ideias pra quarto compartilhado funcionar sem brigar visualmente",
      "A IA propõe escala proporcional ao tamanho real do ambiente",
      "Sugestões de produtos com faixa de preço, ponto de partida realista",
      "Útil mesmo se a meta for só refrescar, sem reforma grande",
    ],
    images: {
      before: "empty-quarto-infantil",
      after: "decorated-quarto-infantil",
      gallery: ["decorated-quarto-infantil", "rank-minimal-bedroom", "decorated-living-warm"],
    },
  },
  lavabo: {
    title: "Decorar Lavabo com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu lavabo decorado com IA. Envie uma foto, escolha o estilo e receba uma inspiração visual com cuba, espelho, papel de parede e lista de compras.",
    h1: "Veja seu *lavabo* decorado com IA",
    promise:
      "Envie uma foto do lavabo como ele está hoje e veja como ele pode virar o ambiente mais impactante da casa. Lavabo aceita ousadia que outros banheiros não aceitam. Teste papel de parede, cuba esculpida, espelho ornamental e iluminação dramática em diferentes estilos.",
    cta: "Ver meu lavabo decorado",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "lavabo",
    benefits: [
      "Lavabo aceita ousadia: papel de parede, cor densa e materiais nobres",
      "Teste cubas esculpidas, espelhos ornamentais e iluminação dramática",
      "Compare versões em art déco, luxo discreto, contemporâneo e maximalista",
      "Funciona em lavabo pequeno (uso curto, impacto alto)",
      "Materiais nobres em escala compacta: dá efeito sem custar fortuna",
      "Lista de compras com sugestões reais e faixa de preço",
      "Visualiza papel de parede antes de aplicar (não tem volta fácil)",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
    ],
    steps: [
      {
        t: "Envie uma foto do lavabo",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Art déco, luxo discreto, contemporâneo ou maximalista. Lavabo aceita o ousado.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um lavabo simples virando o ambiente mais impactante",
    visualDescription:
      "Exemplo de transformação de um lavabo a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Lavabo pequeno aceita papel de parede escuro?",
        a: "Sim. Em lavabo (uso curto, impacto alto), papel de parede ousado funciona muito bem. A IA propõe versões pra você comparar.",
      },
      {
        q: "Materiais nobres não ficam caros?",
        a: "Em lavabo, a escala compacta ajuda: pouca cuba, pouco mármore, pouco papel de parede. Dá pra ter efeito premium com investimento menor que em outros ambientes.",
      },
      {
        q: "Funciona em lavabo de apartamento padrão?",
        a: "Funciona muito bem. A IA respeita a estrutura real e propõe acabamentos viáveis pro tamanho do seu lavabo.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "A IA propõe troca de cuba e bancada?",
        a: "Sim. A inspiração pode mostrar cuba esculpida, bancada de mármore ou alternativas. Você decide o que entra no orçamento.",
      },
      {
        q: "Funciona com lavabo aberto pra sala?",
        a: "Sim. A IA propõe acabamento coerente com a área social aberta, sem brigar com o restante da casa.",
      },
      {
        q: "Posso comparar estilos diferentes no mesmo lavabo?",
        a: "Sim. A mesma foto pode receber art déco, luxo discreto e contemporâneo. Compare lado a lado.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
    ],
    finalCta: "Ver meu lavabo decorado",
    relatedLinks: [
      { label: "Banheiro", to: "/ambientes/banheiro" },
      { label: "Art déco", to: "/estilos/art-deco" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
      { label: "Maximalista elegante", to: "/estilos/maximalista" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Sala", to: "/ambientes/sala" },
    ],
    whyChoose: [
      "Lavabo é o ambiente que mais permite ousadia, com risco baixo de errar",
      "Compare versão art déco densa e contemporânea sóbria na mesma foto",
      "Visualize papel de parede antes de aplicar (decisão difícil de reverter)",
      "A IA respeita a estrutura real (cuba, vaso, espelho), você decide o resto",
      "Sugestões de produtos com faixa de preço, ponto de partida realista",
      "Investimento concentrado em escala compacta: efeito alto, custo controlado",
    ],
    images: {
      before: "empty-bathroom",
      after: "decorated-lavabo",
      gallery: ["decorated-lavabo", "decorated-bathroom-suite", "style-luxo"],
    },
  },
  "sala-tv": {
    title: "Decorar Sala de TV com Inteligência Artificial | Ideal Space",
    description:
      "Veja sua sala de TV decorada com IA. Envie uma foto, escolha o estilo e receba uma inspiração visual com sofá, painel de TV, iluminação e lista de compras.",
    h1: "Veja sua *sala de TV* decorada com IA",
    promise:
      "Envie uma foto da sala de TV como ela está hoje e veja como ela pode virar um ambiente confortável e bonito ao mesmo tempo. Teste sofá, painel de TV, iluminação indireta e paleta em diferentes estilos. Recebe sugestões de produtos reais pra começar.",
    cta: "Ver minha sala de TV decorada",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "sala-tv",
    benefits: [
      "Teste sofá, poltrona reclinável, puff e proporção pra assistir TV",
      "Visualize painel de TV, prateleiras e iluminação indireta antes de comprar",
      "Compare versões em contemporâneo, mid-century, industrial e luxo discreto",
      "Funciona em sala dedicada, integrada ou ambiente pequeno",
      "Acústica e iluminação pensadas pra reduzir reflexo na TV",
      "Lista de compras com sugestões reais e faixa de preço",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
      "Ponto de partida antes de gastar com sofá, painel ou home theater",
    ],
    steps: [
      {
        t: "Envie uma foto da sala de TV",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Contemporâneo, mid-century, industrial, luxo discreto ou natural. Você decide a vibe.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Uma sala de TV simples ganhando conforto",
    visualDescription:
      "Exemplo de transformação de uma sala de TV a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "A IA leva em conta o reflexo na TV?",
        a: "A inspiração visual prioriza iluminação indireta e painel atrás da TV pra reduzir reflexo. Você confirma na execução final.",
      },
      {
        q: "Funciona em sala de TV integrada à sala de estar?",
        a: "Sim. A IA propõe layout coerente entre as duas zonas, mantendo a TV como ponto focal sem brigar com o restante.",
      },
      {
        q: "Posso testar painel de TV de tamanhos diferentes?",
        a: "Sim. Você pode pedir variações. A IA propõe proporções consistentes com o tamanho real do ambiente.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "A lista inclui sofá reclinável e poltrona?",
        a: "Sim, quando fazem parte da proposta visual. Você pode pedir versão minimal (só sofá) ou versão home theater (sofá + poltrona + puff).",
      },
      {
        q: "Funciona em apartamento pequeno?",
        a: "Funciona. A IA propõe escala proporcional: sofá compacto, painel slim, iluminação que valoriza o ambiente sem encher.",
      },
      {
        q: "Posso comparar vários estilos na mesma sala?",
        a: "Sim. A mesma foto pode receber versões em diferentes estilos. Compare lado a lado.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
    ],
    finalCta: "Ver minha sala de TV decorada",
    relatedLinks: [
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Home office", to: "/ambientes/home-office" },
      { label: "Mid-century modern", to: "/estilos/mid-century" },
      { label: "Industrial", to: "/estilos/industrial" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
    ],
    whyChoose: [
      "Visualize a sala de TV pronta antes de comprar sofá, painel ou TV nova",
      "Compare uma versão mid-century quente e uma industrial fria na mesma foto",
      "Ideias para sala de TV compacta funcionar sem virar puxado de quarto",
      "A IA respeita a estrutura real, você decide o que entra no orçamento",
      "Sugestões de produtos com faixa de preço, ponto de partida realista",
      "Útil mesmo se a meta for só renovar (sofá novo, painel novo)",
    ],
    images: {
      before: "empty-living",
      after: "decorated-sala-tv",
      gallery: ["decorated-sala-tv", "decorated-living-warm", "gallery-loft"],
    },
  },
  "quarto-bebe": {
    title: "Decorar Quarto de Bebê com Inteligência Artificial | Ideal Space",
    description:
      "Veja o quarto do bebê decorado com IA. Envie uma foto, escolha o estilo e receba inspiração visual com berço, paleta calma, organização e lista de compras.",
    h1: "Veja o *quarto do bebê* decorado com IA",
    promise:
      "Envie uma foto do quarto como ele está hoje e veja como ele pode receber o bebê com segurança, paleta calma e organização funcional. Teste berço, cômoda, poltrona de amamentação e iluminação suave em diferentes estilos. Você recebe sugestões de produtos reais pra começar.",
    cta: "Ver o quarto do bebê decorado",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "quarto-bebe",
    benefits: [
      "Teste berço, cômoda trocador, poltrona de amamentação e tapete",
      "Visualize paleta calma e iluminação suave antes de comprar",
      "Compare versões em escandinavo, neutro contemporâneo, candy color e boho",
      "Funciona em quarto dedicado ou compartilhado com o casal",
      "Organização de roupas, fraldas e brinquedos pensada pra rotina",
      "Lista de compras com sugestões reais e faixa de preço",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
      "Ideias pra durar além dos primeiros meses, sem refazer tudo aos 2 anos",
    ],
    steps: [
      {
        t: "Envie uma foto do quarto",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Escandinavo, neutro contemporâneo, candy color ou boho. Você decide a vibe.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um quarto comum virando o quarto do bebê",
    visualDescription:
      "Exemplo de transformação a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "A IA sugere móveis seguros pro bebê?",
        a: "A inspiração prioriza berço com espaçamento adequado entre ripas, cantos arredondados e ausência de quinas vivas próximas. Você confirma medidas e selo Inmetro na compra final.",
      },
      {
        q: "Funciona em quarto pequeno ou compartilhado com o casal?",
        a: "Sim. A IA propõe escala proporcional e zoneamento, mantendo área de circulação e separação visual entre cama de casal e berço.",
      },
      {
        q: "Posso pedir paleta neutra ou colorida?",
        a: "Sim. Você define se prefere off-white e madeira clara, candy color suave ou contraste com parede escura.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "A lista inclui poltrona de amamentação?",
        a: "Sim, quando faz parte da proposta visual. Você pode pedir versão minimal (só berço e cômoda) ou versão completa.",
      },
      {
        q: "Serve pra quarto que vai durar até a criança crescer?",
        a: "Sim. Você pode pedir versão que evolui pra quarto infantil sem refazer tudo aos 2 anos, trocando berço por mini-cama no mesmo layout.",
      },
      {
        q: "Posso comparar vários estilos no mesmo quarto?",
        a: "Sim. A mesma foto pode receber versões em diferentes estilos. Compare lado a lado.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
    ],
    finalCta: "Ver o quarto do bebê decorado",
    relatedLinks: [
      { label: "Quarto infantil", to: "/ambientes/quarto-infantil" },
      { label: "Quarto", to: "/ambientes/quarto" },
      { label: "Closet", to: "/ambientes/closet" },
      { label: "Escandinavo", to: "/estilos/escandinavo" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
      { label: "Natural", to: "/estilos/natural" },
    ],
    whyChoose: [
      "Visualize o quarto pronto antes de comprar berço, cômoda ou poltrona",
      "Compare uma versão neutra calma e uma candy color suave na mesma foto",
      "Ideias pra quarto compartilhado com o casal funcionar nos primeiros meses",
      "A IA respeita a estrutura real, você decide o que entra no orçamento",
      "Sugestões de produtos com faixa de preço, ponto de partida realista",
      "Útil mesmo se a meta for só renovar (trocar berço, repintar parede)",
    ],
    images: {
      before: "empty-bedroom",
      after: "decorated-quarto-bebe",
      gallery: ["decorated-quarto-bebe", "decorated-quarto-infantil", "decorated-bedroom"],
    },
  },
  "home-theater": {
    title: "Decorar Home Theater com Inteligência Artificial | Ideal Space",
    description:
      "Veja seu home theater decorado com IA. Envie uma foto, escolha o estilo e receba inspiração visual com poltronas, acústica, blackout e lista de compras.",
    h1: "Veja seu *home theater* decorado com IA",
    promise:
      "Envie uma foto do espaço como ele está hoje e veja como ele pode virar uma experiência de cinema em casa. Teste poltronas reclináveis, painel acústico, iluminação cênica e blackout em diferentes estilos. Você recebe sugestões de produtos reais pra começar.",
    cta: "Ver meu home theater decorado",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "home-theater",
    benefits: [
      "Teste poltronas reclináveis, sofá retrátil e disposição em fileira",
      "Visualize painel acústico, blackout e iluminação cênica antes de comprar",
      "Compare versões em contemporâneo escuro, industrial, mid-century e luxo discreto",
      "Funciona em sala dedicada, sótão, edícula ou ambiente integrado",
      "Acústica, posição da tela e ângulo de visão pensados pra reduzir cansaço",
      "Lista de compras com sugestões reais e faixa de preço",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
      "Ponto de partida realista antes de gastar com projetor, tela ou poltrona",
    ],
    steps: [
      {
        t: "Envie uma foto do espaço",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Contemporâneo escuro, industrial, mid-century ou luxo discreto. Você decide a vibe.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um cômodo comum virando home theater",
    visualDescription:
      "Exemplo de transformação a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "A IA leva em conta a acústica do ambiente?",
        a: "A inspiração prioriza painel ripado, cortina pesada e tapete pra reduzir reverberação. Tratamento acústico técnico segue projeto especializado na execução final.",
      },
      {
        q: "Funciona em sala que não é totalmente escura?",
        a: "Sim. A IA propõe blackout sob medida, cortina dupla e paleta escura nas paredes pra controlar reflexo na tela.",
      },
      {
        q: "Posso comparar projetor e TV grande?",
        a: "Sim. Você pode pedir versão com tela de projeção ou painel com TV de grande polegada. A IA propõe proporções coerentes com o ambiente.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "A lista inclui poltronas reclináveis?",
        a: "Sim, quando fazem parte da proposta visual. Você pode pedir versão econômica (sofá retrátil) ou versão premium (poltronas individuais em fileira).",
      },
      {
        q: "Funciona em sótão ou edícula?",
        a: "Funciona. A IA respeita pé-direito, formato em L ou inclinação do telhado, propondo layout que aproveita o espaço real.",
      },
      {
        q: "Posso comparar vários estilos no mesmo cômodo?",
        a: "Sim. A mesma foto pode receber versões em diferentes estilos. Compare lado a lado.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
    ],
    finalCta: "Ver meu home theater decorado",
    relatedLinks: [
      { label: "Sala de TV", to: "/ambientes/sala-tv" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Mid-century modern", to: "/estilos/mid-century" },
      { label: "Industrial", to: "/estilos/industrial" },
      { label: "Luxo discreto", to: "/estilos/luxo" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
    ],
    whyChoose: [
      "Visualize o home theater pronto antes de comprar poltronas, tela ou projetor",
      "Compare uma versão contemporânea escura e uma mid-century quente na mesma foto",
      "Ideias pra sótão, edícula ou ambiente compacto funcionar como cinema",
      "A IA respeita a estrutura real, você decide o que entra no orçamento",
      "Sugestões de produtos com faixa de preço, ponto de partida realista",
      "Útil mesmo se a meta for só renovar (poltrona nova, blackout, pintura)",
    ],
    images: {
      before: "empty-living",
      after: "decorated-home-theater",
      gallery: ["decorated-home-theater", "decorated-sala-tv", "decorated-living-warm"],
    },
  },
  "area-pet": {
    title: "Decorar Área Pet com Inteligência Artificial | Ideal Space",
    description:
      "Veja a área pet decorada com IA. Envie uma foto, escolha o estilo e receba inspiração visual com nicho, piso lavável, organização e lista de compras.",
    h1: "Veja a *área pet* decorada com IA",
    promise:
      "Envie uma foto do espaço como ele está hoje e veja como ele pode virar uma área pet funcional e bonita. Teste nicho de marcenaria, piso lavável, prateleiras pra utensílios e bebedouro de água corrente em diferentes estilos. Você recebe sugestões de produtos reais pra começar.",
    cta: "Ver minha área pet decorada",
    trustText: "Em poucos passos, a partir de uma foto comum.",
    defaultRoomType: "area-pet",
    benefits: [
      "Teste nicho com cama, comedouro elevado e bebedouro automático",
      "Visualize piso porcelanato lavável e parede com revestimento resistente",
      "Compare versões em escandinavo, contemporâneo, natural e industrial",
      "Funciona em área de serviço integrada, varanda, hall ou canto da sala",
      "Organização vertical pra ração, brinquedos, coleiras e utensílios",
      "Lista de compras com sugestões reais e faixa de preço",
      "Privacidade: suas fotos não são publicadas sem sua autorização",
      "Ideias pra cães, gatos ou multipet sem virar canil",
    ],
    steps: [
      {
        t: "Envie uma foto do espaço",
        d: "Use a foto que você já tem, do celular ou do computador. Quanto mais clara, melhor.",
      },
      {
        t: "Escolha um estilo de decoração",
        d: "Escandinavo, contemporâneo, natural ou industrial. Você decide a vibe.",
      },
      {
        t: "Veja antes/depois e lista de compras",
        d: "Receba uma inspiração visual com sugestões de produtos e faixa de preço estimada.",
      },
    ],
    visualTitle: "Um canto comum virando área pet integrada",
    visualDescription:
      "Exemplo de transformação a partir de uma foto comum. Arraste para comparar antes e depois.",
    faq: [
      {
        q: "Serve pra cão de porte grande?",
        a: "Sim. Você define o porte do pet e a IA propõe nicho, cama e altura de comedouro proporcionais. Confirme medidas reais na execução.",
      },
      {
        q: "Funciona pra gato com prateleiras altas?",
        a: "Sim. A IA propõe circuito vertical com prateleiras, arranhador integrado à marcenaria e nicho protegido em ponto alto.",
      },
      {
        q: "Posso integrar a área pet à área de serviço?",
        a: "Sim. A IA mantém coerência visual entre as duas zonas, separando funcionalmente sem brigar com a marcenaria existente.",
      },
      {
        q: "Posso usar uma foto do celular?",
        a: "Sim. Foto comum do celular já serve, desde que o ambiente esteja visível e iluminado.",
      },
      {
        q: "A lista inclui bebedouro automático e comedouro elevado?",
        a: "Sim, quando fazem parte da proposta visual. Você pode pedir versão minimal (cama e comedouro) ou completa.",
      },
      {
        q: "Funciona em apartamento sem área externa?",
        a: "Funciona. A IA propõe canto integrado à sala, varanda ou hall, usando marcenaria sob medida pra não virar canto solto.",
      },
      {
        q: "Posso comparar vários estilos no mesmo espaço?",
        a: "Sim. A mesma foto pode receber versões em diferentes estilos. Compare lado a lado.",
      },
      {
        q: "Quanto custa para experimentar?",
        a: "3 gerações grátis por mês no plano gratuito. Sem cartão de crédito.",
      },
    ],
    finalCta: "Ver minha área pet decorada",
    relatedLinks: [
      { label: "Varanda gourmet", to: "/ambientes/varanda-gourmet" },
      { label: "Sala", to: "/ambientes/sala" },
      { label: "Closet", to: "/ambientes/closet" },
      { label: "Escandinavo", to: "/estilos/escandinavo" },
      { label: "Natural", to: "/estilos/natural" },
      { label: "Contemporâneo", to: "/estilos/contemporaneo" },
    ],
    whyChoose: [
      "Visualize a área pet pronta antes de comprar nicho, cama ou comedouro",
      "Compare uma versão escandinava e uma natural na mesma foto",
      "Ideias pra apartamento sem área externa funcionar pro pet sem virar canil",
      "A IA respeita a estrutura real, você decide o que entra no orçamento",
      "Sugestões de produtos com faixa de preço, ponto de partida realista",
      "Útil mesmo se a meta for só renovar (trocar cama, organizar utensílios)",
    ],
    images: {
      before: "empty-lavanderia",
      after: "decorated-area-pet",
      gallery: ["decorated-area-pet", "decorated-lavanderia", "decorated-closet"],
    },
  },
};
