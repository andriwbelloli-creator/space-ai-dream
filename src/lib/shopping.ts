import type { BudgetItem } from "@/lib/budget-pdf";

// Base shopping list — kept stable across styles for now. Prices in BRL ranges.
export const SHOPPING_LIST: ReadonlyArray<BudgetItem> = [
  { tag: "Essencial",   name: "Sofá 3 lugares",        cat: "Móveis principais", price: "R$ 1.200–3.500" },
  { tag: "Essencial",   name: "Mesa de centro oval",   cat: "Móveis principais", price: "R$ 300–900" },
  { tag: "Essencial",   name: "Cortina blackout",      cat: "Iluminação natural", price: "R$ 220–700" },
  { tag: "Recomendado", name: "Luminária de piso",     cat: "Iluminação",        price: "R$ 180–600" },
  { tag: "Recomendado", name: "Poltrona linho",        cat: "Móveis",            price: "R$ 700–1.800" },
  { tag: "Recomendado", name: "Aparador madeira",      cat: "Móveis",            price: "R$ 600–1.900" },
  { tag: "Opcional",    name: "Tapete neutro 2×3",     cat: "Decoração",         price: "R$ 250–900" },
  { tag: "Opcional",    name: "Vaso + planta grande",  cat: "Decoração",         price: "R$ 120–450" },
  { tag: "Opcional",    name: "Quadro emoldurado",     cat: "Arte",              price: "R$ 90–350" },
];

function parseRange(price: string): [number, number] {
  const m = price.replace(/\./g, "").match(/(\d+)(?:[\s–-]+(\d+))?/);
  if (!m) return [0, 0];
  const a = parseInt(m[1], 10);
  const b = m[2] ? parseInt(m[2], 10) : a;
  return [a, b];
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