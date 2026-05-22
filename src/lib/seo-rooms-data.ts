/**
 * Dados de SEO e copy comercial das landing pages de ambientes.
 *
 * Fonte única de verdade para as rotas `/ambientes/$roomSlug`. Cada cômodo tem
 * título e meta description otimizados para busca, um H1 com destaque em
 * markdown (`*trecho*`) e argumentos de venda específicos do ambiente.
 */

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
  },
};
