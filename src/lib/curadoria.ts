/**
 * Curadoria editorial "O Atelier Sugere".
 *
 * Catálogo estático de 3 a 4 peças por estilo. Complementa a shopping
 * list automática com uma narrativa de curadoria: "essas peças
 * dialogam com o estilo que você acabou de gerar".
 *
 * Cada peça reaproveita `buildAffiliateLinks(searchQuery)` — zero
 * lógica nova de afiliado. `searchQuery` é o termo otimizado para
 * busca em marketplace; `name` é o rótulo editorial exibido na UI.
 *
 * Convenção de chave: usa o `id` do catálogo de estilos definido em
 * `src/components/UploadPhotoModal.tsx` (japandi, industrial, etc.).
 * Estilo não mapeado cai em `DEFAULT_CURADORIA`.
 */

export type CuratedPiece = {
  name: string;
  category: string;
  /** Frase editorial curta explicando por que a peça funciona no estilo. */
  why: string;
  /** Faixa de preço sugerida em BRL, no padrão "R$ X–Y". */
  priceRange: string;
  /** Termo passado pra buildAffiliateLinks; otimiza match no marketplace. */
  searchQuery: string;
};

const DEFAULT_CURADORIA: ReadonlyArray<CuratedPiece> = [
  {
    name: "Luminária de piso em linho",
    category: "Iluminação",
    why: "Luz quente difusa eleva qualquer ambiente sem competir com a paleta.",
    priceRange: "R$ 280–780",
    searchQuery: "luminária de piso linho bege",
  },
  {
    name: "Vaso cerâmica artesanal grande",
    category: "Decoração",
    why: "Volume escultural pra ancorar a composição com um único objeto.",
    priceRange: "R$ 140–420",
    searchQuery: "vaso cerâmica artesanal grande bege",
  },
  {
    name: "Manta tricô algodão",
    category: "Têxtil",
    why: "Camada têxtil que adiciona textura e convida ao toque.",
    priceRange: "R$ 120–340",
    searchQuery: "manta tricô algodão sofá bege",
  },
];

const CURADORIA_BY_STYLE: Record<string, ReadonlyArray<CuratedPiece>> = {
  japandi: [
    {
      name: "Banco baixo em oak",
      category: "Móveis",
      why: "Linhas retas em madeira clara reforçam o silêncio do japandi.",
      priceRange: "R$ 480–1.400",
      searchQuery: "banco baixo madeira oak escandinavo",
    },
    {
      name: "Cerâmica wabi-sabi (par)",
      category: "Decoração",
      why: "Imperfeição controlada que humaniza o minimalismo da paleta.",
      priceRange: "R$ 160–480",
      searchQuery: "vaso cerâmica wabi sabi artesanal",
    },
    {
      name: "Pendente de papel washi",
      category: "Iluminação",
      why: "Luz suave e textura orgânica, assinatura do estilo.",
      priceRange: "R$ 220–680",
      searchQuery: "pendente papel washi japonês",
    },
  ],
  "moderno-organico": [
    {
      name: "Poltrona bouclé curva",
      category: "Móveis",
      why: "Curva contínua e textura tátil traduzem a essência orgânica.",
      priceRange: "R$ 1.400–3.800",
      searchQuery: "poltrona bouclé curva off white",
    },
    {
      name: "Costela-de-adão em vaso terracota",
      category: "Biofilia",
      why: "Folhagem larga preenche o vazio com massa verde escultural.",
      priceRange: "R$ 180–520",
      searchQuery: "planta costela de adão vaso terracota grande",
    },
    {
      name: "Mesa lateral travertino",
      category: "Móveis",
      why: "Pedra natural com veios irregulares conversa com a biofilia.",
      priceRange: "R$ 690–1.900",
      searchQuery: "mesa lateral travertino pedra",
    },
  ],
  minimalista: [
    {
      name: "Sofá modular cinza claro",
      category: "Móveis",
      why: "Volume único, sem ornamentos, define o ambiente por si só.",
      priceRange: "R$ 2.200–5.800",
      searchQuery: "sofá modular cinza claro 3 lugares",
    },
    {
      name: "Arandela tubular preta",
      category: "Iluminação",
      why: "Geometria reduzida ao essencial, foco na luz e não no objeto.",
      priceRange: "R$ 180–520",
      searchQuery: "arandela tubular preta minimalista",
    },
    {
      name: "Tapete neutro low-pile",
      category: "Têxtil",
      why: "Base monocromática que amarra o ambiente sem chamar atenção.",
      priceRange: "R$ 320–980",
      searchQuery: "tapete neutro bege liso 2x3",
    },
  ],
  natural: [
    {
      name: "Pendente em fibra natural",
      category: "Iluminação",
      why: "Trançado artesanal lança sombras que aquecem o ambiente.",
      priceRange: "R$ 240–720",
      searchQuery: "pendente fibra natural rattan",
    },
    {
      name: "Mesa de centro madeira maciça",
      category: "Móveis",
      why: "Peça única em madeira bruta ancora o ambiente com presença.",
      priceRange: "R$ 780–2.400",
      searchQuery: "mesa de centro madeira maciça",
    },
    {
      name: "Cesto palha grande",
      category: "Organização",
      why: "Funcional e decorativo, soma textura sem custo visual.",
      priceRange: "R$ 90–280",
      searchQuery: "cesto palha grande decorativo",
    },
  ],
  "rustico-moderno": [
    {
      name: "Luminária industrial preto fosco",
      category: "Iluminação",
      why: "Metal escuro contrasta com madeira e reforça a dualidade.",
      priceRange: "R$ 220–620",
      searchQuery: "luminária industrial preto fosco metal",
    },
    {
      name: "Banco rústico madeira de demolição",
      category: "Móveis",
      why: "Madeira com história adiciona aconchego sem perder modernidade.",
      priceRange: "R$ 520–1.600",
      searchQuery: "banco madeira demolição rústico",
    },
    {
      name: "Vaso ferro fundido",
      category: "Decoração",
      why: "Metal envelhecido conversa com a paleta terrosa.",
      priceRange: "R$ 140–420",
      searchQuery: "vaso ferro fundido decorativo",
    },
  ],
  industrial: [
    {
      name: "Pendente Edison cobre",
      category: "Iluminação",
      why: "Filamento à mostra é a assinatura visual do industrial autêntico.",
      priceRange: "R$ 160–460",
      searchQuery: "pendente edison cobre filamento",
    },
    {
      name: "Estante metal e madeira",
      category: "Móveis",
      why: "Estrutura aparente em ferro define o vocabulário do estilo.",
      priceRange: "R$ 680–2.200",
      searchQuery: "estante metal madeira industrial",
    },
    {
      name: "Espelho redondo aro preto",
      category: "Decoração",
      why: "Geometria simples em metal escuro completa a composição.",
      priceRange: "R$ 220–680",
      searchQuery: "espelho redondo aro preto metal",
    },
  ],
  luxo: [
    {
      name: "Mesa de centro mármore",
      category: "Móveis",
      why: "Pedra nobre é o vetor mais direto pra elevar o ambiente.",
      priceRange: "R$ 1.400–4.200",
      searchQuery: "mesa de centro mármore branco",
    },
    {
      name: "Abajur cristal e latão",
      category: "Iluminação",
      why: "Materiais nobres em escala compacta sinalizam discrição.",
      priceRange: "R$ 480–1.400",
      searchQuery: "abajur cristal latão dourado",
    },
    {
      name: "Almofada veludo seda",
      category: "Têxtil",
      why: "Textura tátil e brilho contido somam camada de refinamento.",
      priceRange: "R$ 160–460",
      searchQuery: "almofada veludo seda decorativa",
    },
  ],
  classico: [
    {
      name: "Lustre cristal multibraços",
      category: "Iluminação",
      why: "Simetria e brilho são pilares da linguagem clássica.",
      priceRange: "R$ 980–3.400",
      searchQuery: "lustre cristal multibraços clássico",
    },
    {
      name: "Poltrona capitonê",
      category: "Móveis",
      why: "Acabamento capitonado evoca tradição com elegância contida.",
      priceRange: "R$ 1.200–3.600",
      searchQuery: "poltrona capitonê veludo clássica",
    },
    {
      name: "Quadro com moldura ornamental",
      category: "Arte",
      why: "Moldura trabalhada amarra a composição na parede.",
      priceRange: "R$ 240–820",
      searchQuery: "quadro moldura ornamental dourada",
    },
  ],
  "boho-chic": [
    {
      name: "Tapete kilim padronado",
      category: "Têxtil",
      why: "Padrão étnico ancora o ecletismo característico do boho.",
      priceRange: "R$ 380–1.400",
      searchQuery: "tapete kilim padronado colorido",
    },
    {
      name: "Macramê de parede grande",
      category: "Decoração",
      why: "Têxtil artesanal preenche parede com leveza e movimento.",
      priceRange: "R$ 180–540",
      searchQuery: "macramê parede grande artesanal",
    },
    {
      name: "Poltrona rattan vintage",
      category: "Móveis",
      why: "Fibra natural trançada é peça âncora obrigatória.",
      priceRange: "R$ 780–2.200",
      searchQuery: "poltrona rattan vintage trançada",
    },
  ],
  "mid-century": [
    {
      name: "Poltrona pés palito",
      category: "Móveis",
      why: "Silhueta característica dos anos 50, leve e gráfica.",
      priceRange: "R$ 1.100–3.200",
      searchQuery: "poltrona pés palito mid century",
    },
    {
      name: "Luminária arco dourada",
      category: "Iluminação",
      why: "Curva longa que se tornou ícone do design moderno.",
      priceRange: "R$ 680–1.900",
      searchQuery: "luminária arco dourada mid century",
    },
    {
      name: "Aparador madeira nogueira",
      category: "Móveis",
      why: "Madeira escura com pés cônicos resume a linguagem do estilo.",
      priceRange: "R$ 1.200–3.400",
      searchQuery: "aparador madeira nogueira pés palito",
    },
  ],
  mediterraneo: [
    {
      name: "Vaso cerâmica branca curva",
      category: "Decoração",
      why: "Branco caiado é a base visual do mediterrâneo costeiro.",
      priceRange: "R$ 120–380",
      searchQuery: "vaso cerâmica branca curvo grande",
    },
    {
      name: "Mesa lateral madeira clara",
      category: "Móveis",
      why: "Madeira solar e desgastada evoca casa de praia europeia.",
      priceRange: "R$ 380–1.100",
      searchQuery: "mesa lateral madeira clara natural",
    },
    {
      name: "Almofada linho azul cobalto",
      category: "Têxtil",
      why: "Toque de cor que remete ao mar sem saturar o ambiente.",
      priceRange: "R$ 80–280",
      searchQuery: "almofada linho azul cobalto",
    },
  ],
  "art-deco": [
    {
      name: "Espelho geométrico latão",
      category: "Decoração",
      why: "Geometria e brilho metálico são a essência do art-déco.",
      priceRange: "R$ 420–1.400",
      searchQuery: "espelho geométrico latão art deco",
    },
    {
      name: "Aparador laqueado preto e dourado",
      category: "Móveis",
      why: "Contraste preto e metal dourado define a sofisticação do estilo.",
      priceRange: "R$ 1.400–4.200",
      searchQuery: "aparador laqueado preto dourado art deco",
    },
    {
      name: "Abajur fan shape",
      category: "Iluminação",
      why: "Formato em leque, ícone visual da década de 30.",
      priceRange: "R$ 320–880",
      searchQuery: "abajur fan leque art deco",
    },
  ],
  maximalista: [
    {
      name: "Papel de parede botânico",
      category: "Decoração",
      why: "Padrão denso é a forma mais rápida de elevar o tom maximalista.",
      priceRange: "R$ 180–680",
      searchQuery: "papel de parede botânico colorido",
    },
    {
      name: "Sofá veludo verde esmeralda",
      category: "Móveis",
      why: "Cor saturada em peça grande é statement obrigatório.",
      priceRange: "R$ 2.800–6.800",
      searchQuery: "sofá veludo verde esmeralda",
    },
    {
      name: "Mix de almofadas estampadas",
      category: "Têxtil",
      why: "Camadas de padrão e cor reforçam o vocabulário do estilo.",
      priceRange: "R$ 240–680",
      searchQuery: "kit almofadas estampadas coloridas",
    },
  ],
  brutalista: [
    {
      name: "Banco concreto polido",
      category: "Móveis",
      why: "Massa monolítica em concreto resume a linguagem brutalista.",
      priceRange: "R$ 680–1.900",
      searchQuery: "banco concreto polido decorativo",
    },
    {
      name: "Luminária pendente cimento",
      category: "Iluminação",
      why: "Cimento cru como matéria-prima reforça a estética sem ornamento.",
      priceRange: "R$ 220–620",
      searchQuery: "pendente cimento cinza minimalista",
    },
    {
      name: "Vaso geométrico concreto",
      category: "Decoração",
      why: "Volume bruto em pequena escala completa a composição.",
      priceRange: "R$ 90–280",
      searchQuery: "vaso concreto geométrico cinza",
    },
  ],
  contemporaneo: [
    {
      name: "Sofá modular off white",
      category: "Móveis",
      why: "Linhas suaves em tom neutro são base do contemporâneo brasileiro.",
      priceRange: "R$ 2.400–5.800",
      searchQuery: "sofá modular off white linho",
    },
    {
      name: "Arte abstrata em grande escala",
      category: "Arte",
      why: "Pintura grande é o ponto focal que define o estilo.",
      priceRange: "R$ 380–1.400",
      searchQuery: "quadro abstrato grande contemporâneo",
    },
    {
      name: "Mesa de centro madeira e metal",
      category: "Móveis",
      why: "Mix de materiais nobres em design limpo amarra a composição.",
      priceRange: "R$ 780–2.200",
      searchQuery: "mesa de centro madeira metal preto",
    },
  ],
  transicional: [
    {
      name: "Poltrona linho cinza claro",
      category: "Móveis",
      why: "Silhueta clássica em tecido natural traduz a leveza do estilo.",
      priceRange: "R$ 1.100–2.800",
      searchQuery: "poltrona linho cinza clássica",
    },
    {
      name: "Abajur cerâmica branca",
      category: "Iluminação",
      why: "Base cerâmica neutra atravessa épocas sem datar.",
      priceRange: "R$ 280–780",
      searchQuery: "abajur cerâmica branca clássico",
    },
    {
      name: "Mesa lateral mármore e latão",
      category: "Móveis",
      why: "Materiais clássicos em escala discreta seguram a paleta neutra.",
      priceRange: "R$ 580–1.600",
      searchQuery: "mesa lateral mármore latão",
    },
  ],
};

/**
 * Retorna a curadoria editorial pro estilo informado, ou o fallback
 * neutro quando o id não estiver mapeado (estilos novos, strings
 * inesperadas, ou ausência).
 */
export function getCuradoria(styleId?: string): ReadonlyArray<CuratedPiece> {
  if (!styleId) return DEFAULT_CURADORIA;
  return CURADORIA_BY_STYLE[styleId] ?? DEFAULT_CURADORIA;
}