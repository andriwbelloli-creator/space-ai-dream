/**
 * Dados de SEO e copy comercial das landing pages de ambientes.
 *
 * Fonte única de verdade para as rotas `/ambientes/$roomSlug`. Cada cômodo tem
 * título e meta description otimizados para busca, um H1 com destaque em
 * markdown (`*trecho*`) e argumentos de venda específicos do ambiente.
 */

import type { LandingBenefit, LandingFaq, LandingImages } from "./seo-landing-shared";

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
  /** Texto comercial do botão de conversão. */
  cta: string;
  /** Cômodo pré-selecionado no formulário de leads. */
  defaultRoomType: RoomSlug;
  /** 4 bullets curtos de valor — exibidos abaixo do hero. */
  benefits: LandingBenefit[];
  /** 4 Q&A exibidos na secao de FAQ no fim da landing. */
  faq: LandingFaq[];
  /** Refs a imagens existentes (chaves no LANDING_IMAGES). */
  images: LandingImages;
}

/** Mapa estático de cada cômodo conhecido para o seu conteúdo de SEO. */
export const SEO_ROOMS: Record<RoomSlug, RoomSeoData> = {
  sala: {
    title: "Decorar Sala com Inteligência Artificial - Ideal Space",
    description:
      "Transforme a decoração da sua sala em segundos com IA. Envie uma foto, escolha o estilo e veja o antes e depois com móveis, cores e iluminação sob medida.",
    h1: "Simule a *Decoração da sua Sala* com IA",
    promise:
      "A sala é o cartão de visita da casa — e também o cômodo mais difícil de imaginar pronto antes da reforma. Com o Ideal Space, basta enviar uma foto do ambiente como ele está hoje: em segundos a inteligência artificial preserva paredes, janelas e a perspectiva real e devolve uma sala completa, com sofá, iluminação, tapete e decoração que combinam de verdade. Teste estilos minimalista, japandi, contemporâneo ou industrial sem gastar um centavo em móveis, compare as variações lado a lado e receba uma lista de compras com faixas de preço para tirar o projeto do papel com segurança.",
    cta: "Personalizar Minha Sala",
    defaultRoomType: "sala",
    benefits: [
      "Espaço social mais visível da casa — primeira impressão garantida",
      "Sofá, iluminação, tapete e décor em composição harmônica",
      "Teste de múltiplos estilos antes de gastar com móveis",
      "Lista de compras com faixas de preço para executar com clareza",
    ],
    faq: [
      {
        q: "Funciona com sala integrada à cozinha ou jantar?",
        a: "Sim. Envie a foto que mostre o espaço que você quer transformar. A IA preserva o layout real, incluindo integração com outros ambientes.",
      },
      {
        q: "Posso testar diferentes estilos na mesma sala?",
        a: "Sim. Gere versões em Japandi, contemporâneo, industrial — todas com a mesma estrutura, para você comparar lado a lado.",
      },
      {
        q: "A IA inventa móveis que não existem?",
        a: "As sugestões são baseadas em mobiliário real encontrado em marketplaces brasileiros. A lista de compras vem com faixas de preço estimadas.",
      },
      {
        q: "Preciso refazer a iluminação?",
        a: "Não necessariamente. A IA propõe um cenário completo, mas você escolhe o que de fato vai renovar — desde só a paleta até a sala inteira.",
      },
    ],
    images: {
      before: "empty-living",
      after: "decorated-living",
      gallery: ["decorated-living-warm", "gallery-loft", "gallery-varanda"],
    },
  },
  quarto: {
    title: "Decorar Quarto com Inteligência Artificial - Ideal Space",
    description:
      "Veja o quarto dos seus sonhos antes de gastar. Envie uma foto e a IA do Ideal Space cria um ambiente aconchegante com cama, iluminação e decoração em segundos.",
    h1: "Projete o *Quarto dos seus Sonhos* com IA",
    promise:
      "O quarto precisa equilibrar descanso, estilo e funcionalidade — e visualizar essa combinação só na imaginação é quase impossível. O Ideal Space resolve isso: envie uma foto do seu quarto e a inteligência artificial entrega um ambiente decorado de verdade, com cabeceira, criados-mudo, iluminação suave, têxteis e a paleta de cores ideal para uma noite de sono melhor. Experimente diferentes estilos, do escandinavo clean ao aconchego do japandi, ajuste os detalhes e leve para o seu projeto uma referência clara — sem o risco de comprar móveis que não conversam entre si.",
    cta: "Personalizar Meu Quarto",
    defaultRoomType: "quarto",
    benefits: [
      "Combinação ideal entre conforto, organização e personalidade",
      "Iluminação adequada para a noite e a manhã",
      "Cabeceira, criados-mudo, têxteis e décor em harmonia",
      "Funciona em quartos pequenos sem comprometer espaço",
    ],
    faq: [
      {
        q: "Combina com quarto de casal e solteiro?",
        a: "Sim. Envie a foto do quarto e a IA adapta o resultado ao tamanho e função real do ambiente — cama de casal, solteiro ou box.",
      },
      {
        q: "Posso testar estilos diferentes no mesmo quarto?",
        a: "Sim. Gere versões em escandinavo, Japandi, natural — compare e refine antes de gastar com móveis ou roupas de cama.",
      },
      {
        q: "Quarto pequeno funciona?",
        a: "Sim. A IA propõe móveis e layout que aproveitam cada metro disponível, mesmo em quartos compactos.",
      },
      {
        q: "A IA mostra com a cama arrumada?",
        a: "Sim. Sempre arrumada e estilizada para servir como referência visual clara, fácil de reproduzir.",
      },
    ],
    images: {
      before: "empty-bedroom",
      after: "decorated-bedroom",
      gallery: ["rank-minimal-bedroom", "gallery-loft", "decorated-living-warm"],
    },
  },
  cozinha: {
    title: "Decorar Cozinha com Inteligência Artificial - Ideal Space",
    description:
      "Planeje a reforma da sua cozinha com IA. Envie uma foto e veja armários, bancadas, revestimentos e iluminação em segundos, antes de contratar a obra.",
    h1: "Reimagine a sua *Cozinha* com IA",
    promise:
      "A cozinha é o cômodo mais caro para reformar e o mais arriscado para errar: armários, bancada e revestimentos definem o orçamento inteiro. Com o Ideal Space, você visualiza o resultado antes de contratar qualquer obra — envie uma foto da cozinha atual e a inteligência artificial mantém o layout real e propõe marcenaria, bancadas, iluminação e acabamentos harmônicos em segundos. Compare versões claras e amadeiradas, teste estilos do moderno ao clássico e use a lista de compras com faixas de preço para conversar com marceneiro e fornecedores com total segurança.",
    cta: "Personalizar Minha Cozinha",
    defaultRoomType: "cozinha",
    benefits: [
      "Marcenaria, bancada e revestimentos visualizados antes da obra",
      "Compare versões claras e amadeiradas no mesmo layout",
      "Iluminação técnica e decorativa em conjunto",
      "Lista de compras com faixas de preço para conversar com marceneiro",
    ],
    faq: [
      {
        q: "Funciona com cozinha americana?",
        a: "Sim. Envie a foto que cubra a área que você quer transformar — corredor, ilha ou integrada com sala. A IA preserva o layout real.",
      },
      {
        q: "A IA preserva a posição do fogão e da geladeira?",
        a: "Sim. Hidráulica e elétrica não mudam. A IA respeita o layout existente e propõe armários, bancadas e acabamentos sobre essa base.",
      },
      {
        q: "Posso testar com bancada de mármore vs. madeira?",
        a: "Sim. Gere versões diferentes e compare lado a lado antes de decidir o material da bancada.",
      },
      {
        q: "A lista de compras inclui marcenaria?",
        a: "A marcenaria é sob medida — não está na lista de produtos. Mas revestimentos, eletrodomésticos, iluminação e décor sim.",
      },
    ],
    images: {
      before: "empty-kitchen",
      after: "decorated-kitchen",
      gallery: ["empty-kitchen-island", "decorated-kitchen-island", "decorated-dining"],
    },
  },
  "home-office": {
    title: "Decorar Home Office com Inteligência Artificial - Ideal Space",
    description:
      "Monte um home office produtivo e bonito com IA. Envie uma foto do seu espaço de trabalho e veja mobília, iluminação e organização ideais em segundos.",
    h1: "Monte o *Home Office Ideal* com IA",
    promise:
      "Um bom home office melhora o foco, a postura e a sua imagem nas chamadas de vídeo — mas montar esse espaço sem ver o resultado antes costuma terminar em compras erradas. O Ideal Space mostra o caminho: envie uma foto do seu canto de trabalho e a inteligência artificial devolve um ambiente completo, com mesa, cadeira ergonômica, iluminação adequada, apoio de tela e organização inteligente, aproveitando cada metro disponível. Teste estilos do minimalista ao natural, ajuste a paleta para um fundo profissional e receba uma lista de compras com preços para investir só no que faz diferença.",
    cta: "Personalizar Meu Home Office",
    defaultRoomType: "home-office",
    benefits: [
      "Mesa, cadeira ergonômica e iluminação adequada em composição",
      "Fundo profissional para videochamadas e gravações",
      "Aproveitamento de cada metro disponível, mesmo em apartamentos pequenos",
      "Organização inteligente — fios, prateleiras, apoio de tela",
    ],
    faq: [
      {
        q: "Funciona em canto de sala ou quarto?",
        a: "Sim. Envie a foto do espaço que você usa — o resultado considera o ambiente real, não um escritório fictício.",
      },
      {
        q: "A IA sugere uma marca específica de cadeira?",
        a: "A lista de compras sugere categorias e faixas de preço. A escolha final da marca é sua, com flexibilidade para o seu orçamento.",
      },
      {
        q: "Tem fundo bom para videochamadas?",
        a: "Sim. A IA propõe paletas e composições que funcionam bem em câmera, com luz e contraste adequados para reuniões e gravações.",
      },
      {
        q: "Posso ver versões com 1 ou 2 monitores?",
        a: "Sim. Você pode pedir variações na geração, ajustando o número de telas e a organização da mesa.",
      },
    ],
    images: {
      before: "empty-office",
      after: "gallery-office",
      gallery: ["moodboard-pro", "decorated-living", "rank-minimal-bedroom"],
    },
  },
  banheiro: {
    title: "Decorar Banheiro com Inteligência Artificial - Ideal Space",
    description:
      "Reforme o banheiro com a ajuda da IA. Envie uma foto e veja revestimentos, louças, iluminação e décor em segundos, antes de gastar com a obra.",
    h1: "Renove o seu *Banheiro* com IA",
    promise:
      "Reformar o banheiro envolve decisões caras e definitivas — revestimentos, louças, bancada e iluminação — e qualquer engano custa caro para desfazer. O Ideal Space dá a você uma prévia realista: envie uma foto do banheiro como ele está e a inteligência artificial preserva a estrutura e propõe porcelanatos, cubas, espelhos, metais e iluminação combinando em segundos. Compare um banheiro claro e amplo com versões mais sofisticadas, teste do estilo minimalista ao luxo discreto e leve para o projeto uma referência precisa, acompanhada de uma lista de compras com faixas de preço.",
    cta: "Personalizar Meu Banheiro",
    defaultRoomType: "banheiro",
    benefits: [
      "Revestimentos, louças e iluminação visualizados antes da obra",
      "Compare versões mais claras com versões mais sofisticadas",
      "Cubas, espelhos, metais e décor coordenados em conjunto",
      "Lista de compras com faixas de preço para orientar a obra",
    ],
    faq: [
      {
        q: "Funciona com banheiro pequeno?",
        a: "Sim. A IA adapta o resultado ao tamanho real. Banheiros compactos ganham muito com a escolha certa de revestimentos e luz.",
      },
      {
        q: "Mostra com chuveiro e box de vidro?",
        a: "Sim. Envie a foto do banheiro como ele está; a IA preserva a hidráulica e propõe os acabamentos visíveis, incluindo box e metais.",
      },
      {
        q: "Posso testar mármore vs. porcelanato amadeirado?",
        a: "Sim. Gere versões diferentes e compare. Cada variação vem com a sua lista de produtos correspondente.",
      },
      {
        q: "A lista tem revestimentos específicos?",
        a: "Vem com categorias e faixas de preço por item. As marcas e modelos finais você escolhe com fornecedor local, mantendo flexibilidade.",
      },
    ],
    images: {
      before: "empty-bathroom",
      after: "decorated-bathroom",
      gallery: ["empty-bathroom-suite", "decorated-bathroom-suite", "decorated-living"],
    },
  },
};
