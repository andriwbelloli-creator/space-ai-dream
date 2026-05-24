/**
 * Lista ranqueada com mini-barras proporcionais. Usada em "Top estilos",
 * "Top ambientes", "Top produtos clicados" etc. Espera itens com
 * `{ slug, label, count }` já ordenados (desc por count).
 */
export type RankedItem = { slug: string; label: string; count: number };

export function RankedList({ items, empty }: { items: RankedItem[]; empty: string }) {
  if (items.length === 0) {
    return <p className="mt-3 text-xs text-muted-foreground">{empty}</p>;
  }
  const max = items[0]?.count ?? 1;
  return (
    <ol className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={item.slug} className="flex items-center gap-2">
          <span className="w-4 shrink-0 text-[11px] text-muted-foreground">{i + 1}.</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate">{item.label}</div>
            <div className="mt-0.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-accent/60"
                style={{ width: `${Math.round((item.count / max) * 100)}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-xs font-medium tabular-nums">
            {item.count.toLocaleString("pt-BR")}
          </span>
        </li>
      ))}
    </ol>
  );
}
