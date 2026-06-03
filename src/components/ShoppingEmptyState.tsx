import { ShoppingBag, X, RefreshCw } from "lucide-react";

interface ShoppingEmptyStateProps {
  onClearFilter: () => void;
  onRegenerate?: () => void;
  showRegenerate?: boolean;
}

export function ShoppingEmptyState({
  onClearFilter,
  onRegenerate,
  showRegenerate,
}: ShoppingEmptyStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <ShoppingBag className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">
        Nenhum item neste filtro
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Tente outra categoria ou limpe o filtro para ver todos os itens.
      </p>
      <button
        type="button"
        onClick={onClearFilter}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-3.5 w-3.5" /> Limpar filtros
      </button>
      {showRegenerate && onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refazer lista
        </button>
      )}
    </div>
  );
}
