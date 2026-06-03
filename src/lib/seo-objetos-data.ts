/**
 * Catálogo editorial de objetos decorativos — mock estático curado.
 * Fonte de verdade da rota `/objetos`. Cada item é uma categoria curatorial,
 * não um SKU. O grid mostra ritmo editorial (warm sand + bronze) e remete
 * o usuário a estilos/ambientes onde o objeto entra em composição.
 */

import objetoVasos from "@/assets/objeto-vasos.jpg";
import objetoLuminarias from "@/assets/objeto-luminarias.jpg";
import objetoEspelhos from "@/assets/objeto-espelhos.jpg";
import objetoQuadros from "@/assets/objeto-quadros.jpg";
import objetoTexteis from "@/assets/objeto-texteis.jpg";
import objetoPlantas from "@/assets/objeto-plantas.jpg";
import objetoEsculturas from "@/assets/objeto-esculturas.jpg";
import objetoMesasApoio from "@/assets/objeto-mesas-apoio.jpg";

export type ObjetoSlug =
  | "vasos"
  | "luminarias"
  | "espelhos"
  | "quadros"
  | "texteis"
  | "plantas"
  | "esculturas"
  | "mesas-apoio";

export interface ObjetoItem {
  slug: ObjetoSlug;
  name: string;
  kicker: string;
  description: string;
  src: string;
  alt: string;
  /** Rota interna que faz sentido para quem se interessou pelo objeto. */
  to: string;
}

export const SEO_OBJETOS: ReadonlyArray<ObjetoItem> = [
  {
    slug: "vasos",
    name: "Vasos e cerâmica",
    kicker: "Curadoria",
    description:
      "Peças artesanais em terracota, gres e cerâmica fosca. Volume sem peso, ideais para mesas de centro, consoles e nichos.",
    src: objetoVasos,
    alt: "Coleção curada de vasos de cerâmica em tons terracota e bone sobre superfície clara",
    to: "/estilos/japandi",
  },
  {
    slug: "luminarias",
    name: "Luminárias",
    kicker: "Iluminação",
    description:
      "Pendentes esculturais, abajures em latão e arandelas com luz quente. A camada que define o clima do ambiente à noite.",
    src: objetoLuminarias,
    alt: "Pendente escultural ao lado de abajur de mesa em latão",
    to: "/estilos/contemporaneo",
  },
  {
    slug: "espelhos",
    name: "Espelhos",
    kicker: "Volume",
    description:
      "Arcos em moldura bronze, espelhos orgânicos e formatos esculturais. Ampliam o espaço e refletem luz natural.",
    src: objetoEspelhos,
    alt: "Espelho arqueado com moldura bronze apoiado em parede bege",
    to: "/ambientes/sala",
  },
  {
    slug: "quadros",
    name: "Quadros e arte",
    kicker: "Parede",
    description:
      "Composições em gallery wall, impressões abstratas e fotografia autoral em molduras finas. Personalidade sem virar caos visual.",
    src: objetoQuadros,
    alt: "Parede composta com seis quadros abstratos em molduras pretas e madeira",
    to: "/estilos/contemporaneo",
  },
  {
    slug: "texteis",
    name: "Têxteis e almofadas",
    kicker: "Aconchego",
    description:
      "Linho lavado, lã trançada e algodão pesado. Camada de conforto que muda a temperatura do sofá em segundos.",
    src: objetoTexteis,
    alt: "Almofadas em linho cor caramelo e manta de tricô sobre sofá bege",
    to: "/ambientes/sala",
  },
  {
    slug: "plantas",
    name: "Plantas e cachepôs",
    kicker: "Vida",
    description:
      "Costela-de-adão, jiboia, oliveira e cactos em vasos de barro. Volume verde que respira e suaviza linhas duras.",
    src: objetoPlantas,
    alt: "Planta de folhas largas em vaso de terracota próximo a janela iluminada",
    to: "/estilos/natural",
  },
  {
    slug: "esculturas",
    name: "Esculturas e objetos",
    kicker: "Acento",
    description:
      "Peças em bronze, pedra e madeira torneada. O ponto editorial sobre o console, a estante ou a mesa de jantar.",
    src: objetoEsculturas,
    alt: "Pequena escultura em bronze e pedra natural sobre console de travertino",
    to: "/estilos/luxo",
  },
  {
    slug: "mesas-apoio",
    name: "Mesas de apoio",
    kicker: "Mobiliário",
    description:
      "Travertino, mármore, madeira maciça e metal. Pé direito para xícara, livro e luminária sem comprometer a circulação.",
    src: objetoMesasApoio,
    alt: "Mesa de apoio redonda em travertino com xícara e livro ao lado de sofá bege",
    to: "/ambientes/sala",
  },
] as const;