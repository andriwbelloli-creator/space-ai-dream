import type { BudgetItem } from "@/lib/budget-pdf";

// Base shopping list — kept stable across styles for now. Prices in BRL ranges.
export const SHOPPING_LIST: ReadonlyArray<BudgetItem> = [
  { tag: "Essencial", name: "Sofá 3 lugares", cat: "Móveis principais", price: "R$ 1.200–3.500" },
  { tag: "Essencial", name: "Mesa de centro oval", cat: "Móveis principais", price: "R$ 300–900" },
  { tag: "Essencial", name: "Cortina blackout", cat: "Iluminação natural", price: "R$ 220–700" },
  { tag: "Recomendado", name: "Luminária de piso", cat: "Iluminação", price: "R$ 180–600" },
  { tag: "Recomendado", name: "Poltrona linho", cat: "Móveis", price: "R$ 700–1.800" },
  { tag: "Recomendado", name: "Aparador madeira", cat: "Móveis", price: "R$ 600–1.900" },
  { tag: "Opcional", name: "Tapete neutro 2×3", cat: "Decoração", price: "R$ 250–900" },
  { tag: "Opcional", name: "Vaso + planta grande", cat: "Decoração", price: "R$ 120–450" },
  { tag: "Opcional", name: "Quadro emoldurado", cat: "Arte", price: "R$ 90–350" },
];

// Lista de compras — Quarto. Preços em faixas conservadoras (BRL).
const SHOPPING_LIST_QUARTO: ReadonlyArray<BudgetItem> = [
  { tag: "Essencial", name: "Cama box casal", cat: "Móveis principais", price: "R$ 1.000–3.200" },
  { tag: "Essencial", name: "Colchão casal", cat: "Móveis principais", price: "R$ 700–2.500" },
  { tag: "Essencial", name: "Cabeceira estofada", cat: "Móveis principais", price: "R$ 400–1.400" },
  { tag: "Recomendado", name: "Criado-mudo (par)", cat: "Móveis", price: "R$ 300–1.100" },
  { tag: "Recomendado", name: "Cortina blackout", cat: "Iluminação natural", price: "R$ 220–700" },
  { tag: "Recomendado", name: "Luminária de mesa", cat: "Iluminação", price: "R$ 90–350" },
  { tag: "Recomendado", name: "Guarda-roupa", cat: "Móveis", price: "R$ 900–3.500" },
  { tag: "Opcional", name: "Tapete quarto 1,5×2", cat: "Decoração", price: "R$ 180–700" },
  { tag: "Opcional", name: "Jogo de cama casal", cat: "Têxtil", price: "R$ 150–600" },
  { tag: "Opcional", name: "Quadro emoldurado", cat: "Arte", price: "R$ 90–350" },
];

// Lista de compras — Cozinha. Preços em faixas conservadoras (BRL).
const SHOPPING_LIST_COZINHA: ReadonlyArray<BudgetItem> = [
  {
    tag: "Essencial",
    name: "Armário de cozinha modulado",
    cat: "Móveis principais",
    price: "R$ 1.500–6.000",
  },
  {
    tag: "Essencial",
    name: "Mesa de jantar 4 lugares",
    cat: "Móveis principais",
    price: "R$ 600–2.200",
  },
  {
    tag: "Essencial",
    name: "Cadeiras de jantar (4)",
    cat: "Móveis principais",
    price: "R$ 480–1.600",
  },
  { tag: "Recomendado", name: "Banqueta alta (par)", cat: "Móveis", price: "R$ 260–900" },
  { tag: "Recomendado", name: "Lustre pendente", cat: "Iluminação", price: "R$ 150–650" },
  { tag: "Recomendado", name: "Organizadores de armário", cat: "Organização", price: "R$ 80–300" },
  { tag: "Opcional", name: "Tapete de cozinha", cat: "Decoração", price: "R$ 90–320" },
  {
    tag: "Opcional",
    name: "Conjunto de potes herméticos",
    cat: "Organização",
    price: "R$ 100–380",
  },
  { tag: "Opcional", name: "Quadro decorativo", cat: "Arte", price: "R$ 70–280" },
];

// Lista de compras — Home office. Preços em faixas conservadoras (BRL).
const SHOPPING_LIST_HOME_OFFICE: ReadonlyArray<BudgetItem> = [
  {
    tag: "Essencial",
    name: "Escrivaninha de trabalho",
    cat: "Móveis principais",
    price: "R$ 350–1.500",
  },
  { tag: "Essencial", name: "Cadeira ergonômica", cat: "Móveis principais", price: "R$ 600–2.500" },
  { tag: "Recomendado", name: "Monitor", cat: "Eletrônicos", price: "R$ 700–2.200" },
  { tag: "Recomendado", name: "Luminária articulada", cat: "Iluminação", price: "R$ 120–450" },
  { tag: "Recomendado", name: "Estante / prateleiras", cat: "Móveis", price: "R$ 250–1.100" },
  { tag: "Recomendado", name: "Suporte para notebook", cat: "Acessórios", price: "R$ 60–220" },
  { tag: "Opcional", name: "Tapete para escritório", cat: "Decoração", price: "R$ 150–600" },
  { tag: "Opcional", name: "Organizadores de mesa", cat: "Organização", price: "R$ 50–200" },
  { tag: "Opcional", name: "Vaso + planta", cat: "Decoração", price: "R$ 90–320" },
];

// Lista de compras — Banheiro. Preços em faixas conservadoras (BRL).
const SHOPPING_LIST_BANHEIRO: ReadonlyArray<BudgetItem> = [
  {
    tag: "Essencial",
    name: "Gabinete de banheiro",
    cat: "Móveis principais",
    price: "R$ 400–1.800",
  },
  { tag: "Essencial", name: "Cuba cerâmica", cat: "Louças", price: "R$ 120–500" },
  { tag: "Essencial", name: "Espelho lapidado", cat: "Acessórios", price: "R$ 150–700" },
  { tag: "Recomendado", name: "Torneira inox", cat: "Metais", price: "R$ 90–420" },
  { tag: "Recomendado", name: "Chuveiro / ducha", cat: "Metais", price: "R$ 150–800" },
  { tag: "Recomendado", name: "Nichos / prateleiras", cat: "Organização", price: "R$ 80–350" },
  { tag: "Opcional", name: "Tapete antiderrapante", cat: "Decoração", price: "R$ 40–180" },
  { tag: "Opcional", name: "Kit de acessórios", cat: "Acessórios", price: "R$ 60–250" },
  { tag: "Opcional", name: "Planta para banheiro", cat: "Decoração", price: "R$ 50–200" },
];

// Lista de compras — Lavanderia. Preços em faixas conservadoras (BRL).
const SHOPPING_LIST_LAVANDERIA: ReadonlyArray<BudgetItem> = [
  { tag: "Essencial", name: "Tanque com gabinete", cat: "Móveis principais", price: "R$ 350–1.400" },
  { tag: "Essencial", name: "Máquina de lavar", cat: "Eletrodomésticos", price: "R$ 1.200–3.800" },
  { tag: "Essencial", name: "Armário multiuso", cat: "Móveis principais", price: "R$ 400–1.600" },
  { tag: "Recomendado", name: "Varal de parede retrátil", cat: "Organização", price: "R$ 80–320" },
  { tag: "Recomendado", name: "Tábua de passar dobrável", cat: "Utilidades", price: "R$ 120–450" },
  { tag: "Recomendado", name: "Prateleiras / nichos", cat: "Organização", price: "R$ 70–300" },
  { tag: "Recomendado", name: "Cesto organizador (par)", cat: "Organização", price: "R$ 90–320" },
  { tag: "Opcional", name: "Tapete antiderrapante", cat: "Decoração", price: "R$ 40–180" },
  { tag: "Opcional", name: "Potes para sabão", cat: "Organização", price: "R$ 60–220" },
];

// Mapa cômodo → lista de compras estática. "sala" reaproveita SHOPPING_LIST.
const SHOPPING_LISTS_BY_ROOM: Record<string, ReadonlyArray<BudgetItem>> = {
  quarto: SHOPPING_LIST_QUARTO,
  cozinha: SHOPPING_LIST_COZINHA,
  "home-office": SHOPPING_LIST_HOME_OFFICE,
  banheiro: SHOPPING_LIST_BANHEIRO,
  lavanderia: SHOPPING_LIST_LAVANDERIA,
  sala: SHOPPING_LIST,
};

/**
 * Retorna a lista de compras estática adequada ao cômodo informado.
 * Cômodos não reconhecidos ("sala", "outro", inválido ou ausente) caem
 * na lista tradicional de sala (SHOPPING_LIST).
 */
export function getShoppingFallback(roomType?: string): ReadonlyArray<BudgetItem> {
  if (!roomType) return SHOPPING_LIST;
  return SHOPPING_LISTS_BY_ROOM[roomType] ?? SHOPPING_LIST;
}

function parseRange(price: string): [number, number] {
  const m = price.replace(/\./g, "").match(/(\d+)(?:[\s–-]+(\d+))?/);
  if (!m) return [0, 0];
  const a = parseInt(m[1], 10);
  const b = m[2] ? parseInt(m[2], 10) : a;
  return [a, b];
}

/**
 * Ordem visual canonica das tags da lista de compras. Usada pra
 * ordenar tanto a UI quanto o PDF, garantindo que itens essenciais
 * apareçam primeiro e maximizem a chance de clique afiliado.
 */
export const TAG_PRIORITY: Record<BudgetItem["tag"], number> = {
  Essencial: 0,
  Recomendado: 1,
  Opcional: 2,
};

/**
 * Retorna uma copia da lista ordenada por prioridade da tag.
 * Estavel: itens com a mesma tag preservam a ordem original
 * (Array.sort em V8 é stable desde 2019).
 */
export function sortByPriority(items: ReadonlyArray<BudgetItem>): BudgetItem[] {
  return [...items].sort((a, b) => TAG_PRIORITY[a.tag] - TAG_PRIORITY[b.tag]);
}

export function estimateTotal(items: ReadonlyArray<BudgetItem>): string {
  let min = 0;
  let max = 0;
  for (const it of items) {
    const [a, b] = parseRange(it.price);
    min += a;
    max += b;
  }
  const fmt = (n: number) => n.toLocaleString("pt-BR");
  return `R$ ${fmt(min)} – ${fmt(max)}`;
}

/**
 * Conta quantos itens existem por tag — usado pra alimentar chips
 * de filtro com contagem (ex: "Essencial · 3").
 */
export function countByTag(
  items: ReadonlyArray<BudgetItem>,
): Record<BudgetItem["tag"], number> {
  const out: Record<BudgetItem["tag"], number> = {
    Essencial: 0,
    Recomendado: 0,
    Opcional: 0,
  };
  for (const it of items) out[it.tag] += 1;
  return out;
}

/**
 * Agrupa itens por categoria preservando a ordem de aparição.
 * Útil pra renderizar a lista em seções (Móveis, Iluminação, etc.)
 * quando o usuário expande a visualização.
 */
export function groupByCategory(
  items: ReadonlyArray<BudgetItem>,
): Array<{ cat: string; items: BudgetItem[] }> {
  const order: string[] = [];
  const map = new Map<string, BudgetItem[]>();
  for (const it of items) {
    if (!map.has(it.cat)) {
      order.push(it.cat);
      map.set(it.cat, []);
    }
    map.get(it.cat)!.push(it);
  }
  return order.map((cat) => ({ cat, items: map.get(cat)! }));
}

/**
 * Serializa a lista em texto plano amigável pra área de transferência
 * (e WhatsApp). Mantém prioridade visual e total estimado.
 */
export function toClipboardText(
  items: ReadonlyArray<BudgetItem>,
  projectName?: string,
): string {
  const lines: string[] = [];
  if (projectName) lines.push(`Lista de compras · ${projectName}`, "");
  for (const it of items) {
    lines.push(`• [${it.tag}] ${it.name} — ${it.cat} (${it.price})`);
  }
  lines.push("", `Estimativa total: ${estimateTotal(items)}`);
  lines.push("Gerado pelo Ideal Space · https://idealspace.com.br");
  return lines.join("\n");
}
