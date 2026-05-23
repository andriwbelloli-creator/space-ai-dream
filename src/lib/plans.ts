// Fonte única dos planos do Ideal Space.
// Consumido por src/routes/pricing.tsx e pela seção de planos da home (src/routes/index.tsx).
// Observação: os limites de geração abaixo são exibição — o enforcement real por usuário
// é um passo posterior (ver classificação de risco, item A4).

export type PlanId = "free" | "starter" | "premium" | "pro";

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  /** Preço por mês no ciclo mensal. 0 = grátis. */
  monthly: number;
  /** Preço por mês equivalente quando cobrado no plano anual. */
  annual: number;
  /** Destaque visual "Mais escolhido". */
  highlight?: boolean;
  cta: string;
  /** Destino do CTA: rota interna ("/login") ou link "mailto:". */
  ctaHref: string;
  /** Benefícios listados com check. */
  features: string[];
  /** Itens não inclusos, listados riscados (upsell). */
  notIncluded?: string[];
  /** Microcopy curto abaixo do botão. */
  footnote?: string;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Grátis",
    tagline: "Para testar a IA e decorar seu primeiro ambiente.",
    monthly: 0,
    annual: 0,
    cta: "Começar grátis",
    ctaHref: "/login",
    features: [
      "3 gerações 2D por mês",
      "Estilos básicos",
      "Slider antes e depois",
      "Lista com 3 produtos sugeridos",
      "Download em resolução padrão",
    ],
    notIncluded: ["Sem marca d'água", "Orçamento em PDF"],
    footnote: "Sem cartão de crédito",
  },
  {
    id: "starter",
    name: "Starter",
    tagline: "Para decorar um ambiente do seu jeito, sem marca d'água.",
    monthly: 29.9,
    annual: 22.9,
    cta: "Quero acesso antecipado",
    ctaHref: "/login",
    features: [
      "15 gerações 2D por mês",
      "Todos os estilos básicos",
      "Sem marca d'água",
      "Lista de compras completa",
      "Download em alta resolução",
      "Histórico na nuvem (até 10 projetos)",
    ],
    notIncluded: ["Variações da IA", "Orçamento em PDF"],
    footnote: "Planos pagos em breve. Sem cobrança nesta etapa.",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Para decorar a casa toda com variações, preços e PDF.",
    monthly: 49.9,
    annual: 39.9,
    highlight: true,
    cta: "Quero acesso antecipado",
    ctaHref: "/login",
    features: [
      "50 gerações 2D por mês",
      "Todos os estilos, inclusive premium",
      "Variações da IA por ambiente",
      "Lista de compras com preços estimados",
      "Orçamento em PDF",
      "Sem marca d'água",
      "Histórico ilimitado na nuvem",
      "Suporte prioritário por e-mail",
    ],
    footnote: "Planos pagos em breve. Sem cobrança nesta etapa.",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Para designers, arquitetos, corretores e imobiliárias.",
    monthly: 149.9,
    annual: 119.9,
    cta: "Falar com vendas",
    ctaHref: "mailto:contato@idealspace.com.br",
    features: [
      "200 gerações por mês em resolução máxima",
      "PDF profissional com a sua marca",
      "Organização por cliente e projeto",
      "Virtual staging para anúncios",
      "Fila prioritária de processamento",
      "Modo apresentação para reuniões",
      "Compartilhamento com cliente por link",
    ],
  },
];

/** Formata um preço mensal em BRL. Retorna "Grátis" quando o valor é 0. */
export function formatPlanPrice(value: number): string {
  if (value <= 0) return "Grátis";
  return `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
